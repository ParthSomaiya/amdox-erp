import express from "express";
import { protect } from "../../../middleware/authMiddleware.js";
import tenantMiddleware from "../../../middleware/tenantMiddleware.js";
import { getTenants } from "../controllers/tenantController.js";

const router = express.Router();

router.post("/tenant", createTenant);
router.get("/", protect, tenantMiddleware, getTenants);

export default router;