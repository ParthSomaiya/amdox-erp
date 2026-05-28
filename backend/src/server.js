import "dotenv/config"; // CRITICAL: Must be the absolute first line
import http from "http";
import mongoose from "mongoose";
import app from "./app.js";
import { Server } from "socket.io";

// ================= DATABASE CONNECTION =================
const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/amdox-erp";

mongoose
  .connect(mongoUri)
  .then(() => console.log("💾 Connected to MongoDB successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ================= SERVER INIT =================
const server = http.createServer(app);

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