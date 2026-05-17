import mongoose from "mongoose";

const journalEntrySchema = new mongoose.Schema({
  companyId: String,
  entries: [
    {
      account: String,
      debit: Number,
      credit: Number,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// ✅ FIX (IMPORTANT LINE)
export default mongoose.models.JournalEntry ||
  mongoose.model("JournalEntry", journalEntrySchema);