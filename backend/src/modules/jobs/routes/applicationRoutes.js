import express from "express";
import upload from "../middleware/uploadResume.js";
import {
  applyJob,
  getApplicants,
  updateStatus
} from "../controllers/applicationController.js";

import { protect } from "../../../middleware/authMiddleware.js";

const router = express.Router();

router.post("/apply", protect, upload.single("resume"), applyJob);

router.get("/applicants", protect, getApplicants);

router.put("/:id/status", protect, updateStatus);

export default router;