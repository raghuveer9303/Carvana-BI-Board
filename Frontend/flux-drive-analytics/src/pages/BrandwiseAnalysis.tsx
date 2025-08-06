import { useState, useEffect } from "react";
import { useDashboardData } from "@/hooks/useDashboardData";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Car, TrendingUp, DollarSign, Calendar } from "lucide-react";
import { SalesByBrand } from "@/types/dashboard";
import { fetchBrandMetrics, BrandMetrics } from "@/services/api";

// Brand logos mapping
const brandLogos: Record<string, string> = {
  "Lincoln": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Lincoln_logo.svg/1200px-Lincoln_logo.svg.png",
  "Honda": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Honda_logo.svg/1200px-Honda_logo.svg.png",
  "Ram": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Ram_logo.svg/1200px-Ram_logo.svg.png",
  "VinFast": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/VinFast_logo.svg/1200px-VinFast_logo.svg.png",
  "Ford": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Ford_logo.svg/1200px-Ford_logo.svg.png",
  "Scion": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Scion_logo.svg/1200px-Scion_logo.svg.png",
  "Maserati": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Maserati_logo.svg/1200px-Maserati_logo.svg.png",
  "Dodge": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Dodge_logo.svg/1200px-Dodge_logo.svg.png",
  "Chevrolet": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Chevrolet_logo.svg/1200px-Chevrolet_logo.svg.png",
  "INFINITI": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Infiniti_logo.svg/1200px-Infiniti_logo.svg.png",
  "MINI": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Mini_logo.svg/1200px-Mini_logo.svg.png",
  "Lucid": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Lucid_logo.svg/1200px-Lucid_logo.svg.png",
  "Porsche": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Porsche_logo.svg/1200px-Porsche_logo.svg.png",
  "Alfa Romeo": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Alfa_Romeo_logo.svg/1200px-Alfa_Romeo_logo.svg.png",
  "smart": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Smart_logo.svg/1200px-Smart_logo.svg.png",
  "Audi": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Audi_logo.svg/1200px-Audi_logo.svg.png",
  "Tesla": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Tesla_logo.png/1200px-Tesla_logo.png",
  "Jaguar": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Jaguar_logo.svg/1200px-Jaguar_logo.svg.png",
  "Lexus": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Lexus_logo.svg/1200px-Lexus_logo.svg.png",
  "Kia": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Kia_logo.svg/1200px-Kia_logo.svg.png",
  "Mercedes-Benz": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Mercedes-Benz_logo.svg/1200px-Mercedes-Benz_logo.svg.png",
  "Land Rover": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Land_Rover_logo.svg/1200px-Land_Rover_logo.svg.png",
  "Jeep": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Jeep_logo.svg/1200px-Jeep_logo.svg.png",
  "Rivian": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Rivian_logo.svg/1200px-Rivian_logo.svg.png",
  "Volvo": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Volvo_logo.svg/1200px-Volvo_logo.svg.png",
  "Buick": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Buick_logo.svg/1200px-Buick_logo.svg.png",
  "Cadillac": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Cadillac_logo.svg/1200px-Cadillac_logo.svg.png",
  "Acura": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Acura_logo.svg/1200px-Acura_logo.svg.png",
  "Nissan": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Nissan_logo.svg/1200px-Nissan_logo.svg.png",
  "Polestar": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Polestar_logo.svg/1200px-Polestar_logo.svg.png",
  "Genesis": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Genesis_logo.svg/1200px-Genesis_logo.svg.png",
  "Hyundai": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Hyundai_logo.svg/1200px-Hyundai_logo.svg.png",
  "MAZDA": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Mazda_logo.svg/1200px-Mazda_logo.svg.png",
  "Mitsubishi": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Mitsubishi_logo.svg/1200px-Mitsubishi_logo.svg.png",
  "FIAT": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Fiat_logo.svg/1200px-Fiat_logo.svg.png",
  "Subaru": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Subaru_logo.svg/1200px-Subaru_logo.svg.png",
  "BMW": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/BMW_logo.svg/1200px-BMW_logo.svg.png",
  "Volkswagen": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Volkswagen_logo.svg/1200px-Volkswagen_logo.svg.png",
  "Chrysler": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Chrysler_logo.svg/1200px-Chrysler_logo.svg.png",
  "Toyota": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Toyota_logo.svg/1200px-Toyota_logo.svg.png",
  "GMC": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/GMC_logo.svg/1200px-GMC_logo.svg.png",
};

