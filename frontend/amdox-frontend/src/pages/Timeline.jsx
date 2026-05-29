import { useEffect, useMemo, useState } from "react";
import { Calendar, Clock, FolderGit2, RefreshCw } from "lucide-react";
import api from "../utils/axiosInstance";

export default function Timeline() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await api.get("/tasks");
      setTasks(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Safe date parsing helper to prevent "Invalid Date" (મહત્વનો સુધારો)
  const parseDate = (dateVal, fallbackDate) => {
    const d = new Date(dateVal);
    if (!dateVal || isNaN(d.getTime())) {
      return fallbackDate;
    }
    return d;
  };

  const getDays = (start, end, createdAt) => {
    const s = parseDate(start, parseDate(createdAt, new Date()));
    const e = parseDate(end, new Date(s.getTime() + 5 * 24 * 60 * 60 * 1000)); // જો એન્ડ ડેટ ન હોય તો ડિફોલ્ટ ૫ દિવસનો સ્પાન સેટ થશે

    const diff = Math.ceil((e - s) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  };

  const formatDate = (dateVal, fallbackDate) => {
    const d = parseDate(dateVal, fallbackDate);
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "DONE":
        return "bg-emerald-50 text-emerald-700 border border-emerald-100";
      case "IN_PROGRESS":
        return "bg-amber-50 text-amber-700 border border-amber-100";
      default:
        return "bg-slate-50 text-slate-700 border border-slate-200";
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-violet-600 via-indigo-600 to-indigo-700 p-8 text-white shadow-md border border-indigo-700/10">
        <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest text-indigo-200 font-bold">Workspace Timeline</span>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">Project Timeline</h1>
            <p className="text-indigo-100 text-sm max-w-xl">
              Monitor active task durations, gantt progress lines, and sprint schedules in real-time.
            </p>
          </div>
          <div className="hidden sm:flex h-16 w-16 rounded-2xl bg-white/10 backdrop-blur-md items-center justify-center border border-white/20">
            <Calendar size={28} />
          </div>
        </div>
      </div>

      {/* List Toolbar */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Task Gantt Milestones</h2>
          <p className="text-xs text-slate-400 font-medium">Automatic duration rendering for current tasks</p>
        </div>
        <button
          onClick={fetchTasks}
          className="h-11 px-5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 text-sm font-bold flex items-center justify-center gap-2 border border-slate-200 transition-all"
        >
          <RefreshCw size={14} />
          Refresh
        </button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="bg-white rounded-[32px] border border-slate-200/80 p-20 text-center shadow-sm">
          <div className="h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-slate-500 font-semibold text-sm">Synchronizing timeline bars...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="bg-white rounded-[32px] border border-slate-200/80 p-20 text-center space-y-4 shadow-sm max-w-md mx-auto">
          <FolderGit2 size={48} className="mx-auto text-slate-300" />
          <h3 className="text-xl font-bold text-slate-800">No Tasks on Timeline</h3>
          <p className="text-slate-500 text-sm leading-normal">
            Create new sprint tasks inside the Kanban Board to populate the Gantt schedule.
          </p>
        </div>
      ) : (
        /* Timeline List Grid */
        <div className="space-y-4">
          {tasks.map((task) => {
            const sDate = parseDate(task.startDate, parseDate(task.createdAt, new Date()));
            const eDate = parseDate(task.endDate, new Date(sDate.getTime() + 5 * 24 * 60 * 60 * 1000));
            const days = getDays(task.startDate, task.endDate, task.createdAt);

            return (
              <div
                key={task._id}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all duration-300 space-y-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-base font-bold text-slate-800 tracking-tight">{task.title || "Untitled Task"}</h3>
                    <p className="text-xs text-slate-400 font-semibold mt-1">Gantt Milestone</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wide uppercase ${getStatusStyle(task.status)}`}>
                    {task.status || "TODO"}
                  </span>
                </div>

                {/* Progress Bar Container */}
                <div className="space-y-2">
                  <div className="w-full bg-slate-100 border border-slate-200/60 rounded-full h-8 overflow-hidden relative">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-xs font-bold flex items-center px-4 transition-all duration-500 shadow-md shadow-indigo-100/50"
                      style={{
                        width: `${Math.min(days * 12, 100)}%`, // બાર ની પહોળાઈ માપસર સેટ કરી છે
                        minWidth: "90px",
                      }}
                    >
                      <span className="flex items-center gap-1.5 leading-none">
                        <Clock size={12} />
                        {days} {days === 1 ? "Day" : "Days"}
                      </span>
                    </div>
                  </div>

                  {/* Readable Date Range */}
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-bold pt-1">
                    <span>{formatDate(task.startDate, sDate)}</span>
                    <span>→</span>
                    <span>{formatDate(task.endDate, eDate)}</span>
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