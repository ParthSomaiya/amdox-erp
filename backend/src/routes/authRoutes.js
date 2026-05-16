import express from "express";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";

import {
  sendOTP,
  verifyOTP,
  registerAdmin,
  registerUser,
  login,
} from "../controllers/authController.js";
import Otp from "../models/Otp.js";
import User from "../models/User.js";

const router = express.Router();

router.post("/send-otp", async (req, res) => {
  const { email } = req.body;

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await Otp.create({
    email,
    otp,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000),
  });

  console.log("OTP:", otp); // for testing

  res.json({ message: "OTP sent" });
});

router.post("/verify-otp", async (req, res) => {
  const { email, otp, password, role } = req.body;

  const record = await Otp.findOne({ email, otp });

  if (!record || record.expiresAt < new Date()) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    email,
    password: hashed,
    role: role || "EMPLOYEE",
  });

  // ✅ ADD HERE (after success)
  await Otp.deleteMany({ email });

  res.json({ message: "Registered successfully" });
});

router.post("/register-admin", registerAdmin);
router.post("/register-user", registerUser);
router.post("/login", login);

export default router;