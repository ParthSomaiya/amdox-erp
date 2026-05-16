import express from "express";
import { createBill, payBill, getBills } from "../controllers/apController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createBill);
router.put("/pay", authMiddleware, payBill);
router.get("/", authMiddleware, getBills);

export default router;