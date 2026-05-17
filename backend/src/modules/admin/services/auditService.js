import AuditLog from "../models/AuditLog.js";

export const logAction = async (data) => {
  await AuditLog.create(data);
};