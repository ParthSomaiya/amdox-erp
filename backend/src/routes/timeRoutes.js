import express from "express";

import {
  logTime,
} from "../controllers/timeController.js";

import {
  protect,
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/log",
  protect,
  logTime
);

export default router;