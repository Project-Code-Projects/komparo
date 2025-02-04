import { Router } from "express";
import { scrapeProducts } from "../middlewares/alibabaScraper.js";
import { scrapeAmazonProducts } from "../middlewares/amazonScraper.js";

const router = Router();

router.post("/alibaba", scrapeProducts);
router.post("/amazon", scrapeAmazonProducts);

export default router;
