import Leave from "../models/Leave.js";

// 🧑 Employee apply leave
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

// 👨‍💼 HR/Admin view all leaves
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

// 👨‍💼 HR approve/reject
export const updateLeaveStatus = async (req, res) => {
  try {
    const { leaveId, status } = req.body;

    const leave = await Leave.findByIdAndUpdate(
      leaveId,
      { status },
      { new: true }
    );

    res.json(leave);
  } catch (err) {
    res.status(500).json({ message: "Error updating leave" });
  }
};

// 👤 Employee sees own leaves
export const getMyLeaves = async (req, res) => {
  try {
    const leaves = await Leave.find({
      employeeId: req.user.id,
    });

    res.json(leaves);
  } catch (err) {
    res.status(500).json({ message: "Error fetching my leaves" });
  }
};