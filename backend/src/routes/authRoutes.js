import express from "express";
import passport from "../config/passport.js";
import jwt from "jsonwebtoken";

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
  registerJobUser,
  verifyEmail,
} from "../controllers/authController.js";

const router = express.Router();

/* ======================================================
   🔐 AUTH BASIC
====================================================== */

// OTP
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);

// EMAIL VERIFY
router.get("/verify-email/:token", verifyEmail);


/* ======================================================
   🧑 REGISTER ROUTES
====================================================== */

// ADMIN REGISTER
router.post("/register-admin", registerAdmin);

// NORMAL USER REGISTER
router.post("/register-user", registerUser);

// JOB SEEKER REGISTER
router.post("/register-job", registerJobUser);

// INVITE REGISTER (EMPLOYEE)
router.post("/register-invite/:token", registerEmployeeWithInvite);


/* ======================================================
   🔑 LOGIN / AUTH
====================================================== */

router.post("/login", loginUser);
router.post("/refresh", refreshToken);


/* ======================================================
   🔁 PASSWORD RESET
====================================================== */

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);


/* ======================================================
   🌐 GOOGLE OAUTH
====================================================== */

// Google Login
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Google Callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    try {
      const token = jwt.sign(
        {
          id: req.user._id,
          role: req.user.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      res.redirect(
        `http://localhost:5173/login-success?token=${token}`
      );
    } catch (err) {
      console.error("Google auth error:", err);
      res.redirect(`http://localhost:5173/login?error=auth_failed`);
    }
  }
);

export default router;