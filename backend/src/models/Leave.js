import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },

  fromDate: Date,

  toDate: Date,

  reason: String,

  status: {
    type: String,
    enum: ["PENDING", "APPROVED", "REJECTED"],
    default: "PENDING",
  },

  // ✅ ADD THIS HERE
  history: [
    {
      status: String,

      changedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      changedAt: Date,
    },
  ],

}, { timestamps: true });

export default mongoose.model("Leave", leaveSchema);