import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: String,
    sku: String,
    price: Number,

    stock: {
      type: Number,
      default: 0,
    },

    minStock: {
      type: Number,
      default: 10,
    },

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);