import express from "express";
import { downloadPayslip } from "../controllers/pdfController.js";
import { protect } from "../middleware/authMiddleware.js";
import { exportInvoicePDF } from "../controllers/financeController.js";

const router = express.Router();

router.get("/payslip/:payrollId", protect, downloadPayslip);

router.get("/pdf/:id", exportInvoicePDF);

export default router;