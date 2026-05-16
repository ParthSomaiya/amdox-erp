import express from "express";
import Notification from "../models/Notification.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get notifications
router.get("/", protect, async (req, res) => {
  const data = await Notification.find({
    userId: req.user.id,
  }).sort({ createdAt: -1 });

  res.json(data);
});

// Mark as read
router.put("/read", protect, async (req, res) => {
  const { id } = req.body;

  await Notification.findByIdAndUpdate(id, { isRead: true });

  res.json({ message: "Read" });
});

export default router;