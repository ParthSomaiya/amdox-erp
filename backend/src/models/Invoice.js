import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
  clientName: String,
  month: String,
  amount: Number,
  status: {
    type: String,
    enum: ["PENDING", "PAID"],
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Invoice", invoiceSchema);