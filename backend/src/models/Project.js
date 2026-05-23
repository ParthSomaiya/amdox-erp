import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    // 🔥 Company
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },

    // 🔥 Basic Info
    name: {
      type: String,
      required: true,
    },

    description: String,

    // 🔥 Dates
    startDate: Date,
    endDate: Date,

    // 🔥 Budget
    budget: {
      type: Number,
      default: 0,
    },

    spent: {
      type: Number,
      default: 0,
    },

    // 🔥 Team Members
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // 🔥 Status
    status: {
      type: String,

      enum: [
        "PLANNED",
        "IN_PROGRESS",
        "COMPLETED",
      ],

      default: "PLANNED",
    },
  },

  { timestamps: true }
);

export default
  mongoose.models.Project ||
  mongoose.model(
    "Project",
    projectSchema
  );