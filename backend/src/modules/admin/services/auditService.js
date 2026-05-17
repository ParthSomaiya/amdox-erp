import AuditLog from "../models/AuditLog.js";

export const logAction = async ({
  userId,
  action,
  entity,
  entityId,
  companyId,
}) => {
  await AuditLog.create({
    userId,
    action,
    entity,
    entityId,
    companyId,
  });
};