import { useEffect, useState } from "react";
import axios from "axios";

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);

  const fetchLogs = async (pageNumber = 1) => {
    const res = await axios.get(
      `/api/admin/audit?page=${pageNumber}&limit=10`
    );

    setLogs(res.data.logs);
    setPage(res.data.page);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        📜 Audit Logs
      </h1>

      <div className="bg-white shadow rounded p-4">

        {/* TABLE */}
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">User</th>
              <th className="p-2">Action</th>
              <th className="p-2">Module</th>
              <th className="p-2">Description</th>
              <th className="p-2">Date</th>
            </tr>
          </thead>

          <tbody>
            {logs.map((log) => (
              <tr key={log._id} className="border-t">
                <td className="p-2">
                  {log.userId?.email || "System"}
                </td>
                <td className="p-2">{log.action}</td>
                <td className="p-2">{log.module}</td>
                <td className="p-2">{log.description}</td>
                <td className="p-2">
                  {new Date(log.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={() => fetchLogs(page - 1)}
            disabled={page <= 1}
            className="px-3 py-1 bg-gray-300 rounded"
          >
            Prev
          </button>

          <span className="px-3 py-1">
            Page {page}
          </span>

          <button
            onClick={() => fetchLogs(page + 1)}
            className="px-3 py-1 bg-gray-300 rounded"
          >
            Next
          </button>
        </div>

      </div>
    </div>
  );
}