import { useState, useEffect } from "react";
import { useDashboardData } from "@/hooks/useDashboardData";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Car, TrendingUp, DollarSign, Calendar, BarChart3, PieChart, ChevronDown, ArrowLeft, BarChart3 as BarChart3Icon } from "lucide-react";
import { SalesByBrand } from "@/types/dashboard";
import { fetchBrandMetrics, fetchDetailedBrandAnalysis, BrandMetrics, DetailedBrandAnalysis } from "@/services/api";
import BrandDetailedAnalysis from "@/components/dashboard/BrandDetailedAnalysis";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

// Brand logos mapping with direct image URLs
const brandLogos: Record<string, string> = {
  "Lincoln": "https://commons.wikimedia.org/wiki/File:The_Lincoln_Motor_Company_Logo.svg",
  "Honda": "https://commons.wikimedia.org/wiki/File:Honda_Logo.svg",
  "Ram": "https://commons.wikimedia.org/wiki/Category:Ram_logos",
  "VinFast": "https://commons.wikimedia.org/wiki/File:Logo_of_VinFast_%28simple_variant%29.svg",
  "Ford": "https://commons.wikimedia.org/wiki/File:Ford_Motor_Company_Logo.svg",
  "Scion": "https://commons.wikimedia.org/wiki/File:Scion_logo.png",
  "Maserati": "https://commons.wikimedia.org/wiki/File:Maserati_logo_2.svg",
  "Dodge": "https://commons.wikimedia.org/wiki/File:Dodge_logo.svg",
  "Chevrolet": "https://commons.wikimedia.org/wiki/File:Chevrolet_bowtie_2023.svg",
  "INFINITI": "https://commons.wikimedia.org/wiki/File:Infiniti_logo.svg",
  "MINI": "https://commons.wikimedia.org/wiki/File:MINI_logo.svg",
  "Lucid": "https://commons.wikimedia.org/wiki/File:Lucid_Motors_logo.svg",
  "Porsche": "https://worldvectorlogo.com/logo/porsche-2",
  "Alfa Romeo": "https://worldvectorlogo.com/logo/alfaromeo",
  "smart": "https://brandlogo.net/tag/smart",
  "Audi": "https://worldvectorlogo.com/logo/audi",
  "Tesla": "https://commons.wikimedia.org/wiki/File:Tesla_Motors.svg",
  "Jaguar": "https://commons.wikimedia.org/wiki/File:Jaguar_2024.svg",
  "Lexus": "https://worldvectorlogo.com/logo/lexus",
  "Kia": "https://worldvectorlogo.com/logo/kia",
  "Mercedes-Benz": "https://commons.wikimedia.org/wiki/File:Mercedes-Logo.svg",
  "Land Rover": "https://commons.wikimedia.org/wiki/File:JLR_logo_2023.svg",
  "Jeep": "https://worldvectorlogo.com/logo/jeep",
  "Rivian": "https://commons.wikimedia.org/wiki/File:Rivian_logo_and_wordmark.svg",
  "Volvo": "https://commons.wikimedia.org/wiki/File:Volvo_logo.svg",
  "Buick": "https://worldvectorlogo.com/logo/buick",
  "Cadillac": "https://worldvectorlogo.com/logo/cadillac",
  "Acura": "https://worldvectorlogo.com/logo/acura",
  "Nissan": "https://worldvectorlogo.com/logo/nissan",
  "Polestar": "https://worldvectorlogo.com/logo/polestar",
  "Genesis": "https://worldvectorlogo.com/logo/genesis",
  "Hyundai": "https://worldvectorlogo.com/logo/hyundai",
  "MAZDA": "https://worldvectorlogo.com/logo/mazda",
  "Mitsubishi": "https://worldvectorlogo.com/logo/mitsubishi",
  "FIAT": "https://worldvectorlogo.com/logo/fiat",
  "Subaru": "https://worldvectorlogo.com/logo/subaru",
  "BMW": "https://commons.wikimedia.org/wiki/File:BMW.svg",
  "Volkswagen": "https://worldvectorlogo.com/logo/volkswagen",
  "Chrysler": "https://worldvectorlogo.com/logo/chrysler",
  "Toyota": "https://commons.wikimedia.org/wiki/File:Toyota.svg",
  "GMC": "https://commons.wikimedia.org/wiki/File:GMC-Logo.svg"
};

