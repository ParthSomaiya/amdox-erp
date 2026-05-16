import OTP from "../models/Otp.js";

export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const saveOTP = async (email, phone, otp) => {
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
  await OTP.create({ email, phone, otp, expiresAt });
};