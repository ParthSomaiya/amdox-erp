import mongoose from "mongoose";

const holidaySchema = new mongoose.Schema(
  {
    title: String,

    date: String,

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
  },
  { timestamps: true }
);

export default mongoose.model(
  "Holiday",
  holidaySchema
);