import cron from "node-cron";
import Notification from "../models/Notification.js";

//

cron.schedule("0 9 * * *", async () => {
  await Notification.create({
    title: "Daily Reminder",
    message: "Check your dashboard today",
    type: "INFO",
  });

  console.log("Daily notification sent");
});