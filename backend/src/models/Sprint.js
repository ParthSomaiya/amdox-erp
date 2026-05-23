import mongoose from "mongoose";

const sprintSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },

    name: String,

    goal: String,

    startDate: Date,

    endDate: Date,

    status: {
      type: String,
      enum: [
        "PLANNED",
        "ACTIVE",
        "COMPLETED",
      ],
      default: "PLANNED",
    },
  },
  { timestamps: true }
);

export default mongoose.model(
  "Sprint",
  sprintSchema
);