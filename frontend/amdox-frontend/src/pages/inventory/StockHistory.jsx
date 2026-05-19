import { useEffect, useState } from "react";
import API from "../../services/api";

export default function StockHistory() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    API.get("/inventory/history").then((res) =>
      setHistory(res.data)
    );
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">
        📦 Stock History
      </h1>

      <div className="space-y-2">
        {history.map((h) => (
          <div
            key={h._id}
            className="bg-white p-3 shadow rounded"
          >
            <p>{h.type}</p>
            <p>Qty: {h.quantity}</p>
            <p>{h.reason}</p>
          </div>
        ))}
      </div>
    </div>
  );
}