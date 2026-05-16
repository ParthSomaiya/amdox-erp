import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  title: String,
  month: String,
  amount: Number,
  category: String,
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Expense", expenseSchema);