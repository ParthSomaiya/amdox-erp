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
}, { timestamps: true });

export default mongoose.model("Payroll", payrollSchema);