import Notification from "../models/Notification.js";
import nodemailer from "nodemailer";

// ==============================
// CREATE NOTIFICATION (WITH LIVE SOCKET BROADCAST)
// ==============================
export const createNotification = async (req, res) => {
  try {
    const { userId, title, message, type, meta } = req.body;

    if (!userId || !title || !message) {
      return res.status(400).json({ message: "userId, title and message are required" });
    }

    const notification = await Notification.create({
      userId,
      title,
      message,
      type: type || "INFO",
      meta: meta || {},
    });

    // Retrieve global Socket.io instance to broadcast to the targeted user
    const io = req.app.get("io");
    if (io) {
      io.to(userId.toString()).emit("notification", notification);
      console.log(`Broadcasted real-time notification to user: ${userId}`);
    }

    res.status(201).json(notification);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ==============================
// GET USER NOTIFICATIONS
// ==============================
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ==============================
// MARK SINGLE READ
// ==============================
export const markRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ==============================
// MARK ALL READ
// ==============================
export const markAllRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { userId: req.user._id },
      { isRead: true }
    );

    res.json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ==============================
// DELETE NOTIFICATION
// ==============================
export const deleteNotification = async (req, res) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ==============================
// EMAIL NOTIFICATION
// ==============================
export const sendEmailNotification = async (req, res) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_EMAIL,
      to: req.body.email,
      subject: req.body.subject,
      text: req.body.message,
    });

    res.json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};