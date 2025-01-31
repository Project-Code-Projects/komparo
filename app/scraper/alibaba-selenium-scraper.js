import { Builder, By, until } from 'selenium-webdriver';
import { Options } from 'selenium-webdriver/edge.js';
import { promises as fs } from 'fs';
import readline from 'readline';
// import { convertJsonToCsv } from './json_to_csv.js';

export function alibabaScraper(userInput, maxPrice) {
    console.log("IN HERE...THE SCRAPER =================================")
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const extractData = async (container, selector, attribute = null) => {
        try {
            const element = await container.findElement(By.css(selector));
            return attribute ? await element.getAttribute(attribute) : await element.getText();
        } catch {
            return "nil";
        }
    };

    const applyNewFilter = async (driver) => {
        let filterApplied = false;

        try {
            const filterSection = await driver.wait(
                until.elementLocated(By.className('searchx-filter-wrapper')),
                10000
            );

            const filterElements = await filterSection.findElements(By.css('.searchx-filter-item__label'));

            for (const filterElement of filterElements) {
                const filterText = (await filterElement.getText()).toLowerCase();
                if (filterText.includes("new")) {
                    console.log(`Applying "New" filter...`);
                    try {
                        const linkElement = await filterElement.findElement(
                            By.xpath("./ancestor::div[contains(@class, 'searchx-filter-item')]//a")
                        );

                        await driver.wait(until.elementIsVisible(linkElement), 10000);
                        await driver.wait(until.elementIsEnabled(linkElement), 10000);

                        try {
                            await linkElement.click();
                        } catch (clickError) {
                            console.log(`Standard click failed, trying JavaScriptExecutor...`);
                            await driver.executeScript("arguments[0].click();", linkElement);
                        }

                        await driver.sleep(3000);
                        console.log(`Successfully applied "New" filter.`);
                        filterApplied = true;
                        break;  // Stop after applying the "New" filter
                    } catch (e) {
                        console.log(`Error clicking on "New" filter`, e);
                    }
                }
            }
        } catch (e) {
            console.log("Error finding or applying the 'New' filter:", e);
        }

        return filterApplied;
    };


    const applyFilters = async (driver, userInput) => {
        let filtersApplied = false;

        try {
            // Apply the "New" filter first
            const newFilterApplied = await applyNewFilter(driver);
            if (newFilterApplied) {
                filtersApplied = true;
            }

            // // Proceed to apply other filters even if "New" was applied
            // const filterSection = await driver.wait(
            //     until.elementLocated(By.className('searchx-filter-wrapper')),
            //     10000
            // );

            // const filterElements = await filterSection.findElements(By.css('.searchx-filter-item__label'));
            // console.log("Available filter elements:");

            // // Apply other filters based on user input
            // const inputKeywords = userInput.toLowerCase().split(' ');

            // for (const filterElement of filterElements) {
            //     const filterText = (await filterElement.getText()).toLowerCase();

            //     // Improved keyword matching
            //     const filterMatches = inputKeywords.filter(keyword => filterText.includes(keyword));
            //     if (filterMatches.length > 0) {
            //         filterMatches.sort((a, b) => b.length - a.length);  // Prioritize most relevant match
            //         const bestMatch = filterMatches[0];

            //         console.log(`Found match: ${filterText} matches keyword '${bestMatch}'`);

            //         try {
            //             const linkElement = await filterElement.findElement(
            //                 By.xpath("./ancestor::div[contains(@class, 'searchx-filter-item')]//a")
            //             );

            //             await driver.wait(until.elementIsVisible(linkElement), 10000);
            //             await driver.wait(until.elementIsEnabled(linkElement), 10000);

            //             try {
            //                 await linkElement.click();
            //             } catch (clickError) {
            //                 console.log(`Standard click failed, trying JavaScriptExecutor...`);
            //                 await driver.executeScript("arguments[0].click();", linkElement);
            //             }

            //             await driver.sleep(3000);
            //             console.log(`Successfully applied filter: ${filterText}`);
            //             filtersApplied = true;
            //         } catch (e) {
            //             console.log(`Error clicking on filter: ${filterText}`, e);
            //         }
            //     }
            // }

        } catch (e) {
            console.log("Error finding or applying filters:", e);
        }

        return filtersApplied;
    };


    // Function to scrape product details from a page
    const scrapePage = async (driver, productDataList, index) => {
        try {
            const currentPageElement = await driver.wait(
                until.elementLocated(By.css('.pagination-item.current')),
                10000
            );
            const currentPageNumber = await currentPageElement.getText();
            console.log(`Currently on page ${currentPageNumber}`);
        } catch (e) {
            console.log("Could not identify the current page number.", e);
            return false;
        }

        const productContainers = await driver.findElements(By.className('fy23-search-card'));
        if (!productContainers.length) {
            console.log("No more products found. Exiting...");
            return false;
        }

        const filteredContainers = [];
        for (const container of productContainers) {
            try {
                const name = await extractData(container, '.search-card-e-title a span');
                const price = await extractData(container, '.search-card-e-price-main');
                const productLink = await extractData(container, '.search-card-e-title a', 'href');
                const rating = await extractData(container, '.search-card-e-review strong');
                const imageLink = await extractData(container, 'a.search-card-e-slider__link img.search-card-e-slider__img', 'src');

                if (
                    name !== 'nil' && price !== 'nil' && !price.includes('-') &&
                    productLink !== 'nil' && rating !== 'nil' && imageLink !== 'nil'
                ) {
                    filteredContainers.push(container);
                }
            } catch (e) {
                console.log("Skipping container due to missing data");
            }
        }

        // Process filtered containers
        for (const productContainer of filteredContainers) {
            index++;
            console.log(`\n--- Product Container ${index} ---`);

            const productData = {
                title: await extractData(productContainer, ".search-card-e-title a span"),
                price: await extractData(productContainer, ".search-card-e-price-main"),
                company: await extractData(productContainer, ".search-card-e-company"),
                moq: await extractData(productContainer, ".search-card-m-sale-features__item"),
                rating: await extractData(productContainer, ".search-card-e-review strong"),
                image: await extractData(productContainer, "a.search-card-e-slider__link img.search-card-e-slider__img", "src"),
                link: await extractData(productContainer, ".search-card-e-title a", "href")
            };

            console.log("Product Data:", productData);
            productDataList.push(productData);
        }

        return true;
    };

    const main = async () => {
        const driver = await new Builder()
            .forBrowser('MicrosoftEdge')
            .setEdgeOptions(new Options())
            .build();

        try {
            // Format search query
            const searchQuery = userInput.split(' ').join('+');

            // Load the search page
            console.log("Loading the search page...");
            await driver.get(`https://www.alibaba.com/trade/search?fsb=y&mergeResult=true&ta=y&tab=all&searchText=${searchQuery}&pricet=${maxPrice}`);

            // Wait for page load
            await driver.sleep(5000);

            // Apply filters
            let filtersApplied = await applyFilters(driver, userInput);

            // Initialize variables
            const productDataList = [];
            let index = 1;
            let pageNumber = 1;
            const baseUrl = await driver.getCurrentUrl();

            // Scrape pages
            while (true) {
                const success = await scrapePage(driver, productDataList, index, filtersApplied);
                if (!success || pageNumber === 1) break;

                try {
                    const nextPageUrl = `${baseUrl}page=${pageNumber + 1}`;
                    console.log(`Navigating to page ${pageNumber + 1}...`);
                    await driver.get(nextPageUrl);
                    pageNumber++;
                } catch (e) {
                    console.log("Failed to load the next page. Exiting...", e);
                    break;
                }
            }

            // Save scraped data
            const outputFile = "alibaba_results.json";
            await fs.writeFile(
                outputFile,
                JSON.stringify(productDataList, null, 2),
                'utf-8'
            );
            console.log(`Scraped data saved to ${outputFile}`);

            // Convert JSON to CSV
            // convertJsonToCsv(userInput, outputFile);

        } catch (error) {
            console.error('An error occurred:', error);
        } finally {
            await driver.quit();
            rl.close();
        }
    };

    main();
}


// alibabaScraper("men's shoes", 100);