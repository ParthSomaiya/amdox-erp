import { useEffect, useState } from "react";
import { Loader2, Flame, Info, Clock, ShieldAlert, User } from "lucide-react";
import API from "../../services/api";

export default function AttendanceHeatmap() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/attendance")
      .then((res) => {
        const records = res.data?.data || res.data || [];
        setData(Array.isArray(records) ? records : []);
      })
      .catch((err) => console.error("Heatmap fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  const getHeatLevel = (hours) => {
    const hrs = Number(hours || 0);
    if (hrs >= 8) {
      return {
        bg: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
        badge: "bg-emerald-500 text-white",
        status: "Full Shift (8+ Hrs)",
      };
    }
    if (hrs >= 5) {
      return {
        bg: "bg-amber-500/10 text-amber-700 border-amber-200",
        badge: "bg-amber-500 text-white",
        status: "Half Shift (5-7 Hrs)",
      };
    }
    return {
      bg: "bg-rose-500/10 text-rose-700 border-rose-200",
      badge: "bg-rose-500 text-white",
      status: "Short Shift (<5 Hrs)",
    };
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-10 w-10 text-indigo-600 mx-auto" />
          <p className="mt-4 text-slate-500 text-sm font-semibold">Generating attendance heatmap...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 🚀 Header */}
      <div className="bg-gradient-to-r from-orange-500 via-red-500 to-indigo-700 p-8 rounded-[32px] text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest text-orange-100 font-bold">Workforce Density</span>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight flex items-center gap-2">
              <Flame className="animate-pulse" /> Attendance Heatmap
            </h1>
            <p className="text-orange-100 text-sm max-w-xl">
              Visual overview of logged shift hours. Instantly monitor employee work durations.
            </p>
          </div>
        </div>
      </div>

      {/* 🚀 Legend Guide */}
      <div className="bg-white border rounded-3xl p-5 shadow-sm space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <Info size={14} /> Work Duration color Guide
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-100 rounded-2xl text-xs font-bold text-emerald-700">
            <span className="h-3.5 w-3.5 rounded-full bg-emerald-500 shrink-0" />
            <span>Full Shift (≥ 8 hours)</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-100 rounded-2xl text-xs font-bold text-amber-700">
            <span className="h-3.5 w-3.5 rounded-full bg-amber-500 shrink-0" />
            <span>Half Shift (5 - 7 hours)</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-rose-50 border border-rose-100 rounded-2xl text-xs font-bold text-rose-700">
            <span className="h-3.5 w-3.5 rounded-full bg-rose-500 shrink-0" />
            <span>Short Shift (&lt; 5 hours)</span>
          </div>
        </div>
      </div>

      {/* 🚀 Heatmap Grid */}
      {data.length === 0 ? (
        <div className="bg-white rounded-[32px] p-20 text-center space-y-4 border shadow-sm">
          <ShieldAlert size={48} className="mx-auto text-slate-300" />
          <h3 className="text-xl font-bold text-slate-700">No Attendance Logs Found</h3>
          <p className="text-slate-400 text-sm">Please clock-in from the portal to view data.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {data.map((a) => {
            const hrs = a.totalHours || 0;
            const heat = getHeatLevel(hrs);

            return (
              <div
                key={a._id}
                className="bg-white border rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border-slate-200/80 flex flex-col justify-between"
              >
                {/* Visual Top Bar */}
                <div className="h-16 bg-slate-50 border-b relative flex items-center justify-center">
                  <div className="h-8 w-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <User size={16} />
                  </div>
                  {/* Status Badge */}
                  <span className={`absolute top-2.5 right-3 px-2 py-0.5 rounded-md text-[8px] font-black tracking-wide uppercase ${heat.badgeClass}`}>
                    {heat.status}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  <h4 className="font-extrabold text-slate-800 text-sm truncate" title={a.employeeId?.name || "Employee"}>
                    {a.employeeId?.name || "Employee"}
                  </h4>
                  
                  <div className="flex items-center justify-between pt-2.5 border-t text-xs">
                    <span className="text-slate-400 font-bold">{a.date ? new Date(a.date).toLocaleDateString("en-IN") : ""}</span>
                    <span className={`px-2.5 py-1 rounded-xl font-black text-[11px] border ${heat.bg}`}>
                      {hrs.toFixed(1)} Hrs
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}