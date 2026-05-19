import express from "express";
import {
  createInvoice,
  markInvoicePaid,
  getInvoices,
  addExpense,
  getExpenses,
  getProfitAnalytics
} from "../controllers/financeController.js";

import {
  getFinanceAnalytics,
  getMonthlyFinance,
} from "../controllers/financeAnalyticsController.js";

import { authMiddleware, protect } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import { PERMISSIONS } from "../config/permissions.js";
import { checkPermission } from "../modules/admin/middleware/permissionMiddleware.js";

import {
  PERMISSIONS,
} from "../config/permissions.js";

const router = express.Router();

// Invoice (view)
router.get(
  "/invoice",
  authMiddleware,
  allowRoles("FINANCE", "ADMIN"),
  getInvoices
);

// Create invoice
router.post(
  "/invoice",
  authMiddleware,
  checkPermission(
    PERMISSIONS.CREATE_INVOICE
  ),
  createInvoice
);

// Mark paid
router.post(
  "/invoice/paid",
  authMiddleware,
  allowRoles("FINANCE", "ADMIN"),
  markInvoicePaid
);

// Expense
router.post(
  "/expense",
  authMiddleware,
  allowRoles("FINANCE", "ADMIN"),
  addExpense
);

// Analytics
router.get(
  "/analytics",
  authMiddleware,
  checkPermission(PERMISSIONS.VIEW_ANALYTICS),
  getFinanceAnalytics
);

// Monthly chart
router.get(
  "/analytics/monthly",
  authMiddleware,
  checkPermission(PERMISSIONS.VIEW_ANALYTICS),
  getMonthlyFinance
);

// Profit analytics
router.get(
  "/analytics/profit",
  authMiddleware,
  getProfitAnalytics
);

export default router;