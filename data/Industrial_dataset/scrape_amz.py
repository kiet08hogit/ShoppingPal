import csv
import requests
from bs4 import BeautifulSoup
import json
import time

# Amazon search URL for power tools
url = "https://www.amazon.com/s?k=hard+hat"

# Headers to mimic a real browser
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate',
    'DNT': '1',
    'Connection': 'keep-alive',
    'Upgrade-Insecure-Requests': '1'
}

try:
    print("Fetching Amazon search page...")
    response = requests.get(url, headers=headers, timeout=10)
    response.raise_for_status()
    
    print("Parsing HTML content...")
    soup = BeautifulSoup(response.content, 'html.parser')
    
    # Find all product containers (limit to first 20)
    all_products = soup.find_all('div', {'data-component-type': 's-search-result'})
    products = all_products[:20]  # Only take first 20 products
    
    print(f"Scraping {len(products)} products from first page\n")
    
    products_data = []
    
    for idx, product in enumerate(products, 1):
        try:
            # Product name - try multiple selectors
            name = "N/A"
            name_elem = product.find('span', {'class': 's-size-mini'})
            if name_elem:
                name = name_elem.get_text(strip=True)
            else:
                # Try alternative selector
                h2 = product.find('h2')
                if h2:
                    span = h2.find('span')
                    if span:
                        name = span.get_text(strip=True)
            
            # Price - try multiple approaches
            price = "N/A"
            price_elem = product.find('span', {'class': 'a-price-whole'})
            if not price_elem:
                price_elem = product.find('span', {'class': ['a-price', 'a-price-whole', 'a-price-currency']})
            if price_elem:
                price = price_elem.get_text(strip=True)
            
            # Alternative price search
            if price == "N/A":
                price_span = product.find('span', lambda x: x and 'aria-hidden' in x.attrs and x.get_text(strip=True).startswith('$'))
                if price_span:
                    price = price_span.get_text(strip=True)
            
            # Product URL
            product_url = "N/A"
            link = product.find('a', {'class': 's-no-outline'})
            if link and link.has_attr('href'):
                product_url = link.get('href')
                if not product_url.startswith('http'):
                    product_url = 'https://www.amazon.com' + product_url
            
            # Rating
            rating = "N/A"
            rating_elem = product.find('span', {'class': 'a-icon-star-small'})
            if rating_elem:
                rating = rating_elem.get_text(strip=True)
            
            # Number of reviews
            reviews = "N/A"
            reviews_span = product.find('span', {'aria-label': lambda x: x and 'customer ratings' in str(x).lower()})
            if reviews_span:
                reviews = reviews_span.get_text(strip=True)
            
            # Prime badge
            prime = "No"
            if product.find('span', {'class': 'a-icon-prime'}):
                prime = "Yes"
            
            # Availability
            availability = "Check availability"
            avail_elem = product.find('span', string=lambda x: x and ('in stock' in str(x).lower() or 'only' in str(x).lower()))
            if avail_elem:
                availability = avail_elem.get_text(strip=True)
            
            if name != "N/A":  # Only add if we found a name
                products_data.append({
                    'Product Name': name,
                    'Price': price,
                    'Rating': rating,
                    'Number of Reviews': reviews,
                    'Prime': prime,
                    'Availability': availability,
                    'URL': product_url
                })
                
                print(f"{len(products_data):2d}. ✓ {name[:60]}...")
        
        except Exception as e:
            print(f"Error scraping product {idx}: {str(e)[:50]}")
            continue
    
    # Save to CSV
    csv_filename = "Hard hat.csv"
    if products_data:
        with open(csv_filename, 'w', newline='', encoding='utf-8') as csvfile:
            fieldnames = ['Product Name', 'Price', 'Rating', 'Number of Reviews', 'Prime', 'Availability', 'URL']
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            
            writer.writeheader()
            writer.writerows(products_data)
        
        print(f"\n✓ Successfully scraped {len(products_data)} products!")
        print(f"✓ Data saved to '{csv_filename}'")
    else:
        print("No valid products found!")

except requests.exceptions.RequestException as e:
    print(f"Error fetching page: {e}")
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
