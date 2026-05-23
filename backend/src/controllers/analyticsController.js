import User from "../models/User.js";
import Leave from "../models/Leave.js";
import Payroll from "../models/Payroll.js";
import Invoice from "../models/Invoice.js";
import Expense from "../models/Expense.js";
import Employee from "../models/Employee.js";
import cache from "../config/cache.js";
import { Parser } from "json2csv";
import PDFDocument from "pdfkit";
import redisClient from "../config/redis.js";

// ================= FINANCE ANALYTICS =================

export const financeAnalytics =
  async (req, res) => {

    try {

      const revenue =
        await Invoice.aggregate([

          {
            $group: {

              _id: {
                month: {
                  $month: "$createdAt",
                },
              },

              revenue: {
                $sum: "$amount",
              },

            },
          },

          {
            $sort: {
              "_id.month": 1,
            },
          },

        ]);

      const expenses =
        await Expense.aggregate([

          {
            $group: {

              _id: {
                month: {
                  $month: "$createdAt",
                },
              },

              expense: {
                $sum: "$amount",
              },

            },
          },

        ]);

      res.json({

        revenue,
        expenses,

      });

    } catch (err) {

      res.status(500).json({
        message: err.message,
      });

    }

};


// ================= HR ANALYTICS =================

export const hrAnalytics =
  async (req, res) => {

    try {

      const employees =
        await Employee.countDocuments();

      const activeEmployees =
        await Employee.countDocuments({
          status: "ACTIVE",
        });

      res.json({

        employees,
        activeEmployees,

      });

    } catch (err) {

      res.status(500).json({
        message: err.message,
      });

    }

};


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


export const getKPIs =
  async (req, res) => {

    const cache =
      await redisClient.get(
        "dashboard-kpis"
      );

    if (cache) {

      return res.json(
        JSON.parse(cache)
      );

    }

    const data = {

      revenue: 500000,
      expenses: 120000,
      profit: 380000,
      employees: 45,

    };

    await redisClient.set(
      "dashboard-kpis",
      JSON.stringify(data),
      {
        EX: 300,
      }
    );

    res.json(data);

};

export const exportAnalyticsCSV =
  async (req, res) => {

    const invoices =
      await Invoice.find();

    const parser =
      new Parser();

    const csv =
      parser.parse(invoices);

    res.header(
      "Content-Type",
      "text/csv"
    );

    res.attachment(
      "analytics.csv"
    );

    return res.send(csv);

};

export const exportAnalyticsPDF =
  async (req, res) => {

    const doc =
      new PDFDocument();

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    doc.pipe(res);

    doc.fontSize(22)
      .text("Analytics Report");

    doc.moveDown();

    doc.text(
      "Generated Analytics PDF"
    );

    doc.end();

};

export const getDashboardAnalytics =
  async (req, res) => {

    try {

      // 🔥 CHECK CACHE
      const cached =
        await redisClient.get(
          "dashboard_analytics"
        );

      if (cached) {

        return res.json(
          JSON.parse(cached)
        );

      }

      // 🔥 DB QUERIES
      const totalEmployees =
        await User.countDocuments();

      const totalProjects =
        await Project.countDocuments();

      const totalRevenue =
        await Invoice.aggregate([
          {
            $group: {
              _id: null,
              total: {
                $sum: "$amount",
              },
            },
          },
        ]);

      const data = {
        totalEmployees,
        totalProjects,
        totalRevenue:
          totalRevenue[0]?.total || 0,
      };

      // 🔥 SAVE CACHE
      await redisClient.set(
        "dashboard_analytics",
        JSON.stringify(data),
        {
          EX: 60,
        }
      );

      res.json(data);

    } catch (err) {

      res.status(500).json({
        message: err.message,
      });

    }

};

export const aiAnalytics =
  async (req, res) => {

    try {

      const revenue =
        await Invoice.aggregate([
          {
            $group: {
              _id: null,
              total: {
                $sum: "$amount",
              },
            },
          },
        ]);

      const expenses =
        await Expense.aggregate([
          {
            $group: {
              _id: null,
              total: {
                $sum: "$amount",
              },
            },
          },
        ]);

      const profit =
        (revenue[0]?.total || 0)
        -
        (expenses[0]?.total || 0);

      let insight =
        "Business Stable";

      if (profit < 0) {
        insight =
          "⚠️ Expenses higher than revenue";
      }

      if (profit > 500000) {
        insight =
          "🚀 Strong financial growth";
      }

      res.json({
        revenue:
          revenue[0]?.total || 0,

        expenses:
          expenses[0]?.total || 0,

        profit,

        insight,
      });

    } catch (err) {

      res.status(500).json({
        message: err.message,
      });

    }

};

export const predictiveAnalytics =
  async (req, res) => {

    try {

      const monthlyRevenue =
        await Invoice.aggregate([

          {
            $group: {

              _id: {
                month: {
                  $month: "$createdAt",
                },
              },

              revenue: {
                $sum: "$amount",
              },

            },
          },

          {
            $sort: {
              "_id.month": 1,
            },
          },

        ]);

      let prediction = 0;

      if (
        monthlyRevenue.length >= 2
      ) {

        const last =
          monthlyRevenue[
            monthlyRevenue.length - 1
          ].revenue;

        const prev =
          monthlyRevenue[
            monthlyRevenue.length - 2
          ].revenue;

        prediction =
          last + (last - prev);

      }

      res.json({
        nextMonthPrediction:
          prediction,
      });

    } catch (err) {

      res.status(500).json({
        message: err.message,
      });

    }

};