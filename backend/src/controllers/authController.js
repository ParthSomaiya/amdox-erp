import User from "../models/User.js";
import Company from "../models/Company.js";
import OTP from "../models/Otp.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateOTP, saveOTP } from "../services/otpService.js";
import Invite from "../models/Invite.js";

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
  const { companyName, email, password } = req.body;

  // create company
  const company = await Company.create({
    name: companyName,
    email,
  });

  // create admin user
  const user = await User.create({
    email,
    password,
    role: "ADMIN",
    companyId: company._id,
  });

  res.json({ user });
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

export const registerEmployeeWithInvite = async (req, res) => {
  try {
    const { token, name, password } = req.body;

    const invite = await Invite.findOne({ token });

    if (!invite) {
      return res.status(400).json({ message: "Invalid invite" });
    }

    if (invite.status === "ACCEPTED") {
      return res.status(400).json({ message: "Invite already used" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: invite.email,
      password: hashedPassword,
      role: invite.role,
      companyId: invite.companyId,
    });

    invite.status = "ACCEPTED";
    await invite.save();

    res.json({ message: "Account created", user });
  } catch (err) {
    res.status(500).json({ message: "Register error" });
  }
};

export const registerJobSeeker = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const user = await User.create({
      name,
      email,
      password,
      role: "JOB_SEEKER",
    });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Register error" });
  }
};

export const registerWithInvite = async (req, res) => {
  try {
    const { token, name, password } = req.body;

    const invite = await Invite.findOne({ token });

    if (!invite || invite.expiresAt < new Date()) {
      return res.status(400).json({ message: "Invalid or expired invite" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: invite.email,
      password: hashedPassword,
      role: invite.role,
      companyId: invite.companyId,
    });

    invite.status = "ACCEPTED";
    await invite.save();

    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({ token: jwtToken });
  } catch (err) {
    res.status(500).json({ message: "Register error" });
  }
};