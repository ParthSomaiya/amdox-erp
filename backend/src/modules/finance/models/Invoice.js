import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    companyId: mongoose.Schema.Types.ObjectId,

    customerName: String,

    amount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "PAID", "PARTIAL"],
      default: "PENDING",
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// ✅ FIX OverwriteModelError
export default mongoose.models.Invoice || mongoose.model("Invoice", invoiceSchema);