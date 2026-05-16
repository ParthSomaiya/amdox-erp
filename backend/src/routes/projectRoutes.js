import express from "express";
import {
  createProject,
  getProjects,
  getProjectDetails,
} from "../controllers/projectController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createProject);
router.get("/", protect, getProjects);
router.get("/:id", protect, getProjectDetails);

export default router;