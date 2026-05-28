// import http from "http";
// import { Server } from "socket.io";
// import app from "./app.js";   // ✅ IMPORTANT FIX

// const server = http.createServer(app);

// // Socket
// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:5173",
//     credentials: true,
//   },
// });

// io.on("connection", (socket) => {
//   console.log("User connected:", socket.id);
// });

// // GLOBAL SERVER START
// server.listen(5000, () => {
//   console.log("🚀 Server running on port 5000");
// });