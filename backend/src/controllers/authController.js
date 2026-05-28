import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import User from "../models/User.js";
import Company from "../models/Company.js";
import OTP from "../models/Otp.js";
import Invite from "../models/Invite.js";

import {
  generateOTP,
  saveOTP,
} from "../services/otpService.js";

import {
  sendEmail,
} from "../services/emailService.js";

// ======================================================
// GENERATE ACCESS TOKEN
// ======================================================

const generateAccessToken = (user) => {

  return jwt.sign(

    {
      id: user._id,
      role: user.role,
    },

    process.env.JWT_SECRET,

    {
      expiresIn: "7d",
    }

  );

};

// ======================================================
// GENERATE REFRESH TOKEN
// ======================================================

const generateRefreshToken = (user) => {

  return jwt.sign(

    {
      id: user._id,
    },

    process.env.JWT_REFRESH_SECRET,

    {
      expiresIn: "30d",
    }

  );

};

// ======================================================
// SEND OTP
// ======================================================

export const sendOTP = async (req, res) => {

  try {

    const {
      email,
      phone,
    } = req.body;

    if (!email && !phone) {

      return res.status(400).json({

        success: false,
        message: "Email or phone required",

      });

    }

    const otp = generateOTP();

    await saveOTP(
      email,
      phone,
      otp
    );

    console.log("OTP:", otp);

    res.status(200).json({

      success: true,
      message: "OTP sent successfully",

    });

  } catch (err) {

    console.log(err);

    res.status(500).json({

      success: false,
      message: err.message,

    });

  }

};

// ======================================================
// VERIFY OTP
// ======================================================

export const verifyOTP = async (req, res) => {

  try {

    const {
      email,
      otp,
    } = req.body;

    const record = await OTP.findOne({

      email,
      otp,

    });

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

    res.status(200).json({

      success: true,
      message: "OTP verified successfully",

    });

  } catch (err) {

    console.log(err);

    res.status(500).json({

      success: false,
      message: err.message,

    });

  }

};

// ======================================================
// REGISTER ADMIN
// ======================================================

export const registerAdmin = async (req, res) => {

  try {

    const {
      companyName,
      name,
      email,
      password,
    } = req.body;

    if (
      !companyName ||
      !name ||
      !email ||
      !password
    ) {

      return res.status(400).json({

        success: false,
        message: "All fields are required",

      });

    }

    const existingUser = await User.findOne({

      email: email.toLowerCase(),

    });

    if (existingUser) {

      return res.status(400).json({

        success: false,
        message: "User already exists",

      });

    }

    const company = await Company.create({

      name: companyName,
      email: email.toLowerCase(),

    });

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const verifyToken = crypto
      .randomBytes(32)
      .toString("hex");

    const user = await User.create({

      name,
      email: email.toLowerCase(),
      password: hashedPassword,

      role: "ADMIN",

      companyId: company._id,

      verificationToken: verifyToken,

      isVerified: true,

    });

    const accessToken =
      generateAccessToken(user);

    const refreshToken =
      generateRefreshToken(user);

    user.refreshToken =
      refreshToken;

    await user.save();

    res.status(201).json({

      success: true,

      accessToken,
      refreshToken,

      user: {

        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        companyId: user.companyId,

      },

    });

  } catch (err) {

    console.log(err);

    res.status(500).json({

      success: false,
      message: err.message,

    });

  }

};

// ======================================================
// REGISTER EMPLOYEE USER
// ======================================================

