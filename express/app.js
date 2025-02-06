import express from 'express';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import alibabaRouter from './routes/scraperRoute.js';
import webhookRouter from './routes/webhookRoute.js';
import updatePriceRouter from "./routes/updatePrice.js";
import { connectDB } from '../prisma/connectDB.js';
import 'dotenv/config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(express.static(__dirname));
app.use('/api/scrape', alibabaRouter);
app.use('/api/webhooks', webhookRouter);
app.use("/api/updatePrice", updatePriceRouter);

app.get("/", (req, res) => {
  res.send("Shopify server is running!");
});

app.listen(PORT, async (req, res) => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Test page available at http://localhost:${PORT}/scraper-test.html`);
  await connectDB();
});
