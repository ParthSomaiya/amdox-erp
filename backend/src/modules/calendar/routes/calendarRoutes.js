import express from "express";
import {
  createEvent,
  getEvents,
  deleteEvent,
} from "../controllers/calendarController.js";

const router = express.Router();

router.post("/", createEvent);
router.get("/", getEvents);
router.delete("/:id", deleteEvent);

export default router;