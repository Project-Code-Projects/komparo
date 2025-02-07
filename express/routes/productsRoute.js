import { Router } from "express";
import { getScrapedProducts } from "../controllers/productsController.js";

const router = Router();

router.get("/", getScrapedProducts);

export default router;