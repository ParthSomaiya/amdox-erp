import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import helmet from "helmet";
import hpp from "hpp";
import rateLimit from "express-rate-limit";

dotenv.config();

import connectDB from "./config/db.js";
import env from "./config/env.js";

import errorMiddleware from "./middleware/errorMiddleware.js";

import { initSocket } from "./socket/socket.js";

import "./workers/emailWorker.js";

import { seedAdmin } from "./seed/adminSeeder.js";

// ROUTES
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import hrRoutes from "./routes/hrRoutes.js";
import leaveRoutes from "./routes/leaveRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import payrollRoutes from "./routes/payrollRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import pdfRoutes from "./routes/pdfRoutes.js";
import lifecycleRoutes from "./routes/lifecycleRoutes.js";
import financeRoutes from "./routes/financeRoutes.js";
import glRoutes from "./routes/glRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import vendorRoutes from "./routes/vendorRoutes.js";
import poRoutes from "./routes/poRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import sprintRoutes from "./routes/sprintRoutes.js";
import timeRoutes from "./routes/timeRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import smsRoutes from "./routes/smsRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

import "./cron/backupCron.js";

const app = express();

const server = http.createServer(app);

initSocket(server);

// ================= SECURITY =================

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(helmet());

app.use(hpp());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

// ================= BODY =================

app.use(
  express.json({
    limit: "10mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
  })
);

// ================= STATIC =================

app.use(
  "/uploads",
  express.static("uploads")
);

// ================= ROUTES =================

app.use("/api/auth", authRoutes);

app.use("/api/admin", adminRoutes);

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

app.use("/api/finance", financeRoutes);

app.use("/api/gl", glRoutes);

app.use("/api/products", productRoutes);

app.use("/api/vendors", vendorRoutes);

app.use("/api/po", poRoutes);

app.use("/api/inventory", inventoryRoutes);

app.use("/api/tasks", taskRoutes);

app.use("/api/projects", projectRoutes);

app.use("/api/sprint", sprintRoutes);

app.use("/api/time", timeRoutes);

app.use("/api/payment", paymentRoutes);

app.use("/api/chat", chatRoutes);

app.use("/api/jobs", jobRoutes);

app.use(
  "/api/subscription",
  subscriptionRoutes
);

app.use("/api/sms", smsRoutes);

app.use("/api/ai", aiRoutes);

// ================= ROOT =================

app.get("/", (req, res) => {

  res.status(200).json({
    success: true,
    message:
      "AMDOX ERP API Running",
  });

});

// ================= ERROR =================

app.use(errorMiddleware);

// ================= SERVER =================

const PORT =
  process.env.PORT || 5000;

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

  }

};

startServer();