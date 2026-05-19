import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    action: {
      type: String, // CREATE, UPDATE, DELETE
      required: true,
    },

    module: {
      type: String, // USER, FINANCE, HR
    },

    entity: {
      type: String, // e.g. "Invoice", "Payroll"
    },

    entityId: {
      type: String,
    },

    description: {
      type: String,
    },

    ipAddress: {
      type: String,
    },

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
  },
  { timestamps: true }
);

export default mongoose.model("AuditLog", auditLogSchema);