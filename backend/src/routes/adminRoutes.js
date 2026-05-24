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
  adminDashboard,
} from "../controllers/adminController.js";

import {
  authorize,
  protect,
  authMiddleware,
} from "../middleware/authMiddleware.js";

import {
  allowRoles,
  authorizeRoles,
} from "../middleware/roleMiddleware.js";

import {
  checkPermission,
} from "../middleware/permissionMiddleware.js";

import {
  PERMISSIONS,
} from "../config/permissions.js";

import backupDB from "../utils/backupDB.js";

const router = express.Router();


// ================= USERS =================

// 👥 Get all users
router.get(
  "/users",
  authMiddleware,
  checkPermission(
    PERMISSIONS.MANAGE_USERS
  ),
  getAllUsers
);

// 🔄 Change role
router.put(
  "/role",
  authMiddleware,
  checkPermission(
    PERMISSIONS.MANAGE_USERS
  ),
  changeUserRole
);

// ❌ Deactivate user
router.put(
  "/deactivate",
  authMiddleware,
  checkPermission(
    PERMISSIONS.MANAGE_USERS
  ),
  deactivateUser
);

// ⚙️ Company settings
router.put(
  "/company",
  authMiddleware,
  checkPermission(
    PERMISSIONS.MANAGE_USERS
  ),
  updateCompany
);


// ================= ADMIN STATS =================

router.get(
  "/stats",
  authMiddleware,
  checkPermission(
    PERMISSIONS.VIEW_ANALYTICS
  ),
  getAdminStats
);


// ================= BACKUP =================

router.post(
  "/backup",
  protect,
  authorizeRoles(
    "ADMIN",
    "SUPER_ADMIN"
  ),
  async (req, res) => {

    try {

      await backupDB();

      res.json({
        success: true,
        message:
          "✅ Backup Started Successfully",
      });

    } catch (err) {

      res.status(500).json({
        success: false,
        message: err.message,
      });

    }

  }
);


// ================= USERS CRUD =================

// USERS
router.get(
  "/all-users",
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


// ================= USER STATUS =================

// SUSPEND
router.put(
  "/users/:id/suspend",
  protect,
  authorize("ADMIN"),
  suspendUser
);

// ACTIVATE
router.put(
  "/users/:id/activate",
  protect,
  authorize("ADMIN"),
  activateUser
);


// ================= ROLE =================

// ROLE UPDATE
router.put(
  "/users/:id/role",
  protect,
  authorize("ADMIN"),
  changeRole
);


// ================= PERMISSIONS =================

// ASSIGN PERMISSIONS
router.put(
  "/users/:id/permissions",
  protect,
  authorize("ADMIN"),
  assignPermissions
);


// ================= AUDIT =================

// AUDIT LOGS
router.get(
  "/audit-logs",
  protect,
  authorize("ADMIN"),
  getAuditLogs
);


// ================= TENANT =================

// TENANT ANALYTICS
router.get(
  "/tenant-analytics",
  protect,
  authorize("ADMIN"),
  getTenantAnalytics
);


// ================= SETTINGS =================

// SAVE SETTINGS
router.post(
  "/settings",
  protect,
  authorize("ADMIN"),
  saveSettings
);

// GET SETTINGS
router.get(
  "/settings",
  protect,
  authorize("ADMIN"),
  getSettings
);


// ================= COMPANIES =================

// GET COMPANIES
router.get(
  "/companies",
  protect,
  authorizeRoles(
    "SUPER_ADMIN"
  ),
  getAllCompanies
);

// SUSPEND COMPANY
router.put(
  "/companies/suspend/:id",
  protect,
  authorizeRoles(
    "SUPER_ADMIN"
  ),
  suspendCompany
);


// ================= DASHBOARD =================

// ADMIN DASHBOARD
router.get(
  "/dashboard",
  protect,
  authorizeRoles(
    "ADMIN",
    "SUPER_ADMIN"
  ),
  adminDashboard
);

export default router;