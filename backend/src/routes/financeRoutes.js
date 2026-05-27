import express from "express";
import {
  createInvoice,
  markInvoicePaid,
  getInvoices,
  addExpense,
  getExpenses,
  createJournal,
  gstCalculation,
  auditReport,
} from "../controllers/financeController.js";

import {
  getFinanceAnalytics,
  getMonthlyFinance,
} from "../controllers/financeAnalyticsController.js";

import { 
  authMiddleware,
  protect,
} from "../middleware/authMiddleware.js";

import { 
  allowRoles,
  authorizeRoles,
 } from "../middleware/roleMiddleware.js";

import { checkPermission } from "../middleware/permissionMiddleware.js";

import { 
  createJournalEntry,
  getProfitAnalytics,
} from "../controllers/financeController.js";

import { PERMISSIONS } from "../config/permissions.js";

const router = express.Router();

// Summary
router.get(
  "/analytics",
  authMiddleware,
  checkPermission(PERMISSIONS.VIEW_ANALYTICS),
  getFinanceAnalytics
);

router.get(
  "/analytics/monthly",
  authMiddleware,
  checkPermission(PERMISSIONS.VIEW_ANALYTICS),
  getMonthlyFinance
);

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
  checkPermission(PERMISSIONS.CREATE_INVOICE),
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

router.post(
  "/journal",
  protect,
  createJournalEntry
);

router.get("/expense", authMiddleware, getExpenses);


router.post(
  "/gst",
  gstCalculation
);

router.post(
  "/audit-report",
  auditReport
);


export default router;