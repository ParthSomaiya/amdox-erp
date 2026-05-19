import AuditLog from "../models/AuditLog.js";

// GET ALL LOGS
export const getAuditLogs = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const logs = await AuditLog.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("userId", "name email");

    const total = await AuditLog.countDocuments();

    res.json({
      logs,
      total,
      page: Number(page),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};