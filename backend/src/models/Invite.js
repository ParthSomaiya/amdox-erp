import mongoose from "mongoose";

const inviteSchema = new mongoose.Schema({
  email: String,
  role: String,
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  token: String,
  status: {
    type: String,
    enum: ["PENDING", "ACCEPTED", "EXPIRED"],
    default: "PENDING",
  },
  expiresAt: Date,
}, { timestamps: true });

export default mongoose.model("Invite", inviteSchema);