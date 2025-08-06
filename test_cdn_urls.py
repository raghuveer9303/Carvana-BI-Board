#!/usr/bin/env python3
"""
Test CDN URLs for brand logos
"""

import requests
import time
import json

# Updated brand logos with CDN URLs
brand_logos = {
    "Lincoln": "https://cdn.worldvectorlogo.com/logos/lincoln-1.svg",
    "Honda": "https://cdn.worldvectorlogo.com/logos/honda-1.svg",
    "Ram": "https://cdn.worldvectorlogo.com/logos/ram-1.svg",
    "VinFast": "https://cdn.worldvectorlogo.com/logos/vinfast-1.svg",
    "Ford": "https://cdn.worldvectorlogo.com/logos/ford-1.svg",
    "Scion": "https://cdn.worldvectorlogo.com/logos/scion-1.svg",
    "Maserati": "https://cdn.worldvectorlogo.com/logos/maserati-1.svg",
    "Dodge": "https://cdn.worldvectorlogo.com/logos/dodge-1.svg",
    "Chevrolet": "https://cdn.worldvectorlogo.com/logos/chevrolet-1.svg",
    "INFINITI": "https://cdn.worldvectorlogo.com/logos/infiniti-1.svg",
    "MINI": "https://cdn.worldvectorlogo.com/logos/mini-1.svg",
    "Lucid": "https://cdn.worldvectorlogo.com/logos/lucid-1.svg",
    "Porsche": "https://cdn.worldvectorlogo.com/logos/porsche-1.svg",
    "Alfa Romeo": "https://cdn.worldvectorlogo.com/logos/alfaromeo-1.svg",
    "smart": "https://cdn.worldvectorlogo.com/logos/smart-1.svg",
    "Audi": "https://cdn.worldvectorlogo.com/logos/audi-1.svg",
    "Tesla": "https://cdn.worldvectorlogo.com/logos/tesla-1.svg",
    "Jaguar": "https://cdn.worldvectorlogo.com/logos/jaguar-1.svg",
    "Lexus": "https://cdn.worldvectorlogo.com/logos/lexus-1.svg",
    "Kia": "https://cdn.worldvectorlogo.com/logos/kia-1.svg",
    "Mercedes-Benz": "https://cdn.worldvectorlogo.com/logos/mercedesbenz-1.svg",
    "Land Rover": "https://cdn.worldvectorlogo.com/logos/landrover-1.svg",
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
}

def test_url(url, brand_name):
    """Test a single URL"""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, headers=headers, timeout=10, allow_redirects=True)
        
        is_image = 'image' in response.headers.get('content-type', '').lower()
        is_svg = 'svg' in response.headers.get('content-type', '').lower()
        
        return {
            'brand': brand_name,
            'url': url,
            'status_code': response.status_code,
            'is_image': is_image,
            'is_svg': is_svg,
            'content_type': response.headers.get('content-type', ''),
            'content_length': len(response.content)
        }
    except requests.exceptions.RequestException as e:
        return {
            'brand': brand_name,
            'url': url,
            'status_code': 'ERROR',
            'error': str(e),
            'is_image': False,
            'is_svg': False
        }

def main():
    """Main function to test CDN URLs"""
    print("🔍 Testing CDN URLs for brand logos...")
    print("=" * 80)
    
    results = []
    working_urls = []
    broken_urls = []
    
    for brand, url in brand_logos.items():
        print(f"Testing {brand}...", end=" ")
        result = test_url(url, brand)
        results.append(result)
        
        if result['status_code'] == 200 and (result['is_image'] or result['is_svg']):
            print(f"✅ WORKING! (200, {result['content_type']})")
            working_urls.append(result)
        elif result['status_code'] == 200:
            print(f"⚠️  OK but not image (200, {result['content_type']})")
            working_urls.append(result)
        else:
            print(f"❌ FAILED ({result['status_code']})")
            broken_urls.append(result)
        
        time.sleep(0.2)  # Be nice to the CDN
    
    print("\n" + "=" * 80)
    print("📊 SUMMARY")
    print("=" * 80)
    
    print(f"✅ Working URLs: {len(working_urls)}")
    print(f"❌ Broken URLs: {len(broken_urls)}")
    print(f"📈 Success Rate: {len(working_urls)/len(results)*100:.1f}%")
    
    if broken_urls:
        print("\n❌ BROKEN URLs:")
        print("-" * 40)
        for result in broken_urls:
            print(f"• {result['brand']}: {result['url']}")
            if 'error' in result:
                print(f"  Error: {result['error']}")
            else:
                print(f"  Status: {result['status_code']}")
    
    # Save results to JSON file
    with open('cdn_test_results.json', 'w') as f:
        json.dump({
            'summary': {
                'total': len(results),
                'working': len(working_urls),
                'broken': len(broken_urls),
                'success_rate': len(working_urls)/len(results)*100
            },
            'results': results
        }, f, indent=2)
    
    print(f"\n💾 Detailed results saved to 'cdn_test_results.json'")
    
    if working_urls:
        print("\n✅ WORKING CDN URLs:")
        print("-" * 40)
        for result in working_urls:
            print(f"• {result['brand']}: {result['url']}")

if __name__ == "__main__":
    main() 