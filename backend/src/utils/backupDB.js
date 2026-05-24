import { exec } from "child_process";

const backupDB = async () => {

  return new Promise(
    (resolve, reject) => {

      const date =
        new Date()
          .toISOString()
          .split("T")[0];

      const command = `mongodump --uri="${process.env.MONGO_URI}" --out=backups/${date}`;

      exec(
        command,
        (error, stdout, stderr) => {

          if (error) {

            console.log(
              "❌ Backup Error:",
              error.message
            );

            reject(error);

            return;

          }

          console.log(
            "✅ Database Backup Success"
          );

          resolve(stdout);

        }
      );

    }
  );

};

export default backupDB;