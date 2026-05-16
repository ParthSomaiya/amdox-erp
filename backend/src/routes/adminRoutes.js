import express from "express";
import {
  getAllUsers,
  changeUserRole,
  deactivateUser,
  updateCompany,
  getAdminStats,
  getAuditLogs,
} from "../controllers/adminController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { checkPermission } from "../middleware/permissionMiddleware.js";
import { PERMISSIONS } from "../config/permissions.js";

const router = express.Router();

// 👥 Get all users
router.get(
  "/users",
  authMiddleware,
  checkPermission(PERMISSIONS.MANAGE_USERS),
  getAllUsers
);

// 🔄 Change role
router.put(
  "/role",
  authMiddleware,
  checkPermission(PERMISSIONS.MANAGE_USERS),
  changeUserRole
);

// ❌ Deactivate user
router.put(
  "/deactivate",
  authMiddleware,
  checkPermission(PERMISSIONS.MANAGE_USERS),
  deactivateUser
);

// ⚙️ Company settings
router.put(
  "/company",
  authMiddleware,
  checkPermission(PERMISSIONS.MANAGE_USERS),
  updateCompany
);

// 📊 Admin stats
router.get(
  "/stats",
  authMiddleware,
  checkPermission(PERMISSIONS.VIEW_ANALYTICS),
  getAdminStats
);

// 📜 Audit logs
router.get(
  "/logs",
  authMiddleware,
  checkPermission(PERMISSIONS.MANAGE_USERS),
  getAuditLogs
);

export default router;