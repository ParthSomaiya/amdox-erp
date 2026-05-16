import mongoose from "mongoose";

const inviteSchema = new mongoose.Schema({
  email: String,
  role: String,
  companyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
  },
  token: String,
  expiresAt: Date,
});

export default mongoose.model("Invite", inviteSchema);