import express from "express";

import {
  generatePayroll,
  markPaid,
  getAllPayroll,
  getMyPayroll,
  downloadPayslip,
} from "../controllers/payrollController.js";

import {
  protect,
} from "../middleware/authMiddleware.js";

import upload from "../middleware/uploadMiddleware.js";

const router =
  express.Router();


// ==============================
// ➕ GENERATE PAYROLL
// ==============================

router.post(
  "/generate",

  protect,

  generatePayroll
);


// ==============================
// 💰 MARK AS PAID
// ==============================

router.put(
  "/paid",

  protect,

  markPaid
);


// ==============================
// 📋 ALL PAYROLL
// ==============================

router.get(
  "/",

  protect,

  getAllPayroll
);


// ==============================
// 👤 MY PAYROLL
// ==============================

router.get(
  "/my",

  protect,

  getMyPayroll
);


// ==============================
// 📄 DOWNLOAD PAYSLIP
// ==============================

router.get(
  "/payslip/:id",

  protect,

  downloadPayslip
);


// ==============================
// 📁 UPLOAD PAYSLIP
// ==============================

router.post(

  "/upload-payslip",

  protect,

  upload.single("file"),

  async (req, res) => {

    try {

      res.json({

        message:
          "Payslip uploaded",

        file:
          req.file,

      });

    } catch (err) {

      res.status(500).json({
        message:
          err.message,
      });

    }

  }

);

export default router;