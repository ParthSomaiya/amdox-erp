import JournalEntry from "../models/JournalEntry.js";

// Create journal entry
export const createEntry = async (req, res) => {
  try {
    const entry = await JournalEntry.create({
      ...req.body,
      companyId: req.user.companyId,
    });

    res.status(201).json(entry);
  } catch (err) {
    console.error("GL entry creation error:", err);
    res.status(500).json({ message: "Failed to create general ledger entry" });
  }
};

// Get ledger
export const getLedger = async (req, res) => {
  try {
    const data = await JournalEntry.find({
      companyId: req.user.companyId,
    }).sort({ createdAt: -1 });

    res.json(data);
  } catch (err) {
    console.error("Get ledger error:", err);
    res.status(500).json({ message: "Failed to retrieve general ledger" });
  }
};