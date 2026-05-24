import express from "express";
import {
  applyLeave,
  getAllLeaves,
  updateLeaveStatus,
  getMyLeaves,
  getLeavePrediction,
} from "../controllers/leaveController.js";

// ✅ CORRECT IMPORTS
import { authMiddleware } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();


// 🧑 Employee apply leave
router.post(
  "/apply",
  authMiddleware,
  allowRoles("EMPLOYEE"),
  applyLeave
);


// 👤 Employee sees own leaves
router.get(
  "/my",
  authMiddleware,
  allowRoles("EMPLOYEE"),
  getMyLeaves
);


// 👨‍💼 HR/Admin approve/reject
router.post(
  "/update",
  authMiddleware,
  allowRoles("HR", "ADMIN"),
  updateLeaveStatus
);


// 👨‍💼 HR/Admin view all leaves
router.get(
  "/",
  authMiddleware,
  allowRoles("HR", "ADMIN"),
  getAllLeaves
);

router.get(
  "/prediction/:id",
  getLeavePrediction
);

export default router;