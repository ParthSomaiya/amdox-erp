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
}, { timestamps: true });

export default mongoose.model("Product", productSchema);