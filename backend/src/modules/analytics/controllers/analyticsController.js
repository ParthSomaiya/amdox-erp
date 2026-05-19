import User from "../../../models/User.js";
import Attendance from "../../../models/Attendance.js";
import Leave from "../../../models/Leave.js";
import JournalEntry from "../../finance/models/JournalEntry.js";
import Invoice from "../../finance/models/Invoice.js";
import Task from "../../project/models/Task.js";

// 📊 DASHBOARD SUMMARY
export const getDashboardAnalytics = async (
  req,
  res
) => {
  try {

    const totalEmployees =
      await User.countDocuments();

    const totalProjects =
      await Project.countDocuments();

    const totalJobs =
      await Job.countDocuments();

    // Employee roles
    const employeeRoles =
      await User.aggregate([
        {
          $group: {
            _id: "$role",
            count: { $sum: 1 },
          },
        },
      ]);

    // Leave stats
    const leaveStats =
      await Leave.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
          },
        },
      ]);

    // Revenue
    const invoices =
      await Invoice.find();

    const totalRevenue =
      invoices.reduce(
        (acc, i) => acc + i.amount,
        0
      );

    // Monthly revenue
    const monthlyFinance =
      await Invoice.aggregate([
        {
          $group: {
            _id: {
              $month: "$createdAt",
            },
            revenue: {
              $sum: "$amount",
            },
          },
        },
      ]);

    const formattedFinance =
      monthlyFinance.map((i) => ({
        month: `Month ${i._id}`,
        revenue: i.revenue,
      }));

    res.json({
      totalEmployees,
      totalProjects,
      totalJobs,
      totalRevenue,
      employeeRoles,
      leaveStats,
      monthlyFinance: formattedFinance,
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Analytics error",
    });
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

export const revenueAnalytics = async (req, res) => {
  const data = await Invoice.aggregate([
    {
      $group: {
        _id: { $month: "$createdAt" },
        total: { $sum: "$amount" },
      },
    },
  ]);

  res.json(data);
};