// Remove the local interface since we're importing it from the API

const BrandwiseAnalysis = () => {
  const { data, isLoading, error, refetch } = useDashboardData();
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [brandMetrics, setBrandMetrics] = useState<BrandMetrics | null>(null);
  const [isLoadingBrand, setIsLoadingBrand] = useState(false);

  const handleRefresh = () => {
    refetch();
  };

  const handleBrandClick = async (brand: string) => {
    setSelectedBrand(brand);
    setIsLoadingBrand(true);
    
    try {
      const metrics = await fetchBrandMetrics(brand);
      setBrandMetrics(metrics);
    } catch (error) {
      console.error('Failed to fetch brand metrics:', error);
      // You could add error handling here, like showing a toast notification
    } finally {
      setIsLoadingBrand(false);
    }
  };

  const handleBackToOverview = () => {
    setSelectedBrand(null);
    setBrandMetrics(null);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-dashboard-bg font-body">
        <div className="absolute inset-0 gradient-mesh opacity-50"></div>
        
        <DashboardHeader 
          isLoading={false}
          onRefresh={handleRefresh}
        />
        
        <div className="relative container mx-auto px-6 py-12">
          <div className="max-w-2xl mx-auto">
            <Alert className="glass rounded-2xl border-0 shadow-card backdrop-blur-apple p-8">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-error/10 rounded-full">
                  <AlertCircle className="h-6 w-6 text-error" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-display font-semibold text-foreground mb-2">
                    Connection Error
                  </h3>
                  <AlertDescription className="text-muted-foreground text-base leading-relaxed">
                    Unable to connect to the Carvana Analytics API. Please ensure the backend service is running.
                    {error instanceof Error && (
                      <span className="block mt-2 text-sm font-mono text-error/80">
                        {error.message}
                      </span>
                    )}
                  </AlertDescription>
                </div>
              </div>
            </Alert>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading && !data) {
    return (
      <div className="min-h-screen bg-dashboard-bg font-body">
        <div className="absolute inset-0 gradient-mesh opacity-30"></div>
        
        <DashboardHeader 
          isLoading={true}
          onRefresh={handleRefresh}
        />
        
        <div className="relative container mx-auto px-6 py-6">
          <Skeleton className="h-96 rounded-3xl glass backdrop-blur-apple shadow-card animate-fade-in" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dashboard-bg font-body">
      <div className="absolute inset-0 gradient-mesh opacity-30"></div>
      
      <DashboardHeader 
        isLoading={isLoading}
        onRefresh={handleRefresh}
      />
      
      <div className="relative container mx-auto px-6 py-6">
        {selectedBrand ? (
          // Brand Detail View
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <button
                onClick={handleBackToOverview}
                className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>Back to Overview</span>
              </button>
            </div>

            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <img
                  src={brandLogos[selectedBrand] || "/placeholder.svg"}
                  alt={selectedBrand}
                  className="h-20 w-auto object-contain"
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg";
                  }}
                />
              </div>
              
              <h1 className="text-4xl font-display font-bold text-foreground">
                {selectedBrand}
              </h1>

                             {isLoadingBrand ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
                   {Array.from({ length: 4 }).map((_, i) => (
                     <Skeleton key={i} className="h-40 rounded-3xl glass backdrop-blur-apple shadow-card" />
                   ))}
                 </div>
               ) : brandMetrics ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
                   <div className="glass rounded-3xl backdrop-blur-apple shadow-card p-8 text-center">
                     <div className="flex justify-center mb-4">
                       <div className="p-3 bg-primary/10 rounded-full">
                         <Car className="h-8 w-8 text-primary" />
                       </div>
                     </div>
                     <h3 className="text-3xl font-display font-bold text-foreground mb-2">
                       {brandMetrics.total_vehicles.toLocaleString()}
                     </h3>
                     <p className="text-muted-foreground">Total Vehicles</p>
                   </div>

                   <div className="glass rounded-3xl backdrop-blur-apple shadow-card p-8 text-center">
                     <div className="flex justify-center mb-4">
                       <div className="p-3 bg-green-500/10 rounded-full">
                         <DollarSign className="h-8 w-8 text-green-500" />
                       </div>
                     </div>
                     <h3 className="text-3xl font-display font-bold text-foreground mb-2">
                       ${brandMetrics.average_price.toLocaleString()}
                     </h3>
                     <p className="text-muted-foreground">Average Price</p>
                   </div>

                   <div className="glass rounded-3xl backdrop-blur-apple shadow-card p-8 text-center">
                     <div className="flex justify-center mb-4">
                       <div className="p-3 bg-blue-500/10 rounded-full">
                         <TrendingUp className="h-8 w-8 text-blue-500" />
                       </div>
                     </div>
                     <h3 className="text-3xl font-display font-bold text-foreground mb-2">
                       {brandMetrics.total_sales_30_days}
                     </h3>
                     <p className="text-muted-foreground">Sales (30 Days)</p>
                   </div>

                   <div className="glass rounded-3xl backdrop-blur-apple shadow-card p-8 text-center">
                     <div className="flex justify-center mb-4">
                       <div className="p-3 bg-orange-500/10 rounded-full">
                         <Calendar className="h-8 w-8 text-orange-500" />
                       </div>
                     </div>
                     <h3 className="text-3xl font-display font-bold text-foreground mb-2">
                       {Math.round(brandMetrics.avg_days_to_sell)}
                     </h3>
                     <p className="text-muted-foreground">Avg Days to Sell</p>
                                      </div>
                 </div>
               ) : null}

               {/* Top Models Section */}
               {brandMetrics && brandMetrics.top_models.length > 0 && (
                 <div className="mt-12">
                   <h2 className="text-2xl font-display font-semibold text-foreground mb-6 text-center">
                     Top Models
                   </h2>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     {brandMetrics.top_models.map((model, index) => (
                       <div key={model.model} className="glass rounded-3xl backdrop-blur-apple shadow-card p-6">
                         <div className="flex items-center justify-between mb-4">
                           <div className="flex items-center space-x-3">
                             <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                               <span className="text-sm font-bold text-primary">{index + 1}</span>
                             </div>
                             <h3 className="text-lg font-display font-semibold text-foreground">
                               {model.model}
                             </h3>
                           </div>
                         </div>
                         <div className="space-y-3">
                           <div className="flex justify-between items-center">
                             <span className="text-muted-foreground">Sales</span>
                             <span className="font-semibold text-foreground">{model.sales_count}</span>
                           </div>
                           <div className="flex justify-between items-center">
                             <span className="text-muted-foreground">Avg Price</span>
                             <span className="font-semibold text-foreground">
                               ${model.avg_price.toLocaleString()}
                             </span>
                           </div>
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>
               )}
             </div>
           </div>
        ) : (
          // Brand Overview with Logos and Performance Chart
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl font-display font-bold text-foreground">
                Brand Performance Analysis
              </h1>
              <p className="text-xl text-muted-foreground">
                Click on any brand logo to view detailed metrics
              </p>
            </div>

            {/* Brand Logos Grid */}
            <div className="glass rounded-3xl backdrop-blur-apple shadow-card p-8">
              <h2 className="text-2xl font-display font-semibold text-foreground mb-6">
                Brand Selection
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                {Object.keys(brandLogos).map((brand) => (
                  <button
                    key={brand}
                    onClick={() => handleBrandClick(brand)}
                    className="group p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <img
                        src={brandLogos[brand]}
                        alt={brand}
                        className="h-12 w-auto object-contain group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg";
                        }}
                      />
                      <span className="text-xs text-muted-foreground text-center font-medium">
                        {brand}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Performance Chart */}
            {data && (
              <div className="glass rounded-3xl backdrop-blur-apple shadow-card p-8">
                <h2 className="text-2xl font-display font-semibold text-foreground mb-6">
                  Top 10 Brands by Sales Performance
                </h2>
                <div className="space-y-4">
                  {data.sales_by_brand.slice(0, 10).map((brand, index) => (
                    <div key={brand.brand} className="flex items-center space-x-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-foreground">{brand.brand}</span>
                          <span className="text-sm text-muted-foreground">
                            {brand.sales_count} sales
                          </span>
                        </div>
                        <div className="w-full bg-white/10 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-primary to-primary/70 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${(brand.sales_count / data.sales_by_brand[0].sales_count) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandwiseAnalysis; 