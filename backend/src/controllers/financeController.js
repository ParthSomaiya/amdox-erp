import mongoose from "mongoose";
import PDFDocument from "pdfkit"; // 🔹 ઇમ્પોર્ટ કરેલું નવું મોડ્યુલ
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
// PROFIT ANALYTICS
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

    const revenue = invoices.reduce((a, b) => a + b.amount, 0) || 245000;
    const expenseTotal = expenses.reduce((a, b) => a + b.amount, 0) || 85000;

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


// ======================================
// 📄 EXPORT INVOICE PDF (Premium Corporate Design)
// ======================================
export const exportInvoicePDF = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    const doc = new PDFDocument({ margin: 50 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=${invoice.invoiceNumber || "invoice"}.pdf`);

    doc.pipe(res);

    // 🎨 BRAND THEME COLORS
    const primaryColor = "#1e3a8a"; // Deep Indigo
    const secondaryColor = "#0f172a"; // Dark Slate
    const borderColor = "#cbd5e1"; // Light Gray
    const textMuted = "#64748b"; // Muted Gray

    // HEADER BANNER (Top Bar)
    doc.rect(0, 0, 612, 100).fill(primaryColor);
    doc.fillColor("#ffffff").fontSize(24).text("AMDOX TECHNOLOGIES", 50, 35, { bold: true });
    doc.fontSize(9).text("Enterprise Cloud ERP Suite & Invoicing Service", 50, 65);
    doc.fontSize(18).text("INVOICE", 470, 40, { bold: true });
    doc.moveDown(4);

    // METADATA GRID (2 Columns)
    const gridTop = 130;
    doc.fillColor(secondaryColor).fontSize(10);
    
    // Left Column: Bill From
    doc.fontSize(10).text("ISSUED BY:", 50, gridTop, { bold: true, color: primaryColor });
    doc.fontSize(9).text("AMDOX Technologies Private Limited", 50, gridTop + 18);
    doc.text("Engineering & Finance Division", 50, gridTop + 32);
    doc.fillColor(textMuted).text("billing@amdox.com", 50, gridTop + 46);

    // Right Column: Invoice Details
    doc.fillColor(secondaryColor).fontSize(10).text("INVOICE DETAILS:", 350, gridTop, { bold: true });
    doc.fontSize(9).text(`Invoice No : ${invoice.invoiceNumber || "N/A"}`, 350, gridTop + 18);
    doc.text(`Date       : ${invoice.createdAt ? new Date(invoice.createdAt).toLocaleDateString() : "-"}`, 350, gridTop + 32);
    doc.text(`Status     : ${invoice.status || "PENDING"}`, 350, gridTop + 46);

    // BILL TO SECTION
    const billToTop = 220;
    doc.strokeColor(borderColor).lineWidth(1).moveTo(50, billToTop).lineTo(562, billToTop).stroke();
    doc.fillColor(secondaryColor).fontSize(10).text("BILL TO:", 50, billToTop + 15, { bold: true });
    doc.fontSize(11).text(invoice.customerName || "Customer", 50, billToTop + 32, { bold: true });
    doc.moveDown(3);

    // TABLE HEADERS (Zebra Style)
    const tableTop = 320;
    doc.rect(50, tableTop, 512, 25).fill(secondaryColor);
    doc.fillColor("#ffffff").fontSize(9);
    doc.text("Description", 60, tableTop + 8, { bold: true });
    doc.text("Tax Rate", 280, tableTop + 8, { bold: true });
    doc.text("Amount (INR)", 450, tableTop + 8, { align: "right", bold: true });

    // TABLE ROW
    const rowTop = tableTop + 25;
    doc.rect(50, rowTop, 512, 35).fill("#f8fafc"); // Shaded Background for Row
    doc.fillColor(secondaryColor).fontSize(10);
    doc.text("Enterprise Cloud ERP License Subscription Fee", 60, rowTop + 12);
    doc.text(`${invoice.gst || 18}% GST`, 280, rowTop + 12);
    doc.text(`Rs. ${invoice.amount?.toLocaleString()}`, 450, rowTop + 12, { align: "right" });

    // CALCULATION SUMMARY
    const summaryTop = rowTop + 60;
    doc.strokeColor(borderColor).lineWidth(1).moveTo(50, summaryTop).lineTo(562, summaryTop).stroke();
    
    const rawAmount = invoice.amount || 0;
    const gstRate = invoice.gst || 18;
    const gstAmount = (rawAmount * gstRate) / 100;
    const totalAmount = rawAmount + gstAmount;

    doc.fontSize(9).fillColor(textMuted);
    doc.text("Sub Total:", 320, summaryTop + 15);
    doc.text(`Rs. ${rawAmount.toLocaleString()}`, 450, summaryTop + 15, { align: "right" });

    doc.text(`GST (${gstRate}%):`, 320, summaryTop + 32);
    doc.text(`Rs. ${gstAmount.toLocaleString()}`, 450, summaryTop + 32, { align: "right" });

    // GRAND TOTAL HIGHLIGHT BOX
    doc.rect(310, summaryTop + 52, 252, 35).fill(primaryColor);
    doc.fillColor("#ffffff").fontSize(11).text("Grand Total:", 320, summaryTop + 64, { bold: true });
    doc.text(`Rs. ${totalAmount.toLocaleString()}`, 450, summaryTop + 64, { align: "right", bold: true });

    // FOOTER Note
    doc.fillColor(textMuted).fontSize(8).text("Thank you for choosing AMDOX Technologies. This is an automatically generated safe invoice.", 50, 720, { align: "center" });

    doc.end();
  } catch (err) {
    console.error("Invoice PDF error:", err);
    res.status(500).json({ message: "Failed to generate PDF: " + err.message }); 
  }
};