// Brand list for iteration
const brands = [
  "Lincoln", "Honda", "Ram", "VinFast", "Ford", "Scion", "Maserati", "Dodge",
  "Chevrolet", "INFINITI", "MINI", "Lucid", "Porsche", "Alfa Romeo", "smart",
  "Audi", "Tesla", "Jaguar", "Lexus", "Kia", "Mercedes-Benz", "Land Rover",
  "Jeep", "Rivian", "Volvo", "Buick", "Cadillac", "Acura", "Nissan", "Polestar",
  "Genesis", "Hyundai", "MAZDA", "Mitsubishi", "FIAT", "Subaru", "BMW",
  "Volkswagen", "Chrysler", "Toyota", "GMC"
];

// Remove the local interface since we're importing it from the API

const BrandwiseAnalysis = () => {
  const { data, isLoading, error, refetch } = useDashboardData();
  const [searchParams] = useSearchParams();
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [brandMetrics, setBrandMetrics] = useState<BrandMetrics | null>(null);
  const [detailedAnalysis, setDetailedAnalysis] = useState<DetailedBrandAnalysis | null>(null);
  const [isLoadingBrand, setIsLoadingBrand] = useState(false);
  const [viewMode, setViewMode] = useState<'basic' | 'detailed'>('basic');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Check for brand parameter in URL on component mount
  useEffect(() => {
    const brandFromUrl = searchParams.get('brand');
    if (brandFromUrl && brands.includes(brandFromUrl)) {
      handleBrandClick(brandFromUrl);
    }
  }, [searchParams]);

  const handleRefresh = () => {
    refetch();
  };

  const handleBrandClick = async (brand: string) => {
    setSelectedBrand(brand);
    setIsLoadingBrand(true);
    setViewMode('basic');
    
    try {
      const metrics = await fetchBrandMetrics(brand);
      setBrandMetrics(metrics);
      setDetailedAnalysis(null);
    } catch (error) {
      console.error('Failed to fetch brand metrics:', error);
    } finally {
      setIsLoadingBrand(false);
    }
  };

  const handleDetailedView = async () => {
    if (!selectedBrand) return;
    
    setIsLoadingBrand(true);
    try {
      const detailed = await fetchDetailedBrandAnalysis(selectedBrand);
      setDetailedAnalysis(detailed);
      setViewMode('detailed');
    } catch (error) {
      console.error('Failed to fetch detailed analysis:', error);
    } finally {
      setIsLoadingBrand(false);
    }
  };

  const handleBasicView = () => {
    setViewMode('basic');
    setDetailedAnalysis(null);
  };

  const handleBackToOverview = () => {
    setSelectedBrand(null);
    setBrandMetrics(null);
    setDetailedAnalysis(null);
    setViewMode('basic');
  };

  // Get top 10 brands from dashboard data
  const topBrands = data?.sales_by_brand.slice(0, 10) || [];

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
                    Unable to connect to the Autovana Analytics API. Please ensure the backend service is running.
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
      
      {selectedBrand ? (
        // Header for brand detail view
        <header className="sticky top-0 z-50 w-full glass border-b border-border/20 backdrop-blur-apple shadow-sm">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" className="gap-2" onClick={handleBackToOverview}>
                  <ArrowLeft className="h-4 w-4" />
                  Back to Overview
                </Button>
                <Separator orientation="vertical" className="h-6" />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                    <BarChart3Icon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-display font-bold text-foreground">
                      {selectedBrand} Analysis
                    </h1>
                    <p className="text-sm text-muted-foreground">
                      Detailed brand performance metrics and insights
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                {brandMetrics && (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleBasicView}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        viewMode === 'basic' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-white/10 text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Basic View
                    </button>
                    <button
                      onClick={handleDetailedView}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        viewMode === 'detailed' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-white/10 text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Detailed Analysis
                    </button>
                  </div>
                )}
                <Badge variant="secondary" className="px-3 py-1 rounded-full glass border-0">
                  <BarChart3Icon className="h-3 w-3 mr-1" />
                  Analytics
                </Badge>
              </div>
            </div>
          </div>
        </header>
      ) : (
        <DashboardHeader 
          isLoading={isLoading}
          onRefresh={handleRefresh}
        />
      )}
      
      <div className="relative container mx-auto px-6 py-6">
                {selectedBrand ? (
          // Brand Detail View
          <div className="space-y-8">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="h-20 w-32 flex items-center justify-center bg-white/10 rounded-2xl border border-white/20">
                  <img
                    src={brandLogos[selectedBrand]}
                    alt={selectedBrand}
                    className="h-16 w-auto object-contain max-w-full"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        const fallback = document.createElement('span');
                        fallback.className = 'text-2xl font-display font-bold text-primary text-center';
                        fallback.textContent = selectedBrand;
                        parent.appendChild(fallback);
                      }
                    }}
                  />
                </div>
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
              ) : viewMode === 'detailed' && detailedAnalysis ? (
                <BrandDetailedAnalysis 
                  data={detailedAnalysis} 
                  onBack={handleBackToOverview} 
                />
              ) : brandMetrics ? (
                <div className="space-y-8">
                  {/* Basic Metrics Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

                  {/* Top Models Section */}
                  {brandMetrics.top_models.length > 0 && (
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
              ) : null}
            </div>
          </div>
        ) : (
          // Brand Overview with Top 10 and Dropdown Selection
          <div className="space-y-8">
            {/* Back to Dashboard Button */}
            <div className="flex justify-start">
              <Link to="/" className="flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </Link>
            </div>

            {/* Brand Selection Dropdown - Moved to Top */}
            <div className="glass rounded-3xl backdrop-blur-apple shadow-card p-8">
              <h2 className="text-2xl font-display font-semibold text-foreground mb-6">
                Select Any Brand
              </h2>
              <div className="relative">
                <Select onValueChange={handleBrandClick}>
                  <SelectTrigger className="w-full h-16 text-lg bg-white/10 border-white/20 rounded-2xl">
                    <SelectValue placeholder="Choose a brand to analyze..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-96 bg-white/10 backdrop-blur-apple border-white/20">
                    {brands.map((brand) => (
                      <SelectItem key={brand} value={brand} className="h-16">
                        <div className="flex items-center space-x-3 w-full">
                          <div className="h-8 w-10 flex items-center justify-center bg-white/10 rounded-lg border border-white/20">
                            <img
                              src={brandLogos[brand]}
                              alt={brand}
                              className="h-5 w-auto object-contain max-w-full"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                const parent = e.currentTarget.parentElement;
                                if (parent) {
                                  const fallback = document.createElement('span');
                                  fallback.className = 'text-xs font-bold text-primary text-center leading-tight';
                                  fallback.textContent = brand;
                                  parent.appendChild(fallback);
                                }
                              }}
                            />
                          </div>
                          <span className="font-medium text-foreground">{brand}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="text-center space-y-4">
              <h1 className="text-4xl font-display font-bold text-foreground">
                Brand Performance Analysis
              </h1>
              <p className="text-xl text-muted-foreground">
                Select a brand to view detailed metrics and analysis
              </p>
            </div>

            {/* Top 10 Brands Performance Chart */}
            {data && (
              <div className="glass rounded-3xl backdrop-blur-apple shadow-card p-8">
                <h2 className="text-2xl font-display font-semibold text-foreground mb-6">
                  Top 10 Brands by Sales Performance
                </h2>
                <div className="space-y-4">
                  {topBrands.map((brand, index) => (
                    <div key={brand.brand} className="flex items-center space-x-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">{index + 1}</span>
                      </div>
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="h-8 w-10 flex items-center justify-center bg-white/10 rounded-lg border border-white/20">
                          <img
                            src={brandLogos[brand.brand]}
                            alt={brand.brand}
                            className="h-5 w-auto object-contain max-w-full"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              const parent = e.currentTarget.parentElement;
                              if (parent) {
                                const fallback = document.createElement('span');
                                fallback.className = 'text-xs font-bold text-primary text-center leading-tight';
                                fallback.textContent = brand.brand;
                                parent.appendChild(fallback);
                              }
                            }}
                          />
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
                              style={{ width: `${(brand.sales_count / topBrands[0].sales_count) * 100}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleBrandClick(brand.brand)}
                        className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-sm font-medium transition-colors"
                      >
                        View Details
                      </button>
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