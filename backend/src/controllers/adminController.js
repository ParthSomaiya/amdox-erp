import User from "../models/User.js";
import Company from "../models/Company.js";
import AuditLog from "../models/AuditLog.js";
import Leave from "../models/Leave.js";
import Payroll from "../models/Payroll.js";
import SystemSettings from "../models/SystemSettings.js";

// 📊 Admin dashboard stats
export const getAdminStats = async (req, res) => {
  try {
    const companyId = req.user.companyId;

    const totalUsers = await User.countDocuments({ companyId });

    const activeUsers = await User.countDocuments({
      companyId,
      isActive: true,
    });

    const totalLeaves = await Leave.countDocuments({ companyId });

    const totalPayroll = await Payroll.countDocuments({ companyId });

    res.json({
      totalUsers,
      activeUsers,
      totalLeaves,
      totalPayroll,
    });
  } catch (err) {
    res.status(500).json({ message: "Stats error" });
  }
};


// 👥 Get all users (same company)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({
      companyId: req.user.companyId,
    }).select("-password");

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

// 🔄 Change user role
export const changeUserRole = async (req, res) => {
  try {
    const { userId, role } = req.body;

    const user = await User.findOneAndUpdate(
      {
        _id: userId,
        companyId: req.user.companyId,
      },
      { role },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await AuditLog.create({
      companyId: req.user.companyId,
      action: "CHANGE_ROLE",
      performedBy: req.user.id,
      targetUser: userId,
    });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error updating role" });
  }
};

// ❌ Deactivate user
export const deactivateUser = async (req, res) => {
  const { userId } = req.body;

  const user = await User.findByIdAndUpdate(
    userId,
    { isActive: false },
    { new: true }
  );

  await AuditLog.create({
    companyId: req.user.companyId,
    action: "DEACTIVATE_USER",
    performedBy: req.user.id,
    targetUser: userId,
  });

  res.json(user);
};

// ⚙️ Update company settings
export const updateCompany = async (req, res) => {
  const updated = await Company.findByIdAndUpdate(
    req.user.companyId,
    req.body,
    { new: true }
  );

  res.json(updated);
};


// 🔄 Update role
export const updateUserRole = async (req, res) => {
  try {
    const { userId, role } = req.body;

    const user = await User.findOneAndUpdate(
      {
        _id: userId,
        companyId: req.user.companyId,
      },
      { role },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error updating role" });
  }
};


// ================= USERS =================

// GET ALL USERS
export const getUsers = async (req, res) => {
  try {

    const users = await User.find({
      companyId: req.user.companyId,
    }).select("-password");

    res.json(users);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }
};


// UPDATE USER
export const updateUser = async (req, res) => {
  try {

    const { id } = req.params;

    const user = await User.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    await AuditLog.create({
      companyId: req.user.companyId,
      action: "UPDATE_USER",
      performedBy: req.user.id,
      targetUser: user._id,
    });

    res.json(user);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }
};


// DELETE USER
export const deleteUser = async (req, res) => {
  try {

    const { id } = req.params;

    await User.findByIdAndDelete(id);

    await AuditLog.create({
      companyId: req.user.companyId,
      action: "DELETE_USER",
      performedBy: req.user.id,
      targetUser: id,
    });

    res.json({
      message: "User deleted",
    });

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }
};


// SUSPEND USER
export const suspendUser = async (req, res) => {
  try {

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        isActive: false,
      },
      { new: true }
    );

    res.json(user);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }
};


// ACTIVATE USER
export const activateUser = async (req, res) => {
  try {

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        isActive: true,
      },
      { new: true }
    );

    res.json(user);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }
};


// CHANGE ROLE
export const changeRole = async (req, res) => {
  try {

    const { role } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    );

    await AuditLog.create({
      companyId: req.user.companyId,
      action: "CHANGE_ROLE",
      performedBy: req.user.id,
      targetUser: user._id,
    });

    res.json(user);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }
};


// SAVE PERMISSIONS
export const assignPermissions = async (req, res) => {
  try {

    const { permissions } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { permissions },
      { new: true }
    );

    res.json(user);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }
};


// GET AUDIT LOGS
export const getAuditLogs = async (req, res) => {
  try {

    const logs = await AuditLog.find({
      companyId: req.user.companyId,
    })
      .populate("performedBy", "name email")
      .populate("targetUser", "name email")
      .sort({ createdAt: -1 });

    res.json(logs);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }
};


// TENANT ANALYTICS
export const getTenantAnalytics = async (req, res) => {
  try {

    const totalTenants =
      await Company.countDocuments();

    const totalUsers =
      await User.countDocuments();

    const activeUsers =
      await User.countDocuments({
        isActive: true,
      });

    res.json({
      totalTenants,
      totalUsers,
      activeUsers,
    });

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }
};


// SAVE SETTINGS
export const saveSettings = async (req, res) => {
  try {

    let settings =
      await SystemSettings.findOne({
        companyId: req.user.companyId,
      });

    if (!settings) {

      settings =
        await SystemSettings.create({
          companyId:
            req.user.companyId,
          ...req.body,
        });

    } else {

      Object.assign(
        settings,
        req.body
      );

      await settings.save();

    }

    res.json(settings);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }
};


// GET SETTINGS
export const getSettings = async (req, res) => {
  try {

    const settings =
      await SystemSettings.findOne({
        companyId: req.user.companyId,
      });

    res.json(settings);

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }
};

export const getAllCompanies =
  async (req, res) => {

    const companies =
      await Company.find();

    res.json(companies);

};

export const suspendCompany =
  async (req, res) => {

    const company =
      await Company.findByIdAndUpdate(

        req.params.id,

        {
          suspended: true,
        },

        { new: true }

      );

    res.json(company);

};