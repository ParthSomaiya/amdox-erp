import Notification from "../models/Notification.js";

export const sendNotification = async (userId, message) => {
  await Notification.create({
    userId,
    message,
  });
};