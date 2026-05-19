import User from "../models/User.js";
import Company from "../models/Company.js";
import OTP from "../models/Otp.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { generateOTP, saveOTP } from "../services/otpService.js";
import Invite from "../models/Invite.js";
import crypto from "crypto";

import { sendEmail } from "../services/emailService.js";

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
export const registerUser = async (
  req,
  res
) => {

  try {

    const {
      name,
      email,
      password,
    } = req.body;

    // CHECK USER
    const exists =
      await User.findOne({ email });

    if (exists) {
      return res.status(400).json({
        message:
          "User already exists",
      });
    }

    // HASH PASSWORD
    const hashed =
      await bcrypt.hash(password, 10);

    // CREATE USER
    const user =
      await User.create({

        name,
        email,

        password:
          hashed,

        role:
          "EMPLOYEE",

      });

    // 🔥 SEND EMAIL
    await emailQueue.add(

      "sendEmail",

      {

        to: user.email,

        subject:
          "Welcome to Amdox ERP",

        html: `

      <h2>
        Welcome ${user.name}
      </h2>

      <p>
        Your account has been created successfully.
      </p>

    `,

      }

    );

    // TOKEN
    const token =
      jwt.sign(

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
      message:
        err.message,
    });

  }
};

// Login
export const loginUser =
  async (req, res) => {

    try {

      const {
        email,
        password
      } = req.body;

      const user =
        await User.findOne({
          email,
        });

      if (!user) {

        return res.status(404).json({
          message:
            "User not found",
        });

      }

      const isMatch =
        await bcrypt.compare(
          password,
          user.password
        );

      if (!isMatch) {

        return res.status(400).json({
          message:
            "Invalid credentials",
        });

      }

      const accessToken =
        jwt.sign(

          {
            id: user._id,
            role: user.role,
          },

          process.env.JWT_SECRET,

          {
            expiresIn: "15m",
          }

        );

      const refreshToken =
        jwt.sign(

          {
            id: user._id,
          },

          process.env.JWT_REFRESH_SECRET,

          {
            expiresIn: "7d",
          }

        );

      res.json({

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
        message:
          err.message,
      });

    }

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

export const refreshToken =
  async (req, res) => {

    try {

      const {
        refreshToken,
      } = req.body;

      if (!refreshToken) {

        return res.status(401).json({
          message:
            "No refresh token",
        });

      }

      // VERIFY
      const decoded =
        jwt.verify(

          refreshToken,
          process.env.JWT_SECRET
        );

      // USER
      const user =
        await User.findById(
          decoded.id
        );

      if (
        !user ||
        user.refreshToken !== refreshToken
      ) {

        return res.status(403).json({
          message:
            "Invalid refresh token",
        });

      }

      // NEW ACCESS TOKEN
      const newAccessToken =
        jwt.sign(

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
        accessToken:
          newAccessToken,
      });

    } catch (err) {

      res.status(403).json({
        message:
          "Token expired",
      });

    }
  };

export const forgotPassword =
  async (req, res) => {

    try {

      const { email } =
        req.body;

      // USER
      const user =
        await User.findOne({
          email,
        });

      if (!user) {

        return res.status(404).json({
          message:
            "User not found",
        });

      }

      // TOKEN
      const resetToken =
        crypto.randomBytes(32)
          .toString("hex");

      user.resetToken =
        resetToken;

      user.resetTokenExpiry =
        Date.now() + 3600000;

      await user.save();

      // RESET URL
      const resetUrl =

        `http://localhost:5173/reset-password/${resetToken}`;

      // SEND EMAIL
      await sendEmail({

        to:
          user.email,

        subject:
          "Password Reset",

        html: `

          <h2>
            Reset Password
          </h2>

          <p>
            Click below link:
          </p>

          <a href="${resetUrl}">
            Reset Password
          </a>

        `,

      });

      res.json({
        message:
          "Reset email sent",
      });

    } catch (err) {

      res.status(500).json({
        message:
          err.message,
      });

    }

  };

export const resetPassword =
  async (req, res) => {

    try {

      const {
        token,
        password,
      } = req.body;

      // USER
      const user =
        await User.findOne({

          resetToken:
            token,

          resetTokenExpiry:
            { $gt: Date.now() },

        });

      if (!user) {

        return res.status(400).json({
          message:
            "Invalid or expired token",
        });

      }

      // HASH
      const hashed =
        await bcrypt.hash(
          password,
          10
        );

      user.password =
        hashed;

      user.resetToken =
        undefined;

      user.resetTokenExpiry =
        undefined;

      await user.save();

      res.json({
        message:
          "Password reset successful",
      });

    } catch (err) {

      res.status(500).json({
        message:
          err.message,
      });

    }

  };