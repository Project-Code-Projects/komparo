import { json } from "@remix-run/node";
import { alibabaScraper } from "../scraper/alibaba-selenium-scraper";
import { promises as fs } from "fs";

export async function action() {
  const { query, maxPrice } = await request.json();

  try {
    console.log("Starting scraper for:", query, maxPrice);
    await alibabaScraper(query, maxPrice); // Run the scraper

    // Read the latest scraped data
    const jsonDirectory = "E:/PC Thesis/komparo/app/scraper";
    const fileContents = await fs.readFile(
      `${jsonDirectory}/alibaba_results.json`,
      "utf8",
    );
    const data = JSON.parse(fileContents);

    return json({ success: true, data });
  } catch (error) {
    console.error("Scraper failed:", error);
    return json({ success: false, error: "Scraper failed" }, { status: 500 });
  }
}
