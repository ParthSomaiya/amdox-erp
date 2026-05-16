import express from "express";
import { inviteEmployee } from "../controllers/employeeController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/invite", authMiddleware, inviteEmployee);

export default router;