import express from "express";
import Timeline from "../models/Timeline.js"; 
import User from "../models/User.js"; 

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

// 🔹 સિસ્ટમ સેટિંગ્સ ડિફોલ્ટ ફોલબેક સ્ટેટસ (સેલ્ફ-હીલિંગ)
let systemSettings = {
  companySettings: {
    companyName: "AMDOX ERP Core",
    email: "info@amdoxerp.com",
    phone: "+91 98765 43210",
    website: "www.amdoxerp.com",
    address: "Corporate Headquarters, Ahmedabad, India"
  },
  systemSettings: {
    maintenanceMode: false,
    emailNotifications: true,
    darkMode: false
  },
  securitySettings: {
    passwordMinLength: 8,
    enable2FA: false,
    sessionTimeout: 30,
    loginAttempts: 5
  }
};

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

router.get(
  "/audit",
  authMiddleware,
  allowRoles("ADMIN"),
  async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const totalLogs = await Timeline.countDocuments();
      const logs = await Timeline.find()
        .populate("employee", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const formattedLogs = logs.map((log) => ({
        _id: log._id,
        userId: {
          email: log.employee?.email || "system@amdox.com",
          name: log.employee?.name || "System",
        },
        action: log.action || "ACTIVITY_LOGGED",
        module: "HR / ERP",
        description: log.action,
        createdAt: log.createdAt,
      }));

      res.json({
        success: true,
        logs: formattedLogs,
        page,
        totalPages: Math.ceil(totalLogs / limit),
        total: totalLogs,
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);


// ================= TENANT =================

// TENANT ANALYTICS
router.get(
  "/tenant-analytics",
  authMiddleware,
  allowRoles("ADMIN"),
  async (req, res) => {
    try {
      const totalUsers = await User.countDocuments() || 3;
      res.json({
        totalTenants: 1, // ડિફોલ્ટ સિંગલ ટેનન્ટ સિંક
        totalUsers,
        activeUsers: totalUsers // મોક એક્ટિવ સેસન્સ
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// ================= SETTINGS =================

// SAVE SETTINGS
router.post(
  "/settings",
  authMiddleware,
  allowRoles("ADMIN"),
  (req, res) => {
    try {
      const { companySettings, systemSettings: sys, securitySettings } = req.body;
      
      if (companySettings) systemSettings.companySettings = { ...systemSettings.companySettings, ...companySettings };
      if (sys) systemSettings.systemSettings = { ...systemSettings.systemSettings, ...sys };
      if (securitySettings) systemSettings.securitySettings = { ...systemSettings.securitySettings, ...securitySettings };

      res.json({ success: true, message: "Configuration saved successfully", settings: systemSettings });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
);

// GET SETTINGS
router.get(
  "/settings",
  authMiddleware,
  allowRoles("ADMIN"),
  (req, res) => {
    res.json(systemSettings);
  }
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