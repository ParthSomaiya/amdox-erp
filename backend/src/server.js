import { getPurchaseOrders, receivePurchaseOrder } from "./controllers/inventoryController.js";
import { authMiddleware } from "./middleware/authMiddleware.js";
import paymentRoutes from "./routes/paymentRoutes.js"; 
import { getDemandForecast } from "./controllers/inventoryController.js";

import "dotenv/config"; 
import http from "http";
import mongoose from "mongoose";
import app from "./app.js";
import { Server } from "socket.io";
import helmet from 'helmet';

// ================= DATABASE CONNECTION =================
const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/amdox-erp";

mongoose
  .connect(mongoUri)
  .then(() => console.log("💾 Connected to MongoDB successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ================= SERVER INIT =================
const server = http.createServer(app);


// ================= SECURE ROUTING =================
app.get("/api/po", authMiddleware, getPurchaseOrders);
app.put("/api/po/:id/receive", authMiddleware, receivePurchaseOrder); 
app.use("/api/payment", paymentRoutes);
app.get("/api/inventory/forecast/:productId", authMiddleware, getDemandForecast);



// ================= SECURITY HELMET =================
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// ================= SOCKET.IO =================
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", (userId) => {
    if (userId) {
      socket.join(userId);
      console.log(`User ${userId} joined private notification room`);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});