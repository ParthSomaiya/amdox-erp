import express from "express";
import {
  createProduct,
  getProducts,
  getLowStockProducts,
  generateBarcode,
  generateQRCode,
  autoReorder,
  reorderPrediction,
  getInventoryDashboard, 
  createPurchaseOrder,
  getPurchaseOrders,
  getStockHistory,
  updateProduct,
  deleteProduct,
} from "../controllers/inventoryController.js";

import { authMiddleware, protect } from "../middleware/authMiddleware.js";
import upload from "../config/multer.js"; // 🔹 તમારા ઓરીજીનલ મલ્ટર કન્ફિગને ઇમ્પોર્ટ કર્યો

const router = express.Router();

// 🔹 PRODUCT REGISTRY ROUTES (ઇમેજ અપલોડ મિડલવેર સેટઅપ)
router.post("/product", authMiddleware, upload.single("image"), createProduct);
router.get("/product", authMiddleware, getProducts);
router.put("/product/:id", authMiddleware, upload.single("image"), updateProduct);
router.delete("/product/:id", authMiddleware, deleteProduct);

// 🔹 INVENTORY DASHBOARD ANALYTICS
router.get("/dashboard", authMiddleware, getInventoryDashboard);

// 🔹 PURCHASE ORDER (PO) & STOCK MOVEMENTS
router.post("/purchase-order", authMiddleware, createPurchaseOrder);
router.get("/purchase-order", authMiddleware, getPurchaseOrders);
router.get("/history", authMiddleware, getStockHistory);

// 🔹 ALERTS & CODE GENERATORS
router.get("/low-stock", protect, getLowStockProducts);
router.get("/barcode/:productId", protect, generateBarcode);
router.get("/qrcode/:id", protect, generateQRCode);
router.get("/auto-reorder", protect, autoReorder);
router.get("/reorder-ai", protect, reorderPrediction);

export default router;