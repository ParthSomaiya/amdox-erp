import mongoose from "mongoose";

const schema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  type: { type: String, enum: ["IN", "OUT"] },
  quantity: Number,
  warehouseId: { type: mongoose.Schema.Types.ObjectId, ref: "Warehouse" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.StockMovement || mongoose.model("StockMovement", schema);