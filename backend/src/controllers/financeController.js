import Invoice from "../models/Invoice.js";
import Expense from "../models/Expense.js";


// 📄 Create Invoice
export const createInvoice = async (req, res) => {
  try {
    const { clientName, amount } = req.body;

    const invoice = await Invoice.create({
      clientName,
      amount,
      companyId: req.user.companyId,
    });

    res.json(invoice);
  } catch (err) {
    res.status(500).json({ message: "Invoice error" });
  }
};


// 💰 Mark Invoice Paid
export const markInvoicePaid = async (req, res) => {
  const { invoiceId } = req.body;

  const invoice = await Invoice.findByIdAndUpdate(
    invoiceId,
    { status: "PAID" },
    { new: true }
  );

  res.json(invoice);
};


// 📄 Get Invoices
export const getInvoices = async (req, res) => {
  const data = await Invoice.find({
    companyId: req.user.companyId,
  });

  res.json(data);
};


// 💸 Add Expense
export const addExpense = async (req, res) => {
  const { title, amount, category } = req.body;

  const expense = await Expense.create({
    title,
    amount,
    category,
    companyId: req.user.companyId,
  });

  res.json(expense);
};


// 📊 Get Expenses
export const getExpenses = async (req, res) => {
  const data = await Expense.find({
    companyId: req.user.companyId,
  });

  res.json(data);
};

// 📊 Monthly Finance Analytics
export const getProfitAnalytics = async (req, res) => {
  try {
    const companyId = req.user.companyId;

    // 💰 Monthly Revenue
    const revenue = await Invoice.aggregate([
      {
        $match: {
          companyId,
          status: "PAID",
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // 💸 Monthly Expense
    const expense = await Expense.aggregate([
      {
        $match: { companyId },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // 🔥 Merge both
    const months = [
      "Jan","Feb","Mar","Apr","May","Jun",
      "Jul","Aug","Sep","Oct","Nov","Dec"
    ];

    const result = months.map((m, index) => {
      const r = revenue.find(r => r._id === index + 1);
      const e = expense.find(e => e._id === index + 1);

      const rev = r ? r.total : 0;
      const exp = e ? e.total : 0;

      return {
        month: m,
        revenue: rev,
        expense: exp,
        profit: rev - exp,
      };
    });

    res.json(result);

  } catch (err) {
    res.status(500).json({ message: "Monthly analytics error" });
  }
};