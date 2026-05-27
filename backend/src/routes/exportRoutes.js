import express from "express";
import { downloadPayslip } from "../controllers/pdfController.js";

const router = express.Router();

router.get(
  "/payslip/:payrollId",
  downloadPayslip
);

export default router;