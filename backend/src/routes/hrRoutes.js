import express from "express";
import {
  addEmployee,
  getEmployees,
  applyLeave,
  updateLeaveStatus,
  getLeaves,
} from "../controllers/hrController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// Employee Management
router.post("/add", protect, authorizeRoles("ADMIN", "HR"), addEmployee);
router.get("/", protect, authorizeRoles("ADMIN", "HR"), getEmployees);

// Leave
router.post("/leave", protect, authorizeRoles("EMPLOYEE"), applyLeave);
router.get("/leave", protect, authorizeRoles("HR"), getLeaves);
router.put("/leave", protect, authorizeRoles("HR"), updateLeaveStatus);

export default router;