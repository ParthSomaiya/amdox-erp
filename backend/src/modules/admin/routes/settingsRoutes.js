import express from "express";
import {
  getSettings,
  updateSetting,
} from "../controllers/settingsController.js";

const router = express.Router();

router.get("/", getSettings);
router.post("/", updateSetting);

export default router;