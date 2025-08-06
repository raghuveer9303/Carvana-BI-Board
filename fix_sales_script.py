#!/usr/bin/env python3
from pyspark.sql import SparkSession
from pyspark.sql.functions import *
from pyspark.sql.types import *
import argparse
import logging
from datetime import date
import psycopg2
from urllib.parse import urlparse

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def parse_date(s: str) -> date:
    return date.fromisoformat(s)

def main(postgres_url: str, postgres_user: str, postgres_password: str, iceberg_table: str, process_date: date):
    spark = (
        SparkSession.builder
        .appName("BuildSalesEventsFact")
        .master("spark://spark-master:7077")
        .config("spark.jars.packages",
            "org.apache.hadoop:hadoop-aws:3.3.4," +
            "com.amazonaws:aws-java-sdk-bundle:1.12.367," +
            "org.apache.iceberg:iceberg-spark-runtime-3.5_2.12:1.4.3," +
            "org.postgresql:postgresql:42.6.0"
        )
        .config("spark.hadoop.fs.s3a.endpoint", "http://minio:9000")
        .config("spark.hadoop.fs.s3a.access.key", "AV77UPTYT1L579RBQE3I")
        .config("spark.hadoop.fs.s3a.secret.key", "e8IIzbl3rCXP1DwK+WfkHgfCgjASdfIiY6KRWnuM")
        .config("spark.hadoop.fs.s3a.path.style.access", "true")
        .config("spark.sql.catalog.carvana", "org.apache.iceberg.spark.SparkCatalog")
        .config("spark.sql.catalog.carvana.type", "hadoop")
        .config("spark.sql.catalog.carvana.warehouse", "s3a://carvana-warehouse")
        .getOrCreate()
    )

    try:
        # Read dimension tables
        dim_date = (spark.read
                   .format("jdbc")
                   .option("url", postgres_url)
                   .option("dbtable", "dim_date")
                   .option("user", postgres_user)
                   .option("password", postgres_password)
                   .option("driver", "org.postgresql.Driver")
                   .load())

        dim_vehicle = (spark.read
                      .format("jdbc")
                      .option("url", postgres_url)
                      .option("dbtable", "dim_vehicle")
                      .option("user", postgres_user)
                      .option("password", postgres_password)
                      .option("driver", "org.postgresql.Driver")
                      .load())

        # Read only sold cars for the current date with better filtering
        sold_cars = (spark.read.format("iceberg")
                    .load(iceberg_table)
                    .filter(
                        (col("sold_date") == lit(process_date)) & 
                        (col("status") == "sold") &
                        (col("vin").isNotNull()) &  # Ensure VIN is not null
                        (col("price").isNotNull()) &  # Ensure price is not null
                        (col("sold_date").isNotNull())  # Ensure sold_date is not null
                    ))

        # Add data quality checks
        logger.info(f"Found {sold_cars.count()} sold cars for {process_date}")
        
        # Check for data quality issues
        null_vin_count = sold_cars.filter(col("vin").isNull()).count()
        null_price_count = sold_cars.filter(col("price").isNull()).count()
        future_date_count = sold_cars.filter(col("sold_date") > lit(date.today())).count()
        
        logger.info(f"Data quality check - Null VINs: {null_vin_count}, Null prices: {null_price_count}, Future dates: {future_date_count}")
        
        # Filter out problematic records
        clean_sold_cars = sold_cars.filter(
            (col("vin").isNotNull()) &
            (col("price").isNotNull()) &
            (col("sold_date").isNotNull()) &
            (col("sold_date") <= lit(date.today()))  # Don't include future dates
        )
        
        logger.info(f"After cleaning: {clean_sold_cars.count()} valid sold cars")

        if clean_sold_cars.count() == 0:
            logger.info(f"No valid sales events found for {process_date}")
            return

        # Get date key for the process date
        date_key = int(process_date.strftime("%Y%m%d"))

        # Idempotency: Delete existing rows for this process_date
        pg_url = urlparse(postgres_url.replace('jdbc:', ''))
        conn = psycopg2.connect(
            dbname=pg_url.path[1:],
            user=postgres_user,
            password=postgres_password,
            host=pg_url.hostname,
            port=pg_url.port
        )
        cur = conn.cursor()
        
        # Delete existing data for this date
        cur.execute("DELETE FROM fact_sales_events WHERE sale_date_key = %s", (date_key,))
        deleted_count = cur.rowcount
        logger.info(f"Deleted {deleted_count} existing records for date_key {date_key}")
        
        conn.commit()
        cur.close()
        conn.close()

        # Rename columns in dim_vehicle to avoid collision
        dim_vehicle_renamed = dim_vehicle.select(
            col("manufacturer").alias("vehicle_manufacturer"),
            col("model").alias("vehicle_model"),
            col("brand").alias("vehicle_brand"),
            col("color").alias("vehicle_color"),
            col("vehicle_key")
        )

        # Join using renamed columns and add deduplication
        sales_fact = (clean_sold_cars
                     .join(
                         dim_vehicle_renamed,
                         (col("manufacturer") == col("vehicle_manufacturer")) &
                         (col("model") == col("vehicle_model")) &
                         (col("brand") == col("vehicle_brand")) &
                         (col("color") == col("vehicle_color")),
                         "left"
                     )
                     .select(
                         lit(date_key).alias("sale_date_key"),
                         col("vehicle_key"),
                         col("vin"),
                         col("price").alias("sale_price"),
                         col("mileage").alias("sale_mileage"),
                         when(col("added_date").isNotNull() & col("sold_date").isNotNull(),
                              datediff(col("sold_date"), col("added_date"))).otherwise(0).alias("days_to_sell"),
                         col("added_date"),
                         col("sold_date")
                     )
                     .dropDuplicates(["sale_date_key", "vin"]))  # Remove duplicates

        # Final count check
        final_count = sales_fact.count()
        logger.info(f"Final sales fact count: {final_count}")

        if final_count == 0:
            logger.info("No valid sales data to insert")
            return

        # Write to PostgreSQL using append mode
        (sales_fact.write
         .format("jdbc")
         .option("url", postgres_url)
         .option("dbtable", "fact_sales_events")
         .option("user", postgres_user)
         .option("password", postgres_password)
         .option("driver", "org.postgresql.Driver")
         .mode("append")
         .save())

        logger.info(f"Successfully loaded fact_sales_events with {final_count} records for {process_date}")

    finally:
        spark.stop()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Build Sales Events Fact")
    parser.add_argument("--postgres_url", required=True)
    parser.add_argument("--postgres_user", required=True)
    parser.add_argument("--postgres_password", required=True)
    parser.add_argument("--iceberg_table", required=True)
    parser.add_argument("--process_date", type=parse_date, required=True)
    args = parser.parse_args()
    
    main(args.postgres_url, args.postgres_user, args.postgres_password, args.iceberg_table, args.process_date) 