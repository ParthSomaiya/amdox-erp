import mongoose from "mongoose";

const stockHistorySchema =
  new mongoose.Schema(

    {

      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },

      action: {
        type: String,
        enum: [
          "ADD",
          "REMOVE",
          "TRANSFER",
        ],
      },

      quantity: Number,

      previousStock: Number,

      newStock: Number,

      createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

    },

    { timestamps: true }

  );

export default mongoose.model(
  "StockHistory",
  stockHistorySchema
);