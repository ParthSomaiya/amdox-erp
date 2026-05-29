import express from "express";
import {
  createProject,
  getProjects,
  getProjectDetails,
  createTask,
  getTasks,
  updateTaskStatus,
  projectAnalytics,
  getGanttTasks,
} from "../controllers/projectController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createProject);
router.get("/", protect, getProjects);
router.get("/:id", protect, getProjectDetails);

// =========================
// TASK
// =========================
router.post("/task", protect, createTask);
router.get("/task/:projectId", protect, getTasks);
router.put("/task/:id", protect, updateTaskStatus);

// =========================
// ANALYTICS
// =========================
router.get("/analytics/dashboard", protect, projectAnalytics);
router.get("/gantt", getGanttTasks);

export default router;