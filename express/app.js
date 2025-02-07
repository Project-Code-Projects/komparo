import path from "path";
import cors from "cors";
import "dotenv/config.js";
import cron from "node-cron";
import express from "express";
import db from "./database/db.js";
import { fileURLToPath } from "url";
import { connectDB } from "../prisma/connectDB.js";
import alibabaRouter from "./routes/scraperRoute.js";
import webhookRouter from "./routes/webhookRoute.js";
import updatePriceRouter from "./routes/updatePrice.js";

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

app.listen(PORT, async (req, res) => {
  console.log(`✅  Server running on http://localhost:${PORT}`);
  console.log(
    `✅  Scraper test page available at http://localhost:${PORT}/scraper-test.html`,
  );
  await connectDB();
});

// -------------------------------
// Schedule a Cron Job every 2 minutes
// -------------------------------

cron.schedule("10 * * * * *", async () => {
  console.log(
    "Cron job triggered: scraping pending queries from PostgreSQL...",
  );

  try {
    const { rows } = await db.query(
      'SELECT * FROM public."Comparator" WHERE status = $1',
      ["pending"],
    );

    if (!rows.length) {
      console.log("No pending queries found.");
      return;
    }

    for (const row of rows) {
      const searchQuery = row.query; // Your query column value
      console.log("Panding task: ", searchQuery);
      console.log("Scraping for query:", searchQuery);

      try {
        const amazonResponse = await fetch(
          "http://localhost:3001/api/scrape/amazon",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              searchQuery,
              // maxPrice: 100,
              // maxPages: 1,
            }),
          },
        );

        const alibabaResponse = await fetch(
          "http://localhost:3001/api/scrape/alibaba",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              searchQuery,
              // maxPrice: 100,
              // maxPages: 1,
            }),
          },
        );
        //fetch() returns a 'Response' object. You need to convert that response to JSON using .json()
        const resultAmazon = await amazonResponse.json();
        const resultAlibaba = await alibabaResponse.json();
        console.log(
          "Scraping job result for",
          searchQuery,
          ":",
          resultAmazon.url,
          resultAlibaba.url,
        );

        // Optionally update the status after successful scraping:
        await db.query(
          'UPDATE public."Comparator" SET status = $1,alibaba = $2, amazon = $3 WHERE query = $4',
          ["completed", resultAlibaba.url, resultAmazon.url, searchQuery],
        );
      } catch (scrapeError) {
        console.error(
          `Error scraping for query "${searchQuery}":`,
          scrapeError,
        );
      }
    }
  } catch (error) {
    console.error("Error in cron job:", error);
  }
});
