import mongoose from "mongoose";

const ledgerSchema =
  new mongoose.Schema(
    {

      account: String,

      type: {
        type: String,

        enum: [
          "DEBIT",
          "CREDIT",
        ],
      },

      amount: Number,

      description: String,

      reference: String,

      date: Date,

    },

    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "Ledger",
  ledgerSchema
);