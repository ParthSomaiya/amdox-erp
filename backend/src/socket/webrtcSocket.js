export const initWebRTCSocket =
  (io) => {

    io.on(

      "connection",

      (socket) => {

        console.log(
          "📞 WebRTC User:",
          socket.id
        );

        // =========================
        // JOIN ROOM
        // =========================

        socket.on(

          "join-call",

          (roomId) => {

            socket.join(roomId);

            socket.to(roomId).emit(

              "user-joined",

              socket.id

            );

          }

        );

        // =========================
        // SIGNAL
        // =========================

        socket.on(

          "signal",

          ({
            roomId,
            data,
          }) => {

            socket.to(roomId).emit(

              "signal",

              {
                id:
                  socket.id,

                data,
              }

            );

          }

        );

        // =========================
        // DISCONNECT
        // =========================

        socket.on(

          "disconnect",

          () => {

            console.log(
              "❌ User Left:",
              socket.id
            );

          }

        );

      }

    );

  };