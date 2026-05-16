import JournalEntry from "../models/JournalEntry.js";

// Create journal entry
export const createEntry = async (req, res) => {
  try {
    const entry = await JournalEntry.create({
      ...req.body,
      companyId: req.user.companyId,
    });

    res.json(entry);
  } catch (err) {
    res.status(500).json({ message: "GL error" });
  }
};

// Get ledger
export const getLedger = async (req, res) => {
  const data = await JournalEntry.find({
    companyId: req.user.companyId,
  }).sort({ date: -1 });

  res.json(data);
};