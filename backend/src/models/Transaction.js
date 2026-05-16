import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  companyId: mongoose.Schema.Types.ObjectId,
  amount: Number,
  type: String, // CREDIT / DEBIT
  matched: { type: Boolean, default: false },
});

export default mongoose.model("Transaction", transactionSchema);