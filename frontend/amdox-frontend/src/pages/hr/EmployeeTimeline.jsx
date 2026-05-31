import { useEffect, useState } from "react";
import { Clock, RefreshCw, Loader2, PlayCircle, ShieldCheck } from "lucide-react";
import API from "../../services/api";
import notifier from "../../utils/notifier";

export default function EmployeeTimeline() {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTimeline = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/audit").catch(() => API.get("/audit"));
      setTimeline(res.data?.logs || res.data || []);
      notifier.employeeTimelineReviewed();
    } catch (err) {
      console.error("Failed to load audit logs:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimeline();
  }, []);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 p-8 rounded-[32px] text-white shadow-sm flex items-center justify-between">
        <div>
          <span className="text-xs uppercase tracking-widest text-indigo-100 font-bold">Activity Logs</span>
          <h1 className="text-3xl font-black mt-1 flex items-center gap-2">🕒 Employee Audit Timeline</h1>
          <p className="text-indigo-100 text-sm mt-2">Chronological audit logs of workforce actions and onboarding changes.</p>
        </div>
        <button
          onClick={fetchTimeline}
          className="h-10 w-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center border border-white/10 transition"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {loading ? (
        <div className="p-20 text-center">
          <Loader2 className="animate-spin h-10 w-10 text-indigo-600 mx-auto" />
        </div>
      ) : timeline.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border text-slate-400">
          No audit activities logged yet.
        </div>
      ) : (
        <div className="space-y-6">
          {timeline.map((t) => (
            <div key={t._id} className="bg-white rounded-2xl border p-6 shadow-sm flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <PlayCircle size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-sm leading-relaxed">{t.action || t.description}</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Module: {t.module || "SYSTEM"}</p>
                </div>
              </div>
              <span className="text-xs text-slate-400 font-semibold flex items-center gap-1 shrink-0">
                <Clock size={12} /> {new Date(t.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}