import express from "express";
import { getReceivables } from "../controllers/arController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getReceivables);

export default router;