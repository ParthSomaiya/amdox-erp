import express from "express";
import {
  getDashboardAnalytics,
  getFinanceAnalytics,
  getInventoryAnalytics,
  getProjectAnalytics,
} from "../controllers/analyticsController.js";

import { protect } from "../../../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/dashboard", protect, getDashboardAnalytics);
router.get("/finance", protect, getFinanceAnalytics);
router.get("/inventory", protect, getInventoryAnalytics);
router.get("/projects", protect, getProjectAnalytics);

export default router;