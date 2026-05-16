import mongoose from "mongoose";

const poSchema = new mongoose.Schema({
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
      price: Number,
    },
  ],
  status: {
    type: String,
    enum: ["PENDING", "RECEIVED"],
    default: "PENDING",
  },
  companyId: mongoose.Schema.Types.ObjectId,
}, { timestamps: true });

export default mongoose.model("PurchaseOrder", poSchema);