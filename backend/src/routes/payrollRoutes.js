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
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();


// 💰 Generate Payroll (Finance/Admin)
router.post(
  "/generate",
  authMiddleware,
  checkPermission(PERMISSIONS.GENERATE_PAYROLL),
  generatePayroll
);


// 💰 Mark as Paid (Finance/Admin)
router.put(
  "/pay",
  authMiddleware,
  allowRoles("FINANCE", "ADMIN"),
  markPaid
);

router.get("/payslip/:id", downloadPayslip);

// 👨‍💼 View all payroll (Finance/Admin)
router.get(
  "/",
  authMiddleware,
  checkPermission(PERMISSIONS.VIEW_PAYROLL),
  getAllPayroll
);

// 👤 Employee view own payroll
router.get(
  "/my",
  authMiddleware,
  allowRoles("EMPLOYEE"),
  getMyPayroll
);

router.post(
  "/upload-payslip",
  authMiddleware,
  allowRoles("HR", "ADMIN", "FINANCE"),
  upload.single("file"),
  async (req, res) => {
    try {
      const { payrollId } = req.body;

      // 👇 IMPORTANT CHANGE
      const fileUrl = req.file.location;

      const payroll = await Payroll.findByIdAndUpdate(
        payrollId,
        { payslip: fileUrl },
        { new: true }
      );

      res.json(payroll);
    } catch (err) {
      res.status(500).json({ message: "Upload error" });
    }
  }
);

router.get(
  "/payslip/:id",
  authMiddleware,
  async (req, res) => {
    const payroll = await Payroll.findById(req.params.id);

    // Security check
    if (
      payroll.employeeId.toString() !== req.user.id &&
      req.user.role !== "HR" &&
      req.user.role !== "ADMIN"
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    // 👇 Redirect to S3 file
    res.redirect(payroll.payslip);
  }
);

export default router;