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
import "./cron/backupCron.js";

import { seedAdmin } from "./seed/adminSeeder.js";

// ================= ROUTES =================

import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import hrRoutes from "./routes/hrRoutes.js";
import leaveRoutes from "./routes/leaveRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import payrollRoutes from "./routes/payrollRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import financeRoutes from "./routes/financeRoutes.js";
import glRoutes from "./routes/glRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import vendorRoutes from "./routes/vendorRoutes.js";
import poRoutes from "./routes/poRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import sprintRoutes from "./routes/sprintRoutes.js";
import timeRoutes from "./routes/timeRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import lifecycleRoutes from "./routes/lifecycleRoutes.js";
import pdfRoutes from "./routes/pdfRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";
import smsRoutes from "./routes/smsRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import reconciliationRoutes from "./routes/reconciliationRoutes.js";
import exportRoutes from "./routes/exportRoutes.js";
import stockRoutes from "./routes/stockRoutes.js";
import apRoutes from "./routes/apRoutes.js";
import arRoutes from "./routes/arRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";

const app = express();

const server = http.createServer(app);

initSocket(server);

// ================= SECURITY =================

app.use(
  cors({
    origin: env.CLIENT_URL || "http://localhost:5173",
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

app.use("/api/employees", employeeRoutes);

app.use("/api/hr", hrRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/payroll", payrollRoutes);

app.use("/api/analytics", analyticsRoutes);

app.use("/api/finance", financeRoutes);
app.use("/api/gl", glRoutes);
app.use("/api/ap", apRoutes);
app.use("/api/ar", arRoutes);
app.use("/api/reconciliation", reconciliationRoutes);
app.use("/api/reports", reportRoutes);

app.use("/api/inventory", inventoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/purchase-orders", poRoutes);
app.use("/api/stock", stockRoutes);

app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/sprints", sprintRoutes);
app.use("/api/time", timeRoutes);

app.use("/api/notifications", notificationRoutes);
app.use("/api/chat", chatRoutes);

app.use("/api/lifecycle", lifecycleRoutes);

app.use("/api/pdf", pdfRoutes);
app.use("/api/export", exportRoutes);

app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);

app.use("/api/payment", paymentRoutes);
app.use("/api/subscriptions", subscriptionRoutes);

app.use("/api/sms", smsRoutes);

app.use("/api/ai", aiRoutes);

// ================= ROOT =================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "AMDOX ERP API Running",
  });
});

// ================= ERROR =================

app.use(errorMiddleware);

// ================= SERVER =================

const PORT = env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    console.log("✅ MongoDB Connected");

    await seedAdmin();

    console.log("✅ Admin Seeded");

    server.listen(PORT, () => {
      console.log(
        `🚀 Server Running On Port ${PORT}`
      );
    });

  } catch (error) {

    console.log("❌ Server Failed");

    console.log(error);

    process.exit(1);

  }
};

startServer();