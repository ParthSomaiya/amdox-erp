import express from "express";
import crypto from "crypto";
import bcrypt from "bcryptjs";

import Invite from "../models/Invite.js";
import User from "../models/User.js";
import Leave from "../models/Leave.js";


import {
  addEmployee,
  getEmployees,
  applyLeave,
  updateLeaveStatus,
  getLeaves,

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
  authMiddleware,
  authorize,
  protect,
} from "../middleware/authMiddleware.js";

import {
  authorizeRoles,
} from "../middleware/roleMiddleware.js";

const router = express.Router();


// ==============================
// 📩 INVITE GET
// ==============================

router.get(
  "/invite/:token",

  async (req, res) => {

    try {

      const invite =
        await Invite.findOne({
          token:
            req.params.token,
        });

      if (
        !invite ||
        invite.expiresAt <
          new Date()
      ) {

        return res.status(400).json({
          message:
            "Invalid or expired invite",
        });

      }

      res.json(invite);

    } catch (err) {

      res.status(500).json({
        message:
          err.message,
      });

    }

  }
);


// ==============================
// 📩 CREATE INVITE
// ==============================

router.post(
  "/invite",

  protect,

  async (req, res) => {

    try {

      const {
        email,
        role,
      } = req.body;

      const token =
        crypto
          .randomBytes(20)
          .toString("hex");

      await Invite.create({

        email,
        role,

        companyId:
          req.user.companyId,

        token,

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
        "Invite Link:",
        inviteLink
      );

      res.json({
        message:
          "Invite sent",
      });

    } catch (err) {

      res.status(500).json({
        message:
          err.message,
      });

    }

  }
);


// ==============================
// 👤 REGISTER VIA INVITE
// ==============================

router.post(
  "/register-invite",

  async (req, res) => {

    try {

      const {
        token,
        password,
      } = req.body;

      const invite =
        await Invite.findOne({
          token,
        });

      if (!invite) {

        return res.status(400).json({
          message:
            "Invalid invite",
        });

      }

      const hashed =
        await bcrypt.hash(
          password,
          10
        );

      await User.create({

        email:
          invite.email,

        password:
          hashed,

        role:
          invite.role,

        companyId:
          invite.companyId,

      });

      await Invite.deleteOne({
        token,
      });

      res.json({
        message:
          "Account created via invite",
      });

    } catch (err) {

      res.status(500).json({
        message:
          err.message,
      });

    }

  }
);


// ==============================
// 👨‍💼 EMPLOYEES
// ==============================

router.post(
  "/add",

  protect,

  authorizeRoles(
    "ADMIN",
    "HR"
  ),

  addEmployee
);

router.get(
  "/",

  protect,

  authorizeRoles(
    "ADMIN",
    "HR"
  ),

  getEmployees
);

router.get(
  "/search",
  protect,
  authorizeRoles("ADMIN", "HR"),
  searchEmployees
);

// ==============================
// 📅 LEAVE
// ==============================

router.post(
  "/leave",

  protect,

  applyLeave
);

router.get(
  "/leave",

  protect,

  authorizeRoles(
    "ADMIN",
    "HR"
  ),

  getLeaves
);

router.put(
  "/leave/status",

  protect,

  authorizeRoles(
    "ADMIN",
    "HR"
  ),

  updateLeaveStatus
);

router.put(
  "/leave/approve/:id",
  authMiddleware,
  authorize("HR", "ADMIN"),
  approveLeave
);

router.put(
  "/leave/reject/:id",
  authMiddleware,
  authorize("HR", "ADMIN"),
  rejectLeave
);

router.get(
  "/analytics",
  authMiddleware,
  authorize("HR", "ADMIN"),
  hrAnalytics
);

// ==============================
// 💰 INVOICE
// ==============================

router.post(
  "/invoice",

  protect,

  createInvoice
);

router.get(
  "/invoice",

  protect,

  getInvoices
);

router.post(
  "/invoice/paid",

  protect,

  markInvoicePaid
);


// ==============================
// 💸 EXPENSE
// ==============================

router.post(
  "/expense",

  protect,

  addExpense
);

router.get(
  "/expense",

  protect,

  getExpenses
);

router.post(
  "/payroll/generate",

  protect,

  authorizeRoles(
    "ADMIN",
    "HR"
  ),

  generatePayroll
);

router.post(
  "/attendance/biometric",

  protect,

  biometricSync
);

router.get(
  "/leave/prediction/:id",

  protect,

  authorizeRoles(
    "ADMIN",
    "HR"
  ),

  leavePrediction
);

router.get(
  "/timeline",
  getTimeline
);

export default router;