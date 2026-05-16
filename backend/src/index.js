import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// ✅ ES module __dirname fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ LOAD ENV FIRST (MOST IMPORTANT)
dotenv.config({
  path: path.join(__dirname, "../../.env"), // 👈 ROOT .env
});

// 🔍 DEBUG
console.log("CLIENT ID:", process.env.GOOGLE_CLIENT_ID);

import cors from "cors";
import mongoose from "mongoose";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import hrRoutes from "./routes/hrRoutes.js";
import leaveRoutes from "./routes/leaveRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import payrollRoutes from "./routes/payrollRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import pdfRoutes from "./routes/pdfRoutes.js";
import financeRoutes from "./routes/financeRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import lifecycleRoutes from "./routes/lifecycleRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import glRoutes from "./routes/glRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import vendorRoutes from "./routes/vendorRoutes.js";
import poRoutes from "./routes/poRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

import { seedAdmin } from "./seed/adminSeeder.js";
import { Server } from "socket.io";
import { setSocket } from "./utils/notify.js";

// app
const app = express();

// limiter
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
}));

// server
const server = http.createServer(app);

app.use(limiter);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

setSocket(io);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // join user room
  socket.on("join", (userId) => {
    socket.join(userId);
  });
});

seedAdmin();

dotenv.config();


// Middlewares
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));


app.use(express.json());

// ✅ Database Connection (ADD THIS)
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));


// ✅ Routes (PLACE HERE)
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/hr", hrRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/payroll", payrollRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api", analyticsRoutes);
app.use("/api", pdfRoutes);
app.use("/api/finance", financeRoutes);
app.use("/api/admin", adminRoutes);
app.use("/uploads", express.static("uploads"));
app.use("/api/reports", reportRoutes);
app.use("/api/lifecycle", lifecycleRoutes);
app.use("/api/jobs", applicationRoutes);
app.use("/api/gl", glRoutes);
app.use("/api/products", productRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/po", poRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);



// Test Route
app.get("/", (req, res) => {
  res.send("ERP API Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});