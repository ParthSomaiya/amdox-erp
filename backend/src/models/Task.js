import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: String,
  status: {
    type: String,
    enum: ["TODO", "IN_PROGRESS", "DONE"],
    default: "TODO",
  },
  loggedHours: {
    type: Number,
    default: 0,
  },
  projectId: mongoose.Schema.Types.ObjectId,
  companyId: mongoose.Schema.Types.ObjectId,
}, { timestamps: true });

// 🔥 IMPORTANT (overwrite error avoid)
export default mongoose.models.Task || mongoose.model("Task", taskSchema);