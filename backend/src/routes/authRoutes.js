import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import passport from "../config/passport.js";

import Otp from "../models/Otp.js";
import User from "../models/User.js";

import {

  sendOTP,
  verifyOTP,

  registerAdmin,
  registerUser,

  loginUser,

  refreshToken,

  forgotPassword,
  resetPassword,

  registerEmployeeWithInvite,

} from "../controllers/authController.js";

const router = express.Router();

// ================= OTP SEND =================

router.post(
  "/send-otp",
  sendOTP
);

// ================= OTP VERIFY =================

router.post(
  "/verify-otp",
  verifyOTP
);

// ================= REGISTER ADMIN =================

router.post(
  "/register-admin",
  registerAdmin
);

// ================= REGISTER USER =================

router.post(
  "/register-user",
  registerUser
);

// ================= LOGIN =================

router.post(
  "/login",
  loginUser
);

// ================= REGISTER INVITE =================

router.post(
  "/register-invite",
  registerEmployeeWithInvite
);

// ================= FORGOT PASSWORD =================

router.post(
  "/forgot-password",
  forgotPassword
);

// ================= RESET PASSWORD =================

router.post(
  "/reset-password",
  resetPassword
);

// ================= REFRESH TOKEN =================

router.post(
  "/refresh",
  refreshToken
);

// ================= GOOGLE LOGIN =================

router.get(

  "/google",

  passport.authenticate(

    "google",

    {
      scope: ["profile", "email"],
    }

  )

);

// ================= GOOGLE CALLBACK =================

router.get(

  "/google/callback",

  passport.authenticate(

    "google",

    {
      session: false,
    }

  ),

  (req, res) => {

    const token = jwt.sign(

      {
        id: req.user._id,
      },

      process.env.JWT_SECRET

    );

    res.redirect(

      `http://localhost:5173/login-success?token=${token}`

    );

  }

);

export default router;