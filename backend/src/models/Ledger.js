import mongoose from "mongoose";

const ledgerSchema =
  new mongoose.Schema({

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },

    account: String,

    debit: Number,

    credit: Number,

    description: String,

  }, {
    timestamps: true,
  });

export default mongoose.model(
  "Ledger",
  ledgerSchema
);