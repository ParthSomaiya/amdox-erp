import express from "express";

import {
  authorize,
} from "../middleware/authMiddleware.js";

const router = express.Router();

import {

  createJob,
  getJobs,

  applyJob,

  getApplicants,

  updateApplicantStatus,

} from "../controllers/jobController.js";

import upload
from "../config/multer.js";

import { authMiddleware } from "../middleware/authMiddleware.js";


// =========================
// JOBS
// =========================

router.post(
  "/",
  authorize,
  createJob
);

router.get(
  "/",
  getJobs
);


// =========================
// APPLY
// =========================

router.post(
  "/apply/:jobId",

  upload.single(
    "resume"
  ),

  applyJob
);


// =========================
// APPLICANTS
// =========================

router.get(
  "/applicants",
  authMiddleware,
  getApplicants
);

router.put(
  "/applicant/:id",
  authMiddleware,
  updateApplicantStatus
);

router.post(
  "/interview",
  authMiddleware,
  async (req, res) => {

    res.json({
      message: "Interview Scheduled",
      data: req.body,
    });

  }
);

export default router;