import express from "express";

import {

  createProduct,
  getProducts,
  getLowStockProducts,

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

export default router;