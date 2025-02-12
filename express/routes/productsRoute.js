import { Router } from "express";
import { getScrappedProducts } from "../controllers/productsController.js";

const router = Router();

router.get("/", getScrappedProducts);

export default router;