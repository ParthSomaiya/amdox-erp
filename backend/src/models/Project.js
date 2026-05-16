import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    startDate: Date,
    endDate: Date,

    budget: Number,
    spent: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["PLANNED", "IN_PROGRESS", "COMPLETED"],
      default: "PLANNED",
    },

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);