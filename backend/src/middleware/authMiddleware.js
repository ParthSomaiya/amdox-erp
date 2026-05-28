import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import User from "../models/User.js";
import Company from "../models/Company.js";
import OTP from "../models/Otp.js";
import Invite from "../models/Invite.js";

import { generateOTP, saveOTP } from "../services/otpService.js";
import { sendEmail } from "../services/emailService.js";

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
    const { email, phone } = req.body;

    if (!email && !phone) {
      return res.status(400).json({
        success: false,
        message: "Email or phone required",
      });
    }

    const otp = generateOTP();
    await saveOTP(email, phone, otp);

    res.json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const record = await OTP.findOne({ email, otp });

    if (!record) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    if (record.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired",
      });
    }

    await OTP.deleteMany({ email });

    res.json({
      success: true,
      message: "OTP verified",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ================= REGISTER ADMIN =================

export const registerAdmin = async (req, res) => {
  try {
    const { companyName, name, email, password } = req.body;

    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const company = await Company.create({ name: companyName });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "ADMIN",
      companyId: company._id,
      isVerified: true,
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      success: true,
      accessToken,
      refreshToken,
      user,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ================= REGISTER USER =================

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "EMPLOYEE",
      isVerified: true,
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      success: true,
      accessToken,
      refreshToken,
      user,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ================= LOGIN =================

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email first",
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await user.save();

    res.json({
      success: true,
      accessToken,
      refreshToken,
      user,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ================= REFRESH TOKEN =================

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        message: "No refresh token",
      });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET
    );

    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({
        success: false,
        message: "Invalid refresh token",
      });
    }

    const newAccessToken = generateAccessToken(user);

    res.json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (err) {
    res.status(403).json({
      success: false,
      message: "Token expired",
    });
  }
};

// ================= FORGOT PASSWORD =================

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

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

    const resetUrl = `http://localhost:5173/reset-password/${token}`;

    await sendEmail({
      to: email,
      subject: "Reset Password",
      html: `<a href="${resetUrl}">Reset Password</a>`,
    });

    res.json({
      success: true,
      message: "Reset link sent",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ================= RESET PASSWORD =================

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    res.json({
      success: true,
      message: "Password reset successful",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ================= EMAIL VERIFY =================

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid token",
      });
    }

    user.isVerified = true;
    user.verificationToken = undefined;

    await user.save();

    res.json({
      success: true,
      message: "Email verified",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ================= EXPORT ALL (IMPORTANT FIX) =================

export {
  generateAccessToken,
  generateRefreshToken,
};