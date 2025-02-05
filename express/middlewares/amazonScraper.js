import { Builder, By, until } from "selenium-webdriver";
import { Options } from "selenium-webdriver/edge.js";
import { promises as fs } from "fs";
import { fileURLToPath } from "url";
import { convertJsonToCsv } from "../utils/json_to_csv.js";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Reusable function to extract text or attribute from an element.
async function extractData(container, selector, attribute = null) {
  try {
    const element = await container.findElement(By.css(selector));
    let value = attribute
      ? await element.getAttribute(attribute)
      : await element.getText();
    if (!value || value.trim() === "") {
      value = await element.getAttribute("aria-label");
    }
    return value || "";
  } catch {
    return "nil";
  }
}

// Function to check if a product object has valid data.
function isValidProduct(productData) {
  const requiredFields = ["title", "price", "image", "link"];
  for (const field of requiredFields) {
    if (!productData[field] || productData[field] === "nil") {
      console.log(`Skipping product: Missing ${field}`);
      return false;
    }
  }
  // You might add additional checks here if needed.
  return true;
}

// Function to scrape product data from a single Amazon search results page.
async function scrapePage(driver) {
  const productDataList = [];

  try {
    await driver.wait(
      until.elementLocated(
        By.css("div[data-component-type='s-search-result']"),
      ),
      10000,
    );
    // Find product containers. Amazon search results typically use 'div.s-result-item'
    const productContainers = await driver.findElements(
      By.css("div[data-component-type='s-search-result']"),
    );
    //console.log("Product Container: ", productContainers);
    if (!productContainers.length) {
      console.log("No products found on this page.");
      return [];
    }

    // Loop through each product container.
    for (const container of productContainers) {
      try {
        const productData = {
          title: await extractData(
            container,
            ".a-size-base-plus.a-color-base.a-text-normal",
          ),
          price: await extractData(
            container,
            "span.a-price span.a-price-whole",
          ),
          image: await extractData(container, "img.s-image", "src"),
          link: await extractData(
            container,
            "a.a-link-normal.s-no-outline",
            "href",
          ),
        };
        console.log("Product Data: ", productData);
        if (isValidProduct(productData)) {
          productData.price = productData.price.trim();
          productData.scrapedAt = new Date().toISOString();
          productDataList.push(productData);
        }
      } catch (e) {
        console.error("Error extracting product data:", e);
      }
    }
  } catch (e) {
    console.error("Error scraping page:", e);
  }

  return productDataList;
}

// Main function to scrape Amazon products based on a search query and price filter.
export async function scrapeAmazonProducts(req, res) {
  console.log("Scraping Amazon products...");
  const { searchQuery, maxPrice = 1000, maxPages = 1 } = req.body;

  console.log("Search query:", searchQuery);
  console.log("Max price:", maxPrice);
  console.log("Max pages:", maxPages);

  if (!searchQuery) {
    return res.status(400).json({ error: "Search query is required" });
  }

  let driver;

  try {
    driver = await new Builder()
      .forBrowser("MicrosoftEdge")
      .setEdgeOptions(new Options())
      .build();

    // Format search query (replace spaces with '+')
    const formattedQuery = searchQuery.split(" ").join("+");
    // Amazon's price filter uses price in cents.
    const maxPriceInCents = parseInt(maxPrice) * 100;
    // Construct the Amazon search URL.
    // Search with Price ---> &rh=p_36:0-${maxPriceInCents}
    const url = `https://www.amazon.com/s?k=${formattedQuery}`;
    console.log("Amazon URL:", url);

    await driver.get(url);
    // Wait for the page to load.
    await driver.sleep(5000);

    let allProducts = [];
    let currentPage = 1;

    // Loop through pages.
    while (currentPage <= maxPages) {
      const products = await scrapePage(driver);

      if (!products.length) break;

      allProducts = [...allProducts, ...products];

      if (currentPage < maxPages) {
        try {
          const nextPageUrl = `${url}&page=${currentPage + 1}`;
          await driver.get(nextPageUrl);
          await driver.sleep(3000);
          currentPage++;
        } catch (e) {
          console.error("Error navigating to next page:", e);
          break;
        }
      } else {
        break;
      }
    }

    // Save results to a JSON file.
    // const fileName = `amazon_results.json`;
    const filePath = path.join(__dirname, "results.json");

    await fs.writeFile(filePath, JSON.stringify(allProducts, null, 2), "utf-8");

    await convertJsonToCsv(searchQuery, filePath, "Amazon");

    return res.status(200).json({
      success: true,
      results: allProducts,
      totalProducts: allProducts.length,
      pagesScraped: currentPage,
      filePath,
    });
  } catch (error) {
    console.error("Scraping error:", error);
    return res.status(500).json({
      error: "An error occurred while scraping products",
      details: error.message,
    });
  } finally {
    if (driver) {
      console.log("Quitting driver...");
      await driver.quit();
    }
  }
}
