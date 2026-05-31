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
    <div className="space-y-6 max-w-4xl mx-auto overflow-x-hidden px-1">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 p-5 sm:p-8 rounded-2xl sm:rounded-[32px] text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
        <div className="space-y-1">
          <span className="text-[10px] uppercase tracking-widest text-indigo-100 font-bold">Activity Logs</span>
          <h1 className="text-xl sm:text-2xl font-black flex items-center gap-2">🕒 Employee Audit Timeline</h1>
          <p className="text-indigo-100 text-xs max-w-xl">Chronological audit logs of workforce actions and onboarding changes.</p>
        </div>
        <button
          onClick={fetchTimeline}
          className="h-9 w-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center border border-white/10 transition cursor-pointer self-start sm:self-center shrink-0"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {loading ? (
        <div className="p-20 text-center">
          <Loader2 className="animate-spin h-10 w-10 text-indigo-600 mx-auto" />
        </div>
      ) : timeline.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border text-slate-400 font-bold text-xs">
          No audit activities logged yet.
        </div>
      ) : (
        <div className="space-y-3.5 w-full max-w-full overflow-hidden">
          {timeline.map((t) => (
            <div key={t._id} className="bg-white rounded-xl sm:rounded-2xl border p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-start justify-between gap-3 w-full max-w-full overflow-hidden">
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <div className="h-9 w-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
                  <PlayCircle size={18} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-slate-800 text-xs sm:text-sm leading-relaxed break-words">{t.action || t.description}</h3>
                  <p className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">Module: {t.module || "SYSTEM"}</p>
                </div>
              </div>
              <span className="text-[10px] sm:text-xs text-slate-400 font-semibold flex items-center gap-1 shrink-0 self-end sm:self-start">
                <Clock size={11} /> {new Date(t.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-center gap-1.5 text-[10px] sm:text-xs text-slate-400 font-semibold pt-2">
        <ShieldCheck size={13} className="text-indigo-600 shrink-0" /> Enterprise Action Audit System Active
      </div>
    </div>
  );
}