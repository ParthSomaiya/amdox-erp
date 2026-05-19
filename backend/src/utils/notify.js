import Notification from "../models/Notification.js";

let io;

export const setSocket = (socketIo) => {
  io = socketIo;
};

export const sendNotification = async ({
  userId,
  title,
  message,
  type = "INFO",
}) => {

  // save in DB
  const notification =
    await Notification.create({
      userId,
      title,
      message,
      type,
    });

  // realtime emit
  io.to(userId.toString()).emit(
    "new_notification",
    notification
  );
};