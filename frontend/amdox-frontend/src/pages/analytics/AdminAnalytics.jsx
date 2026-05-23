import { io } from "socket.io-client";

const socket =
  io("http://localhost:5000");

useEffect(() => {

  socket.on(
    "dashboard-update",

    (data) => {

      setData(data);

    }
  );

}, []);