import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import {
  BarChart3,
  Briefcase,
  IndianRupee,
  TrendingUp,
  Wallet,
  AlertTriangle,
  RefreshCw,
  FolderKanban,
  Plus,
  Loader2
} from "lucide-react";
import API from "../services/api";

export default function ProjectDashboard() {
  const navigate = useNavigate(); 
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await API.get("/projects");
      setProjects(res.data || []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const totalBudget = projects.reduce((acc, item) => acc + Number(item?.budget || 0), 0);
    const totalSpent = projects.reduce((acc, item) => acc + Number(item?.spent || 0), 0);
    const totalRemaining = totalBudget - totalSpent;
    const overBudget = projects.filter((item) => Number(item?.spent || 0) > Number(item?.budget || 0)).length;

    return {
      totalProjects: projects.length,
      totalBudget,
      totalSpent,
      totalRemaining,
      overBudget,
    };
  }, [projects]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const getProgress = (spent, budget) => {
    if (!budget) return 0;
    return Math.min(((spent / budget) * 100).toFixed(0), 100);
  };

  const getStatus = (spent, budget) => {
    if (spent > budget) {
      return { label: "Over Budget", color: "bg-red-100 text-red-700 border-red-200" };
    }
    const progress = (spent / budget) * 100;
    if (progress >= 80) {
      return { label: "Critical", color: "bg-yellow-100 text-yellow-700 border-yellow-200" };
    }
    return { label: "Healthy", color: "bg-green-100 text-green-700 border-green-200" };
  };

  return (
    <div className="space-y-8">
      {/* HERO SECTION */}
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 p-8 text-white shadow-2xl">
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm backdrop-blur-xl">
              <FolderKanban size={16} />
              Enterprise Project Analytics
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">Projects Dashboard</h1>
            <p className="mt-4 max-w-xl text-blue-100 text-base leading-relaxed">
              Track project budgets, spending, financial progress, and operational performance in real-time.
            </p>
          </div>

          <button
            onClick={() => navigate("/projects/create")}
            className="h-12 px-6 rounded-2xl bg-white hover:bg-slate-50 text-indigo-600 text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-indigo-600/10 hover:scale-[1.02] shrink-0"
          >
            <Plus size={18} /> Create Project
          </button>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200/80">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Active Projects</p>
          <h2 className="mt-4 text-3xl font-black text-slate-800">{stats.totalProjects}</h2>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200/80">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Budget</p>
          <h2 className="mt-4 text-2xl font-black text-emerald-600">{formatCurrency(stats.totalBudget)}</h2>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200/80">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Spent</p>
          <h2 className="mt-4 text-2xl font-black text-slate-800">{formatCurrency(stats.totalSpent)}</h2>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200/80">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Remaining</p>
          <h2 className="mt-4 text-2xl font-black text-indigo-600">{formatCurrency(stats.totalRemaining)}</h2>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200/80">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Over Budget</p>
          <h2 className="mt-4 text-3xl font-black text-red-600">{stats.overBudget}</h2>
        </div>
      </div>

      {/* PROJECT LIST */}
      <div className="rounded-[32px] bg-white shadow-sm border border-slate-200/80 overflow-hidden">
        <div className="flex items-center justify-between px-8 py-6 border-b">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Project Financial Overview</h2>
            <p className="text-xs text-slate-400 font-medium">Live budget utilization and spending reports</p>
          </div>
          <button
            onClick={fetchProjects}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-50 border px-4 py-2 text-slate-600 text-sm font-semibold hover:bg-slate-100 transition-all"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="p-20 text-center">
            <Loader2 className="animate-spin h-10 w-10 text-indigo-600 mx-auto" />
            <p className="mt-4 text-slate-500 text-sm">Syncing projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <p className="p-20 text-center text-slate-400 text-sm">No projects found. Create one to see details.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-8">
            {projects.map((project) => {
              const progress = getProgress(Number(project.spent || 0), Number(project.budget || 0));
              const status = getStatus(Number(project.spent || 0), Number(project.budget || 0));

              return (
                <div key={project._id} className="rounded-3xl border border-slate-200 p-6 space-y-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-slate-800 tracking-tight">{project.name}</h3>
                      <p className="text-xs text-slate-400 mt-1 font-semibold">Budget monitoring</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${status.color}`}>
                      {status.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-2xl border">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Budget</span>
                      <p className="text-lg font-black text-slate-800 mt-1">{formatCurrency(project.budget)}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl border">
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Spent</span>
                      <p className="text-lg font-black text-slate-800 mt-1">{formatCurrency(project.spent)}</p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-slate-500">
                      <span>Budget Usage</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="h-3.5 bg-slate-100 rounded-full overflow-hidden border">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          progress >= 100
                            ? "bg-red-500"
                            : progress >= 80
                            ? "bg-yellow-500"
                            : "bg-indigo-600"
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}