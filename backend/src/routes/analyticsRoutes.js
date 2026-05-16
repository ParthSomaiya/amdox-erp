import express from "express";
import { getAnalytics } from "../controllers/analyticsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ ADD YOUR LINE HERE
router.get("/analytics", protect, getAnalytics);

export default router;