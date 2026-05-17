import express from "express";
import {
  createProject,
  getProjectDashboard,
} from "../controllers/projectController.js";

import {
  createTask,
  getTasksByProject,
  updateTaskStatus,
  getTimeline,
} from "../controllers/taskController.js";

const router = express.Router();

// Project
router.post("/projects", createProject);
router.get("/projects/dashboard", getProjectDashboard);

// Tasks
router.post("/tasks", createTask);
router.get("/tasks/:projectId", getTasksByProject);
router.put("/tasks/:id", updateTaskStatus);

// Timeline
router.get("/timeline/:projectId", getTimeline);

export default router;