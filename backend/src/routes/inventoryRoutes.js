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
  receivePurchaseOrder,
  getDemandForecast,
} from "../controllers/inventoryController.js";

import { authMiddleware, protect } from "../middleware/authMiddleware.js";
import upload from "../config/multer.js"; // 🔹 તમારા ઓરીજીનલ મલ્ટર કન્ફિગને ઇમ્પોર્ટ કર્યો

const router = express.Router();

// 🔹 PRODUCT REGISTRY ROUTES (ઇમેજ અપલોડ મિડલવેર સેટઅપ)
router.post("/product", authMiddleware, upload.single("image"), createProduct);
router.get("/product", getProducts); 
router.put("/product/:id", authMiddleware, upload.single("image"), updateProduct);
router.delete("/product/:id", authMiddleware, deleteProduct);

// 🔹 INVENTORY DASHBOARD ANALYTICS
router.get("/dashboard", authMiddleware, getInventoryDashboard);

// 🔹 PURCHASE ORDER (PO) & STOCK MOVEMENTS
router.post("/purchase-order", authMiddleware, createPurchaseOrder);
router.get("/po", authMiddleware, getPurchaseOrders);
router.put("/po/:id/receive", authMiddleware, receivePurchaseOrder); 
router.get("/history", authMiddleware, getStockHistory);

// 🔹 ALERTS & CODE GENERATORS
router.get("/low-stock", protect, getLowStockProducts);
router.get("/barcode/:productId", protect, generateBarcode);
router.get("/auto-reorder", protect, autoReorder);

// ================= BARCODE & QR GENERATORS =================
router.get("/product/:productId/barcode", authMiddleware, generateBarcode);
router.get("/product/:id/qr", authMiddleware, generateQRCode);

// ================= AI CORE FORECASTING =================
router.get("/reorder-ai", authMiddleware, autoReorder);
router.get("/reorder-prediction", authMiddleware, reorderPrediction);
router.get("/forecast/:productId", authMiddleware, getDemandForecast);

export default router;