import { useEffect, useMemo, useState } from "react";
import { Calendar, Clock, RefreshCw, Loader2, CheckCircle2, ListTodo, Milestone, User, ShieldCheck, TrendingUp, AlertCircle } from "lucide-react";
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
      console.warn("API offline. Loading mock timeline parameters.");
      loadMockTasks();
    } finally {
      setLoading(false);
    }
  };

  const loadMockTasks = () => {
    const defaultTasks = [
      { _id: "t-1", title: "Enterprise Database Schema Migration", status: "DONE", startDate: "2026-05-25", endDate: "2026-05-30", description: "Isolate tenant rows and inject RLS rules", priority: "HIGH", assignedTo: "Parth Somaiya" },
      { _id: "t-2", title: "Corporate Invoicing PDF Engine", status: "IN_PROGRESS", startDate: "2026-05-28", endDate: "2026-06-03", description: "Build on-the-fly client side PDF generator", priority: "MEDIUM", assignedTo: "Dharmik Kotecha" },
      { _id: "t-3", title: "OAuth OIDC SAML Integration", status: "TODO", startDate: "2026-06-01", endDate: "2026-06-07", description: "SAML 2.0 Google Workspace & Azure AD auth", priority: "HIGH", assignedTo: "Jaydeep Patel" }
    ];
    setTasks(defaultTasks);
  };

  const parseDate = (dateVal, fallbackDate) => {
    const d = new Date(dateVal);
    return !dateVal || isNaN(d.getTime()) ? fallbackDate : d;
  };

  const getDays = (start, end, createdAt) => {
    const s = parseDate(start, parseDate(createdAt, new Date()));
    const e = parseDate(end, new Date(s.getTime() + 5 * 24 * 60 * 60 * 1000));
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

  // ડાયનેમિક કેપીઆઈ કેલ્ક્યુલેશન્સ
  const metrics = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === "DONE").length;
    const pending = total - completed;
    return { total, completed, pending };
  }, [tasks]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "DONE":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200/60";
      case "IN_PROGRESS":
        return "bg-amber-50 text-amber-700 border border-amber-200/60";
      default:
        return "bg-slate-100 text-slate-700 border border-slate-200/60";
    }
  };

  return (
    <div className="space-y-8 font-sans">
      {/* 🚀 Hero Banner */}
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-[32px] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        <span className="text-[10px] uppercase tracking-widest text-indigo-400 font-bold block mb-2">Workspace Roadmap</span>
        <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
          <Milestone className="text-indigo-400" /> Sprint Timeline Monitor
        </h1>
        <p className="mt-2 text-slate-400 text-sm max-w-xl">Track continuous integration schedules, gantt milestone bars, and developer sprint completion speeds.</p>
      </div>

      {/* 📊 Performance KPIs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase block">Total Scheduled Scope</span>
            <h2 className="text-2xl font-black text-slate-800 mt-2">{metrics.total} Milestones</h2>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center"><ListTodo size={20} /></div>
        </div>

        <div className="bg-white border rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase block">Completed Objectives</span>
            <h2 className="text-2xl font-black text-emerald-600 mt-2">{metrics.completed} Sprints</h2>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><CheckCircle2 size={20} /></div>
        </div>

        <div className="bg-white border rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase block">Velocity Index</span>
            <h2 className="text-2xl font-black text-indigo-600 mt-2">94.2% On-Time</h2>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center"><TrendingUp size={20} /></div>
        </div>
      </div>

      {/* Toolbar Controls */}
      <div className="bg-white rounded-3xl border p-5 shadow-sm flex justify-between items-center">
        <div>
          <h3 className="font-bold text-slate-800 text-sm">Gantt Milestones Feed</h3>
          <p className="text-xs text-slate-400 mt-0.5">Chronological flow of task schedules</p>
        </div>
        <button
          onClick={fetchTasks}
          disabled={loading}
          className="h-10 px-4 rounded-xl bg-slate-50 border hover:bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center gap-2"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {/* Timeline main flow list */}
      {loading ? (
        <div className="p-20 text-center"><Loader2 className="animate-spin h-8 w-8 text-indigo-600 mx-auto" /></div>
      ) : tasks.length === 0 ? (
        <div className="bg-white rounded-[32px] p-20 text-center border shadow-sm">
          <AlertCircle className="mx-auto text-slate-300 mb-2" size={36} />
          <p className="text-slate-400 text-sm font-semibold">No active timeline data compiled.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => {
            const sDate = parseDate(task.startDate, parseDate(task.createdAt, new Date()));
            const eDate = parseDate(task.endDate, new Date(sDate.getTime() + 5 * 24 * 60 * 60 * 1000));
            const days = getDays(task.startDate, task.endDate, task.createdAt);

            return (
              <div key={task._id} className="bg-white rounded-[24px] border border-slate-200/80 p-6 shadow-sm hover:shadow-md hover:border-indigo-200/50 transition duration-200 space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-slate-800 text-sm sm:text-base">{task.title}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1.5">
                      <User size={12} className="text-indigo-600" /> Assigned: {task.assignedTo || "Unassigned"}
                    </p>
                  </div>

                  <span className={`px-2.5 py-1 rounded text-[9px] font-black uppercase border ${getStatusStyle(task.status)}`}>
                    {task.status || "TODO"}
                  </span>
                </div>

                {/* Progress bar with glowing gradients */}
                <div className="space-y-2.5">
                  <div className="w-full bg-slate-100 border border-slate-200 rounded-full h-8 overflow-hidden relative shadow-inner">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-[10px] font-black flex items-center px-4 transition-all duration-500 shadow-md"
                      style={{
                        width: `${Math.min(days * 12, 100)}%`, 
                        minWidth: "95px",
                      }}
                    >
                      <span className="flex items-center gap-1">
                        <Clock size={12} /> {days} {days === 1 ? "Day" : "Days"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wide">
                    <Calendar size={12} />
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

      <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-semibold pt-4">
        <ShieldCheck size={14} /> Persistent Enterprise Gantt & Milestone Core Active
      </div>
    </div>
  );
}