import Notification from "../models/Notification.js";

let ioInstance = null;

// attach socket
export const setSocket = (io) => {
  ioInstance = io;
};

// send notification
export const sendNotification = async (
  userId,
  message,
  type = "SYSTEM",
  companyId
) => {
  // 1. Save in DB
  const notification = await Notification.create({
    userId,
    companyId,
    message,
    type,
  });

  // 2. Real-time emit
  if (ioInstance) {
    ioInstance.to(userId.toString()).emit("notification", notification);
  }

  return notification;
};