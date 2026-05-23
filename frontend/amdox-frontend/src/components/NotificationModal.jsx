import { useEffect, useState } from "react";
import API from "../services/api";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

export default function NotificationModal() {
  const [data, setData] = useState([]);

  useEffect(() => {
    API.get("/notifications").then((res) =>
      setData(res.data)
    );

    const user = JSON.parse(localStorage.getItem("user"));

    socket.emit("join", user._id);

    socket.on("notification", (msg) => {
      setData((prev) => [msg, ...prev]);
    });
  }, []);

  const markAll = async () => {
    await API.put("/notifications/mark-all-read");
  };

  return (
    <div className="p-4 w-80 bg-white shadow-lg">
      <h2 className="font-bold mb-3">
        Notifications
      </h2>

      <button onClick={markAll} className="text-blue-600">
        Mark all read
      </button>

      {data.map((n) => (
        <div key={n._id} className="border-b p-2">
          <p className="font-semibold">{n.title}</p>
          <p className="text-sm">{n.message}</p>
        </div>
      ))}
    </div>
  );
}