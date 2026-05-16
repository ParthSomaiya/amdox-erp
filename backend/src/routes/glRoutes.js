import express from "express";
import { createEntry, getLedger } from "../controllers/glController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, allowRoles("FINANCE"), createEntry);
router.get("/", authMiddleware, allowRoles("FINANCE"), getLedger);

export default router;