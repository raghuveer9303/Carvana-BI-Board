import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

// Brand logos mapping with direct image URLs
const brandLogos: Record<string, string> = {
  "Lincoln": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/The_Lincoln_Motor_Company_Logo.svg/1200px-The_Lincoln_Motor_Company_Logo.svg.png",
  "Honda": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Honda_Logo.svg/1200px-Honda_Logo.svg.png",
  "Ram": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Ram_logo.svg/1200px-Ram_logo.svg.png",
  "VinFast": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Logo_of_VinFast_%28simple_variant%29.svg/1200px-Logo_of_VinFast_%28simple_variant%29.svg.png",
  "Ford": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Ford_Motor_Company_Logo.svg/1200px-Ford_Motor_Company_Logo.svg.png",
  "Scion": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Scion_logo.png/1200px-Scion_logo.png",
  "Maserati": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Maserati_logo_2.svg/1200px-Maserati_logo_2.svg.png",
  "Dodge": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Dodge_logo.svg/1200px-Dodge_logo.svg.png",
  "Chevrolet": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Chevrolet_bowtie_2023.svg/1200px-Chevrolet_bowtie_2023.svg.png",
  "INFINITI": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Infiniti_logo.svg/1200px-Infiniti_logo.svg.png",
  "MINI": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/MINI_logo.svg/1200px-MINI_logo.svg.png",
  "Lucid": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Lucid_Motors_logo.svg/1200px-Lucid_Motors_logo.svg.png",
  "Porsche": "https://worldvectorlogo.com/downloaded/porsche-2.svg",
  "Alfa Romeo": "https://worldvectorlogo.com/downloaded/alfaromeo.svg",
  "smart": "https://brandlogo.net/wp-content/uploads/2015/11/smart-logo-vector-400x400.png",
  "Audi": "https://worldvectorlogo.com/downloaded/audi.svg",
  "Tesla": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/Tesla_Motors.svg/1200px-Tesla_Motors.svg.png",
  "Jaguar": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Jaguar_2024.svg/1200px-Jaguar_2024.svg.png",
  "Lexus": "https://worldvectorlogo.com/downloaded/lexus.svg",
  "Kia": "https://worldvectorlogo.com/downloaded/kia.svg",
  "Mercedes-Benz": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Mercedes-Logo.svg/1200px-Mercedes-Logo.svg.png",
  "Land Rover": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/JLR_logo_2023.svg/1200px-JLR_logo_2023.svg.png",
  "Jeep": "https://worldvectorlogo.com/downloaded/jeep.svg",
  "Rivian": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Rivian_logo_and_wordmark.svg/1200px-Rivian_logo_and_wordmark.svg.png",
  "Volvo": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Volvo_logo.svg/1200px-Volvo_logo.svg.png",
  "Buick": "https://worldvectorlogo.com/downloaded/buick.svg",
  "Cadillac": "https://worldvectorlogo.com/downloaded/cadillac.svg",
  "Acura": "https://worldvectorlogo.com/downloaded/acura.svg",
  "Nissan": "https://worldvectorlogo.com/downloaded/nissan.svg",
  "Polestar": "https://worldvectorlogo.com/downloaded/polestar.svg",
  "Genesis": "https://worldvectorlogo.com/downloaded/genesis.svg",
  "Hyundai": "https://worldvectorlogo.com/downloaded/hyundai.svg",
  "MAZDA": "https://worldvectorlogo.com/downloaded/mazda.svg",
  "Mitsubishi": "https://worldvectorlogo.com/downloaded/mitsubishi.svg",
  "FIAT": "https://worldvectorlogo.com/downloaded/fiat.svg",
  "Subaru": "https://worldvectorlogo.com/downloaded/subaru.svg",
  "BMW": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/BMW.svg/1200px-BMW.svg.png",
  "Volkswagen": "https://worldvectorlogo.com/downloaded/volkswagen.svg",
  "Chrysler": "https://worldvectorlogo.com/downloaded/chrysler.svg",
  "Toyota": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Toyota.svg/1200px-Toyota.svg.png",
  "GMC": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/GMC-Logo.svg/1200px-GMC-Logo.svg.png"
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