import express from "express";
import { createPO, receivePO, getPOs } from "../controllers/poController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createPO);
router.post("/receive", protect, receivePO);
router.get("/", protect, getPOs);

export default router;