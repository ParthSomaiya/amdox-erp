import User from "../models/User.js";
import Company from "../models/Company.js";
import AuditLog from "../models/AuditLog.js";
import Leave from "../models/Leave.js";
import Payroll from "../models/Payroll.js";

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

// 📜 Audit logs
export const getAuditLogs = async (req, res) => {
  const logs = await AuditLog.find({
    companyId: req.user.companyId,
  })
    .populate("performedBy", "email")
    .sort({ createdAt: -1 });

  res.json(logs);
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


// ❌ Delete user
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findOneAndDelete({
      _id: userId,
      companyId: req.user.companyId,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user" });
  }
};