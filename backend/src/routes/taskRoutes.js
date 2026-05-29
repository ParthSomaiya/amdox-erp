import express from "express";
import {
  createTask,
  getTasks,
  updateTaskStatus,
  logHours,
} from "../controllers/taskController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createTask);
router.get("/", protect, getTasks);
router.put("/:id", protect, updateTaskStatus); 
router.post("/log-hours", protect, logHours);

export default router;