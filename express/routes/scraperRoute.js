import { Router } from "express";
import { scrapeAlibabaProducts } from "../middlewares/alibabaScraper.js";
import { scrapeAmazonProducts } from "../middlewares/amazonScraper.js";

const router = Router();

router.post("/alibaba", scrapeAlibabaProducts);
router.post("/amazon", scrapeAmazonProducts);

export default router;
