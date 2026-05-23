import mongoose from "mongoose";

// ledger 

const ledgerSchema =
  new mongoose.Schema(
    {
      companyId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Company",
      },

      account: String,

      debit: {
        type: Number,
        default: 0,
      },

      credit: {
        type: Number,
        default: 0,
      },

      balance: {
        type: Number,
        default: 0,
      },

      reference: String,
    },
    { timestamps: true }
  );

export default mongoose.model(
  "Ledger",
  ledgerSchema
);