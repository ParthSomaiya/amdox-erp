import { exec } from "child_process";

export const backupDB = () => {
  const cmd = `mongodump --uri="${process.env.MONGO_URI}" --out=backup`;

  exec(cmd, (err) => {
    if (err) console.log("Backup failed");
    else console.log("Backup success");
  });
};