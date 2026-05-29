import express from "express";
import {
  generatePayroll,
  markPaid,
  getAllPayroll,
  getMyPayroll,
  downloadPayslip,
} from "../controllers/payrollController.js";

import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/generate", protect, authorizeRoles("HR", "ADMIN"), generatePayroll);
router.put("/paid", protect, authorizeRoles("HR", "ADMIN"), markPaid);
router.get("/", protect, authorizeRoles("HR", "ADMIN"), getAllPayroll);
router.get("/my", protect, getMyPayroll);
router.get("/payslip/:id", protect, downloadPayslip);

router.post(
  "/upload-payslip",
  protect,
  authorizeRoles("HR", "ADMIN"),
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