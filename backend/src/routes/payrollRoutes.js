import express from "express";

import {
  generatePayroll,
  markPaid,
  getAllPayroll,
  getMyPayroll,
  downloadPayslip,
} from "../controllers/payrollController.js";

import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

/* =========================================================
   ➕ PAYROLL GENERATION
========================================================= */

router.post(
  "/generate",
  protect,
  generatePayroll
);

/* =========================================================
   💰 MARK PAYROLL AS PAID
========================================================= */

router.put(
  "/paid",
  protect,
  markPaid
);

/* =========================================================
   📋 GET ALL PAYROLL (ADMIN/HR)
========================================================= */

router.get(
  "/",
  protect,
  getAllPayroll
);

/* =========================================================
   👤 GET MY PAYROLL (EMPLOYEE)
========================================================= */

router.get(
  "/my",
  protect,
  getMyPayroll
);

/* =========================================================
   📄 DOWNLOAD PAYSLIP (PDF)
========================================================= */

router.get(
  "/payslip/:id",
  protect,
  downloadPayslip
);

/* =========================================================
   📁 UPLOAD PAYSLIP (OPTIONAL FEATURE)
========================================================= */

router.post(
  "/upload-payslip",
  protect,
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: "No file uploaded",
        });
      }

      return res.json({
        success: true,
        message: "Payslip uploaded successfully",
        file: {
          filename: req.file.filename,
          path: req.file.path,
          size: req.file.size,
        },
      });

    } catch (err) {
      console.error("Upload Payslip Error:", err);

      return res.status(500).json({
        success: false,
        message: err.message || "Upload failed",
      });
    }
  }
);

export default router;