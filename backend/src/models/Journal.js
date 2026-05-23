import mongoose from "mongoose";

const journalSchema =
  new mongoose.Schema({

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },

    entries: [

      {
        account: String,

        debit: Number,

        credit: Number,
      },

    ],

    note: String,

  }, {
    timestamps: true,
  });

export default mongoose.model(
  "Journal",
  journalSchema
);