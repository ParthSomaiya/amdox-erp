import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import path from "path";
import mongoose from "mongoose"; 
import express from "express";

import errorMiddleware from "./middleware/errorMiddleware.js";

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
import calendarRoutes from "./routes/calendarRoutes.js"; 
import { getPurchaseOrders } from "./controllers/inventoryController.js";
import { receivePurchaseOrder } from "./controllers/inventoryController.js";
import hrRouter from "./routes/hr.js"; 
import jobRouter from "./routes/jobRoutes.js"; 
import applicationRouter from "./routes/applicationRoutes.js";

.0

// ================= APP INIT =================
const app = express();



// =====================================
// 👥 VENDORS REGISTRY PUBLIC ROUTES (FINAL AND RESOLVED)
// =====================================
app.get("/api/vendor", async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  try {
    const Vendor = mongoose.models.Vendor || mongoose.model("Vendor", new mongoose.Schema({
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String }
    }, { timestamps: true }));

    const list = await Vendor.find({}).sort({ createdAt: -1 });
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 🔹 અહીં આપણે 'express.json()' ને લોકલ મિડલવેર તરીકે પાસ કરેલ છે જેથી બોડી ક્યારેય 'undefined' ન થાય!
app.post("/api/vendor", express.json(), async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  try {
    const { name, email, phone } = req.body;
    if (!name || !email) {
      return res.status(400).json({ success: false, message: "Name and email are required" });
    }

    const Vendor = mongoose.models.Vendor || mongoose.model("Vendor", new mongoose.Schema({
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String }
    }, { timestamps: true }));

    const newVendor = new Vendor({ name, email, phone });
    await newVendor.save();
    res.status(201).json({ success: true, vendor: newVendor });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ================= SECURITY =================
app.use(
  cors({
    origin: [
      "http://192.168.1.105:5173",
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
    max: 500,
  })
);

// ================= BODY =================
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ================= LOGGER =================
app.use(morgan("dev"));

// ================= STATIC FILES =================
app.use("/uploads", express.static(path.resolve("uploads")));

// ================= HEALTH CHECK =================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "AMDOX ERP API Running 🚀",
  });
});

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
app.use("/api/invoice", pdfRoutes);
app.use("/api/export", exportRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/subscriptions", subscriptionRoutes);
app.use("/api/sms", smsRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/calendar", calendarRoutes); // REGISTER NEW CALENDAR ROUTES
app.get("/api/po", getPurchaseOrders);
app.use("/api", inventoryRoutes);
app.use("/api/hr", hrRouter);
app.use("/api/jobs", jobRouter);                       
app.use("/api/applications", applicationRoutes); 

// ================= 404 =================
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

// ================= ERROR HANDLER =================
app.use(errorMiddleware);

export default app;