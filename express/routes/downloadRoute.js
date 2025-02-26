import { Router } from "express";
import { getDownloadUrl } from "../controllers/downloadController";

const router = Router();

router.get("/", getDownloadUrl);

export default router;