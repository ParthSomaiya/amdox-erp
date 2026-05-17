import mongoose from "mongoose";

const poSchema = new mongoose.Schema({
  companyId: mongoose.Schema.Types.ObjectId,

  // ✅ ADD HERE (replace existing vendorId if simple hato)
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: true,
  },

  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: Number,
      price: Number,
    },
  ],

  status: {
    type: String,
    enum: ["PENDING", "RECEIVED"],
    default: "PENDING",
  },
}, { timestamps: true });

export default mongoose.model("PurchaseOrder", poSchema);