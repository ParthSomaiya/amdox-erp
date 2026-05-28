import express from "express";
import {
  checkIn,
  checkOut,
  getAllAttendance,
  getMyAttendance,
  biometricSync,
} from "../controllers/attendanceController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

/* =========================================================
   🧑 EMPLOYEE ROUTES
========================================================= */

// 🔹 Check-in
router.post(
  "/check-in",
  authMiddleware,
  allowRoles("EMPLOYEE"),
  checkIn
);

// 🔹 Check-out
router.post(
  "/check-out",
  authMiddleware,
  allowRoles("EMPLOYEE"),
  checkOut
);

// 🔹 Get own attendance
router.get(
  "/my",
  authMiddleware,
  allowRoles("EMPLOYEE"),
  getMyAttendance
);

/* =========================================================
   👨‍💼 HR / ADMIN ROUTES
========================================================= */

// 🔹 Get all attendance records
router.get(
  "/",
  authMiddleware,
  allowRoles("HR", "ADMIN"),
  getAllAttendance
);

/* =========================================================
   🧬 BIOMETRIC SYNC (SECURED FIXED)
   ✔ FIX: now protected with auth + role
========================================================= */

router.post(
  "/biometric-sync",
  authMiddleware,
  allowRoles("ADMIN", "HR"),
  biometricSync
);

export default router;