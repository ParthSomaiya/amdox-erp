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


app.get("/api/po", authMiddleware, getPurchaseOrders);
app.put("/api/po/:id/receive", authMiddleware, receivePurchaseOrder); 
app.use("/api/payment", paymentRoutes);
app.get("/api/inventory/forecast/:productId", authMiddleware, getDemandForecast);


app.get("/api/vendor", async (req, res) => {
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

app.post("/api/vendor", async (req, res) => {
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


app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

// Bind Socket.io globally to the express application
app.set("io", io);

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join private notification room
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