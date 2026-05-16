import express from "express";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

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

import { seedAdmin } from "./seed/adminSeeder.js";
import { Server } from "socket.io";
import { setSocket } from "./utils/notify.js";

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

const app = express();

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


// Test Route
app.get("/", (req, res) => {
  res.send("ERP API Running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});