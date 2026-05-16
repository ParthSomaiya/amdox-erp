import mongoose from "mongoose";

const journalEntrySchema = new mongoose.Schema(
  {
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    date: {
      type: Date,
      default: Date.now,
    },
    description: String,

    entries: [
      {
        account: String, // Cash, Revenue, Expense
        debit: { type: Number, default: 0 },
        credit: { type: Number, default: 0 },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("JournalEntry", journalEntrySchema);