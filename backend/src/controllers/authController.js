import User from "../models/User.js";
import Company from "../models/Company.js";
import OTP from "../models/Otp.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateOTP, saveOTP } from "../services/otpService.js";

// Send OTP
export const sendOTP = async (req, res) => {
  const { email, phone } = req.body;
  const otp = generateOTP();
  await saveOTP(email, phone, otp);
  console.log("OTP:", otp);
  res.json({ message: "OTP sent" });
};

// Verify OTP
export const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  const record = await OTP.findOne({ email, otp });
  if (!record) return res.status(400).json({ message: "Invalid OTP" });

  if (record.expiresAt < new Date())
    return res.status(400).json({ message: "OTP expired" });

   res.json({ message: "OTP verified" });
};

// Admin Register
export const registerAdmin = async (req, res) => {
  const { name, email, password, companyName } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashed,
    role: "ADMIN",
  });

  const company = await Company.create({
    name: companyName,
    ownerId: user._id,
  });

  user.companyId = company._id;
  await user.save();

  res.json({ message: "Admin registered" });
};

// User Register
export const registerUser = async (req, res) => {
  const { name, email, password, role, companyId } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashed,
    role,
    companyId,
  });

  res.json({ message: "User registered" });
};

// Login
export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Wrong password" });

  const token = jwt.sign(
    {
      userId: user._id,
      role: user.role,
      companyId: user.companyId,
    },
    process.env.JWT_SECRET
  );

  res.json({ token });
};