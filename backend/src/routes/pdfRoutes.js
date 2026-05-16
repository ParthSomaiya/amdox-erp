import express from "express";
import { downloadPayslip } from "../controllers/pdfController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/payslip/:payrollId", protect, downloadPayslip);

export default router;