import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    experience: { type: Number },
    skills: { type: String },
    portfolio: { type: String },
    resume: { type: String },
    jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
    position: { type: String, default: "Frontend Developer" },
    status: { 
      type: String, 
      enum: ["PENDING", "ACCEPTED", "REJECTED"], 
      default: "PENDING" 
    }
  },
  { timestamps: true } 
);

const Application = mongoose.model("Application", applicationSchema);
export default Application;