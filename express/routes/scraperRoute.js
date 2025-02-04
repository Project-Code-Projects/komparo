import { Router } from "express";
import { scrapeProducts } from "../middlewares/alibabaScraper.js";

const router = Router();

router.post("/alibaba", scrapeProducts);

export default router;
