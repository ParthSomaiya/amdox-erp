import express from "express";
import {
  generatePayroll,
  markPaid,
  getAllPayroll,
  getMyPayroll,
} from "../controllers/payrollController.js";

// ✅ CORRECT IMPORTS
import { authMiddleware } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();


// 💰 Generate Payroll (Finance/Admin)
router.post(
  "/generate",
  authMiddleware,
  allowRoles("FINANCE", "ADMIN"),
  generatePayroll
);


// 💰 Mark as Paid (Finance/Admin)
router.put(
  "/pay",
  authMiddleware,
  allowRoles("FINANCE", "ADMIN"),
  markPaid
);


// 👨‍💼 View all payroll (Finance/Admin)
router.get(
  "/",
  authMiddleware,
  allowRoles("FINANCE", "ADMIN"),
  getAllPayroll
);


// 👤 Employee view own payroll
router.get(
  "/my",
  authMiddleware,
  allowRoles("EMPLOYEE"),
  getMyPayroll
);

export default router;