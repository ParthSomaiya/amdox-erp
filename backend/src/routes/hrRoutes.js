import express from "express";
import crypto from "crypto";
import bcrypt from "bcryptjs";

import Invite from "../models/Invite.js";
import User from "../models/User.js";

import {
  addEmployee,
  getEmployees,
  applyLeave,
  getLeaves,
  updateLeaveStatus,
  approveLeave,
  rejectLeave,
  hrAnalytics,
  generatePayroll,
  biometricSync,
  leavePrediction,
  getTimeline,
  searchEmployees,
} from "../controllers/hrController.js";

import {
  createInvoice,
  markInvoicePaid,
  getInvoices,
  addExpense,
  getExpenses,
} from "../controllers/financeController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

/* =========================================================
   📩 INVITE MANAGEMENT
========================================================= */

// GET INVITE DETAILS
router.get("/invite/:token", async (req, res) => {
  try {
    const invite = await Invite.findOne({ token: req.params.token });

    if (!invite || invite.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired invite",
      });
    }

    return res.json({ success: true, invite });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// CREATE INVITE
router.post(
  "/invite",
  protect,
  authorizeRoles("ADMIN", "HR"),
  async (req, res) => {
    try {
      const { email, role } = req.body;

      if (!email || !role) {
        return res.status(400).json({
          success: false,
          message: "Email and role required",
        });
      }

      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "User already exists",
        });
      }

      const token = crypto.randomBytes(32).toString("hex");

      await Invite.create({
        email,
        role,
        token,
        companyId: req.user.companyId,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });

      const inviteLink = `http://localhost:5173/invite/${token}`;

      console.log("📩 Invite Link:", inviteLink);

      return res.status(201).json({
        success: true,
        message: "Invite created successfully",
        inviteLink,
      });
    } catch (err) {
      return res.status(500).json({ success: false, message: err.message });
    }
  }
);

// REGISTER USING INVITE
router.post("/register-invite", async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: "Token and password required",
      });
    }

    const invite = await Invite.findOne({ token });

    if (!invite) {
      return res.status(400).json({
        success: false,
        message: "Invalid invite token",
      });
    }

    if (invite.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Invite expired",
      });
    }

    const existingUser = await User.findOne({ email: invite.email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      email: invite.email,
      password: hashedPassword,
      role: invite.role,
      companyId: invite.companyId,
      isVerified: true,
    });

    await Invite.deleteOne({ token });

    return res.status(201).json({
      success: true,
      message: "Account created successfully",
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

/* =========================================================
   👨‍💼 EMPLOYEE MANAGEMENT
========================================================= */

router.post("/employees", protect, authorizeRoles("ADMIN", "HR"), addEmployee);
router.get("/employees", protect, authorizeRoles("ADMIN", "HR"), getEmployees);
router.get("/employees/search", protect, authorizeRoles("ADMIN", "HR"), searchEmployees);

/* =========================================================
   🟡 LEAVE MANAGEMENT
========================================================= */

router.post("/leave", protect, applyLeave);
router.get("/leave", protect, authorizeRoles("ADMIN", "HR"), getLeaves);
router.put("/leave/status", protect, authorizeRoles("ADMIN", "HR"), updateLeaveStatus);
router.put("/leave/approve/:id", protect, authorizeRoles("ADMIN", "HR"), approveLeave);
router.put("/leave/reject/:id", protect, authorizeRoles("ADMIN", "HR"), rejectLeave);
router.get("/leave/prediction/:id", protect, authorizeRoles("ADMIN", "HR"), leavePrediction);

/* =========================================================
   📊 HR ANALYTICS
========================================================= */

router.get("/analytics", protect, authorizeRoles("ADMIN", "HR"), hrAnalytics);

/* =========================================================
   💰 PAYROLL
========================================================= */

router.post("/payroll/generate", protect, authorizeRoles("ADMIN", "HR"), generatePayroll);

/* =========================================================
   🕒 ATTENDANCE / BIOMETRIC
========================================================= */

router.post("/attendance/biometric", protect, authorizeRoles("ADMIN", "HR"), biometricSync);

/* =========================================================
   📌 TIMELINE
========================================================= */

router.get("/timeline", protect, getTimeline);

/* =========================================================
   💼 FINANCE MODULE (HR ALIASES)
========================================================= */

router.post("/invoice", protect, authorizeRoles("ADMIN", "FINANCE"), createInvoice);
router.get("/invoice", protect, authorizeRoles("ADMIN", "FINANCE"), getInvoices);
router.post("/invoice/paid", protect, authorizeRoles("ADMIN", "FINANCE"), markInvoicePaid);
router.post("/expense", protect, authorizeRoles("ADMIN", "FINANCE"), addExpense);
router.get("/expense", protect, authorizeRoles("ADMIN", "FINANCE"), getExpenses);

export default router;