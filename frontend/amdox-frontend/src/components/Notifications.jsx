import { useEffect, useState } from "react";
import API from "../services/api";

export default function Notifications() {
  const [data, setData] = useState([]);

  useEffect(() => {
    API.get("/notifications").then((res) => setData(res.data));
  }, []);

  return (
    <div>
      <h3>Notifications 🔔</h3>

      {data.map((n) => (
        <div key={n._id}>
          {n.message} {n.isRead ? "✔" : "❗"}
        </div>
      ))}
    </div>
  );
}