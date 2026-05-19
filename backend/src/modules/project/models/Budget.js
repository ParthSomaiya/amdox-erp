import mongoose from "mongoose";

const budgetSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },

    plannedBudget: Number,

    actualCost: {
      type: Number,
      default: 0,
    },

    currency: {
      type: String,
      default: "INR",
    },

    companyId: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Budget ||
  mongoose.model(
    "Budget",
    budgetSchema
  );