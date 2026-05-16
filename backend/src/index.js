import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import hrRoutes from "./routes/hrRoutes.js";
import leaveRoutes from "./routes/leaveRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import payrollRoutes from "./routes/payrollRoutes.js";

import { seedAdmin } from "./seed/adminSeeder.js";

seedAdmin();

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
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


// Test Route
app.get("/", (req, res) => {
  res.send("ERP API Running...");
});

// Server Start
app.listen(5000, () => {
  console.log("Server running on port 5000");
});