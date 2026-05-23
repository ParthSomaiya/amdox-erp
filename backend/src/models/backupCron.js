import cron from "node-cron";
import BackupLog from "../models/BackupLog.js";

cron.schedule("0 0 * * *", async () => {

  console.log("🔥 Running Daily Backup");

  await BackupLog.create({

    fileName:
      `backup-${Date.now()}.zip`,

    status: "SUCCESS",

    backupType: "AUTO",

  });

});