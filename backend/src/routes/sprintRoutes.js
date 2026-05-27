import express from "express";

import {
  createSprint,
  getSprints,
} from "../controllers/sprintController.js";

const router = express.Router();

router.post("/", protect, createSprint);

router.get("/:projectId", protect, getSprints);

export default router;