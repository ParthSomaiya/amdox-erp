import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import mongoose from "mongoose";
import http from "http";
import rateLimit from "express-rate-limit";
import { Server } from "socket.io";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import hpp from "hpp";

import "./workers/emailWorker.js";

// ================= CONFIG =================
import "./config/passport.js";
import { setSocket } from "./utils/notify.js";

// ================= ROUTES =================

// AUTH
import authRoutes from "./routes/authRoutes.js";

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
import reportRoutes from "./modules/finance/routes/reportRoutes.js";
import glRoutes from "./routes/glRoutes.js";

// SUPPLY CHAIN
import productRoutes from "./routes/productRoutes.js";
import vendorRoutes from "./routes/vendorRoutes.js";
import poRoutes from "./routes/poRoutes.js";

// PROJECT
import projectRoutes from "./modules/project/routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import budgetRoutes from "./modules/project/routes/budgetRoutes.js";

// JOBS
import jobRoutes from "./modules/jobs/routes/jobRoutes.js";
import applicationRoutes from "./modules/jobs/routes/applicationRoutes.js";

// ADMIN
import adminRoutes from "./modules/admin/routes/adminRoutes.js";

// ANALYTICS
import analyticsRoutesNew from "./modules/analytics/routes/analyticsRoutes.js";

import chatRoutes from "./modules/chat/routes/chatRoutes.js";

import calendarRoutes from "./modules/calendar/routes/calendarRoutes.js";


import { sanitizeInput } from "./middleware/sanitizeMiddleware.js";

// ================= SERVICES =================
import { startBackupJob } from "./modules/admin/services/backupService.js";
import { seedAdmin } from "./seed/adminSeeder.js";
import { seedPermissions } from "./modules/admin/services/permissionService.js";

// ================= ENV =================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.join(__dirname, "../../.env"),
});

// ================= APP =================
const app = express();

// ================= SERVER =================
const server = http.createServer(app);

// ================= SOCKET =================
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

setSocket(io);

io.on("connection", (socket) => {

  console.log(
    "User connected:",
    socket.id
  );

  // JOIN USER ROOM
  socket.on(

    "join",

    (userId) => {

      socket.join(userId);

    }

  );

  // JOIN CHAT ROOM
  socket.on(

    "joinRoom",

    (room) => {

      socket.join(room);

    }

  );

  // SEND MESSAGE
  socket.on(

    "sendMessage",

    async (data) => {

      io.to(data.room)
        .emit(
          "receiveMessage",
          data
        );

    }

  );

});

// ================= MIDDLEWARE =================

// RATE LIMIT
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

// CORS
app.use(cors({

  origin:
    "http://localhost:5173",

  credentials: true,

}));

// JSON
app.use(express.json({
  limit: "10mb",
}));

// 🔥 SECURITY HEADERS
app.use(helmet());

// 🔥 PREVENT NOSQL INJECTION
app.use(mongoSanitize());


// 🔥 PREVENT HTTP PARAM POLLUTION
app.use(hpp());

// STATIC FILES
app.use("/uploads", express.static("uploads"));

// ================= ROUTES =================

// AUTH
app.use("/api/auth", authRoutes);

// CORE
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/hr", hrRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/payroll", payrollRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api", analyticsRoutes);
app.use("/api", pdfRoutes);
app.use("/api/lifecycle", lifecycleRoutes);

// FINANCE
app.use("/api/finance", financeRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/gl", glRoutes);

// SUPPLY CHAIN
app.use("/api/products", productRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/po", poRoutes);

// PROJECT
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/budgets", budgetRoutes);

// JOBS
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);

// ADMIN
app.use("/api/admin", adminRoutes);

// ANALYTICS
app.use("/api/analytics", analyticsRoutesNew);

app.use("/api/chat", chatRoutes);

app.use("/api/calendar", calendarRoutes);

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("✅ ERP API Running...");
});

// ================= DATABASE + SERVER START =================

const PORT = process.env.PORT || 5000;

const connectDB = async () => {
  try {
    // CONNECT DATABASE
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected");

    // ================= SEEDERS =================
    await seedAdmin();
    console.log("✅ Admin Seeder Done");

    await seedPermissions();
    console.log("✅ Permission Seeder Done");

    // ================= BACKUP =================
    startBackupJob();

    // ================= START SERVER =================
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (err) {
    console.log("❌ DB Connection Error:");
    console.log(err.message);

    process.exit(1);
  }
};

// START APP
connectDB();