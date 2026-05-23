import mongoose from "mongoose";

const stockTransferSchema =
  new mongoose.Schema({

    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },

    fromWarehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
    },

    toWarehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Warehouse",
    },

    quantity: Number,

    transferredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

  },

  { timestamps: true }

);

export default mongoose.model(
  "StockTransfer",
  stockTransferSchema
);