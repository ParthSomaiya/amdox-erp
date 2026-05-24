import express from "express";
import {
  checkIn,
  checkOut,
  getAllAttendance,
  getMyAttendance,
  biometricSync,
} from "../controllers/attendanceController.js";

// ✅ CORRECT IMPORTS
import { authMiddleware } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();


// 🧑 Employee
router.post(
  "/check-in",
  authMiddleware,
  allowRoles("EMPLOYEE"),
  checkIn
);

router.post(
  "/check-out",
  authMiddleware,
  allowRoles("EMPLOYEE"),
  checkOut
);

router.get(
  "/my",
  authMiddleware,
  allowRoles("EMPLOYEE"),
  getMyAttendance
);


// 👨‍💼 HR/Admin
router.get(
  "/",
  authMiddleware,
  allowRoles("HR", "ADMIN"),
  getAllAttendance
);

router.post(
  "/biometric-sync",
  biometricSync
);

export default router;