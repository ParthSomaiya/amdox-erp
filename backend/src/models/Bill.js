import mongoose from "mongoose";

const billSchema = new mongoose.Schema(
  {
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
    companyId: mongoose.Schema.Types.ObjectId,
    amount: Number,
    status: {
      type: String,
      enum: ["UNPAID", "PAID"],
      default: "UNPAID",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Bill", billSchema);