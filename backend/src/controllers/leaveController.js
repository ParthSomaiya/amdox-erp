import mongoose from "mongoose";
import Leave from "../models/Leave.js";
import LeaveBalance from "../models/LeaveBalance.js";
import User from "../models/User.js";

// 🔹 સાર્વત્રિક કન્ઝિસ્ટન્ટ ટેનન્ટ આઈડી (Guarantees absolute workspace alignment across offline tests)
const DEFAULT_COMPANY_ID = "665e7d89b3f3a2c0d4e5f6a1";

// ========================================
// 📩 APPLY LEAVE (EMPLOYEE)
// ========================================
export const applyLeave = async (req, res) => {
  try {
    const { fromDate, toDate, reason, leaveType, proof } = req.body;

    if (!fromDate || !toDate || !reason) {
      return res.status(400).json({
        success: false,
        message: "From date, to date, and reason are required",
      });
    }

    let companyId = req.user?.companyId;

    if (!companyId) {
      const userObj = await User.findById(req.user.id);
      companyId = userObj?.companyId;
    }

    if (!companyId) {
      const fallbackAdmin = await User.findOne({ role: "ADMIN" });
      companyId = fallbackAdmin?.companyId || DEFAULT_COMPANY_ID;
    }

    const leave = await Leave.create({
      employeeId: req.user.id,
      companyId,
      fromDate,
      toDate,
      reason,
      leaveType: leaveType || "CASUAL",
      status: "PENDING",
      proof: proof || null, // Capture proof Base64 directly
    });

    return res.status(201).json(leave);
  } catch (err) {
    console.error("Apply leave error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ========================================
// 👤 GET MY LEAVES (EMPLOYEE)
// ========================================
export const getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({
      employeeId: req.user.id,
    }).sort({ createdAt: -1 });

    return res.json(leaves);
  } catch (err) {
    console.error("Get my leaves error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ========================================
// 📊 GET MY LEAVE BALANCE (DYNAMIC DOCK)
// ========================================
export const getLeaveBalance = async (req, res) => {
  try {
    let balance = await LeaveBalance.findOne({
      employeeId: req.user.id,
    });

    if (!balance) {
      balance = await LeaveBalance.create({
        employeeId: req.user.id,
        companyId: req.user?.companyId || DEFAULT_COMPANY_ID,
        casual: 8,
        sick: 5,
        paid: 12,
        usedLeaves: 0,
        remainingLeaves: 25,
      });
    }

    return res.json({
      success: true,
      balance,
    });
  } catch (err) {
    console.error("Get leave balance error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ========================================
// 👨‍💼 GET ALL LEAVES (ADMIN/HR)
// ========================================
export const getAllLeaves = async (req, res) => {
  try {
    // 🛡️ એડમિન અને એચઆર બાયપાસ: એડમિન અને એચઆર બંનેને તમામ કર્મચારીઓની અરજીઓ દેખાશે
    const filter = {};

    const leaves = await Leave.find(filter)
      .populate("employeeId", "name email")
      .sort({ createdAt: -1 });

    return res.json(leaves);
  } catch (err) {
    console.error("Get all leaves error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ========================================
// 📝 UPDATE LEAVE STATUS (ADMIN/HR)
// ========================================
export const updateLeaveStatus = async (req, res) => {
  try {
    const { leaveId, status } = req.body;

    const leave = await Leave.findById(leaveId);
    if (!leave) {
      return res.status(404).json({ success: false, message: "Leave not found" });
    }

    const days = Math.ceil(
      (new Date(leave.toDate) - new Date(leave.fromDate)) / (1000 * 60 * 60 * 24)
    ) || 1;

    leave.status = status;
    await leave.save();

    if (status === "APPROVED") {
      const balance = await LeaveBalance.findOne({
        employeeId: leave.employeeId,
      });

      if (balance) {
        balance.usedLeaves += days;
        balance.remainingLeaves = Math.max(0, balance.remainingLeaves - days);
        await balance.save();
      }
    }

    return res.json(leave);
  } catch (err) {
    console.error("Update leave status error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

// ========================================
// 🧬 AI LEAVE PREDICTION
// ========================================
export const getLeavePrediction = async (req, res) => {
  try {
    const leaves = await Leave.find({
      employeeId: req.params.id,
    });

    const totalLeaves = leaves.length;
    let prediction = "LOW";

    if (totalLeaves > 10) prediction = "HIGH";
    else if (totalLeaves > 5) prediction = "MEDIUM";

    return res.json({
      employeeId: req.params.id,
      totalLeaves,
      prediction,
    });
  } catch (err) {
    console.error("Get leave prediction error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
};