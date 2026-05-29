import express from "express";
import {
  createInvoice,
  markInvoicePaid,
  getInvoices,
  addExpense,
  getExpenses,
  createJournalEntry,
  gstCalculation,
  auditReport,
} from "../controllers/financeController.js";

import {
  getFinanceAnalytics,
  getMonthlyFinance,
} from "../controllers/financeAnalyticsController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Summary Analytics
router.get(
  "/analytics",
  protect,
  authorizeRoles("FINANCE", "ADMIN"),
  getFinanceAnalytics
);

router.get(
  "/analytics/monthly",
  protect,
  authorizeRoles("FINANCE", "ADMIN"),
  getMonthlyFinance
);

// Invoices
router.get(
  "/invoice",
  protect,
  authorizeRoles("FINANCE", "ADMIN"),
  getInvoices
);

router.post(
  "/invoice",
  protect,
  authorizeRoles("FINANCE", "ADMIN"),
  createInvoice
);

router.post(
  "/invoice/paid",
  protect,
  authorizeRoles("FINANCE", "ADMIN"),
  markInvoicePaid
);

// Expenses
router.get(
  "/expense",
  protect,
  authorizeRoles("FINANCE", "ADMIN"),
  getExpenses
);

router.post(
  "/expense",
  protect,
  authorizeRoles("FINANCE", "ADMIN"),
  addExpense
);

// Journals
router.post(
  "/journal",
  protect,
  authorizeRoles("FINANCE", "ADMIN"),
  createJournalEntry
);

router.post(
  "/gst",
  protect,
  gstCalculation
);

router.post(
  "/audit-report",
  protect,
  auditReport
);

export default router;