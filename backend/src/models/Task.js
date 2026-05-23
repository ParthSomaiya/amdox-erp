import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: String,

    description: String,

    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },

    sprintId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sprint",
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    status: {
      type: String,
      enum: [
        "TODO",
        "IN_PROGRESS",
        "DONE",
      ],
      default: "TODO",
    },

    priority: {
      type: String,
      enum: [
        "LOW",
        "MEDIUM",
        "HIGH",
      ],
      default: "MEDIUM",
    },

    estimatedHours: {
      type: Number,
      default: 0,
    },

    loggedHours: {
      type: Number,
      default: 0,
    },

    startDate: Date,

    dueDate: Date,

    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Task ||
  mongoose.model("Task", taskSchema);