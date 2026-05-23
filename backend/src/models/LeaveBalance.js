import mongoose from "mongoose";

const leaveBalanceSchema =
  new mongoose.Schema(
    {
      employeeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      totalLeaves: {
        type: Number,
        default: 24,
      },

      usedLeaves: {
        type: Number,
        default: 0,
      },

      remainingLeaves: {
        type: Number,
        default: 24,
      },

      year: String,
    },
    { timestamps: true }
  );

export default mongoose.model(
  "LeaveBalance",
  leaveBalanceSchema
);