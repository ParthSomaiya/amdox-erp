import cron from "node-cron";

import backupDB from "../utils/backupDB.js";

// ================= DAILY BACKUP =================

// EVERY DAY AT 2:00 AM

cron.schedule(
  "0 2 * * *",
  async () => {

    try {

      console.log(
        "📦 Running Database Backup..."
      );

      await backupDB();

      console.log(
        "✅ Backup Completed"
      );

    } catch (err) {

      console.log(
        "❌ Backup Failed:"
      );

      console.log(
        err.message
      );

    }

  }
);