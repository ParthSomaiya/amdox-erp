import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    // 🔥 Company
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },

    // 🔥 Project
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },

    // 🔥 Assigned User
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // 🔥 Task Info
    title: {
      type: String,
      required: true,
    },

    description: String,

    // 🔥 Priority
    priority: {
      type: String,

      enum: [
        "LOW",
        "MEDIUM",
        "HIGH",
      ],

      default: "MEDIUM",
    },

    // 🔥 Status
    status: {
      type: String,

      enum: [
        "TODO",
        "IN_PROGRESS",
        "DONE",
      ],

      default: "TODO",
    },

    // 🔥 Hours Tracking
    loggedHours: {
      type: Number,
      default: 0,
    },

    // 🔥 Deadline
    dueDate: Date,
  },

  { timestamps: true }
);

// 🔥 Overwrite error avoid
export default
  mongoose.models.Task ||
  mongoose.model(
    "Task",
    taskSchema
  );