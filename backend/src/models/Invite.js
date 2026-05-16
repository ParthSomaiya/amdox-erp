import mongoose from "mongoose";

const inviteSchema = new mongoose.Schema({
  email: String,
  role: {
    type: String,
    enum: ["HR", "FINANCE", "EMPLOYEE"],
  },
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  token: String,
  status: {
    type: String,
    default: "PENDING",
  },
});

export default mongoose.model("Invite", inviteSchema);