import cron from "node-cron";
import fs from "fs";

export const startBackupJob = () => {
  cron.schedule("0 2 * * *", async () => {
    console.log("Running backup...");

    // simple example (replace with mongodump in prod)
    fs.writeFileSync(
      `backup-${Date.now()}.json`,
      JSON.stringify({ msg: "backup" })
    );
  });
};  