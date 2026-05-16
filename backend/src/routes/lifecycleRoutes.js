import express from "express";
import {
  updateLifecycle,
  getLifecycle,
} from "../controllers/lifecycleController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  allowRoles("HR", "ADMIN"),
  updateLifecycle
);

router.get(
  "/",
  authMiddleware,
  allowRoles("HR", "ADMIN"),
  getLifecycle
);

export default router;