export const registerUser = async (req, res) => {

  try {

    const {
      name,
      email,
      password,
    } = req.body;

    if (
      !name ||
      !email ||
      !password
    ) {

      return res.status(400).json({

        success: false,
        message: "All fields are required",

      });

    }

    const existingUser = await User.findOne({

      email: email.toLowerCase(),

    });

    if (existingUser) {

      return res.status(400).json({

        success: false,
        message: "User already exists",

      });

    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const user = await User.create({

      name,

      email: email.toLowerCase(),

      password: hashedPassword,

      role: "EMPLOYEE",

      isVerified: true,

    });

    const accessToken =
      generateAccessToken(user);

    const refreshToken =
      generateRefreshToken(user);

    user.refreshToken =
      refreshToken;

    await user.save();

    res.status(201).json({

      success: true,

      accessToken,
      refreshToken,

      user: {

        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,

      },

    });

  } catch (err) {

    console.log(err);

    res.status(500).json({

      success: false,
      message: err.message,

    });

  }

};

// =========================================
// LOGIN USER
// =========================================

export const loginUser = async (req, res) => {

  try {

    const {
      email,
      password,
    } = req.body;

    // ================= VALIDATION =================

    if (!email || !password) {

      return res.status(400).json({

        success: false,

        message:
          "Email and password are required",

      });

    }

    // ================= FIND USER =================

    const user = await User.findOne({

      email: email.toLowerCase().trim(),

    });

    if (!user) {

      return res.status(401).json({

        success: false,

        message:
          "Invalid email or password",

      });

    }

    // ================= VERIFY EMAIL =================

    if (!user.isVerified) {

      return res.status(401).json({

        success: false,

        message:
          "Please verify your email first",

      });

    }

    // ================= CHECK PASSWORD =================

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {

      return res.status(401).json({

        success: false,

        message:
          "Invalid email or password",

      });

    }

    // ================= GENERATE TOKENS =================

    const accessToken =
      generateAccessToken(user);

    const refreshToken =
      generateRefreshToken(user);

    // ================= SAVE =================

    user.refreshToken =
      refreshToken;

    user.lastActive =
      new Date();

    await user.save();

    // ================= RESPONSE =================

    res.status(200).json({

      success: true,

      message:
        "Login successful",

      accessToken,

      refreshToken,

      user: {

        id:
          user._id,

        name:
          user.name,

        email:
          user.email,

        role:
          user.role,

        companyId:
          user.companyId,

      },

    });

  } catch (err) {

    console.log(
      "LOGIN ERROR:",
      err
    );

    res.status(500).json({

      success: false,

      message:
        "Server error during login",

    });

  }

};

// ======================================================
// REGISTER EMPLOYEE WITH INVITE
// ======================================================

export const registerEmployeeWithInvite = async (req, res) => {

  try {

    const {
      name,
      password,
    } = req.body;

    const {
      token,
    } = req.params;

    const invite = await Invite.findOne({

      token,

    });

    if (!invite) {

      return res.status(400).json({

        success: false,
        message: "Invalid invite token",

      });

    }

    const existingUser =
      await User.findOne({

        email: invite.email,

      });

    if (existingUser) {

      return res.status(400).json({

        success: false,
        message: "User already exists",

      });

    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    const user = await User.create({

      name,

      email: invite.email,

      password: hashedPassword,

      role: invite.role,

      companyId: invite.companyId,

      isVerified: true,

    });

    invite.status = "ACCEPTED";

    await invite.save();

    res.status(201).json({

      success: true,
      message: "Employee registered successfully",

      user,

    });

  } catch (err) {

    console.log(err);

    res.status(500).json({

      success: false,
      message: err.message,

    });

  }

};

// ======================================================
// REFRESH TOKEN
// ======================================================

export const refreshToken = async (req, res) => {

  try {

    const {
      refreshToken,
    } = req.body;

    if (!refreshToken) {

      return res.status(401).json({

        success: false,
        message: "Refresh token required",

      });

    }

    const decoded = jwt.verify(

      refreshToken,
      process.env.JWT_REFRESH_SECRET

    );

    const user = await User.findById(
      decoded.id
    );

    if (
      !user ||
      user.refreshToken !== refreshToken
    ) {

      return res.status(403).json({

        success: false,
        message: "Invalid refresh token",

      });

    }

    const newAccessToken =
      generateAccessToken(user);

    res.status(200).json({

      success: true,

      accessToken:
        newAccessToken,

    });

  } catch (err) {

    console.log(err);

    res.status(403).json({

      success: false,
      message: "Refresh token expired",

    });

  }

};

// ======================================================
// FORGOT PASSWORD
// ======================================================

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

    const resetToken = crypto
      .randomBytes(32)
      .toString("hex");

    user.resetToken =
      resetToken;

    user.resetTokenExpiry =
      Date.now() + 1000 * 60 * 60;

    await user.save();

    const resetUrl =

      `http://localhost:5173/reset-password/${resetToken}`;

    await sendEmail({

      to: user.email,

      subject: "Reset Password",

      html: `
        <h2>Password Reset</h2>

        <p>
          Click below link to reset password
        </p>

        <a href="${resetUrl}">
          Reset Password
        </a>
      `,

    });

    res.status(200).json({

      success: true,
      message: "Reset link sent successfully",

    });

  } catch (err) {

    console.log(err);

    res.status(500).json({

      success: false,
      message: err.message,

    });

  }

};

// ======================================================
// RESET PASSWORD
// ======================================================

export const resetPassword = async (req, res) => {

  try {

    const { password } = req.body;

    const { token } = req.params;

    const user = await User.findOne({

      resetToken: token,

      resetTokenExpiry: {
        $gt: Date.now(),
      },

    });

    if (!user) {

      return res.status(400).json({

        success: false,
        message: "Invalid or expired token",

      });

    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    user.password =
      hashedPassword;

    user.resetToken =
      undefined;

    user.resetTokenExpiry =
      undefined;

    await user.save();

    res.status(200).json({

      success: true,
      message: "Password reset successful",

    });

  } catch (err) {

    console.log(err);

    res.status(500).json({

      success: false,
      message: err.message,

    });

  }

};

// ======================================================
// REGISTER JOB USER
// ======================================================

export const registerJobUser = async (req, res) => {

  try {

    const {
      name,
      email,
      password,
    } = req.body;

    const existingUser =
      await User.findOne({

        email: email.toLowerCase(),

      });

    if (existingUser) {

      return res.status(400).json({

        success: false,
        message: "User already exists",

      });

    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    const user = await User.create({

      name,

      email: email.toLowerCase(),

      password: hashedPassword,

      role: "JOB_SEEKER",

      isVerified: true,

    });

    const accessToken =
      generateAccessToken(user);

    const refreshToken =
      generateRefreshToken(user);

    user.refreshToken =
      refreshToken;

    await user.save();

    res.status(201).json({

      success: true,

      accessToken,
      refreshToken,

      user: {

        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,

      },

    });

  } catch (err) {

    console.log(err);

    res.status(500).json({

      success: false,
      message: err.message,

    });

  }

};

// ======================================================
// VERIFY EMAIL
// ======================================================

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

    user.isVerified = true;

    user.verificationToken =
      undefined;

    await user.save();

    res.status(200).json({

      success: true,
      message: "Email verified successfully",

    });

  } catch (err) {

    console.log(err);

    res.status(500).json({

      success: false,
      message: err.message,

    });

  }

};