import express from "express";
import {
  applyJob,
  getApplications,
  updateStatus,
} from "../controllers/applicationController.js";

import upload from "../middleware/uploadMiddleware.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// ✅ Job apply (public)
router.post("/apply", upload.single("resume"), applyJob);

// ✅ HR/Admin view
router.get(
  "/",
  authMiddleware,
  allowRoles("HR", "ADMIN"),
  getApplications
);

// ✅ HR update status
router.put(
  "/status",
  authMiddleware,
  allowRoles("HR"),
  updateStatus
);

export default router;