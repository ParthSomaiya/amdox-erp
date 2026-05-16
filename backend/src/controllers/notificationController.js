import Notification from "../models/Notification.js";

// GET all notifications
export const getNotifications = async (req, res) => {
  try {
    const data = await Notification.find({
      userId: req.user.id,
    }).sort({ createdAt: -1 });

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error fetching notifications" });
  }
};

// MARK as read
export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    await Notification.findByIdAndUpdate(id, {
      isRead: true,
    });

    res.json({ message: "Marked as read" });
  } catch (err) {
    res.status(500).json({ message: "Error updating notification" });
  }
};