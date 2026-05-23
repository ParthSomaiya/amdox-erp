import mongoose from "mongoose";

const bankSchema =
  new mongoose.Schema({

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },

    type: {
      type: String,
      enum: ["CREDIT", "DEBIT"],
    },

    amount: Number,

    description: String,

  }, {
    timestamps: true,
  });

export default mongoose.model(
  "BankTransaction",
  bankSchema
);