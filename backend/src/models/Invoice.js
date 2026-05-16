import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema({
  clientName: String,
  amount: Number,
  status: {
    type: String,
    default: "PENDING", // PAID
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