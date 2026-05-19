import { notificationQueue } from "../queues/notificationQueue.js";
import { sendSocketNotification } from "../utils/notify.js";

notificationQueue.process(async (job) => {
  const { userId, title, message } = job.data;

  // realtime socket send
  sendSocketNotification(userId, {
    title,
    message,
  });

  return true;
});