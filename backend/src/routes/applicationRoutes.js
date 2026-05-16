import express from "express";
import { applyJob, getApplicants } from "../controllers/applicationController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/apply", authMiddleware, applyJob);
router.get("/", authMiddleware, getApplicants);

export default router;