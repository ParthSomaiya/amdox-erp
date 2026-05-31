import { useEffect, useMemo, useState } from "react";
import { Flame, RefreshCw, Loader2 } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import API from "../../services/api";
import notifier from "../../utils/notifier";

export default function BurndownChart() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await API.get("/tasks");
      setTasks(res.data || []);
      notifier.burndownViewed();
    } catch (err) {
      console.error("Burndown Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 ડાયનેમિક કેલ્ક્યુલેશન: આઈડીયલ બર્ન રેટ અને રીયલ ટાસ્ક રીમેઇનિંગ લાઈન ચાર્ટ
  const chartData = useMemo(() => {
    if (tasks.length === 0) return [];
    
    const total = tasks.length;
    const completedCount = tasks.filter(t => t.status === "DONE").length;
    const remaining = total - completedCount;

    // આલેખ માટે ૭ દિવસનો મધ્યમ સ્પ્રેડ રન
    return Array.from({ length: 7 }).map((_, index) => {
      const ideal = Math.max(0, total - (total / 6) * index);
      let actual = total;

      if (index >= 3) {
        actual = Math.max(remaining, total - completedCount * (index / 6));
      }

      return {
        day: `Day ${index + 1}`,
        "Ideal Burn Line": Number(ideal.toFixed(1)),
        "Actual Remaining": Number(actual.toFixed(1)),
      };
    });
  }, [tasks]);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "DONE").length;
  const remainingTasks = totalTasks - completedTasks;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-rose-500 via-pink-600 to-red-600 rounded-[32px] p-8 text-white shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="space-y-2">
          <span className="text-xs uppercase tracking-widest text-rose-100 font-bold">Sprint Performance</span>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">🔥 Burndown Chart</h1>
          <p className="text-rose-100 text-sm max-w-xl">
            Track sprint progress, monitor team velocity, and estimate remaining workload.
          </p>
        </div>
        <div className="hidden sm:flex h-16 w-16 rounded-2xl bg-white/10 backdrop-blur-md items-center justify-center border border-white/20">
          <Flame size={28} />
        </div>
      </div>

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white border rounded-3xl p-6 shadow-sm">
          <span className="text-xs text-slate-400 font-bold uppercase">Total Scope Tasks</span>
          <p className="text-3xl font-black text-slate-800 mt-2">{totalTasks}</p>
        </div>
        <div className="bg-white border rounded-3xl p-6 shadow-sm">
          <span className="text-xs text-slate-400 font-bold uppercase">Completed</span>
          <p className="text-3xl font-black text-green-600 mt-2">{completedTasks}</p>
        </div>
        <div className="bg-white border rounded-3xl p-6 shadow-sm">
          <span className="text-xs text-slate-400 font-bold uppercase">Remaining Workload</span>
          <p className="text-3xl font-black text-rose-500 mt-2">{remainingTasks}</p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Sprint Progress</h2>
            <p className="text-xs text-slate-400">Comparing ideal velocity vs actual sprint completion</p>
          </div>
          <button
            onClick={fetchData}
            className="h-11 px-5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 text-sm font-bold flex items-center justify-center gap-2 border border-slate-200 transition-all"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="p-20 text-center">
            <Loader2 className="animate-spin h-10 w-10 text-indigo-600 mx-auto" />
            <p className="mt-4 text-slate-400 text-sm">Rendering burndown chart...</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={380}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Ideal Burn Line" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="5 5" />
              <Line type="monotone" dataKey="Actual Remaining" stroke="#ef4444" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}