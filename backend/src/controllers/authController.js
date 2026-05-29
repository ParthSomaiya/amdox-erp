import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";

import Invite from "../models/Invite.js";
import User from "../models/User.js";
import Company from "../models/Company.js";
import OTP from "../models/Otp.js";

// ================= TOKEN GENERATORS =================

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

// ================= OTP GENERATION =================

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

    console.log("Generated OTP:", otp);

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
        message: "Invalid or expired OTP",
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

// ================= REGISTER EMPLOYEE (OTP ENABLED) =================

export const registerUser = async (req, res) => {
  try {
    const email = req.body.email?.toLowerCase();
    const { name, password, role } = req.body;

    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashed,
      role: role || "EMPLOYEE",
      isVerified: false,
    });

    // generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    await OTP.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    console.log("Employee Signup OTP:", otp);

    res.json({
      success: true,
      message: "OTP sent to email for verification",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= LOGIN (STABLE & SECURE) =================

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Force load the select: false password field
    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    }).select("+password");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (!user.password) {
      return res.status(400).json({
        success: false,
        message: "Password has not been set for this account",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

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

    // Bypass full document save validation that causes required-field errors
    await User.updateOne(
      { _id: user._id },
      { $set: { refreshToken } }
    );

    user.password = undefined;

    return res.status(200).json({
      success: true,
      accessToken,
      refreshToken,
      user,
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Server error occurred during login",
      error: err.message,
    });
  }
};

// ================= REFRESH TOKEN =================

export const refreshToken = async (req, res) => {
  try {
    const token = req.body.refreshToken;

    if (!token) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET
    );

    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== token) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = generateAccessToken(user);

    res.json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (err) {
    res.status(403).json({ message: "Refresh token expired" });
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

    await User.updateOne(
      { _id: user._id },
      { $set: { refreshToken } }
    );

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


// ======================================
// 📩 FORGOT PASSWORD (OTP SENDER VIA GMAIL)
// ======================================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // ૧. ૬-આંકડાનો યુનિક ઓટીપી બનાવો
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otpCode;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // ૧૦ મિનિટની વેલિડિટી
    await user.save();

    // ૨. લોકલ હોસ્ટ કોન્સોલ લોગીંગ
    console.log("-----------------------------------------");
    console.log(`🔑 SECURE PASSWORD RESET OTP FOR ${email}: ${otpCode}`);
    console.log("-----------------------------------------");

    // ૩. 100% Real Gmail SMTP Transporter સેટઅપ
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for port 465
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `"AMDOX Technologies" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Secure Password Reset OTP Code",
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #1e293b;">
            <h2 style="color: #1e3a8a;">AMDOX ERP - Password Reset</h2>
            <p>Hello,</p>
            <p>You requested a password reset verification code. Please find your 6-digit OTP code below:</p>
            <div style="background-color: #f1f5f9; padding: 15px; border-radius: 10px; display: inline-block; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #1e3a8a;">
              ${otpCode}
            </div>
            <p style="margin-top: 15px; font-size: 11px; color: #64748b;">This OTP is valid for 10 minutes. Please do not share this code with anyone.</p>
          </div>
        `,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Email SMTP credentials are missing in backend .env file.",
      });
    }

    return res.json({
      success: true,
      message: "An OTP has been successfully sent to your verified email address.",
    });
  } catch (err) {
    console.error("Forgot password error:", err);
    return res.status(500).json({ success: false, message: "Failed to send email: " + err.message });
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
        message: "Token has expired or is invalid",
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          password: hashed,
          resetToken: null,
          resetTokenExpiry: null,
        },
      }
    );

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
        message: "Invalid verification token",
      });
    }

    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          isVerified: true,
          verificationToken: null,
        },
      }
    );

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

// ================= REGISTER JOB USER =================

export const registerJobUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
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

    await User.updateOne(
      { _id: user._id },
      { $set: { refreshToken } }
    );

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

// ================= REGISTER EMPLOYEE WITH INVITE =================

export const registerEmployeeWithInvite = async (req, res) => {
  try {
    const { token } = req.params;
    const { name, password } = req.body;

    const invite = await Invite.findOne({ token });

    if (!invite) {
      return res.status(400).json({
        success: false,
        message: "Invalid invitation token",
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