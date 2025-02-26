import "dotenv/config.js";
import path from "path";
import cors from "cors";
import cron from "node-cron";
import express from "express";
import { fileURLToPath } from "url";
import { PrismaClient } from "@prisma/client";
import { connectDB } from "../prisma/connectDB.js";
import webhookRouter from "./routes/webhookRoute.js";
import updatePriceRouter from "./routes/updatePrice.js";
import productsRouter from "./routes/productsRoute.js";
import { initializeComparatorProducts } from "./utils/shopifyUtils.js";
import { scrapeAmazonProducts } from "./utils/scrapers/amazonScraper.js";
import { scrapeAlibabaProducts } from "./utils/scrapers/alibabaScraper.js";
import { getDownloadUrl } from "./controllers/downloadController.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(express.static(__dirname));
app.use("/api/webhooks", webhookRouter);
app.use("/api/updatePrice", updatePriceRouter); // Bad practice; change naming convention Mr. Iqbal
app.use("/api/products", productsRouter);
app.use("/api/download", getDownloadUrl);

app.get("/", (req, res) => {
  res.send("Shopify server is running!");
});

app.listen(PORT, async (req, res) => {
  console.log(` ✅ Server running on http://localhost:${PORT}`);
  await connectDB();
  await initializeComparatorProducts();
});

// -------------------------------
// Schedule a Cron Job every 2 minutes
// -------------------------------

const prisma = new PrismaClient();

let isScraping = false;

cron.schedule("10 * * * * *", async () => {
  if (isScraping) {
    console.log("⏳ Scraping is already in progress. Skipping this run...");
    return;
  }

  isScraping = true;

  console.log(
    "---------------------------------------------------------------",
  );
  console.log(
    "Cron job triggered: scraping pending queries from PostgreSQL...",
  );
  console.log(
    "---------------------------------------------------------------",
  );

  try {
    const row = await prisma.comparator.findFirst({
      where: {
        status: "pending",
      },
    });

    if (!row) {
      console.log("No pending queries found.");
      isScraping = false;
      return;
    }

    const searchQuery = row.query;
    const searchQueryId = row.id;
    console.log("Processing:", searchQuery);

    await prisma.comparator.update({
      where: { query: searchQuery },
      data: { status: "processing" },
    });

    try {
      await scrapeAmazonProducts(searchQuery, searchQueryId);
      await scrapeAlibabaProducts(searchQuery, searchQueryId);

      console.log(
        "---------------------------------------------------------------",
      );
      console.log("Back to Cron Scheduler...");
      console.log(
        "---------------------------------------------------------------",
      );
      console.log("Scraping completed for", searchQuery);

      await prisma.comparator.update({
        where: { query: searchQuery },
        data: {
          status: "completed",
        },
      });

      console.log("Updated status for", searchQuery);
      console.log("[END]");
    } catch (scrapeError) {
      console.error(`Error scraping for "${searchQuery}":`, scrapeError);
      await prisma.comparator.update({
        where: { query: searchQuery },
        data: { status: "pending" },
      });
    }
  } catch (error) {
    console.error("Error in cron job:", error);
  }

  isScraping = false;
});
