import JournalEntry from "../models/JournalEntry.js";
import Payment from "../models/Payment.js";
import Invoice from "../models/Invoice.js";

export const recordPayment = async (req, res) => {
  const { invoiceId, amount } = req.body;

  const payment = await Payment.create({
    invoiceId,
    amount,
    companyId: req.companyId,
  });

  // 🔥 Journal Entry
  await JournalEntry.create({
    date: new Date(),
    description: "Payment Received",
    companyId: req.companyId,
    entries: [
      {
        account: "Cash",
        debit: amount,
        credit: 0,
      },
      {
        account: "Accounts Receivable",
        debit: 0,
        credit: amount,
      },
    ],
  });

  res.json(payment);
};

export const reconcileInvoice = async (invoiceId) => {
  const payments = await Payment.find({ invoiceId });

  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);

  const invoice = await Invoice.findById(invoiceId);

  if (!invoice) return;

  if (totalPaid >= invoice.amount) {
    invoice.status = "PAID";
  } else {
    invoice.status = "PARTIAL";
  }

  await invoice.save();
};