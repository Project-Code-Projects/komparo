import { convertJsonToCsv } from "../utils/jsonToCsv.js";
import { Builder, By, until } from "selenium-webdriver";
import { Options } from "selenium-webdriver/edge.js";
import { promises as fs } from "fs";
import { fileURLToPath } from "url";
import path from "path";
import { uploadCsv } from "../utils/cloudinaryUtils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function extractData(container, selector, attribute = null) {
  try {
    const element = await container.findElement(By.css(selector));
    return attribute
      ? await element.getAttribute(attribute)
      : await element.getText();
  } catch {
    return "nil";
  }
}

export async function applyNewFilter(driver) {
  try {
    const filterSection = await driver.wait(
      until.elementLocated(By.className("searchx-filter-wrapper")),
      10000,
    );

    const filterElements = await filterSection.findElements(
      By.css(".searchx-filter-item__label"),
    );

    for (const filterElement of filterElements) {
      const filterText = (await filterElement.getText()).toLowerCase();
      if (filterText.includes("new")) {
        console.log('Applying "New" filter...');
        try {
          const linkElement = await filterElement.findElement(
            By.xpath(
              "./ancestor::div[contains(@class, 'searchx-filter-item')]//a",
            ),
          );

          await driver.wait(until.elementIsVisible(linkElement), 10000);
          await driver.wait(until.elementIsEnabled(linkElement), 10000);

          try {
            await linkElement.click();
          } catch (clickError) {
            console.log("Using JavaScriptExecutor for click...");
            await driver.executeScript("arguments[0].click();", linkElement);
          }

          await driver.sleep(3000);
          return true;
        } catch (e) {
          console.error('Error applying "New" filter:', e);
          return false;
        }
      }
    }
  } catch (e) {
    console.error("Error finding 'New' filter:", e);
  }
  return false;
}

export async function isValidProduct(productData) {
  const requiredFields = ["title", "price", "image", "link"];
  for (const field of requiredFields) {
    if (!productData[field] || productData[field] === "nil") {
      console.log(`Skipping product: Missing ${field}`);
      return false;
    }
  }

  if (productData.price.includes("-")) {
    console.log("Skipping product: Price range detected");
    return false;
  }

  if (!productData.price.includes("$")) {
    // May need to change later
    console.log("Skipping product: Invalid price format");
    return false;
  }

  if (!productData.image.startsWith("http")) {
    console.log("Skipping product: Invalid image URL");
    return false;
  }

  if (!productData.link.startsWith("http")) {
    console.log("Skipping product: Invalid product URL");
    return false;
  }

  return true;
}

export async function scrapePage(driver) {
  const productDataList = [];

  try {
    const productContainers = await driver.findElements(
      By.className("fy23-search-card"),
    );

    if (!productContainers.length) {
      return [];
    }

    for (const container of productContainers) {
      try {
        const productData = {
          title: await extractData(container, ".search-card-e-title a span"),
          price: await extractData(container, ".search-card-e-price-main"),
          company: await extractData(container, ".search-card-e-company"),
          moq: await extractData(
            container,
            ".search-card-m-sale-features__item",
          ),
          rating: await extractData(container, ".search-card-e-review strong"),
          nop: await extractData(
            container,
            "div.search-card-e-market-power-common",
          ),
          image: await extractData(
            container,
            "a.search-card-e-slider__link img.search-card-e-slider__img",
            "src",
          ),
          link: await extractData(container, ".search-card-e-title a", "href"),
        };

        if (isValidProduct(productData)) {
          // productData.price = productData.price.trim();
          productData.price = productData.price.replace(/\$/g, "").trim();
          console.log("price:", productData.price);
          productData.scrapedAt = new Date().toISOString();
          console.log("Scraped Product:", JSON.stringify(productData, null, 2));
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

export async function scrapeAlibabaProducts(
  searchQuery,
  maxPrice = 1000,
  maxPages = 1,
) {
  console.log("Scraping Alibaba products...");
  //const { searchQuery, maxPrice = 1000, maxPages = 1 } = req.body;

  console.log("Search query:", searchQuery);
  console.log("Max price:", maxPrice);
  console.log("Max pages:", maxPages);

  let driver;

  try {
    driver = await new Builder()
      .forBrowser("MicrosoftEdge")
      .setEdgeOptions(new Options())
      .build();
    //&pricet=${maxPrice}
    const formattedQuery = searchQuery.split(" ").join("+");
    const url = `https://www.alibaba.com/trade/search?fsb=y&mergeResult=true&ta=y&tab=all&searchText=${formattedQuery}`;

    await driver.get(url);
    await driver.sleep(5000);

    // await applyNewFilter(driver);

    let allProducts = [];
    let currentPage = 1;

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

    // const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    // const fileName = `alibaba_results_${timestamp}.json`;
    const filePath = path.join(
      __dirname,
      "../datasets/json/scraped_results.json",
    );

    await fs.writeFile(filePath, JSON.stringify(allProducts, null, 2), "utf-8");

    const csvFilePath = await convertJsonToCsv(
      searchQuery,
      filePath,
      "Alibaba",
    );

    const alibabaUrl = await uploadCsv(csvFilePath);
    console.log("alibaba: ", alibabaUrl);
    return alibabaUrl;
  } catch (error) {
    console.error("Scraping error:", error);
  } finally {
    if (driver) {
      console.log("Quitting driver...");
      await driver.quit();
    }
  }
}

// scrapeAlibabaProducts("The Collection Snowboard: Oxygen");