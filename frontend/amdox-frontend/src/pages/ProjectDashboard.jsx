import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom"; 
import { createPortal } from "react-dom";
import {
  FolderKanban,
  Plus,
  Loader2,
  Coins,
  AlertTriangle,
  RefreshCw,
  PlusCircle,
  X,
  Check,
  TrendingUp
} from "lucide-react";
import API from "../services/api";
import notifier from "../utils/notifier";

export default function ProjectDashboard() {
  const navigate = useNavigate(); 
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // લોકલ સ્ટોરેજ ટ્રેકિંગ ફોર એક્સપેન્સ અને માઇલસ્ટોન્સ
  const [customData, setCustomData] = useState({});
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [activeProj, setActiveProj] = useState(null);
  const [expenseInput, setExpenseInput] = useState("");
  const [milestoneInput, setMilestoneInput] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // કસ્ટમ બજેટ ડેટા લોડ કરવો
    const savedData = localStorage.getItem("amdox_project_custom_data");
    if (savedData) {
      setCustomData(JSON.parse(savedData));
    }
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await API.get("/projects");
      setProjects(res.data || []);
      notifier.projectsDashboardViewed();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openExpenseModal = (proj) => {
    setActiveProj(proj);
    setExpenseInput("");
    setMilestoneInput("");
    setShowExpenseModal(true);
  };

  // ખર્ચ અને માઇલસ્ટોન બ્રાઉઝર મેમરીમાં સેવ કરવાનું ફંક્શન
  const handleSaveExpense = (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const projId = activeProj._id;
      
      const currentProjData = customData[projId] || { spent: 0, milestones: [] };
      const newSpent = currentProjData.spent + Number(expenseInput || 0);
      const newMilestones = milestoneInput.trim() 
        ? [...currentProjData.milestones, { text: milestoneInput, date: new Date().toLocaleDateString("en-IN") }]
        : currentProjData.milestones;

      const updatedData = {
        ...customData,
        [projId]: {
          spent: newSpent,
          milestones: newMilestones
        }
      };

      setCustomData(updatedData);
      localStorage.setItem("amdox_project_custom_data", JSON.stringify(updatedData));
      
      alert("Project budget and milestones updated successfully!");
      setShowExpenseModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  // લાઈવ ડાયનેમિક કેલ્ક્યુલેટેડ સ્ટેટ્સ
  const stats = useMemo(() => {
    let totalBudget = 0;
    let totalSpent = 0;
    let overBudgetCount = 0;

    projects.forEach((p) => {
      const planned = Number(p.budget || 0);
      const localData = customData[p._id] || { spent: 0 };
      const actual = Number(p.spent || 0) + localData.spent;

      totalBudget += planned;
      totalSpent += actual;

      if (actual > planned) {
        overBudgetCount++;
      }
    });

    return {
      totalProjects: projects.length,
      totalBudget,
      totalSpent,
      totalRemaining: totalBudget - totalSpent,
      overBudget: overBudgetCount,
    };
  }, [projects, customData]);

  return (
    <div className="space-y-8">
      {/* HERO SECTION */}
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 p-8 text-white shadow-md">
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm backdrop-blur-xl">
              <FolderKanban size={16} />
              Enterprise Project Analytics
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight">Workspace Projects</h1>
            <p className="mt-4 max-w-xl text-blue-100 text-sm leading-relaxed">
              Track project budgets, spent costs, milestone alerts, and manage financial overruns dynamically.
            </p>
          </div>

          <button
            onClick={() => navigate("/projects/create")}
            className="h-12 px-6 rounded-2xl bg-white hover:bg-slate-50 text-indigo-600 text-sm font-bold flex items-center justify-center gap-2 transition shadow-lg shrink-0"
          >
            <Plus size={18} /> Create Project
          </button>
        </div>
      </div>

      {/* KPI METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="rounded-3xl bg-white p-6 shadow-sm border">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Active Projects</p>
          <h2 className="mt-4 text-3xl font-black text-slate-800">{stats.totalProjects}</h2>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm border">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Budget</p>
          <h2 className="mt-4 text-2xl font-black text-slate-800">₹{stats.totalBudget.toLocaleString("en-IN")}</h2>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm border">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Actual Spent</p>
          <h2 className="text-2xl font-black text-rose-500">₹{stats.totalSpent.toLocaleString("en-IN")}</h2>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm border">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Remaining</p>
          <h2 className={`mt-4 text-2xl font-black ${stats.totalRemaining >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
            ₹{stats.totalRemaining.toLocaleString("en-IN")}
          </h2>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-sm border">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Over Budget</p>
          <h2 className="mt-4 text-3xl font-black text-rose-500">{stats.overBudget}</h2>
        </div>
      </div>

      {/* PROJECTS LIST GRID */}
      <div className="rounded-[32px] bg-white shadow-sm border overflow-hidden">
        <div className="flex items-center justify-between px-8 py-6 border-b">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Project Financial & Milestone Status</h2>
            <p className="text-xs text-slate-400">Live budget usage progress and custom alert triggers</p>
          </div>
          <button
            onClick={fetchProjects}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-50 border px-4 py-2 text-slate-600 text-sm font-semibold hover:bg-slate-100 transition"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="p-20 text-center">
            <Loader2 className="animate-spin h-10 w-10 text-indigo-600 mx-auto" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-8">
            {projects.map((project) => {
              const planned = Number(project.budget || 0);
              const localData = customData[project._id] || { spent: 0, milestones: [] };
              const actual = Number(project.spent || 0) + localData.spent;
              const remaining = planned - actual;
              const progress = planned > 0 ? Math.min(((actual / planned) * 100).toFixed(0), 100) : 0;
              const isOverrun = actual > planned;

              return (
                <div key={project._id} className="rounded-3xl border p-6 space-y-6 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-slate-800 tracking-tight">{project.name}</h3>
                        <p className="text-xs text-slate-400 mt-1 font-semibold">Active Campaign</p>
                      </div>
                      
                      {/* ⚠️ LIVE OVERRUN ALERT (Flashing) */}
                      {isOverrun ? (
                        <span className="px-3 py-1 rounded-full text-xs font-black bg-rose-50 border border-rose-100 text-rose-600 flex items-center gap-1.5 animate-pulse">
                          <AlertTriangle size={14} /> Critical Overrun
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-50 border border-green-100 text-green-700">
                          Budget Healthy
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-xs font-semibold">
                      <div className="bg-slate-50 p-4 rounded-xl border">
                        <span className="text-slate-400 block mb-1">Planned</span>
                        <span className="text-slate-800 font-bold">₹{planned.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-xl border">
                        <span className="text-slate-400 block mb-1">Actual</span>
                        <span className="text-rose-500 font-bold">₹{actual.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="bg-slate-50 p-4 rounded-xl border">
                        <span className="text-slate-400 block mb-1">Remaining</span>
                        <span className={remaining >= 0 ? "text-emerald-600 font-bold" : "text-rose-500 font-bold"}>
                          ₹{remaining.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold text-slate-500">
                        <span>Burn Rate</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="h-3 bg-slate-100 rounded-full overflow-hidden border">
                        <div
                          className={`h-full rounded-full transition-all ${
                            isOverrun ? "bg-rose-500" : progress >= 80 ? "bg-amber-500" : "bg-indigo-600"
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Milestones List */}
                    {localData.milestones.length > 0 && (
                      <div className="pt-3 border-t space-y-2">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Completed Milestones</span>
                        <div className="flex flex-wrap gap-2">
                          {localData.milestones.map((m, idx) => (
                            <span key={idx} className="px-3 py-1 bg-indigo-50 border rounded-xl text-[10px] font-bold text-indigo-700 flex items-center gap-1">
                              ✓ {m.text} ({m.date})
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <button
                    onClick={() => openExpenseModal(project)}
                    className="w-full h-11 bg-slate-50 border hover:bg-indigo-50/10 hover:border-indigo-100 text-slate-700 hover:text-indigo-600 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition mt-4"
                  >
                    <PlusCircle size={14} /> Record Expense & Milestone
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* RECORD EXPENSE MODAL */}
      {showExpenseModal && createPortal(
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-6">
            <div className="flex justify-between items-center pb-3 border-b">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Coins size={20} className="text-indigo-600" /> Record Expense & Milestones
              </h2>
              <button onClick={() => setShowExpenseModal(false)} className="text-slate-400"><X size={18} /></button>
            </div>

            <form onSubmit={handleSaveExpense} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Add Expense Amount (INR)</label>
                <input
                  type="number"
                  min="1"
                  value={expenseInput}
                  onChange={(e) => setExpenseInput(e.target.value)}
                  placeholder="e.g. 5000"
                  className="w-full h-11 border rounded-xl px-4 text-sm bg-slate-50/50 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Add Milestone Achieved (Optional)</label>
                <input
                  type="text"
                  value={milestoneInput}
                  onChange={(e) => setMilestoneInput(e.target.value)}
                  placeholder="e.g. Phase 1 Frontend Complete"
                  className="w-full h-11 border rounded-xl px-4 text-sm bg-slate-50/50 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowExpenseModal(false)}
                  className="flex-1 h-11 border rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || (!expenseInput && !milestoneInput)}
                  className="flex-1 h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {saving ? <Loader2 className="animate-spin h-4 w-4" /> : <Check size={16} />}
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}