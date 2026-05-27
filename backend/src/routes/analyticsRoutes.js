import express from "express";
import {
  getAnalytics,
  financeAnalytics,
  hrAnalytics,
  getKPIs,

  exportAnalyticsCSV,
  exportAnalyticsPDF,

  getDashboardAnalytics,
  aiAnalytics,
  predictiveAnalytics,
  advancedAnalytics,
} from "../controllers/analyticsController.js";

import { protect } from "../middleware/authMiddleware.js";

import { checkPermission } from "../middleware/permissionMiddleware.js";

const router = express.Router();

// ✅ ADD YOUR LINE HERE
router.get("/", protect, getAnalytics);

router.get(
  "/finance",
  protect,
  financeAnalytics
);

router.get(
  "/hr",
  protect,
  hrAnalytics
);

router.get(
  "/kpis",
  protect,
  getKPIs
);

router.get(
  "/export/csv",
  protect,
  exportAnalyticsCSV
);

router.get(
  "/export/pdf",
  protect,
  exportAnalyticsPDF
);

router.get(
  "/dashboard",
  getDashboardAnalytics
);

router.get(
  "/ai",
  aiAnalytics
);

router.get(
  "/predict",
  predictiveAnalytics
);

router.get(
  "/advanced",
  protect,
  advancedAnalytics
);

export default router;