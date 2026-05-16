import Invoice from "../models/Invoice.js";
import Expense from "../models/Expense.js";
import Payroll from "../models/Payroll.js";
import PDFDocument from "pdfkit";

export const getProfitLoss = async (req, res) => {
  try {
    const companyId = req.user.companyId;

    const { from, to } = req.query;

    const dateFilter = {
      companyId,
      createdAt: {
        $gte: new Date(from),
        $lte: new Date(to),
      },
    };

    // 💰 Revenue (only paid invoices)
    const invoices = await Invoice.find({
      ...dateFilter,
      status: "PAID",
    });

    const revenue = invoices.reduce((sum, inv) => sum + inv.amount, 0);

    // 💸 Expenses
    const expensesData = await Expense.find(dateFilter);
    const expenses = expensesData.reduce((sum, e) => sum + e.amount, 0);

    // 💼 Payroll
    const payrolls = await Payroll.find(dateFilter);
    const payroll = payrolls.reduce((sum, p) => sum + p.netSalary, 0);

    // 📊 Profit
    const profit = revenue - (expenses + payroll);

    res.json({
      revenue,
      expenses,
      payroll,
      profit,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "P&L error" });
  }
};

export const getMonthlyPL = async (req, res) => {
  try {
    const companyId = req.user.companyId;

    const invoices = await Invoice.aggregate([
      { $match: { companyId, status: "PAID" } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          revenue: { $sum: "$amount" },
        },
      },
    ]);

    const expenses = await Expense.aggregate([
      { $match: { companyId } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          expenses: { $sum: "$amount" },
        },
      },
    ]);

    const payrolls = await Payroll.aggregate([
      { $match: { companyId } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          payroll: { $sum: "$netSalary" },
        },
      },
    ]);

    // merge data
    const result = [];

    for (let i = 1; i <= 12; i++) {
      const rev = invoices.find(i2 => i2._id === i)?.revenue || 0;
      const exp = expenses.find(e => e._id === i)?.expenses || 0;
      const pay = payrolls.find(p => p._id === i)?.payroll || 0;

      result.push({
        month: `M${i}`,
        revenue: rev,
        expenses: exp,
        payroll: pay,
        profit: rev - (exp + pay),
      });
    }

    res.json(result);

  } catch (err) {
    res.status(500).json({ message: "Monthly P&L error" });
  }
};

export const exportPLPDF = async (req, res) => {
  try {
    const { revenue, expenses, payroll, profit } = req.query;

    const doc = new PDFDocument();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=pl-report.pdf");

    doc.pipe(res);

    doc.fontSize(20).text("Profit & Loss Report", { align: "center" });

    doc.moveDown();

    doc.fontSize(14).text(`Revenue: ₹${revenue}`);
    doc.text(`Expenses: ₹${expenses}`);
    doc.text(`Payroll: ₹${payroll}`);
    doc.text(`Profit: ₹${profit}`);

    doc.end();

  } catch (err) {
    res.status(500).json({ message: "PDF error" });
  }
};

export const getBalanceSheet = async (req, res) => {
  try {
    const companyId = req.user.companyId;

    const receivables = await Invoice.aggregate([
      { $match: { companyId, status: "UNPAID" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const expenses = await Expense.aggregate([
      { $match: { companyId } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const assets = receivables[0]?.total || 0;
    const liabilities = expenses[0]?.total || 0;

    res.json({
      assets,
      liabilities,
      equity: assets - liabilities,
    });
  } catch (err) {
    res.status(500).json({ message: "Balance sheet error" });
  }
};