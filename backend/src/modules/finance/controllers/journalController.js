import JournalEntry from "../models/JournalEntry.js";
import Account from "../models/Account.js";

export const createJournalEntry = async (req, res) => {
  try {
    const { lines, description } = req.body;

    // ✅ VALIDATION: Debit = Credit
    let totalDebit = 0;
    let totalCredit = 0;

    lines.forEach(l => {
      totalDebit += l.debit || 0;
      totalCredit += l.credit || 0;
    });

    if (totalDebit !== totalCredit) {
      return res.status(400).json({
        error: "Debit and Credit must be equal"
      });
    }

    // ✅ Create entry
    const entry = await JournalEntry.create({
      lines,
      description,
      createdBy: req.user?.id
    });

    // ✅ Update account balances
    for (const line of lines) {
      const account = await Account.findById(line.account);

      if (!account) continue;

      account.balance += (line.debit - line.credit);
      await account.save();
    }

    res.json(entry);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getJournalEntries = async (req, res) => {
  const entries = await JournalEntry
    .find()
    .populate("lines.account");

  res.json(entries);
};