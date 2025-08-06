import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

// Brand logos mapping with worldvectorlogo.com CDN URLs
const brandLogos: Record<string, string> = {
  "Lincoln": "https://cdn.worldvectorlogo.com/logos/lincoln-1.svg",
  "Honda": "https://cdn.worldvectorlogo.com/logos/honda-1.svg",
  "Ram": "https://cdn.worldvectorlogo.com/logos/ram-1.svg",
  "VinFast": "https://cdn.worldvectorlogo.com/logos/vinfast-3.svg",
  "Ford": "https://cdn.worldvectorlogo.com/logos/ford-1.svg",
  "Scion": "https://cdn.worldvectorlogo.com/logos/scion.svg",
  "Maserati": "https://cdn.worldvectorlogo.com/logos/maserati-1.svg",
  "Dodge": "https://cdn.worldvectorlogo.com/logos/dodge-1.svg",
  "Chevrolet": "https://cdn.worldvectorlogo.com/logos/chevrolet-1.svg",
  "INFINITI": "https://cdn.worldvectorlogo.com/logos/infiniti-1.svg",
  "MINI": "https://cdn.worldvectorlogo.com/logos/bmw-mini-1.svg",
  "Lucid": "https://cdn.worldvectorlogo.com/logos/lucid-motors-logo.svg",
  "Porsche": "https://cdn.worldvectorlogo.com/logos/porsche-1.svg",
  "Alfa Romeo": "https://cdn.worldvectorlogo.com/logos/alfaromeo.svg",
  "smart": "https://cdn.worldvectorlogo.com/logos/smart-1.svg",
  "Audi": "https://cdn.worldvectorlogo.com/logos/audi-11.svg",
  "Tesla": "https://cdn.worldvectorlogo.com/logos/tesla-1.svg",
  "Jaguar": "https://cdn.worldvectorlogo.com/logos/jaguar-1.svg",
  "Lexus": "https://cdn.worldvectorlogo.com/logos/lexus-1.svg",
  "Kia": "https://cdn.worldvectorlogo.com/logos/kia-1.svg",
  "Mercedes-Benz": "https://cdn.worldvectorlogo.com/logos/mercedes-benz-9.svg",
  "Land Rover": "https://cdn.worldvectorlogo.com/logos/land-rover.svg",
  "Jeep": "https://cdn.worldvectorlogo.com/logos/jeep-1.svg",
  "Rivian": "https://cdn.worldvectorlogo.com/logos/rivian-1.svg",
  "Volvo": "https://cdn.worldvectorlogo.com/logos/volvo-1.svg",
  "Buick": "https://cdn.worldvectorlogo.com/logos/buick-1.svg",
  "Cadillac": "https://cdn.worldvectorlogo.com/logos/cadillac-1.svg",
  "Acura": "https://cdn.worldvectorlogo.com/logos/acura-1.svg",
  "Nissan": "https://cdn.worldvectorlogo.com/logos/nissan-1.svg",
  "Polestar": "https://cdn.worldvectorlogo.com/logos/polestar-1.svg",
  "Genesis": "https://cdn.worldvectorlogo.com/logos/genesis-1.svg",
  "Hyundai": "https://cdn.worldvectorlogo.com/logos/hyundai-1.svg",
  "MAZDA": "https://cdn.worldvectorlogo.com/logos/mazda-1.svg",
  "Mitsubishi": "https://cdn.worldvectorlogo.com/logos/mitsubishi-1.svg",
  "FIAT": "https://cdn.worldvectorlogo.com/logos/fiat-1.svg",
  "Subaru": "https://cdn.worldvectorlogo.com/logos/subaru-1.svg",
  "BMW": "https://cdn.worldvectorlogo.com/logos/bmw-1.svg",
  "Volkswagen": "https://cdn.worldvectorlogo.com/logos/volkswagen-1.svg",
  "Chrysler": "https://cdn.worldvectorlogo.com/logos/chrysler-1.svg",
  "Toyota": "https://cdn.worldvectorlogo.com/logos/toyota-1.svg",
  "GMC": "https://cdn.worldvectorlogo.com/logos/gmc-1.svg"
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

interface BrandSelectorProps {
  onBrandSelect?: (brand: string) => void;
  selectedBrand?: string | null;
  className?: string;
}

export function BrandSelector({ onBrandSelect, selectedBrand, className }: BrandSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleBrandSelect = (brand: string) => {
    onBrandSelect?.(brand);
    setIsOpen(false);
  };

  return (
    <div className={cn("glass rounded-3xl backdrop-blur-apple shadow-card p-6", className)}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-display font-semibold text-foreground">
              Brand Analysis
            </h2>
            <p className="text-sm text-muted-foreground">
              Select a brand to view detailed metrics
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="px-3 py-1 rounded-full glass border-0">
          <BarChart3 className="h-3 w-3 mr-1" />
          Analytics
        </Badge>
      </div>

      <div className="space-y-4">
        {/* Brand Selection Dropdown */}
        <div className="relative">
          <Select onValueChange={handleBrandSelect} value={selectedBrand || undefined}>
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

        {/* Quick Brand Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {brands.slice(0, 12).map((brand) => (
            <Button
              key={brand}
              variant="ghost"
              size="sm"
              onClick={() => handleBrandSelect(brand)}
              className={cn(
                "h-16 flex flex-col items-center justify-center gap-2 p-2 rounded-xl",
                "bg-white/5 hover:bg-white/10 border border-white/10",
                "transition-all duration-200 hover:scale-105",
                selectedBrand === brand && "bg-primary/20 border-primary/30 text-primary"
              )}
            >
              <div className="h-6 w-8 flex items-center justify-center bg-white/10 rounded border border-white/20">
                <img
                  src={brandLogos[brand]}
                  alt={brand}
                  className="h-4 w-auto object-contain max-w-full"
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
              <span className="text-xs font-medium text-center leading-tight">
                {brand}
              </span>
            </Button>
          ))}
        </div>

        {/* View All Brands Button */}
        <div className="text-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            className="px-6 py-2 rounded-xl border-white/20 bg-white/5 hover:bg-white/10"
          >
            View All Brands
            <ChevronDown className={cn(
              "h-4 w-4 ml-2 transition-transform duration-200",
              isOpen && "rotate-180"
            )} />
          </Button>
        </div>

        {/* Expanded Brand Grid */}
        {isOpen && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mt-4">
            {brands.slice(12).map((brand) => (
              <Button
                key={brand}
                variant="ghost"
                size="sm"
                onClick={() => handleBrandSelect(brand)}
                className={cn(
                  "h-16 flex flex-col items-center justify-center gap-2 p-2 rounded-xl",
                  "bg-white/5 hover:bg-white/10 border border-white/10",
                  "transition-all duration-200 hover:scale-105",
                  selectedBrand === brand && "bg-primary/20 border-primary/30 text-primary"
                )}
              >
                <div className="h-6 w-8 flex items-center justify-center bg-white/10 rounded border border-white/20">
                  <img
                    src={brandLogos[brand]}
                    alt={brand}
                    className="h-4 w-auto object-contain max-w-full"
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
                <span className="text-xs font-medium text-center leading-tight">
                  {brand}
                </span>
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 