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

// ================= SEND OTP =================

export const sendOTP = async (req, res) => {

  try {

    const { email, phone } = req.body;

    const otp = generateOTP();

    await saveOTP(
      email,
      phone,
      otp
    );

    console.log("OTP:", otp);

    res.json({
      message: "OTP sent",
    });

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }

};

// ================= VERIFY OTP =================

export const verifyOTP = async (req, res) => {

  try {

    const { email, otp } = req.body;

    const record = await OTP.findOne({
      email,
      otp,
    });

    if (!record) {

      return res.status(400).json({
        message: "Invalid OTP",
      });

    }

    if (record.expiresAt < new Date()) {

      return res.status(400).json({
        message: "OTP expired",
      });

    }

    res.json({
      message: "OTP verified",
    });

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }

};

// ================= REGISTER ADMIN =================

export const registerAdmin = async (req, res) => {

  try {

    const {
      companyName,
      name,
      email,
      password,
    } = req.body;

    // =========================
    // CHECK EXISTING USER
    // =========================

    const exists = await User.findOne({
      email,
    });

    if (exists) {

      return res.status(400).json({
        message: "User already exists",
      });

    }

    // =========================
    // CREATE COMPANY
    // =========================

    const company = await Company.create({

      name: companyName,
      email,

    });

    // =========================
    // HASH PASSWORD
    // =========================

    const hashedPassword =
      await bcrypt.hash(password, 10);

    // =========================
    // EMAIL VERIFY TOKEN
    // =========================

    const verifyToken =
      crypto.randomBytes(32).toString("hex");

    // =========================
    // CREATE ADMIN USER
    // =========================

    const user = await User.create({

      name,
      email,

      password:
        hashedPassword,

      role:
        "ADMIN",

      companyId:
        company._id,

      verificationToken:
        verifyToken,

      isVerified:
        false,

    });

    // =========================
    // VERIFY EMAIL URL
    // =========================

    const verifyUrl =

      `http://localhost:5173/verify-email/${verifyToken}`;

    // =========================
    // SEND EMAIL
    // =========================

    await sendEmail({

      to: email,

      subject: "Verify Your Admin Account",

      html: `

        <h2>Welcome to AMDOX ERP</h2>

        <p>
          Click below to verify your account
        </p>

        <a href="${verifyUrl}">
          Verify Account
        </a>

      `,

    });

    // =========================
    // JWT TOKEN
    // =========================

    const token = jwt.sign(

      {
        id: user._id,
        role: user.role,
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "7d",
      }

    );

    // =========================
    // RESPONSE
    // =========================

    res.status(201).json({

      message:
        "Admin registered. Verification email sent.",

      token,

      user,

    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: err.message,
    });

  }

};

// ================= REGISTER USER =================

export const registerUser = async (req, res) => {

  try {

    const {
      name,
      email,
      password,
    } = req.body;

    // CHECK USER
    const exists = await User.findOne({
      email,
    });

    if (exists) {

      return res.status(400).json({
        message: "User already exists",
      });

    }

    // HASH PASSWORD
    const hashedPassword =
      await bcrypt.hash(password, 10);

    const verifyToken =
      crypto.randomBytes(32).toString("hex");

    // CREATE USER
    const user = await User.create({

      name,
      email,

      password:
        hashedPassword,

      role:
        "EMPLOYEE",

      verificationToken:
        verifyToken,

      isVerified:
        false,

    });

    // TOKEN
    const token = jwt.sign(


      {
        id: user._id,
        role: user.role,
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "7d",
      }

    );

    res.status(201).json({

      token,

      user,

    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: err.message,
    });

  }

};

// ================= LOGIN =================

export const loginUser = async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await User.findOne({
      email,
    }).select("+password");

    if (!user) {

      return res.status(404).json({
        message: "User not found",
      });

    }

    if (!user.isActive) {

      return res.status(403).json({
        message: "Account disabled",
      });

    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {

      return res.status(400).json({
        message: "Invalid credentials",
      });

    }

    const accessToken = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    const refreshToken = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: "30d",
      }
    );

    user.refreshToken = refreshToken;

    await user.save();

    res.json({

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
      message: err.message,
    });

  }

};

