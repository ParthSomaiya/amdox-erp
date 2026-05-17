import JournalEntry from "../models/JournalEntry.js";

export const createInvoice = async (req, res) => {
  const { customer, amount } = req.body;

  // Save invoice (assume model exists)
  const invoice = await Invoice.create({
    customer,
    amount,
    companyId: req.companyId,
  });

  // ✅ AHI ADD KARVU (after DB save)
  await logAction({
    userId: req.user.id,
    action: "CREATE_INVOICE",
    entity: "Invoice",
    entityId: invoice._id,
    companyId: req.companyId,
  });

  await logAction({
    userId: req.user.id,
    action: "CREATE_USER",
    entity: "User",
    entityId: user._id,
    companyId: req.companyId,
  });

  await logAction({
    userId: req.user.id,
    action: "CREATE_TASK",
    entity: "Task",
    entityId: task._id,
    companyId: req.companyId,
  });

  // 🔥 AUTO JOURNAL ENTRY
  await JournalEntry.create({
    date: new Date(),
    description: "Invoice Created",
    companyId: req.companyId,
    entries: [
      {
        account: "Accounts Receivable",
        debit: amount,
        credit: 0,
      },
      {
        account: "Revenue",
        debit: 0,
        credit: amount,
      },
    ],
  });

  res.json(invoice);
};