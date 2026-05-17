import User from "../../../models/User.js";
import Attendance from "../../../models/Attendance.js";
import Leave from "../../../models/Leave.js";
import JournalEntry from "../../finance/models/JournalEntry.js";
import Invoice from "../../finance/models/Invoice.js";
import Task from "../../project/models/Task.js";

// 📊 DASHBOARD SUMMARY
export const getDashboardAnalytics = async (req, res) => {
  try {
    const companyId = req.user.companyId;

    const employees = await User.countDocuments({ companyId });

    const leaves = await Leave.countDocuments({
      companyId,
      status: "APPROVED",
    });

    const attendance = await Attendance.countDocuments({
      companyId,
    });

    const invoices = await Invoice.aggregate([
      { $match: { companyId } },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    res.json({
      employees,
      leaves,
      attendance,
      revenue: invoices[0]?.total || 0,
    });
  } catch (err) {
    res.status(500).json({ message: "Analytics error" });
  }
};

// 📈 FINANCE ANALYTICS
export const getFinanceAnalytics = async (req, res) => {
  try {
    const companyId = req.user.companyId;

    const data = await Invoice.aggregate([
      { $match: { companyId } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          revenue: { $sum: "$amount" },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Finance analytics error" });
  }
};

// 📦 INVENTORY ANALYTICS
export const getInventoryAnalytics = async (req, res) => {
  try {
    const companyId = req.user.companyId;

    const lowStock = await Product.find({
      companyId,
      stock: { $lt: 10 },
    });

    res.json({
      lowStock,
      count: lowStock.length,
    });
  } catch (err) {
    res.status(500).json({ message: "Inventory analytics error" });
  }
};

// 📊 PROJECT ANALYTICS
export const getProjectAnalytics = async (req, res) => {
  try {
    const companyId = req.user.companyId;

    const tasks = await Task.aggregate([
      { $match: { companyId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Project analytics error" });
  }
};