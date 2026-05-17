import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    enum: ["ASSET", "LIABILITY", "EQUITY", "REVENUE", "EXPENSE"],
    required: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  }
}, { timestamps: true });

export default mongoose.model("Account", accountSchema);