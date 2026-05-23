import mongoose from "mongoose";


// journal 

const journalSchema =
  new mongoose.Schema(
    {
      companyId: {
        type:
          mongoose.Schema.Types.ObjectId,
        ref: "Company",
      },

      date: {
        type: Date,
        default: Date.now,
      },

      description: String,

      entries: [
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
        },
      ],
    },
    { timestamps: true }
  );

export default mongoose.model(
  "JournalEntry",
  journalSchema
);