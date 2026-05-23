import express from "express";

import {
  createSprint,
  getSprints,
} from "../controllers/sprintController.js";

const router = express.Router();

router.post(
  "/",
  createSprint
);

router.get(
  "/:projectId",
  getSprints
);

export default router;