import mongoose from "mongoose";

const stockHistorySchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },

    type: {
      type: String,
      enum: ["IN", "OUT"],
    },

    quantity: Number,

    reason: String,

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
  },
  { timestamps: true }
);

export default mongoose.model("StockHistory", stockHistorySchema);