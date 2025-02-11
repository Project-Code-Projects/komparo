import path from "path";
import cors from "cors";
import "dotenv/config.js";
import cron from "node-cron";
import express from "express";
import { fileURLToPath } from "url";
import { connectDB } from "../prisma/connectDB.js";
import webhookRouter from "./routes/webhookRoute.js";
import updatePriceRouter from "./routes/updatePrice.js";
import productsRouter from "./routes/productsRoute.js";
import { PrismaClient } from "@prisma/client";
import { scrapeAmazonProducts } from "./middlewares/amazonScraper.js";
import { scrapeAlibabaProducts } from "./middlewares/alibabaScraper.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(express.static(__dirname));
app.use("/api/webhooks", webhookRouter);
app.use("/api/updatePrice", updatePriceRouter); // Bad practice; change naming convention
app.use("/api/products", productsRouter);

app.get("/", (req, res) => {
  res.send("Shopify server is running!");
});

app.listen(PORT, async (req, res) => {
  console.log(` ✅ Server running on http://localhost:${PORT}`);
  await connectDB();
});

// -------------------------------
// Schedule a Cron Job every 2 minutes
// -------------------------------

const prisma = new PrismaClient();

cron.schedule("10 * * * * *", async () => {
  console.log("Cron job triggered: scraping pending queries from PostgreSQL...");

  try {
    const rows = await prisma.comparator.findMany({
      where: {
        status: "pending",
      },
    });

    if (!rows.length) {
      console.log("No pending queries found.");
      return;
    }

    for (const row of rows) {
      const searchQuery = row.query;
      console.log("Pending task: ", searchQuery);
      console.log("Scraping for query:", searchQuery);

      try {
        const amazonResponse = await scrapeAmazonProducts(searchQuery);
        const alibabaResponse = await scrapeAlibabaProducts(searchQuery);

        console.log("Scraping job result for", searchQuery, ":", amazonResponse, alibabaResponse);

        await prisma.comparator.update({
          where: {
            query: searchQuery,
          },
          data: {
            status: "completed",
            alibaba: alibabaResponse,
            amazon: amazonResponse,
          },
        });
      } catch (scrapeError) {
        console.error(`Error scraping for query "${searchQuery}":`, scrapeError);
      }
    }
  } catch (error) {
    console.error("Error in cron job:", error);
  }
});

