import { useEffect, useState } from "react";
import { CalendarRange, Loader2, RefreshCw } from "lucide-react";
import API from "../../services/api";
import GanttChart from "./GanttChart";

export default function GanttBoard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const res = await API.get("/tasks");
      setTasks(res.data || []);
    } catch (err) {
      console.error("Gantt Tasks Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Safe date parsing & styles mapping to prevent react-gantt crashes
  const formattedTasks = tasks.map((t) => {
    const sDate = t.startDate ? new Date(t.startDate) : new Date(t.createdAt || Date.now());
    const eDate = t.endDate ? new Date(t.endDate) : new Date(sDate.getTime() + 4 * 24 * 60 * 60 * 1000);

    return {
      id: String(t._id),
      name: t.title || "Sprint Objective",
      start: isNaN(sDate.getTime()) ? new Date() : sDate,
      end: isNaN(eDate.getTime()) ? new Date() : eDate,
      type: "task",
      progress: t.status === "DONE" ? 100 : t.status === "IN_PROGRESS" ? 50 : 0,
      styles: { progressColor: "#4f46e5", progressSelectedColor: "#312e81" },
    };
  });

  return (
    <div className="space-y-8">
      {/* 🔹 કસ્ટમ SVG સ્ટાઇલ જે ડાબી બાજુના અક્ષરોને બિલકુલ ડાર્ક અને સ્પષ્ટ કરી દેશે */}
      <style>{`
        .gantt-container-custom text {
          fill: #1e293b !important; 
          font-family: 'Inter', sans-serif !important;
          font-size: 11px !important;
        }
        .gantt-container-custom ._3_9HT { 
          fill: #0f172a !important;
          font-weight: bold !important;
          font-size: 12px !important;
        }
      `}</style>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 rounded-[32px] p-8 text-white shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="space-y-2">
          <span className="text-xs uppercase tracking-widest text-indigo-200 font-bold">Workspace Schedule</span>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">📅 Gantt Timeline</h1>
          <p className="text-indigo-100 text-sm max-w-xl">
            Visualize project schedules, task durations, and resource dependencies on a timeline.
          </p>
        </div>
        <div className="hidden sm:flex h-16 w-16 rounded-2xl bg-white/10 backdrop-blur-md items-center justify-center border border-white/20">
          <CalendarRange size={28} />
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Sprint Roadmap</h2>
          <p className="text-xs text-slate-400 font-medium">Automatic rendering of task scopes</p>
        </div>
        <button
          onClick={loadTasks}
          className="h-11 px-5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 text-sm font-bold flex items-center justify-center gap-2 border border-slate-200 transition-all"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Gantt Chart Container (Added custom wrapper class) */}
      {loading ? (
        <div className="bg-white rounded-[32px] border border-slate-200/80 p-20 text-center shadow-sm">
          <Loader2 className="animate-spin h-10 w-10 text-indigo-600 mx-auto" />
          <p className="mt-4 text-slate-500 font-semibold text-sm">Loading timeline...</p>
        </div>
      ) : formattedTasks.length === 0 ? (
        <div className="bg-white rounded-[32px] border border-slate-200/80 p-20 text-center text-slate-400">
          No tasks available. Add tasks to see them on the Gantt chart.
        </div>
      ) : (
        <div className="gantt-container-custom bg-white rounded-[32px] border border-slate-200/80 p-6 shadow-sm overflow-x-auto">
          <GanttChart tasks={formattedTasks} />
        </div>
      )}
    </div>
  );
}