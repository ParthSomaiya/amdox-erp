import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import helmet from "helmet";
import hpp from "hpp";
import rateLimit from "express-rate-limit";

// ================= CONFIG =================
dotenv.config();

import connectDB from "./config/db.js";
import env from "./config/env.js";

// ================= MIDDLEWARE =================
import errorMiddleware from "./middleware/errorMiddleware.js";

// ================= SOCKET =================
import { initSocket } from "./socket/socket.js";

// ================= WORKERS =================
import "./workers/emailWorker.js";

// ================= SEEDERS =================
import { seedAdmin } from "./seed/adminSeeder.js";

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

// AI
import aiRoutes from "./ai/aiRoutes.js";

// ================= APP =================
const app = express();

// ================= SERVER =================
const server = http.createServer(app);

// ================= SOCKET INIT =================
const io = initSocket(server);

// ================= DATABASE =================
await connectDB();

console.log("✅ MongoDB Connected");

// ================= SECURITY =================

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

app.use(helmet());

app.use(hpp());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// ================= BODY PARSER =================

app.use(
  express.json({
    limit: "10mb",
  })
);

// ================= STATIC =================

app.use(
  "/uploads",
  express.static("uploads")
);

// ================= ROUTES =================

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
app.use("/api/notifications", notificationRoutes);
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
app.use("/api/subscription", subscriptionRoutes);

// AI
app.use("/api/ai", aiRoutes);

// ================= ROOT =================

app.get("/", (req, res) => {

  res.json({
    success: true,
    message: "✅ AMDOX ERP API Running",
  });

});

// ================= ERROR MIDDLEWARE =================

app.use(errorMiddleware);

// ================= START SERVER =================

const PORT = env.PORT || process.env.PORT || 5000;

const startServer = async () => {

  try {

    // ADMIN SEED
    await seedAdmin();

    console.log("✅ Admin Seeded");

    // START SERVER
    server.listen(PORT, () => {

      console.log(
        `🚀 Server running on port ${PORT}`
      );

    });

  } catch (err) {

    console.log("❌ Server Error");

    console.log(err.message);

  }

};

startServer();