import express from "express";
import { createEntry, getLedger } from "../controllers/glController.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, authorizeRoles("FINANCE", "ADMIN"), createEntry);
router.get("/", protect, authorizeRoles("FINANCE", "ADMIN"), getLedger);

export default router;