import express from "express";
import { createEvent, getEvents, deleteEvent } from "../controllers/calendarController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createEvent);
router.get("/", protect, getEvents);
router.delete("/:id", protect, deleteEvent);

export default router;