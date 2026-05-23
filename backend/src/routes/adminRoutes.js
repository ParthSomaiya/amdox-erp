import express from "express";
import {
  getAllUsers,
  changeUserRole,
  deactivateUser,
  updateCompany,
  getAdminStats,
  getAuditLogs,
  getUsers,
  updateUser,
  deleteUser,
  suspendUser,
  activateUser,
  changeRole,
  assignPermissions,
  getTenantAnalytics,
  saveSettings,
  getSettings,
  getAllCompanies,
  suspendCompany,
  
} from "../controllers/adminController.js";


import {
  protect,
  authorize,
  authMiddleware,
} from "../middleware/authMiddleware.js";

import { backupDB } from "../utils/backup.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
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


router.get(
  "/backup",
  authMiddleware,
  allowRoles("ADMIN"),
  async (req, res) => {
    backupDB();
    res.json({ message: "Backup started" });
  }
);

// USERS
router.get(
  "/users",
  protect,
  authorize("ADMIN"),
  getUsers
);

router.put(
  "/users/:id",
  protect,
  authorize("ADMIN"),
  updateUser
);

router.delete(
  "/users/:id",
  protect,
  authorize("ADMIN"),
  deleteUser
);


// SUSPEND / ACTIVATE
router.put(
  "/users/:id/suspend",
  protect,
  authorize("ADMIN"),
  suspendUser
);

router.put(
  "/users/:id/activate",
  protect,
  authorize("ADMIN"),
  activateUser
);


// ROLE UPDATE
router.put(
  "/users/:id/role",
  protect,
  authorize("ADMIN"),
  changeRole
);


// PERMISSIONS
router.put(
  "/users/:id/permissions",
  protect,
  authorize("ADMIN"),
  assignPermissions
);


// AUDIT LOGS
router.get(
  "/audit-logs",
  protect,
  authorize("ADMIN"),
  getAuditLogs
);


// ANALYTICS
router.get(
  "/tenant-analytics",
  protect,
  authorize("ADMIN"),
  getTenantAnalytics
);


// SETTINGS
router.post(
  "/settings",
  protect,
  authorize("ADMIN"),
  saveSettings
);

router.get(
  "/settings",
  protect,
  authorize("ADMIN"),
  getSettings
);

router.get(
  "/companies",
  protect,
  authorizeRoles("SUPER_ADMIN"),
  getAllCompanies
);

router.put(
  "/companies/suspend/:id",
  protect,
  authorizeRoles("SUPER_ADMIN"),
  suspendCompany
);

export default router;