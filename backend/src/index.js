import dotenv from "dotenv";

dotenv.config();

import http from "http";

import app from "./app.js";

import connectDB from "./config/db.js";

import env from "./config/env.js";

import { initSocket } from "./socket/socket.js";

import "./workers/emailWorker.js";

import "./cron/backupCron.js";

import { seedAdmin } from "./seed/adminSeeder.js";

const PORT =
  env.PORT || 5000;

const startServer = async () => {

  try {

    await connectDB();

    console.log(
      "✅ MongoDB Connected"
    );

    await seedAdmin();

    console.log(
      "✅ Admin Seeded"
    );

    const server =
      http.createServer(app);

    initSocket(server);

    server.listen(PORT, () => {

      console.log(
        `🚀 Server Running On Port ${PORT}`
      );

    });

  } catch (error) {

    console.log(
      "❌ Server Failed"
    );

    console.log(error);

    process.exit(1);

  }

};

startServer();