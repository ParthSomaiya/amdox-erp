import Invoice from "../models/Invoice.js";
import Expense from "../models/Expense.js";

// 📊 Get finance analytics
export const getFinanceAnalytics = async (req, res) => {
  try {
    const companyId = req.user.companyId;

    // 💰 Total Revenue (PAID invoices only)
    const revenueData = await Invoice.aggregate([
      {
        $match: {
          companyId,
          status: "PAID",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" },
        },
      },
    ]);

    // 💸 Total Expenses
    const expenseData = await Expense.aggregate([
      {
        $match: { companyId },
      },
      {
        $group: {
          _id: null,
          totalExpense: { $sum: "$amount" },
        },
      },
    ]);

    const totalRevenue = revenueData[0]?.totalRevenue || 0;
    const totalExpense = expenseData[0]?.totalExpense || 0;

    const profit = totalRevenue - totalExpense;

    res.json({
      totalRevenue,
      totalExpense,
      profit,
    });
  } catch (err) {
    res.status(500).json({ message: "Finance analytics error" });
  }
};

export const getMonthlyFinance = async (req, res) => {
  try {
    const companyId = req.user.companyId;

    // 📈 Revenue per month
    const revenue = await Invoice.aggregate([
      {
        $match: {
          companyId,
          status: "PAID",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // 📉 Expense per month
    const expense = await Expense.aggregate([
      {
        $match: { companyId },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({ revenue, expense });
  } catch (err) {
    res.status(500).json({ message: "Monthly finance error" });
  }
};