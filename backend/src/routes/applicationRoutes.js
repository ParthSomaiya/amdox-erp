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

// ✅ નવો યુઝર એપ્લાય કરે (Public)
router.post("/apply", upload.single("resume"), applyJob);

// ✅ એડમિન/HR તમામ અરજીઓ જોઈ શકે
router.get("/", authMiddleware, allowRoles("HR", "ADMIN"), getApplications);

// ✅ HR સ્ટેટસ અપડેટ કરે
router.put("/status", authMiddleware, allowRoles("HR"), updateStatus);

export default router;