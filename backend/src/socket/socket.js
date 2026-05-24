import { Server } from "socket.io";

let io;

export const initSocket = (server) => {

  io = new Server(server, {

    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },

  });

  io.on("connection", (socket) => {

    console.log(
      "✅ Socket Connected:",
      socket.id
    );

    // USER ROOM
    socket.on("join", (userId) => {

      socket.join(userId);

    });

    // CHAT ROOM
    socket.on("joinRoom", (roomId) => {

      socket.join(roomId);

    });

    // SEND MESSAGE
    socket.on("sendMessage", (data) => {

      io.to(data.chatId).emit(
        "receiveMessage",
        data
      );

    });

    // TYPING
    socket.on("typing", (data) => {

      socket.to(data.chatId).emit(
        "typing",
        data
      );

    });

    // NOTIFICATION
    socket.on("sendNotification", (data) => {

      io.to(data.userId).emit(
        "new_notification",
        data
      );

    });

    socket.on("disconnect", () => {

      console.log(
        "❌ Socket Disconnected:",
        socket.id
      );

    });

  });

  return io;

};

export const getIO = () => {

  if (!io) {

    throw new Error(
      "Socket.io not initialized"
    );

  }

  return io;

};