import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import http from "http";

import connectDB from "./config/db.js";
import env from "./config/env.js";

import errorMiddleware from "./middleware/errorMiddleware.js";

import { initSocket } from "./socket/socket.js";

import "./workers/emailWorker.js";

import { seedAdmin } from "./seed/adminSeeder.js";

import "./cron/backupCron.js";

// ================= ROUTES =================

// AUTH
import authRoutes from "./routes/authRoutes.js";

// ADMIN
import adminRoutes from "./routes/adminRoutes.js";

// CORE
import dashboardRoutes from "./routes/dashboardRoutes.js";
import hrRoutes from "./routes/hrRoutes.js";
import leaveRoutes from "./routes/leaveRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import payrollRoutes from "./routes/payrollRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import pdfRoutes from "./routes/pdfRoutes.js";
import lifecycleRoutes from "./routes/lifecycleRoutes.js";

// FINANCE
import financeRoutes from "./routes/financeRoutes.js";
import glRoutes from "./routes/glRoutes.js";

// INVENTORY
import productRoutes from "./routes/productRoutes.js";
import vendorRoutes from "./routes/vendorRoutes.js";
import poRoutes from "./routes/poRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";

// PROJECT
import taskRoutes from "./routes/taskRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import sprintRoutes from "./routes/sprintRoutes.js";
import timeRoutes from "./routes/timeRoutes.js";

// PAYMENT
import paymentRoutes from "./routes/paymentRoutes.js";

// CHAT
import chatRoutes from "./routes/chatRoutes.js";

// JOB
import jobRoutes from "./routes/jobRoutes.js";

// SUBSCRIPTION
import subscriptionRoutes from "./routes/subscriptionRoutes.js";

// SMS
import smsRoutes from "./routes/smsRoutes.js";

// AI
import aiRoutes from "./routes/aiRoutes.js";

// ================= APP =================

const app = express();

// ================= SERVER =================

const server = http.createServer(app);

// ================= SOCKET =================

initSocket(server);

// ================= SECURITY =================

app.use(
  cors({
    origin: [
      "http://localhost:5173",
    ],
    credentials: true,
  })
);

app.use(helmet());

app.use(hpp());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    message: "Too many requests",
  })
);

// ================= LOGGER =================

app.use(morgan("dev"));

// ================= BODY PARSER =================

app.use(
  express.json({
    limit: "10mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

// ================= STATIC =================

app.use(
  "/uploads",
  express.static("uploads")
);

// ================= API ROUTES =================

// AUTH
app.use("/api/auth", authRoutes);

// ADMIN
app.use("/api/admin", adminRoutes);

// CORE
app.use("/api/dashboard", dashboardRoutes);

app.use("/api/hr", hrRoutes);

app.use("/api/leave", leaveRoutes);

app.use("/api/attendance", attendanceRoutes);

app.use("/api/payroll", payrollRoutes);

app.use(
  "/api/notifications",
  notificationRoutes
);

app.use("/api/analytics", analyticsRoutes);

app.use("/api/pdf", pdfRoutes);

app.use("/api/lifecycle", lifecycleRoutes);

// FINANCE
app.use("/api/finance", financeRoutes);

app.use("/api/gl", glRoutes);

// INVENTORY
app.use("/api/products", productRoutes);

app.use("/api/vendors", vendorRoutes);

app.use("/api/po", poRoutes);

app.use("/api/inventory", inventoryRoutes);

// PROJECT
app.use("/api/tasks", taskRoutes);

app.use("/api/projects", projectRoutes);

app.use("/api/sprint", sprintRoutes);

app.use("/api/time", timeRoutes);

// PAYMENT
app.use("/api/payment", paymentRoutes);

// CHAT
app.use("/api/chat", chatRoutes);

// JOB
app.use("/api/jobs", jobRoutes);

// SUBSCRIPTION
app.use(
  "/api/subscription",
  subscriptionRoutes
);

// SMS
app.use("/api/sms", smsRoutes);

// AI
app.use("/api/ai", aiRoutes);

// ================= ROOT =================

app.get("/", (req, res) => {

  res.status(200).json({

    success: true,

    message: "✅ AMDOX ERP API Running",

    version: "1.0.0",

  });

});

// ================= 404 =================

app.use("*", (req, res) => {

  res.status(404).json({

    success: false,

    message: "API Route Not Found",

  });

});

// ================= ERROR MIDDLEWARE =================

app.use(errorMiddleware);

// ================= PORT =================

const PORT =
  env.PORT ||
  process.env.PORT ||
  5000;

// ================= START SERVER =================

const startServer = async () => {

  try {

    // DATABASE
    await connectDB();

    console.log(
      "✅ MongoDB Connected"
    );

    // SEED ADMIN
    await seedAdmin();

    console.log(
      "✅ Admin Seeded"
    );

    // START SERVER
    server.listen(PORT, () => {

      console.log(`
========================================
🚀 AMDOX ERP SERVER STARTED
🌍 PORT : ${PORT}
========================================
      `);

    });

  } catch (error) {

    console.log(`
========================================
❌ SERVER FAILED
========================================
    `);

    console.log(error);

    process.exit(1);

  }

};

startServer();