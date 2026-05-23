import express from "express";

import {
  logTime,
} from "../controllers/timeController.js";

const router = express.Router();

router.post(
  "/log",
  logTime
);

export default router;