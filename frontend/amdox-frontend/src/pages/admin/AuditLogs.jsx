import { useEffect, useState } from "react";
import API from "../../services/api";

export default function AuditLogs() {
  // ================= STATE =================
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const limit = 10;

  // ================= FETCH LOGS =================
  const fetchLogs = async (pageNumber = 1) => {
    try {
      setLoading(true);
      setError("");

      const res = await API.get(
        `/api/admin/audit?page=${pageNumber}&limit=${limit}`
      );

      const data = res.data || {};

      setLogs(data.logs || []);
      setPage(data.page || pageNumber);
    } catch (err) {
      console.error("Audit logs error:", err);
      setError("Failed to load audit logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(1);
  }, []);

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">📜 Audit Logs</h1>

        <div className="bg-white shadow rounded p-10 text-center text-gray-600 animate-pulse">
          Loading Audit Logs...
        </div>
      </div>
    );
  }

  // ================= ERROR =================
  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">📜 Audit Logs</h1>

        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl">
          {error}
        </div>
      </div>
    );
  }

  // ================= UI =================
  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black">📜 Audit Logs</h1>

        <button
          onClick={() => fetchLogs(1)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Refresh
        </button>
      </div>

      {/* TABLE CARD */}
      <div className="bg-white shadow-lg rounded-2xl overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full text-sm">

            {/* HEADER */}
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
              <tr>
                <th className="p-4 text-left">User</th>
                <th className="p-4 text-left">Action</th>
                <th className="p-4 text-left">Module</th>
                <th className="p-4 text-left">Description</th>
                <th className="p-4 text-left">Date</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center p-10 text-gray-500"
                  >
                    No audit logs found
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr
                    key={log._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="p-4 font-medium">
                      {log.userId?.email || "System"}
                    </td>

                    <td className="p-4">
                      <span className="px-2 py-1 rounded bg-gray-200 text-gray-700 text-xs font-semibold">
                        {log.action}
                      </span>
                    </td>

                    <td className="p-4">{log.module}</td>

                    <td className="p-4 text-gray-600">
                      {log.description}
                    </td>

                    <td className="p-4 text-gray-500">
                      {log.createdAt
                        ? new Date(log.createdAt).toLocaleString()
                        : "N/A"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex items-center justify-between p-4 bg-gray-50">

          <button
            onClick={() => page > 1 && fetchLogs(page - 1)}
            disabled={page <= 1}
            className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50"
          >
            ⬅ Prev
          </button>

          <span className="font-semibold text-gray-700">
            Page {page}
          </span>

          <button
            onClick={() => fetchLogs(page + 1)}
            className="px-4 py-2 bg-gray-300 rounded-lg"
          >
            Next ➡
          </button>

        </div>

      </div>
    </div>
  );
}