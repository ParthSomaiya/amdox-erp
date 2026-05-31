import { useEffect, useState } from "react";
import API from "../../services/api";
import notifier from "../../utils/notifier";

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const limit = 10;

  const fetchLogs = async (pageNumber = 1) => {
    try {
      setLoading(true);
      setError("");

      const res = await API.get(
        `/admin/audit?page=${pageNumber}&limit=${limit}`
      );

      const data = res.data || {};
      setLogs(data.logs || []);
      setPage(data.page || pageNumber);
      notifier.auditViewed();
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

  // 🔹 કલરફુલ અને ટૂંકા એક્શન બેજીસ રેન્ડર કરવા માટેનું હેલ્પર ફંક્શન
  const renderActionBadge = (actionText = "") => {
    const text = actionText.toUpperCase();
    let label = "SYSTEM";
    let style = "bg-slate-50 text-slate-600 border-slate-200";

    if (text.includes("ONBOARD") || text.includes("EMPLOYEE ADDED")) {
      label = "ONBOARD";
      style = "bg-emerald-50 text-emerald-700 border-emerald-100";
    } else if (text.includes("LEAVE")) {
      label = "LEAVE";
      style = "bg-amber-50 text-amber-700 border-amber-100";
    } else if (text.includes("CHECK") || text.includes("ATTENDANCE")) {
      label = "ATTENDANCE";
      style = "bg-sky-50 text-sky-700 border-sky-100";
    } else if (text.includes("PAYROLL")) {
      label = "PAYROLL";
      style = "bg-violet-50 text-violet-700 border-violet-100";
    }

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${style}`}>
        {label}
      </span>
    );
  };

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

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-slate-800">📜 Audit Logs</h1>
        <button
          onClick={() => fetchLogs(1)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Refresh
        </button>
      </div>

      <div className="bg-white shadow-sm rounded-2xl border border-slate-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase text-xs font-semibold border-b">
              <tr>
                <th className="p-4 text-left">User</th>
                <th className="p-4 text-left">Action</th>
                <th className="p-4 text-left">Module</th>
                <th className="p-4 text-left">Description</th>
                <th className="p-4 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center p-10 text-slate-400 font-medium">
                    No audit logs found
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log._id} className="border-b hover:bg-slate-50/50 transition">
                    <td className="p-4 font-semibold text-slate-700">
                      {log.userId?.email || "System"}
                    </td>
                    {/* 🔹 FIXED: લાંબા લખાણને બદલે સુંદર શોર્ટ કલર બેજ બતાવવા માટે */}
                    <td className="p-4">
                      {renderActionBadge(log.action)}
                    </td>
                    <td className="p-4 font-medium">{log.module}</td>
                    <td className="p-4 text-slate-500 max-w-xs truncate" title={log.description}>
                      {log.description}
                    </td>
                    <td className="p-4 text-slate-400">
                      {log.createdAt ? new Date(log.createdAt).toLocaleString() : "N/A"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between p-4 bg-slate-50 border-t border-slate-100">
          <button
            onClick={() => page > 1 && fetchLogs(page - 1)}
            disabled={page <= 1}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl disabled:opacity-50 text-sm font-semibold hover:bg-slate-50 transition"
          >
            ⬅ Prev
          </button>
          <span className="font-semibold text-slate-600 text-sm">
            Page {page}
          </span>
          <button
            onClick={() => fetchLogs(page + 1)}
            className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl text-sm font-semibold hover:bg-slate-50 transition"
          >
            Next ➡
          </button>
        </div>
      </div>
    </div>
  );
}