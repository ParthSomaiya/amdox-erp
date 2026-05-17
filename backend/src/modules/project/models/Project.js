import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  name: String,
  description: String,
  companyId: String,
  budget: Number,
  spent: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

// ✅ CRITICAL FIX
export default mongoose.models.Project ||
  mongoose.model("Project", projectSchema);