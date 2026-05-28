import mongoose from "mongoose";

const payrollSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },

    // Format: YYYY-MM
    month: {
      type: String,
      required: true,
      index: true,
    },

    basicSalary: {
      type: Number,
      required: true,
      min: 0,
    },

    bonus: {
      type: Number,
      default: 0,
      min: 0,
    },

    deductions: {
      type: Number,
      default: 0,
      min: 0,
    },

    netSalary: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "PAID"],
      default: "PENDING",
      index: true,
    },

    // 📄 PDF payslip file path
    payslip: {
      type: String,
      default: null,
    },

    // 💳 Payment tracking (future-proof)
    paidAt: {
      type: Date,
      default: null,
    },

    paymentMethod: {
      type: String,
      enum: ["BANK", "CASH", "UPI", "CARD"],
      default: "BANK",
    },

    // 🧾 Optional audit note
    remarks: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

/* ===============================
   🚀 INDEXES FOR PERFORMANCE
================================ */
payrollSchema.index({ employeeId: 1, month: 1 }, { unique: true });
payrollSchema.index({ companyId: 1, month: -1 });
payrollSchema.index({ status: 1 });

export default mongoose.model("Payroll", payrollSchema);