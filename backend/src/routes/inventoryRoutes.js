import express from "express";

import {

  createProduct,
  getProducts,
  getLowStockProducts,
  generateBarcode,
  generateQRCode,
  autoReorder,
} from "../controllers/inventoryController.js";

import {

  authMiddleware,
  authorize,
  protect,

} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/product",
  authMiddleware,
  createProduct
);

router.get(
  "/product",
  authMiddleware,
  getProducts
);

router.get(
  "/low-stock",
  protect,
  getLowStockProducts
);

router.get(
  "/barcode/:productId",
  protect,
  generateBarcode
);

router.get(
  "/qrcode/:id",
  protect,
  generateQRCode
);

router.get(
  "/auto-reorder",
  protect,
  autoReorder
);


export default router;