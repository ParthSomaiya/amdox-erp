import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
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

    // YYYY-MM-DD format (for fast daily lookup)
    date: {
      type: String,
      required: true,
      index: true,
    },

    checkIn: {
      type: Date,
      default: null,
    },

    checkOut: {
      type: Date,
      default: null,
    },

    totalHours: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["PRESENT", "ABSENT", "HALF_DAY", "LEAVE"],
      default: "PRESENT",
    },

    // 🔥 Optional biometric tracking support
    source: {
      type: String,
      enum: ["MANUAL", "BIOMETRIC", "MOBILE"],
      default: "MANUAL",
    },

    // 🧾 Extra tracking for audits
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
   🚀 PERFORMANCE INDEXES
================================ */
attendanceSchema.index({ employeeId: 1, date: 1 }, { unique: true });
attendanceSchema.index({ companyId: 1, date: -1 });
attendanceSchema.index({ employeeId: 1, createdAt: -1 });

export default mongoose.model("Attendance", attendanceSchema);