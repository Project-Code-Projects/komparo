'''
We can optimize this further by adding some restrictions:
    1. Add more than one filter option. [Optional]
    2. The New filter option can be applied [Optional]
'''	

from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
import time
import json

# Initialize WebDriver
driver = webdriver.Edge()

# User input for the product search
user_input = input("Enter the product you want to search for: ")
max_price_input = input("Enter the maximum price you want to filter by: ")

# Format the search query
search_query = "+".join(user_input.split())

# List to hold scraped data
product_data_list = []

# Index to track container and page number
index, page_number = 1, 1

# Load the search page
print("Loading the search page...")
driver.get(f"https://www.alibaba.com/trade/search?fsb=y&mergeResult=true&ta=y&tab=all&searchText={search_query}&pricet={max_price_input}")

# Allow time for the page to load completely
time.sleep(5)

# Apply filters only on the first iteration
try:
    filter_section = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CLASS_NAME, "searchx-filter-wrapper"))
    )

    filter_elements = filter_section.find_elements(By.CSS_SELECTOR, ".searchx-filter-item__label")
    print("Available filter elements:")
    for filter_element in filter_elements:
        print(filter_element.text.strip())

    # Split user input into individual keywords
    input_keywords = user_input.lower().split()

    # Apply the matching filter
    for filter_element in filter_elements:
        filter_text = filter_element.text.strip().lower()
        if any(keyword in filter_text for keyword in input_keywords):
            print(f"Applying filter: {filter_text}")
            try:
                link_element = filter_element.find_element(By.XPATH, "./ancestor::a")
                WebDriverWait(driver, 10).until(EC.element_to_be_clickable(link_element)).click()
                time.sleep(3) 
                print(f"Successfully applied filter: {filter_text}")
                break
            except Exception as e:
                print(f"Error clicking on the filter: {filter_text}.", e)
    filters_applied = True
except Exception as e:
    print("Error finding or applying filters:", e)

# Initialize base URL
base_url = driver.current_url

while True:
   # Get the current page number
    try:
        current_page_element = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.CSS_SELECTOR, ".pagination-item.current"))
        )
        current_page_number = current_page_element.text.strip()
        print(f"Currently on page {current_page_number}")
    except Exception as e:
        print("Could not identify the current page number.", e)
        break


    # Scrape product details
    product_containers = driver.find_elements(By.CLASS_NAME, "fy23-search-card")
    if not product_containers:
        print("No more products found. Exiting...")
        break

    # Filter product containers based on restrictions before processing
    filtered_containers = []
    for container in product_containers:
        try:
            # Extract relevant fields for filtering
            name = container.find_element(By.CSS_SELECTOR, ".search-card-e-title a span").text.strip()
            price = container.find_element(By.CSS_SELECTOR, ".search-card-e-price-main").text.strip()
            product_link = container.find_element(By.CSS_SELECTOR, ".search-card-e-title a").get_attribute("href")
            rating = container.find_element(By.CSS_SELECTOR, ".search-card-e-review strong").text.strip()
            image_link = container.find_element(By.CSS_SELECTOR, "a.search-card-e-slider__link img.search-card-e-slider__img").get_attribute("src")

            # Check restrictions
            if (
                name != "nil" and
                price != "nil" and "-" not in price and  # Exclude range prices
                product_link != "nil" and
                rating != "nil" and
                image_link != "nil"
            ):
                filtered_containers.append(container)
        except Exception as e:
            print("Skipping container due to missing data")
            # print(e)

    # Process filtered containers
    for product_container in filtered_containers:
        index += 1
        print(f"\n--- Product Container {index} ---")

        def extract_data(selector, attribute=None):
            try:
                element = product_container.find_element(By.CSS_SELECTOR, selector)
                return element.get_attribute(attribute) if attribute else element.text.strip()
            except Exception:
                return "nil"

        product_data = {
            "Product Name": extract_data(".search-card-e-title a span"),
            "Price": extract_data(".search-card-e-price-main"),
            "Company": extract_data(".search-card-e-company"),
            "MOQ": extract_data(".search-card-m-sale-features__item"),
            "Rating": extract_data(".search-card-e-review strong"),
            "Image Link": extract_data("a.search-card-e-slider__link img.search-card-e-slider__img", "src"),
            "Product Link": extract_data(".search-card-e-title a", "href"),
        }

        print("Product Data:", product_data)
        product_data_list.append(product_data)

    # Handle pagination
    try:
        next_page_url = base_url + f"page={page_number + 1}"
        print(f"Navigating to page {page_number + 1}...")
        driver.get(next_page_url)
        page_number += 1
        if page_number == 2:	
            break
    except Exception as e:
        print("Failed to load the next page. Exiting...", e)
        break

# Save scraped data
output_file = "alibaba_results.json"
with open(output_file, "w", encoding="utf-8") as json_file:
    json.dump(product_data_list, json_file, indent=2)

print(f"Scraped data saved to {output_file}")
driver.quit()
