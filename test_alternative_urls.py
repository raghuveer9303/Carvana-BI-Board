#!/usr/bin/env python3
"""
Test alternative URLs for broken brand logos
"""

import requests
import time

# Broken URLs that need alternatives
broken_brands = {
    "VinFast": "https://worldvectorlogo.com/logo/vinfast-1",
    "Scion": "https://worldvectorlogo.com/logo/scion-1", 
    "MINI": "https://worldvectorlogo.com/logo/mini-1",
    "Lucid": "https://worldvectorlogo.com/logo/lucid-1",
    "Alfa Romeo": "https://worldvectorlogo.com/logo/alfaromeo-1",
    "Audi": "https://worldvectorlogo.com/logo/audi-1",
    "Mercedes-Benz": "https://worldvectorlogo.com/logo/mercedesbenz-1",
    "Land Rover": "https://worldvectorlogo.com/logo/landrover-1"
}

# Alternative URL patterns to test
alternative_patterns = [
    # Wikipedia Commons (most reliable)
    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/{brand}.svg/1200px-{brand}.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/{brand}_Logo.svg/1200px-{brand}_Logo.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/{brand}_logo.svg/1200px-{brand}_logo.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/{brand}_logo.svg/1200px-{brand}_logo.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e8/{brand}_Motors.svg/1200px-{brand}_Motors.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/{brand}_2024.svg/1200px-{brand}_2024.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/{brand}_2023.svg/1200px-{brand}_2023.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/{brand}_bowtie_2023.svg/1200px-{brand}_bowtie_2023.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/{brand}_logo_and_wordmark.svg/1200px-{brand}_logo_and_wordmark.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/JLR_logo_2023.svg/1200px-JLR_logo_2023.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/The_{brand}_Motor_Company_Logo.svg/1200px-The_{brand}_Motor_Company_Logo.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/{brand}_logo.png/1200px-{brand}_logo.png",
    
    # WorldVectorLogo alternatives
    "https://worldvectorlogo.com/logo/{brand_lower}-2",
    "https://worldvectorlogo.com/logo/{brand_lower_nospace}-1",
    "https://worldvectorlogo.com/logo/{brand_lower_nospace}-2",
    "https://worldvectorlogo.com/downloaded/{brand_lower_nospace}.svg",
    "https://worldvectorlogo.com/downloaded/{brand_lower_nospace}-2.svg",
    
    # Brandlogo.net
    "https://brandlogo.net/wp-content/uploads/2015/11/{brand_lower}-logo-vector-400x400.png"
]

def test_url(url, brand_name):
    """Test a single URL"""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        response = requests.get(url, headers=headers, timeout=10, allow_redirects=True)
        
        is_image = 'image' in response.headers.get('content-type', '').lower()
        
        return {
            'url': url,
            'status_code': response.status_code,
            'is_image': is_image,
            'content_type': response.headers.get('content-type', ''),
            'content_length': len(response.content)
        }
    except requests.exceptions.RequestException as e:
        return {
            'url': url,
            'status_code': 'ERROR',
            'error': str(e),
            'is_image': False
        }

def generate_alternatives(brand):
    """Generate alternative URLs for a brand"""
    alternatives = []
    
    # Brand name variations
    brand_variations = [
        brand,
        brand.replace(' ', ''),
        brand.replace(' ', '_'),
        brand.replace(' ', '-'),
        brand.upper(),
        brand.lower(),
        brand.replace('-', ''),
        brand.replace('_', '')
    ]
    
    for pattern in alternative_patterns:
        for variation in brand_variations:
            try:
                url = pattern.format(
                    brand=variation,
                    brand_lower=brand.lower(),
                    brand_lower_nospace=brand.lower().replace(' ', '')
                )
                alternatives.append(url)
            except:
                continue
    
    return list(set(alternatives))  # Remove duplicates

def main():
    """Main function to test alternatives"""
    print("🔍 Testing alternative URLs for broken brand logos...")
    print("=" * 80)
    
    working_alternatives = {}
    
    for brand, original_url in broken_brands.items():
        print(f"\n🔍 Testing alternatives for {brand}...")
        print("-" * 50)
        
        alternatives = generate_alternatives(brand)
        working_urls = []
        
        for i, url in enumerate(alternatives[:20]):  # Test first 20 alternatives
            print(f"  Testing {i+1}/{len(alternatives[:20])}: {url}")
            result = test_url(url, brand)
            
            if result['status_code'] == 200 and result['is_image']:
                print(f"    ✅ WORKING! (200, {result['content_type']})")
                working_urls.append(result)
            elif result['status_code'] == 200:
                print(f"    ⚠️  OK but not image (200, {result['content_type']})")
            else:
                print(f"    ❌ Failed ({result['status_code']})")
            
            time.sleep(0.2)  # Be nice to servers
        
        if working_urls:
            working_alternatives[brand] = working_urls[0]['url']  # Take first working one
            print(f"\n✅ Found working alternative for {brand}: {working_urls[0]['url']}")
        else:
            print(f"\n❌ No working alternatives found for {brand}")
    
    print("\n" + "=" * 80)
    print("📊 SUMMARY")
    print("=" * 80)
    
    if working_alternatives:
        print("✅ WORKING ALTERNATIVES:")
        for brand, url in working_alternatives.items():
            print(f"• {brand}: {url}")
        
        print("\n📝 Updated brandLogos mapping:")
        print("const brandLogos: Record<string, string> = {")
        for brand, url in working_alternatives.items():
            print(f'  "{brand}": "{url}",')
        print("};")
    else:
        print("❌ No working alternatives found")
    
    return working_alternatives

if __name__ == "__main__":
    main() 