import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import helmet from "helmet";
import hpp from "hpp";
import rateLimit from "express-rate-limit";
import { Server } from "socket.io";

// ================= LOAD ENV =================
dotenv.config();

// ================= DB =================
import connectDB from "./config/db.js";

// ================= WORKERS =================
import "./workers/emailWorker.js";

// ================= CONFIG =================
import "./config/passport.js";

// ================= SOCKET =================
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
import glRoutes from "./routes/glRoutes.js";

// SUPPLY CHAIN
import productRoutes from "./routes/productRoutes.js";
import vendorRoutes from "./routes/vendorRoutes.js";
import poRoutes from "./routes/poRoutes.js";

// PROJECT
import taskRoutes from "./routes/taskRoutes.js";

// ================= APP =================
const app = express();

// ================= SERVER =================
const server = http.createServer(app);

// ================= SOCKET IO =================
const io = new Server(server, {

  cors: {
    origin: "*",
  },

});

setSocket(io);

// SOCKET EVENTS
io.on("connection", (socket) => {

  console.log("✅ User connected:", socket.id);

  socket.on("join", (userId) => {

    socket.join(userId);

  });

  socket.on("joinRoom", (room) => {

    socket.join(room);

  });

  socket.on("sendMessage", (data) => {

    io.to(data.room).emit(
      "receiveMessage",
      data
    );

  });

});

// ================= MIDDLEWARE =================

// RATE LIMIT
app.use(

  rateLimit({

    windowMs: 15 * 60 * 1000,
    max: 100,

  })

);

// SECURITY
app.use(helmet());
app.use(hpp());

// CORS
app.use(

  cors({

    origin:
      "http://localhost:5173",

    credentials: true,

  })

);

// JSON
app.use(

  express.json({

    limit: "10mb",

  })

);

// STATIC
app.use(
  "/uploads",
  express.static("uploads")
);

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
app.use("/api/analytics", analyticsRoutes);
app.use("/api/pdf", pdfRoutes);
app.use("/api/lifecycle", lifecycleRoutes);

// FINANCE
app.use("/api/finance", financeRoutes);
app.use("/api/gl", glRoutes);

// SUPPLY CHAIN
app.use("/api/products", productRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/po", poRoutes);

// PROJECT
app.use("/api/tasks", taskRoutes);

// TEST ROUTE
app.get("/", (req, res) => {

  res.send("✅ ERP API Running");

});

// ================= START SERVER =================

const PORT =
  process.env.PORT || 5000;

const startServer = async () => {

  try {

    // CONNECT DB
    await connectDB();

    // START SERVER
    server.listen(PORT, () => {

      console.log(
        `🚀 Server running on port ${PORT}`
      );

    });

  } catch (err) {

    console.log(
      "❌ Server Error"
    );

    console.log(err);

  }

};

// START
startServer();