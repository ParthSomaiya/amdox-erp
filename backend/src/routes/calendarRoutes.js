import express from "express";
import {
  createEvent,
  getEvents,
  updateEvent,
  deleteEvent,
} from "../controllers/calendarController.js";
import { protect } from "../middleware/authMiddleware.js"; // 🔹 સિક્યોરિટી પ્રોટેક્શન એક્ટિવ

const router = express.Router();

router.post("/", protect, createEvent);
router.get("/", protect, getEvents);
router.put("/:id", protect, updateEvent);
router.delete("/:id", protect, deleteEvent);

export default router;