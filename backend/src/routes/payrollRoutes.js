import express from "express";
import {
  generatePayroll,
  markPaid,
  getAllPayroll,
  getMyPayroll,
} from "../controllers/payrollController.js";

import { protect } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// HR/Admin
router.post("/generate", protect, authorizeRoles("HR", "ADMIN"), generatePayroll);
router.put("/pay", protect, authorizeRoles("HR", "ADMIN"), markPaid);
router.get("/", protect, authorizeRoles("HR", "ADMIN"), getAllPayroll);

// Employee
router.get("/my", protect, authorizeRoles("EMPLOYEE"), getMyPayroll);

export default router;