import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, ClipboardList, CheckCircle2, Clock, Plus, RefreshCw } from "lucide-react";
import API from "../../services/api";

export default function ProjectsDashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    totalProjects: 0,
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await API.get("/projects/analytics/dashboard");
      setData(res.data || {});
    } catch (err) {
      console.error("Dashboard analytics fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 rounded-[32px] p-8 text-white shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">📅 Project Dashboard</h1>
          <p className="mt-2 text-indigo-100 text-sm">Monitor workspace sprints, tasks, and project summaries.</p>
        </div>
        
        {/* 🔹 DYNAMIC REDIRECT TO CREATE PROJECT */}
        <button
          onClick={() => navigate("/projects/create")}
          className="h-11 px-5 rounded-xl bg-white hover:bg-slate-50 text-indigo-600 text-sm font-bold flex items-center justify-center gap-2 transition shadow-sm shrink-0"
        >
          <Plus size={16} /> Create Project
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Operational Overview</h2>
          <p className="text-xs text-slate-400 font-medium">Real-time task aggregates and project counts</p>
        </div>
        <button
          onClick={fetchAnalytics}
          className="h-11 px-5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 text-sm font-bold flex items-center justify-center gap-2 border border-slate-200 transition-all"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* 📊 KPI CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Projects */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Projects</span>
            <h2 className="text-3xl font-black text-slate-800 mt-2">{data.totalProjects || 0}</h2>
          </div>
          <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Briefcase size={22} />
          </div>
        </div>

        {/* Total Tasks */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Tasks</span>
            <h2 className="text-3xl font-black text-slate-800 mt-2">{data.totalTasks || 0}</h2>
          </div>
          <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <ClipboardList size={22} />
          </div>
        </div>

        {/* Completed */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Completed</span>
            <h2 className="text-3xl font-black text-green-600 mt-2">{data.completedTasks || 0}</h2>
          </div>
          <div className="h-12 w-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
            <CheckCircle2 size={22} />
          </div>
        </div>

        {/* Pending */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Pending</span>
            <h2 className="text-3xl font-black text-rose-600 mt-2">{data.pendingTasks || 0}</h2>
          </div>
          <div className="h-12 w-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Clock size={22} />
          </div>
        </div>

      </div>
    </div>
  );
}