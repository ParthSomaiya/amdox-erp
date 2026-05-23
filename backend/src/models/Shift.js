import mongoose from "mongoose";

const shiftSchema = new mongoose.Schema(
  {
    name: String,

    startTime: String,

    endTime: String,

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
  },
  { timestamps: true }
);

export default mongoose.model(
  "Shift",
  shiftSchema
);