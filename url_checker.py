#!/usr/bin/env python3
"""
Brand Logo URL Checker
Checks all brand logo URLs for 404 errors and other HTTP status codes.
"""

import requests
import time
from urllib.parse import urlparse
import json

# Brand logos mapping from the frontend
brand_logos = {
    "Lincoln": "https://worldvectorlogo.com/logo/lincoln-1",
    "Honda": "https://worldvectorlogo.com/logo/honda-1",
    "Ram": "https://worldvectorlogo.com/logo/ram-1",
    "VinFast": "https://worldvectorlogo.com/logo/vinfast-1",
    "Ford": "https://worldvectorlogo.com/logo/ford-1",
    "Scion": "https://worldvectorlogo.com/logo/scion-1",
    "Maserati": "https://worldvectorlogo.com/logo/maserati-1",
    "Dodge": "https://worldvectorlogo.com/logo/dodge-1",
    "Chevrolet": "https://worldvectorlogo.com/logo/chevrolet-1",
    "INFINITI": "https://worldvectorlogo.com/logo/infiniti-1",
    "MINI": "https://worldvectorlogo.com/logo/mini-1",
    "Lucid": "https://worldvectorlogo.com/logo/lucid-1",
    "Porsche": "https://worldvectorlogo.com/logo/porsche-1",
    "Alfa Romeo": "https://worldvectorlogo.com/logo/alfaromeo-1",
    "smart": "https://worldvectorlogo.com/logo/smart-1",
    "Audi": "https://worldvectorlogo.com/logo/audi-1",
    "Tesla": "https://worldvectorlogo.com/logo/tesla-1",
    "Jaguar": "https://worldvectorlogo.com/logo/jaguar-1",
    "Lexus": "https://worldvectorlogo.com/logo/lexus-1",
    "Kia": "https://worldvectorlogo.com/logo/kia-1",
    "Mercedes-Benz": "https://worldvectorlogo.com/logo/mercedesbenz-1",
    "Land Rover": "https://worldvectorlogo.com/logo/landrover-1",
    "Jeep": "https://worldvectorlogo.com/logo/jeep-1",
    "Rivian": "https://worldvectorlogo.com/logo/rivian-1",
    "Volvo": "https://worldvectorlogo.com/logo/volvo-1",
    "Buick": "https://worldvectorlogo.com/logo/buick-1",
    "Cadillac": "https://worldvectorlogo.com/logo/cadillac-1",
    "Acura": "https://worldvectorlogo.com/logo/acura-1",
    "Nissan": "https://worldvectorlogo.com/logo/nissan-1",
    "Polestar": "https://worldvectorlogo.com/logo/polestar-1",
    "Genesis": "https://worldvectorlogo.com/logo/genesis-1",
    "Hyundai": "https://worldvectorlogo.com/logo/hyundai-1",
    "MAZDA": "https://worldvectorlogo.com/logo/mazda-1",
    "Mitsubishi": "https://worldvectorlogo.com/logo/mitsubishi-1",
    "FIAT": "https://worldvectorlogo.com/logo/fiat-1",
    "Subaru": "https://worldvectorlogo.com/logo/subaru-1",
    "BMW": "https://worldvectorlogo.com/logo/bmw-1",
    "Volkswagen": "https://worldvectorlogo.com/logo/volkswagen-1",
    "Chrysler": "https://worldvectorlogo.com/logo/chrysler-1",
    "Toyota": "https://worldvectorlogo.com/logo/toyota-1",
    "GMC": "https://worldvectorlogo.com/logo/gmc-1"
}

def check_url(url, brand_name):
    """Check a single URL and return the status"""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, headers=headers, timeout=10, allow_redirects=True)
        return {
            'brand': brand_name,
            'url': url,
            'status_code': response.status_code,
            'final_url': response.url,
            'content_type': response.headers.get('content-type', ''),
            'content_length': len(response.content),
            'is_image': 'image' in response.headers.get('content-type', '').lower()
        }
    except requests.exceptions.RequestException as e:
        return {
            'brand': brand_name,
            'url': url,
            'status_code': 'ERROR',
            'error': str(e),
            'is_image': False
        }

def main():
    """Main function to check all URLs"""
    print("🔍 Checking all brand logo URLs for 404 errors...")
    print("=" * 80)
    
    results = []
    working_urls = []
    broken_urls = []
    
    for brand, url in brand_logos.items():
        print(f"Checking {brand}...", end=" ")
        result = check_url(url, brand)
        results.append(result)
        
        if result['status_code'] == 200 and result['is_image']:
            print(f"✅ OK (200)")
            working_urls.append(result)
        elif result['status_code'] == 200:
            print(f"⚠️  OK but not image (200)")
            working_urls.append(result)
        else:
            print(f"❌ FAILED ({result['status_code']})")
            broken_urls.append(result)
        
        time.sleep(0.5)  # Be nice to the servers
    
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
    with open('url_check_results.json', 'w') as f:
        json.dump({
            'summary': {
                'total': len(results),
                'working': len(working_urls),
                'broken': len(broken_urls),
                'success_rate': len(working_urls)/len(results)*100
            },
            'results': results
        }, f, indent=2)
    
    print(f"\n💾 Detailed results saved to 'url_check_results.json'")
    
    # Generate alternative URLs for broken ones
    if broken_urls:
        print("\n🔄 SUGGESTED ALTERNATIVES:")
        print("-" * 40)
        for result in broken_urls:
            brand = result['brand']
            # Try different URL patterns
            alternatives = [
                f"https://worldvectorlogo.com/logo/{brand.lower()}-2",
                f"https://worldvectorlogo.com/logo/{brand.lower().replace(' ', '')}-1",
                f"https://worldvectorlogo.com/logo/{brand.lower().replace(' ', '')}-2",
                f"https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/{brand.replace(' ', '_')}.svg/1200px-{brand.replace(' ', '_')}.svg.png"
            ]
            print(f"\n{brand} alternatives:")
            for alt_url in alternatives:
                print(f"  • {alt_url}")

if __name__ == "__main__":
    main() 