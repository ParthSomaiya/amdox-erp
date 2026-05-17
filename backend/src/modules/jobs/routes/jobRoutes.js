import express from "express";
import {
  getPublicJobs,
  getCompanyJobs,
  createJob,
  getJobs 
} from "../controllers/jobController.js";
import { protect } from "../../../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.get("/public", getPublicJobs);

// Company career page
router.get("/company/:companyId", getCompanyJobs);

// Admin create job
router.post("/", protect, createJob);
router.get("/", getJobs);

export default router;