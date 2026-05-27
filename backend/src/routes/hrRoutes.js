// src/routes/hrRoutes.js

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

import {

  protect,

} from "../middleware/authMiddleware.js";

import {

  authorizeRoles,

} from "../middleware/roleMiddleware.js";

const router = express.Router();

// ======================================================
// INVITE - GET INVITE DETAILS
// ======================================================

router.get(
  "/invite/:token",

  async (req, res) => {

    try {

      const invite =
        await Invite.findOne({
          token: req.params.token,
        });

      if (
        !invite ||
        invite.expiresAt < new Date()
      ) {

        return res.status(400).json({
          success: false,
          message:
            "Invalid or expired invite",
        });

      }

      res.status(200).json({
        success: true,
        invite,
      });

    } catch (err) {

      res.status(500).json({
        success: false,
        message: err.message,
      });

    }

  }
);

// ======================================================
// CREATE INVITE
// ======================================================

router.post(
  "/invite",

  protect,

  authorizeRoles(
    "ADMIN",
    "HR"
  ),

  async (req, res) => {

    try {

      const {
        email,
        role,
      } = req.body;

      if (!email || !role) {

        return res.status(400).json({
          success: false,
          message:
            "Email and role required",
        });

      }

      const existingUser =
        await User.findOne({
          email,
        });

      if (existingUser) {

        return res.status(400).json({
          success: false,
          message:
            "User already exists",
        });

      }

      const token =
        crypto
          .randomBytes(32)
          .toString("hex");

      await Invite.create({

        email,

        role,

        token,

        companyId:
          req.user.companyId,

        expiresAt:
          new Date(
            Date.now() +
            24 *
              60 *
              60 *
              1000
          ),

      });

      const inviteLink =
        `http://localhost:5173/invite/${token}`;

      console.log(
        "📩 Invite Link:",
        inviteLink
      );

      res.status(201).json({

        success: true,

        message:
          "Invite created successfully",

        inviteLink,

      });

    } catch (err) {

      res.status(500).json({

        success: false,

        message: err.message,

      });

    }

  }
);

// ======================================================
// REGISTER USING INVITE
// ======================================================

router.post(
  "/register-invite",

  async (req, res) => {

    try {

      const {
        token,
        password,
      } = req.body;

      if (
        !token ||
        !password
      ) {

        return res.status(400).json({
          success: false,
          message:
            "Token and password required",
        });

      }

      const invite =
        await Invite.findOne({
          token,
        });

      if (!invite) {

        return res.status(400).json({
          success: false,
          message:
            "Invalid invite token",
        });

      }

      if (
        invite.expiresAt <
        new Date()
      ) {

        return res.status(400).json({
          success: false,
          message:
            "Invite expired",
        });

      }

      const existingUser =
        await User.findOne({
          email:
            invite.email,
        });

      if (existingUser) {

        return res.status(400).json({
          success: false,
          message:
            "User already exists",
        });

      }

      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

      await User.create({

        email:
          invite.email,

        password:
          hashedPassword,

        role:
          invite.role,

        companyId:
          invite.companyId,

      });

      await Invite.deleteOne({
        token,
      });

      res.status(201).json({

        success: true,

        message:
          "Account created successfully",

      });

    } catch (err) {

      res.status(500).json({

        success: false,

        message: err.message,

      });

    }

  }
);

// ======================================================
// EMPLOYEE MANAGEMENT
// ======================================================

// ADD EMPLOYEE

router.post(
  "/employees",

  protect,

  authorizeRoles(
    "ADMIN",
    "HR"
  ),

  addEmployee
);

// GET EMPLOYEES

router.get(
  "/employees",

  protect,

  authorizeRoles(
    "ADMIN",
    "HR"
  ),

  getEmployees
);

// SEARCH EMPLOYEES

router.get(
  "/employees/search",

  protect,

  authorizeRoles(
    "ADMIN",
    "HR"
  ),

  searchEmployees
);

// ======================================================
// LEAVE MANAGEMENT
// ======================================================

// APPLY LEAVE

router.post(
  "/leave",

  protect,

  applyLeave
);

// GET ALL LEAVES

router.get(
  "/leave",

  protect,

  authorizeRoles(
    "ADMIN",
    "HR"
  ),

  getLeaves
);

// UPDATE LEAVE STATUS

router.put(
  "/leave/status",

  protect,

  authorizeRoles(
    "ADMIN",
    "HR"
  ),

  updateLeaveStatus
);

// APPROVE LEAVE

router.put(
  "/leave/approve/:id",

  protect,

  authorizeRoles(
    "ADMIN",
    "HR"
  ),

  approveLeave
);

// REJECT LEAVE

router.put(
  "/leave/reject/:id",

  protect,

  authorizeRoles(
    "ADMIN",
    "HR"
  ),

  rejectLeave
);

// LEAVE PREDICTION

router.get(
  "/leave/prediction/:id",

  protect,

  authorizeRoles(
    "ADMIN",
    "HR"
  ),

  leavePrediction
);

// ======================================================
// HR ANALYTICS
// ======================================================

router.get(
  "/analytics",

  protect,

  authorizeRoles(
    "ADMIN",
    "HR"
  ),

  hrAnalytics
);

// ======================================================
// PAYROLL
// ======================================================

router.post(
  "/payroll/generate",

  protect,

  authorizeRoles(
    "ADMIN",
    "HR"
  ),

  generatePayroll
);

// ======================================================
// BIOMETRIC
// ======================================================

router.post(
  "/attendance/biometric",

  protect,

  authorizeRoles(
    "ADMIN",
    "HR"
  ),

  biometricSync
);

// ======================================================
// TIMELINE
// ======================================================

router.get(
  "/timeline",

  protect,

  getTimeline
);

// ======================================================
// FINANCE
// ======================================================

// CREATE INVOICE

router.post(
  "/invoice",

  protect,

  authorizeRoles(
    "ADMIN",
    "FINANCE"
  ),

  createInvoice
);

// GET INVOICES

router.get(
  "/invoice",

  protect,

  authorizeRoles(
    "ADMIN",
    "FINANCE"
  ),

  getInvoices
);

// MARK INVOICE PAID

router.post(
  "/invoice/paid",

  protect,

  authorizeRoles(
    "ADMIN",
    "FINANCE"
  ),

  markInvoicePaid
);

// ADD EXPENSE

router.post(
  "/expense",

  protect,

  authorizeRoles(
    "ADMIN",
    "FINANCE"
  ),

  addExpense
);

// GET EXPENSES

router.get(
  "/expense",

  protect,

  authorizeRoles(
    "ADMIN",
    "FINANCE"
  ),

  getExpenses
);

export default router;