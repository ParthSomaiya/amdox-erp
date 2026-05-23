import { Server } from "socket.io";

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("🔔 User connected:", socket.id);

    // ================= JOIN USER =================
    socket.on("join", (userId) => {
      socket.join(userId);
      console.log("User joined room:", userId);
    });

    // ================= JOIN CHAT ROOM =================
    socket.on("joinRoom", (roomId) => {
      socket.join(roomId);
      console.log("Joined chat room:", roomId);
    });

    // ================= CHAT MESSAGE =================
    socket.on("sendMessage", (data) => {
      io.to(data.chatId).emit("receiveMessage", data);
    });

    // ================= NOTIFICATION =================
    socket.on("sendNotification", (data) => {
      io.to(data.userId).emit("notification", data);
    });

    // ================= TYPING =================
    socket.on("typing", (data) => {
      socket.to(data.chatId).emit("typing", data);
    });

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });
  });

  return io;
};