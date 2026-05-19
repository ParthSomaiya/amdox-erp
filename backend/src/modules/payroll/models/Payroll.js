import Payroll from "../modules/payroll/models/Payroll.js";

import mongoose from "mongoose";

const payrollSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  month: String, // "2026-04"

  basicSalary: Number,
  bonus: Number,
  deductions: Number,
  netSalary: Number,

  status: {
    type: String,
    enum: ["PENDING", "PAID"],
    default: "PENDING",
  },

  // ✅ ADD THIS LINE HERE 👇
  payslip: {
    type: String, // file path (uploads/xxxx.pdf)
  },

}, { timestamps: true });

export default mongoose.model("Payroll", payrollSchema);