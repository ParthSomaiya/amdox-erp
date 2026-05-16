import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
  },

  title: String,
  description: String,

  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  status: {
    type: String,
    enum: ["TODO", "IN_PROGRESS", "DONE"],
    default: "TODO",
  },

  hours: Number, // resource tracking

  companyId: mongoose.Schema.Types.ObjectId,
}, { timestamps: true });

export default mongoose.model("Task", taskSchema);