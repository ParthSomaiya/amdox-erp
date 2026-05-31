import { useEffect, useState, useMemo } from "react";
import { CalendarRange, Loader2, RefreshCw, Milestone, Layers, FolderGit, ShieldCheck } from "lucide-react";
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

  // gantt-task-react માટે ડેટા ઓટો-સિંકિંગ
  const formattedTasks = useMemo(() => {
    return tasks.map((t) => {
      const sDate = t.startDate ? new Date(t.startDate) : new Date(t.createdAt || Date.now());
      const eDate = t.endDate ? new Date(t.endDate) : new Date(sDate.getTime() + 4 * 24 * 60 * 60 * 1000);

      return {
        id: String(t._id),
        name: t.title || "Sprint Objective",
        start: isNaN(sDate.getTime()) ? new Date() : sDate,
        end: isNaN(eDate.getTime()) ? new Date() : eDate,
        type: "task",
        progress: t.status === "DONE" ? 100 : t.status === "IN_PROGRESS" ? 50 : 0,
        styles: { 
          progressColor: "#4f46e5", 
          progressSelectedColor: "#312e81",
          backgroundColor: "#f8fafc"
        },
      };
    });
  }, [tasks]);

  const stats = useMemo(() => {
    const total = formattedTasks.length;
    const completed = formattedTasks.filter(t => t.progress === 100).length;
    return { total, completed };
  }, [formattedTasks]);

  return (
    <div className="space-y-8 font-sans">
      
      {/* CSS Overrides for clean Gantt rendering */}
      <style>{`
        .gantt-container-custom text {
          fill: #334155 !important;
          font-family: 'Inter', sans-serif !important;
          font-weight: 600 !important;
        }
        .gantt-container-custom ._3_E6b {
          stroke: #e2e8f0 !important;
        }
      `}</style>

      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-[32px] p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-56 h-56 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        <span className="text-[10px] uppercase tracking-widest text-indigo-400 font-bold block mb-2">Workspace Schedule</span>
        <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
          <CalendarRange className="text-indigo-400" /> Sprint Gantt Timeline
        </h1>
        <p className="mt-2 text-slate-400 text-sm max-w-xl">Track task durations, parallel sprint dependencies and burn velocities on a synchronized timeline card.</p>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white border rounded-2xl p-5 shadow-sm">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Active Scope Items</span>
          <h3 className="text-2xl font-black text-slate-800 mt-2">{stats.total} Sprints</h3>
        </div>
        <div className="bg-white border rounded-2xl p-5 shadow-sm">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Completed Tasks</span>
          <h3 className="text-2xl font-black text-emerald-600 mt-2">{stats.completed} Objectives</h3>
        </div>
        <div className="bg-white border rounded-2xl p-5 shadow-sm">
          <span className="text-[10px] text-slate-400 font-bold uppercase block">Net Team Velocity</span>
          <h3 className="text-2xl font-black text-indigo-600 mt-2">84.2% Efficiency</h3>
        </div>
      </div>

      {/* Gantt Wrapper */}
      <div className="bg-white rounded-[32px] border shadow-sm p-6 space-y-4">
        <div className="flex justify-between items-center border-b pb-4">
          <div>
            <h3 className="font-extrabold text-slate-800 text-sm">Gantt Render Chart</h3>
            <p className="text-xs text-slate-400 mt-0.5">Double-click on elements to update project timelines</p>
          </div>
          <button
            onClick={loadTasks}
            disabled={loading}
            className="h-10 px-4 rounded-xl bg-slate-50 border hover:bg-slate-100 text-slate-600 text-xs font-bold flex items-center gap-2"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>

        {loading ? (
          <div className="p-20 text-center"><Loader2 className="animate-spin h-8 w-8 text-indigo-600 mx-auto" /></div>
        ) : formattedTasks.length === 0 ? (
          <div className="p-20 text-center text-slate-400 border border-dashed rounded-2xl">
            <FolderGit className="mx-auto mb-2 text-slate-300" size={32} />
            <p className="text-sm font-semibold">No active timeline data compiled.</p>
          </div>
        ) : (
          <div className="gantt-container-custom overflow-x-auto border rounded-2xl">
            <GanttChart tasks={formattedTasks} />
          </div>
        )}
      </div>
    </div>
  );
}