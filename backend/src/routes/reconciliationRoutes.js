import express from "express";
import { reconcile } from "../controllers/reconciliationController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, reconcile);

export default router;