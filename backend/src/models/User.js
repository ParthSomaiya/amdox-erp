import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  phone: String,
  password: String,

  role: {
    type: String,
    enum: ["ADMIN", "HR", "FINANCE", "EMPLOYEE", "EMPLOYER", "JOB_SEEKER"],
  },

  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },

  isActive: {
    type: Boolean,
    default: true,
  },
});

export default mongoose.model("User", userSchema);