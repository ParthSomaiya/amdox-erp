import express from "express";
import {
    getTrialBalance,
    getBalanceSheet
} from "../controllers/reportController.js";
import { protect } from "../../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/trial-balance", protect, getTrialBalance);
router.get("/balance-sheet", protect, getBalanceSheet);

export default router;