import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: String,
  phone: String,
  otp: String,
  expiresAt: Date,
});

export default mongoose.model("OTP", otpSchema);
