import express from 'express';
import { newProductCreated } from '../controllers/webhookController.js';

const router = express.Router();

router.post('/product/create', newProductCreated);

export default router;
