import express from "express";
import {
  createProduct,
  addStock,
  reduceStock,
  getLowStock,
  getInventoryDashboard,
} from "../controllers/inventoryController.js";

const router = express.Router();

router.post("/product", createProduct);
router.post("/stock/in", addStock);
router.post("/stock/out", reduceStock);

router.get("/low-stock", getLowStock);
router.get("/dashboard", getInventoryDashboard);

export default router;