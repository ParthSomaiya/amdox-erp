import express
from "express";

import {
  applyJob,
  getApplicants,
  updateStatus,
}
from "../controllers/applicationController.js";

import {
  authMiddleware,
}
from "../../../middleware/authMiddleware.js";

import upload
from "../../../middleware/uploadMiddleware.js";

const router =
  express.Router();

// APPLY JOB
router.post(

  "/apply",

  authMiddleware,

  upload.single("resume"),

  applyJob

);

// GET APPLICANTS
router.get(

  "/applicants",

  authMiddleware,

  getApplicants

);

// UPDATE STATUS
router.put(

  "/:id/status",

  authMiddleware,

  updateStatus

);

export default router;