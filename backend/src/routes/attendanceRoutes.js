import express from "express";
import {
  checkIn,
  checkOut,
  getAllAttendance,
  getMyAttendance,
} from "../controllers/attendanceController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Employee
router.post("/check-in", protect, authorizeRoles("EMPLOYEE"), checkIn);
router.post("/check-out", protect, authorizeRoles("EMPLOYEE"), checkOut);
router.get("/my", protect, authorizeRoles("EMPLOYEE"), getMyAttendance);

// HR/Admin
router.get("/", protect, authorizeRoles("HR", "ADMIN"), getAllAttendance);

export default router;