export default function socketHandler(io) {

  const onlineUsers = {};

  io.on("connection", (socket) => {

    console.log(
      "User Connected",
      socket.id
    );

    // =====================
    // USER ONLINE
    // =====================

    socket.on(
      "join",
      (userId) => {

        onlineUsers[userId] =
          socket.id;

        io.emit(
          "onlineUsers",
          Object.keys(
            onlineUsers
          )
        );

      }
    );


    // =====================
    // JOIN ROOM
    // =====================

    socket.on(
      "joinRoom",
      (chatId) => {

        socket.join(chatId);

      }
    );


    // =====================
    // SEND MESSAGE
    // =====================

    socket.on(
      "sendMessage",
      (data) => {

        io.to(data.chatId)
          .emit(
            "receiveMessage",
            data
          );

      }
    );


    // =====================
    // TYPING
    // =====================

    socket.on(
      "typing",
      (data) => {

        socket.to(data.chatId)
          .emit(
            "typing",
            data
          );

      }
    );


    // =====================
    // DISCONNECT
    // =====================

    socket.on(
      "disconnect",
      () => {

        for (let key in onlineUsers) {

          if (
            onlineUsers[key] ===
            socket.id
          ) {

            delete onlineUsers[key];

          }

        }

        io.emit(
          "onlineUsers",
          Object.keys(
            onlineUsers
          )
        );

      }
    );

    // ========================
    // JOIN CALL ROOM
    // ========================

    socket.on(
      "join-call",
      (roomId) => {

        socket.join(roomId);

      }
    );


    // ========================
    // WEBRTC OFFER
    // ========================

    socket.on(
      "offer",
      ({ roomId, offer }) => {

        socket.to(roomId).emit(
          "offer",
          offer
        );

      }
    );


    // ========================
    // ANSWER
    // ========================

    socket.on(
      "answer",
      ({ roomId, answer }) => {

        socket.to(roomId).emit(
          "answer",
          answer
        );

      }
    );


    // ========================
    // ICE CANDIDATE
    // ========================

    socket.on(
      "ice-candidate",
      ({ roomId, candidate }) => {

        socket.to(roomId).emit(
          "ice-candidate",
          candidate
        );

      }
    );

  });

}