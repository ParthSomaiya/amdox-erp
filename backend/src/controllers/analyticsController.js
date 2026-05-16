import User from "../models/User.js";
import Leave from "../models/Leave.js";
import Payroll from "../models/Payroll.js";

export const getAnalytics = async (req, res) => {
  try {
    // ✅ ADD FILTER CODE HERE (TOP)
    const { month } = req.query;

    const matchStage = {
      companyId: req.user.companyId,
    };

    // apply month filter (for payroll)
    if (month) {
      matchStage.month = Number(month);
    }

    // Monthly employees
    const employees = await User.aggregate([
      { $match: { companyId: req.user.companyId } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Leaves count
    const leaves = await Leave.aggregate([
      { $match: { companyId: req.user.companyId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Payroll trend (✅ FILTER APPLIED HERE)
    const payroll = await Payroll.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$netSalary" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({ employees, leaves, payroll });
  } catch (err) {
    res.status(500).json({ message: "Analytics error" });
  }
};