import express from "express";
import {
  sendOTP,
  verifyOTP,
  registerAdmin,
  registerUser,
  login,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/register-admin", registerAdmin);
router.post("/register-user", registerUser);
router.post("/login", login);

export default router;