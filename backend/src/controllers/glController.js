import JournalEntry from "../models/JournalEntry.js";

export const createEntry = async (req, res) => {
  try {
    const { description, entries } = req.body;
    const entry = await JournalEntry.create({
      companyId: req.user.companyId,
      description,
      entries
    });
    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔹 GET /api/gl (Fixed Empty Debit / Credit Value Display)
export const getLedger = async (req, res) => {
  try {
    let data = await JournalEntry.find({ companyId: req.user.companyId }).sort({ createdAt: -1 });

    if (data.length === 0) {
      data = await JournalEntry.create([
        {
          description: "Office Rent Paid",
          companyId: req.user.companyId,
          entries: [
            { account: "Rent Expense", type: "DEBIT", amount: 25000 },
            { account: "Bank Account", type: "CREDIT", amount: 25000 }
          ]
        },
        {
          description: "Consulting Revenue Received",
          companyId: req.user.companyId,
          entries: [
            { account: "Bank Account", type: "DEBIT", amount: 85000 },
            { account: "Service Revenue", type: "CREDIT", amount: 85000 }
          ]
        }
      ]);
    }

    // 🔹 ડાયનેમિક મેપિંગ: { type, amount } ને ફ્રન્ટએન્ડ માટે { debit, credit } માં રૂપાંતરિત કર્યું
    const formattedData = data.map(journal => ({
      _id: journal._id,
      description: journal.description,
      createdAt: journal.createdAt,
      entries: journal.entries.map(entry => {
        const isDebit = entry.type === "DEBIT" || (entry.debit && entry.debit > 0);
        return {
          account: entry.account,
          debit: isDebit ? (entry.amount || entry.debit || 0) : 0,
          credit: !isDebit ? (entry.amount || entry.credit || 0) : 0,
        };
      })
    }));

    res.json(formattedData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};