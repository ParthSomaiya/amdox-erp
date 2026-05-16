import express from "express";
import { 
    getProfitLoss, 
    getMonthlyPL, 
    exportPLPDF,
    getBalanceSheet  } from "../controllers/reportController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";


const router = express.Router();

router.get(
  "/profit-loss",
  authMiddleware,
  allowRoles("ADMIN", "FINANCE"),
  getProfitLoss
);

router.get(
  "/monthly-pl",
  authMiddleware,
  allowRoles("ADMIN", "FINANCE"),
  getMonthlyPL
);

router.get(
  "/pl-pdf",
  authMiddleware,
  allowRoles("ADMIN", "FINANCE"),
  exportPLPDF
);

router.get(
  "/balance-sheet",
  authMiddleware,
  allowRoles("ADMIN", "FINANCE"),
  getBalanceSheet
);

export default router;