import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: String,
  sku: String,
  price: Number,
  quantity: Number,
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  barcode: {
    type: String,
    unique: true,
  },
  qrCode: String,

  lowStockLimit: {
    type: Number,
    default: 5,
  },
}, { timestamps: true });

export default mongoose.model("Product", productSchema);