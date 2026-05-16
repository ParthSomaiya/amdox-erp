import express from "express";
import {
  createInvoice,
  markInvoicePaid,
  getInvoices,
  addExpense,
  getExpenses,
} from "../controllers/financeController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { getProfitAnalytics } from "../controllers/financeController.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/analytics", authMiddleware, getProfitAnalytics);

// View allowed for admin + finance
router.get(
  "/invoice",
  authMiddleware,
  allowRoles("FINANCE", "ADMIN"),
  getInvoices
);

// ONLY FINANCE + ADMIN
router.post(
  "/invoice",
  authMiddleware,
  allowRoles("FINANCE", "ADMIN"),
  createInvoice
);

router.post(
  "/invoice/paid",
  authMiddleware,
  allowRoles("FINANCE", "ADMIN"),
  markInvoicePaid
);

router.post(
  "/expense",
  authMiddleware,
  allowRoles("FINANCE", "ADMIN"),
  addExpense
);


router.get("/expense", authMiddleware, getExpenses);

export default router;