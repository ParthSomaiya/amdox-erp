import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";

import Invite from "../models/Invite.js";
import User from "../models/User.js";
import Company from "../models/Company.js";
import OTP from "../models/Otp.js";

// આપણી નવી અને સિક્યોર ઈમેલ ફાઈલ ઈમ્પોર્ટ કરો
import { sendDirectEmail } from "../utils/sendEmail.js";

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

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #1e293b;">
        <h2 style="color: #4f46e5;">AMDOX ERP - Email Verification</h2>
        <p>Hello,</p>
        <p>Please use the following 6-digit verification code to verify your action:</p>
        <div style="background-color: #f1f5f9; padding: 15px; border-radius: 10px; display: inline-block; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #4f46e5;">
          ${otp}
        </div>
        <p style="margin-top: 15px; font-size: 11px; color: #64748b;">This code is valid for 10 minutes.</p>
      </div>
    `;

    await sendDirectEmail(email, "AMDOX ERP - Verification Code", htmlContent);

    res.json({
      success: true,
      message: "OTP generated and sent to email",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= VERIFY OTP (STABLE UNIFIED CHECK) =================

export const verifyOTP = async (req, res) => {
  try {
    const email = req.body.email?.toLowerCase().trim();
    const { otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP are required" });
    }

    // 🧠 યુનિફાઇડ સિક્યોર લુકઅપ: આપણી મુખ્ય OTP કલેક્શનમાંથી જ ઓટીપી શોધો
    const record = await OTP.findOne({ email, otp: Number(otp) });

    if (!record) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    const user = await User.findOne({ email });
    const resetToken = user ? user.resetToken : null;

    await User.updateOne({ email }, { isVerified: true });
    await OTP.deleteMany({ email });

    return res.json({
      success: true,
      message: "Email verified successfully",
      resetToken: resetToken 
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
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

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #1e293b;">
        <h2 style="color: #4f46e5;">Welcome to AMDOX ERP - Complete Signup</h2>
        <p>Hello ${name},</p>
        <p>Thank you for registering. Please find your 6-digit account verification OTP below:</p>
        <div style="background-color: #f1f5f9; padding: 15px; border-radius: 10px; display: inline-block; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #4f46e5;">
          ${otp}
        </div>
        <p style="margin-top: 15px; font-size: 11px; color: #64748b;">This OTP is valid for 10 minutes.</p>
      </div>
    `;

    await sendDirectEmail(email, "AMDOX ERP - Verify Your Account", htmlContent);

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

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    }).select("+password");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (!user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Please verify your email address before logging in.",
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
// 📩 FORGOT PASSWORD (UNIFIED OTP & LINK SENDER)
// ======================================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const resetToken = crypto.randomBytes(20).toString("hex");

    // ૧. પાસવર્ડ રીસેટ માટેના ઓટીપીને પણ સીધા જ આપણી 'OTP' કલેક્શન ફાઈલમાં સેવ કરો
    await OTP.deleteMany({ email: email.toLowerCase().trim() }); // જૂના ઓટીપી ક્લીનઅપ કરો
    await OTP.create({
      email: email.toLowerCase().trim(),
      otp: Number(otpCode),
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // ૧૫ મિનિટ વેલિડિટી
    });

    // ૨. સેશનની સિક્યોરિટી માટે લિંક ટોકન સેવ કરો
    user.resetToken = resetToken;
    user.resetTokenExpiry = new Date(Date.now() + 3600000);
    await user.save({ validateBeforeSave: false });

    console.log("-----------------------------------------");
    console.log(`🔑 PASSWORD RESET OTP FOR ${email}: ${otpCode}`);
    console.log(`🔗 RESET LINK: http://localhost:5173/reset-password/${resetToken}`);
    console.log("-----------------------------------------");

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 16px;">
        <h2 style="color: #4f46e5; text-align: center;">AMDOX ERP - Password Reset</h2>
        <p>Hello,</p>
        <p>You requested to reset your account password. We have provided both ways for your convenience:</p>
        
        <div style="background-color: #f8fafc; padding: 20px; border-radius: 12px; text-align: center; margin: 20px 0;">
          <p style="margin: 0 0 10px 0; font-weight: bold; color: #475569;">Method 1: Enter 6-Digit Verification OTP</p>
          <span style="font-size: 28px; font-weight: 900; letter-spacing: 5px; color: #4f46e5;">${otpCode}</span>
        </div>

        <div style="text-align: center; margin: 25px 0;">
          <p style="margin-bottom: 12px; font-weight: bold; color: #475569;">Method 2: Click Direct Reset Link</p>
          <a href="http://localhost:5173/reset-password/${resetToken}" target="_blank" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; font-weight: bold; border-radius: 10px; display: inline-block;">Reset Password Now</a>
        </div>

        <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
        <p style="font-size: 11px; color: #94a3b8; text-align: center;">This security token/OTP is confidential. Please do not share it with anyone.</p>
      </div>
    `;

    await sendDirectEmail(email, "AMDOX ERP - Password Reset Verification", htmlContent);

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

// ======================================
// 🔑 RESET PASSWORD VIA OTP (MFA SECURED FOR NAVBAR MODAL)
// ======================================
export const resetPasswordViaOTP = async (req, res) => {
  try {
    const email = req.body.email?.toLowerCase().trim();
    const { otp, password } = req.body;

    if (!email || !otp || !password) {
      return res.status(400).json({
        success: false,
        message: "Email, OTP, and password are required",
      });
    }

    const record = await OTP.findOne({ email, otp: Number(otp) });

    if (!record) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP code",
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    await User.updateOne(
      { email },
      {
        $set: {
          password: hashed,
          isVerified: true,
        }
      }
    );

    await OTP.deleteMany({ email });

    return res.json({
      success: true,
      message: "Password reset successfully!",
    });
  } catch (err) {
    console.error("Reset password via OTP error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to reset password: " + err.message,
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

// ================= REGISTER JOB USER (OTP SECURED) =================

export const registerJobUser = async (req, res) => {
  try {
    const email = req.body.email?.toLowerCase();
    const { name, password } = req.body;

    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    await User.create({
      name,
      email,
      password: hashed,
      role: "JOB_SEEKER",
      isVerified: false,
    });

    // generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    await OTP.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    console.log("Job Seeker Signup OTP:", otp);

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #1e293b;">
        <h2 style="color: #4f46e5;">Welcome to AMDOX Careers - Complete Signup</h2>
        <p>Hello ${name},</p>
        <p>Thank you for your application interest. Please enter the following 6-digit OTP code to verify your email:</p>
        <div style="background-color: #f1f5f9; padding: 15px; border-radius: 10px; display: inline-block; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #4f46e5;">
          ${otp}
        </div>
        <p style="margin-top: 15px; font-size: 11px; color: #64748b;">This OTP is valid for 10 minutes.</p>
      </div>
    `;

    await sendDirectEmail(email, "AMDOX Careers - Verify Your Email", htmlContent);

    return res.json({
      success: true,
      message: "OTP sent to email for verification",
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