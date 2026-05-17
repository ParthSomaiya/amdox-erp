import cron from "node-cron";
import { exec } from "child_process";
import fs from "fs";
import path from "path";

// Backup folder
const backupDir = path.join("backups");

// Ensure folder exists
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir);
}

// ✅ MAIN FUNCTION
export const startBackupJob = () => {
  console.log("✅ Backup scheduler started...");

  // Daily at 2 AM
  cron.schedule("0 2 * * *", () => {
    const date = new Date().toISOString().split("T")[0];
    const folderName = `${backupDir}/backup-${date}`;

    const command = `mongodump --out ${folderName}`;

    exec(command, (err) => {
      if (err) {
        console.error("❌ Backup failed:", err.message);
      } else {
        console.log("✅ Backup completed:", folderName);
      }
    });
  });
};