import mongoose from "mongoose";

const auditSchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    action: String,
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    targetUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("AuditLog", auditSchema);