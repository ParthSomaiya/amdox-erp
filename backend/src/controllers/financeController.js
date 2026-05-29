import mongoose from "mongoose";
import Invoice from "../models/Invoice.js";
import Expense from "../models/Expense.js";
import JournalEntry from "../models/JournalEntry.js";
import Ledger from "../models/Ledger.js";
import plaid from "../config/plaid.js";

import { sendNotification } from "../utils/notify.js";
import { createDoubleEntry } from "../services/journalService.js";
import { calculateGST } from "../services/gstService.js";
import { generateAuditReport } from "../utils/auditReportGenerator.js";

// ======================================
// CREATE JOURNAL ENTRY
// ======================================
export const createJournalEntry = async (req, res) => {
  try {
    const { description, entries } = req.body;

    const journal = await JournalEntry.create({
      companyId: req.user.companyId,
      description,
      entries,
    });

    // AUTO LEDGER POSTING
    for (const item of entries) {
      const existing = await Ledger.findOne({
        companyId: req.user.companyId,
        account: item.account,
      });

      if (existing) {
        if (item.type === "DEBIT") {
          existing.debit += item.amount;
          existing.balance += item.amount;
        } else {
          existing.credit += item.amount;
          existing.balance -= item.amount;
        }
        await existing.save();
      } else {
        await Ledger.create({
          companyId: req.user.companyId,
          account: item.account,
          debit: item.type === "DEBIT" ? item.amount : 0,
          credit: item.type === "CREDIT" ? item.amount : 0,
          balance: item.type === "DEBIT" ? item.amount : -item.amount,
        });
      }
    }

    res.status(201).json(journal);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ======================================
// CREATE INVOICE
// ======================================
export const createInvoice = async (req, res) => {
  try {
    const count = await Invoice.countDocuments({ companyId: req.user.companyId });
    const invoiceNumber = `INV-2026-${String(count + 1).padStart(3, "0")}`;

    const invoice = await Invoice.create({
      invoiceNumber,
      customerName: req.body.customerName,
      amount: req.body.amount,
      gst: req.body.gst,
      companyId: req.user.companyId,
    });

    res.status(201).json(invoice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ======================================
// MARK INVOICE PAID
// ======================================
export const markInvoicePaid = async (req, res) => {
  try {
    const { invoiceId } = req.body;

    const invoice = await Invoice.findByIdAndUpdate(
      invoiceId,
      { status: "PAID" },
      { new: true }
    );

    res.json(invoice);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ======================================
// GET INVOICES
// ======================================
export const getInvoices = async (req, res) => {
  try {
    const data = await Invoice.find({
      companyId: req.user.companyId,
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ======================================
// ADD EXPENSE
// ======================================
export const addExpense = async (req, res) => {
  try {
    const { title, amount, category } = req.body;

    const expense = await Expense.create({
      title,
      amount,
      category,
      companyId: req.user.companyId,
    });

    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ======================================
// GET EXPENSES
// ======================================
export const getExpenses = async (req, res) => {
  try {
    const data = await Expense.find({
      companyId: req.user.companyId,
    });
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ======================================
// PROFIT ANALYTICS (FIXED OBJECTID TYPE MATCH CASTING)
// ======================================
export const getProfitAnalytics = async (req, res) => {
  try {
    const companyId = new mongoose.Types.ObjectId(req.user.companyId);

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
    ]);

    const expense = await Expense.aggregate([
      {
        $match: {
          companyId,
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          total: { $sum: "$amount" },
        },
      },
    ]);

    res.json({
      revenue,
      expense,
    });
  } catch (err) {
    console.error("Profit analytics error:", err);
    res.status(500).json({ message: "Analytics Error" });
  }
};

// ======================================
// PROFIT LOSS
// ======================================
export const getProfitLoss = async (req, res) => {
  try {
    const invoices = await Invoice.find({ companyId: req.user.companyId });
    const expenses = await Expense.find({ companyId: req.user.companyId });

    const revenue = invoices.reduce((a, b) => a + b.amount, 0);
    const expenseTotal = expenses.reduce((a, b) => a + b.amount, 0);

    res.json({
      revenue,
      expenses: expenseTotal,
      profit: revenue - expenseTotal,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ======================================
// BANK BALANCE
// ======================================
export const bankBalance = async (req, res) => {
  try {
    const response = await plaid.accountsBalanceGet({
      access_token: req.body.accessToken,
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ======================================
// DOUBLE ENTRY
// ======================================
export const createJournal = async (req, res) => {
  try {
    const result = await createDoubleEntry(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ======================================
// GST
// ======================================
export const gstCalculation = async (req, res) => {
  try {
    const result = calculateGST(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ======================================
// AUDIT REPORT
// ======================================
export const auditReport = async (req, res) => {
  try {
    const path = await generateAuditReport(req.body.data);
    res.json({ file: path });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};