// ================= REGISTER EMPLOYEE WITH INVITE =================

export const registerEmployeeWithInvite = async (req, res) => {

  try {

    const { name } = req.body;
    const { password } = req.body;

    const { token } = req.params;

    const invite = await Invite.findOne({
      token,
    });

    if (!invite) {

      return res.status(400).json({
        message: "Invalid invite",
      });

    }

    if (invite.status === "ACCEPTED") {

      return res.status(400).json({
        message: "Invite already used",
      });

    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user = await User.create({

      name,

      email:
        invite.email,

      password:
        hashedPassword,

      role:
        invite.role,

      companyId:
        invite.companyId,

    });

    invite.status = "ACCEPTED";

    await invite.save();

    res.json({

      message: "Account created",

      user,

    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: err.message,
    });

  }

};

// ================= REFRESH TOKEN =================

export const refreshToken = async (req, res) => {

  try {

    const { refreshToken } = req.body;

    if (!refreshToken) {

      return res.status(401).json({
        message: "No refresh token",
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
        message: "Invalid refresh token",
      });

    }

    const accessToken = jwt.sign(

      {
        id: user._id,
        role: user.role,
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "15m",
      }

    );

    res.json({
      accessToken,
    });

  } catch (err) {

    res.status(403).json({
      message: "Token expired",
    });

  }

};

// ================= FORGOT PASSWORD =================

export const forgotPassword = async (req, res) => {

  try {

    const { email } = req.body;

    const user = await User.findOne({
      email,
    });

    if (!user) {

      return res.status(404).json({
        message: "User not found",
      });

    }

    // =========================
    // EMAIL VERIFY CHECK
    // =========================

    if (
      user.isVerified === false
    ) {

      return res.status(401).json({
        message: "Please verify your email",
      });

    }

    // PASSWORD CHECK
    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    const resetToken =
      crypto.randomBytes(32).toString("hex");

    user.resetToken = resetToken;

    user.resetTokenExpiry =
      Date.now() + 3600000;

    await user.save();

    const resetUrl =

      `http://localhost:5173/reset-password/${resetToken}`;

    await sendEmail({

      to: user.email,

      subject: "Password Reset",

      html: `

        <h2>Reset Password</h2>

        <a href="${resetUrl}">
          Reset Password
        </a>

      `,

    });

    res.json({
      message: "Reset email sent",
    });

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }

};

// ================= RESET PASSWORD =================

export const resetPassword = async (req, res) => {

  try {

    const {
      token,
      password,
    } = req.body;

    const user = await User.findOne({

      resetToken: token,

      resetTokenExpiry: {
        $gt: Date.now(),
      },

    });

    if (!user) {

      return res.status(400).json({
        message: "Invalid or expired token",
      });

    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    user.password = hashedPassword;

    user.resetToken = undefined;

    user.resetTokenExpiry = undefined;

    await user.save();

    res.json({
      message: "Password reset successful",
    });

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }

};

export const registerJobUser = async (req, res) => {

  try {

    const {
      name,
      email,
      password,
    } = req.body;

    // CHECK EXISTING USER
    const exists = await User.findOne({
      email,
    });

    if (exists) {

      return res.status(400).json({
        message: "User already exists",
      });

    }

    // HASH PASSWORD
    const hashedPassword =
      await bcrypt.hash(password, 10);

    // CREATE USER
    const user = await User.create({

      name,

      email,

      password: hashedPassword,

      role: "JOB_SEEKER",

    });

    // TOKEN
    const token = jwt.sign(

      {
        id: user._id,
        role: user.role,
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "7d",
      }

    );

    res.status(201).json({

      message: "Job seeker registered",

      token,

      user,

    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
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
        message: "Invalid verification token",
      });

    }

    user.isVerified = true;

    user.verificationToken = undefined;

    await user.save();

    res.json({
      message: "Email verified successfully",
    });

  } catch (err) {

    res.status(500).json({
      message: err.message,
    });

  }

};