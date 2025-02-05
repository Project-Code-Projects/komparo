import express from "express";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
import alibabaRouter from "./routes/scraperRoute.js";
import webhookRouter from "./routes/webhookRoute.js";
import updatePriceRouter from "./routes/updatePrice.js";
import "dotenv/config.js";
import cron from "node-cron";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(express.static(__dirname));
app.use("/api/scrape", alibabaRouter);
app.use("/api/webhooks", webhookRouter);
app.use("/api/updatePrice", updatePriceRouter);

app.get("/", (req, res) => {
  res.send("Shopify server is running!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(
    `Test page available at http://localhost:${PORT}/scraper-test.html`,
  );
});

// -------------------------------
// Schedule a Cron Job every 2 minutes
// -------------------------------

// cron.schedule("*/2 * * * *", async () => {
//   console.log("Cron job triggered: scraping Alibaba data...");
//   try {
//     // Adjust the searchQuery and parameters as needed.
//     const response = await fetch("http://localhost:3001/api/scrape/alibaba", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         searchQuery: "man's t-shirt",
//         maxPrice: 100,
//         maxPages: 1,
//       }),
//     });
//     const result = await response.json();
//     console.log("Scraping job result:", result);
//   } catch (error) {
//     console.error("Error in cron job:", error);
//   }
// });

cron.schedule("*/1 * * * *", async () => {
  console.log("Cron job triggered: scraping Alibaba data...");
  try {
    // Adjust the searchQuery and parameters as needed.
    const response = await fetch("http://localhost:3001/api/scrape/amazon", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        searchQuery: "man's t-shirt",
        maxPrice: 100,
        maxPages: 1,
      }),
    });
    const result = await response.json();
    console.log("Scraping job result:", result);
  } catch (error) {
    console.error("Error in cron job:", error);
  }
});
