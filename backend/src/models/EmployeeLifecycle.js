import mongoose from "mongoose";

const employeeLifecycleSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    status: {
      type: String,
      enum: ["HIRED", "ACTIVE", "PROMOTED", "EXITED"],
      default: "HIRED",
    },
    designation: String,
    salary: Number,
    joinedAt: { type: Date, default: Date.now },
    exitedAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model("EmployeeLifecycle", employeeLifecycleSchema);