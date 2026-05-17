import mongoose from "mongoose";

const auditSchema = new mongoose.Schema({
  userId: String,
  action: String,
  entity: String,
  entityId: String,
  companyId: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.AuditLog ||
  mongoose.model("AuditLog", auditSchema);