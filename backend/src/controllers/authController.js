import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import Invite from "../models/Invite.js"
import User from "../models/User.js";
import Company from "../models/Company.js";
import OTP from "../models/Otp.js";

// ================= TOKEN =================

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "30d" }
  );
};

// ================= OTP =================

export const sendOTP = async (req, res) => {
  try {
    const email = req.body.email?.toLowerCase();

    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    await OTP.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    console.log("OTP:", otp);

    res.json({
      success: true,
      message: "OTP generated",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= VERIFY OTP =================

export const verifyOTP = async (req, res) => {
  try {
    const email = req.body.email?.toLowerCase();
    const { otp } = req.body;

    const record = await OTP.findOne({ email, otp });

    if (!record) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    await User.updateOne({ email }, { isVerified: true });
    await OTP.deleteMany({ email });

    res.json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= REGISTER =================

export const registerUser = async (req, res) => {
  try {
    const email = req.body.email?.toLowerCase();

    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(400).json({ message: "User exists" });
    }

    const hashed = await bcrypt.hash(req.body.password, 10);

    const user = await User.create({
      name: req.body.name,
      email,
      password: hashed,
      role: req.body.role || "EMPLOYEE",
      isVerified: false,
    });

    // send OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    await OTP.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    res.json({
      success: true,
      message: "OTP sent for verification",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= LOGIN (FINAL FIX) =================

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required",
      });
    }

    // find user
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // check password exists
    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: "Password not set for this user",
      });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // create tokens
    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "30d" }
    );

    user.refreshToken = refreshToken;
    await user.save();

    return res.status(200).json({
      success: true,
      accessToken,
      refreshToken,
      user,
    });

  } catch (err) {
    console.log("LOGIN ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Server error in login",
      error: err.message,
    });
  }
};

// ================= REFRESH TOKEN =================

export const refreshToken = async (req, res) => {
  try {
    const token = req.body.refreshToken;

    if (!token) {
      return res.status(401).json({ message: "No token" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET
    );

    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== token) {
      return res.status(403).json({ message: "Invalid token" });
    }

    const newAccessToken = generateAccessToken(user);

    res.json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (err) {
    res.status(403).json({ message: "Token expired" });
  }
};


// ================= REGISTER ADMIN =================

export const registerAdmin = async (req, res) => {
  try {
    const { companyName, name, email, password } = req.body;

    const existing = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const company = await Company.create({
      name: companyName,
      email: email.toLowerCase(),
    });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashed,
      role: "ADMIN",
      companyId: company._id,
      isVerified: true,
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    return res.status(201).json({
      success: true,
      accessToken,
      refreshToken,
      user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// ================= FORGOT PASSWORD =================

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");

    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 3600000;

    await user.save();

    return res.json({
      success: true,
      resetLink: `http://localhost:5173/reset-password/${token}`,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ================= RESET PASSWORD =================

export const resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.params;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid token",
      });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetToken = null;
    user.resetTokenExpiry = null;

    await user.save();

    return res.json({
      success: true,
      message: "Password reset successful",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ================= VERIFY EMAIL =================

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      verificationToken: token,
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid token",
      });
    }

    user.isVerified = true;
    user.verificationToken = null;

    await user.save();

    return res.json({
      success: true,
      message: "Email verified",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ================= JOB USER =================

export const registerJobUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "User exists",
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashed,
      role: "JOB_SEEKER",
      isVerified: true,
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    return res.json({
      success: true,
      accessToken,
      refreshToken,
      user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ================= INVITE USER =================

export const registerEmployeeWithInvite = async (req, res) => {
  try {
    const { token } = req.params;
    const { name, password } = req.body;

    const invite = await Invite.findOne({ token });

    if (!invite) {
      return res.status(400).json({
        success: false,
        message: "Invalid invite",
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: invite.email,
      password: hashed,
      role: invite.role,
      companyId: invite.companyId,
      isVerified: true,
    });

    invite.status = "ACCEPTED";
    await invite.save();

    return res.json({
      success: true,
      user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};