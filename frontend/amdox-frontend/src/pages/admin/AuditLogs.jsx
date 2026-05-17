import { useEffect, useState } from "react";
import axios from "axios";

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    axios.get("/api/admin/audit").then((res) => {
      setLogs(res.data);
    });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📜 Audit Logs</h1>

      <div className="space-y-2">
        {logs.map((log) => (
          <div
            key={log._id}
            className="bg-white p-3 rounded shadow text-sm"
          >
            <div><b>Action:</b> {log.action}</div>
            <div><b>Entity:</b> {log.entity}</div>
            <div><b>User:</b> {log.userId}</div>
            <div className="text-gray-500">
              {new Date(log.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}