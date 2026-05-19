import express from "express";
import { manualBackup } from "../controllers/backupController.js";

const router = express.Router();

router.post("/", manualBackup);

export default router;