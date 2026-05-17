import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ ENV LOAD
dotenv.config({
  path: path.join(__dirname, "../../.env"),
});

console.log("CLIENT ID:", process.env.GOOGLE_CLIENT_ID);

// ✅ PASSPORT
import "./config/passport.js";

import cors from "cors";
import mongoose from "mongoose";
import http from "http";
import rateLimit from "express-rate-limit";
import { Server } from "socket.io";
import { setSocket } from "./utils/notify.js";

// 🔹 CORE ROUTES (OLD)
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import hrRoutes from "./routes/hrRoutes.js";
import leaveRoutes from "./routes/leaveRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import payrollRoutes from "./routes/payrollRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
// import analyticsRoutes from "./routes/analyticsRoutes.js";
import pdfRoutes from "./routes/pdfRoutes.js";
import lifecycleRoutes from "./routes/lifecycleRoutes.js";

// 🔹 FINANCE
import financeRoutes from "./routes/financeRoutes.js";
import reportRoutes from "./modules/finance/routes/reportRoutes.js";
import glRoutes from "./routes/glRoutes.js";

// 🔹 SUPPLY CHAIN
import productRoutes from "./routes/productRoutes.js";
import vendorRoutes from "./routes/vendorRoutes.js";
import poRoutes from "./routes/poRoutes.js";

// 🔹 PROJECT
import projectRoutes from "./modules/project/routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

// 🔹 JOB PORTAL
import jobRoutes from "./modules/jobs/routes/jobRoutes.js";
import applicationRoutes from "./modules/jobs/routes/applicationRoutes.js";

import adminRoutes from "./modules/admin/routes/adminRoutes.js";
import analyticsRoutesNew from "./modules/analytics/routes/analyticsRoutes.js";

import { startBackupJob } from "./modules/admin/services/backupService.js";

startBackupJob();

import { seedAdmin } from "./seed/adminSeeder.js";

seedAdmin();

const app = express();

// ✅ RATE LIMIT
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
}));

// SERVER
const server = http.createServer(app);

// SOCKET
const io = new Server(server, {
  cors: { origin: "*" },
});

setSocket(io);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  socket.on("join", (userId) => socket.join(userId));
});

// MIDDLEWARE
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

// DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

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
app.use("/api/analytics", analyticsRoutesNew);
app.use("/api", pdfRoutes);
app.use("/api/admin", adminRoutes);
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

// JOB PORTAL
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);

// STATIC
app.use("/uploads", express.static("uploads"));

app.use("/api/admin", adminRoutes);


// TEST
app.get("/", (req, res) => {
  res.send("ERP API Running...");
});

// START
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});