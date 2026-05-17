import express from "express";
import { getStockHistory } from "../controllers/stockController.js";

const router = express.Router();

router.get("/history", getStockHistory);

export default router;