import express from "express";

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

import {
  protect,
} from "../middleware/authMiddleware.js";


// =========================
// JOBS
// =========================

router.post(
  "/",
  protect,
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
  protect,
  getApplicants
);

router.put(
  "/applicant/:id",
  protect,
  updateApplicantStatus
);

export default router;