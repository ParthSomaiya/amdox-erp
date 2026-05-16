import Leave from "../models/Leave.js";
import { sendNotification } from "../utils/notify.js";

// 🧑 Apply Leave
export const applyLeave = async (req, res) => {
  try {
    const { fromDate, toDate, reason } = req.body;

    const leave = await Leave.create({
      employeeId: req.user.id,
      companyId: req.user.companyId,
      fromDate,
      toDate,
      reason,
    });

    res.json(leave);
  } catch (err) {
    res.status(500).json({ message: "Error applying leave" });
  }
};

// 👨‍💼 All Leaves (HR/Admin)
export const getAllLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({
      companyId: req.user.companyId,
    }).populate("employeeId", "email role");

    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: "Error fetching leaves" });
  }
};

// 👤 My Leaves
export const getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({
      employeeId: req.user.id,
      companyId: req.user.companyId, // ✅ FIXED
    });

    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: "Error fetching my leaves" });
  }
};

// ✅ Approve / Reject (SECURE)
export const updateLeaveStatus = async (req, res) => {
  try {
    const { leaveId, status } = req.body;

    const leave = await Leave.findOneAndUpdate(
      {
        _id: leaveId,
        companyId: req.user.companyId, // ✅ SECURITY
      },
      { status },
      { new: true }
    );

    if (!leave) {
      return res.status(404).json({ message: "Leave not found" });
    }

    await sendNotification(
      leave.employeeId,
      `Your leave is ${status}`
    );

    res.json(leave);
  } catch (err) {
    res.status(500).json({ message: "Error updating leave" });
  }
};