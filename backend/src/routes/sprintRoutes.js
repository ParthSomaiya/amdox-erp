// src/routes/sprintRoutes.js

import express from "express";

import {

  createSprint,
  getSprints,

} from "../controllers/sprintController.js";

import {

  protect,

} from "../middleware/authMiddleware.js";

const router = express.Router();

// ================= CREATE SPRINT =================

router.post(
  "/",
  protect,
  createSprint
);

// ================= GET SPRINTS =================

router.get(
  "/:projectId",
  protect,
  getSprints
);

export default router;