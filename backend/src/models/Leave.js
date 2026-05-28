import mongoose from "mongoose";

const leaveHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      required: true,
    },

    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    changedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const leaveSchema = new mongoose.Schema(
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

    fromDate: {
      type: Date,
      required: true,
    },

    toDate: {
      type: Date,
      required: true,
    },

    reason: {
      type: String,
      trim: true,
      required: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
      index: true,
    },

    // 📌 Leave change tracking (HR audit trail)
    history: [leaveHistorySchema],
  },
  {
    timestamps: true,
  }
);

/* ===============================
   📊 INDEXES (performance boost)
================================ */
leaveSchema.index({ employeeId: 1, companyId: 1 });
leaveSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model("Leave", leaveSchema);