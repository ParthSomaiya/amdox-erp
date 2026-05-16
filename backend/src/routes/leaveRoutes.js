import express from "express";
import {
  applyLeave,
  getAllLeaves,
  updateLeaveStatus,
  getMyLeaves,
} from "../controllers/leaveController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Employee
router.post("/apply", protect, authorizeRoles("EMPLOYEE"), applyLeave);
router.get("/my", protect, authorizeRoles("EMPLOYEE"), getMyLeaves);

// HR/Admin
router.get("/", protect, authorizeRoles("HR", "ADMIN"), getAllLeaves);
router.put("/status", protect, authorizeRoles("HR", "ADMIN"), updateLeaveStatus);

export default router;