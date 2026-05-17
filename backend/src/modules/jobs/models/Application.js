import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job"
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  resume: String, // file path

  status: {
    type: String,
    enum: ["APPLIED", "SHORTLISTED", "REJECTED"],
    default: "APPLIED"
  },

  companyId: mongoose.Schema.Types.ObjectId

}, { timestamps: true });

export default mongoose.model("Application", applicationSchema);