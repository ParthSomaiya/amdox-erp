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
  Check
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
    <div className="space-y-6 max-w-full overflow-x-hidden px-1">
      {/* HERO SECTION */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-[32px] bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 p-5 sm:p-8 text-white shadow-md">
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-xs backdrop-blur-xl">
              <FolderKanban size={14} />
              Enterprise Project Analytics
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">Workspace Projects</h1>
            <p className="mt-2 max-w-xl text-blue-100 text-xs leading-relaxed">
              Track project budgets, spent costs, milestone alerts, and manage financial overruns dynamically.
            </p>
          </div>

          <button
            onClick={() => navigate("/projects/create")}
            className="h-10 px-5 rounded-xl bg-white hover:bg-slate-50 text-indigo-600 text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-lg shrink-0 w-full md:w-auto cursor-pointer"
          >
            <Plus size={14} /> Create Project
          </button>
        </div>
      </div>

      {/* KPI METRICS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-6">
        <div className="rounded-xl sm:rounded-2xl bg-white p-3.5 sm:p-5 shadow-sm border min-w-0">
          <p className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider truncate">Active Projects</p>
          <h2 className="mt-2 text-xl sm:text-2xl font-black text-slate-800">{stats.totalProjects}</h2>
        </div>
        <div className="rounded-xl sm:rounded-2xl bg-white p-3.5 sm:p-5 shadow-sm border min-w-0">
          <p className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider truncate">Total Budget</p>
          <h2 className="mt-2 text-base sm:text-lg font-black text-slate-800 truncate">₹{stats.totalBudget.toLocaleString("en-IN")}</h2>
        </div>
        <div className="rounded-xl sm:rounded-2xl bg-white p-3.5 sm:p-5 shadow-sm border min-w-0">
          <p className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider truncate">Actual Spent</p>
          <h2 className="mt-2 text-base sm:text-lg font-black text-rose-500 truncate">₹{stats.totalSpent.toLocaleString("en-IN")}</h2>
        </div>
        <div className="rounded-xl sm:rounded-2xl bg-white p-3.5 sm:p-5 shadow-sm border min-w-0">
          <p className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider truncate">Remaining</p>
          <h2 className={`mt-2 text-base sm:text-lg font-black truncate ${stats.totalRemaining >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
            ₹{stats.totalRemaining.toLocaleString("en-IN")}
          </h2>
        </div>
        <div className="rounded-xl sm:rounded-2xl bg-white p-3.5 sm:p-5 shadow-sm border col-span-2 lg:col-span-1 min-w-0">
          <p className="text-[10px] sm:text-xs text-slate-400 font-bold uppercase tracking-wider truncate">Over Budget</p>
          <h2 className="mt-2 text-xl sm:text-2xl font-black text-rose-500">{stats.overBudget}</h2>
        </div>
      </div>

      {/* PROJECTS LIST GRID */}
      <div className="rounded-2xl sm:rounded-[32px] bg-white shadow-sm border overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-5 sm:px-8 py-4 sm:py-5 border-b gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-800">Project Financial & Status</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">Live budget usage progress and custom alert triggers</p>
          </div>
          <button
            onClick={fetchProjects}
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-50 border px-3 py-1.5 text-slate-600 text-xs font-semibold hover:bg-slate-100 transition self-start sm:self-center cursor-pointer"
          >
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="p-20 text-center">
            <Loader2 className="animate-spin h-10 w-10 text-indigo-600 mx-auto" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 p-4 sm:p-6">
            {projects.map((project) => {
              const planned = Number(project.budget || 0);
              const localData = customData[project._id] || { spent: 0, milestones: [] };
              const actual = Number(project.spent || 0) + localData.spent;
              const remaining = planned - actual;
              const progress = planned > 0 ? Math.min(((actual / planned) * 100).toFixed(0), 100) : 0;
              const isOverrun = actual > planned;

              return (
                <div key={project._id} className="rounded-2xl sm:rounded-3xl border p-4 sm:p-5 space-y-4 sm:space-y-5 flex flex-col justify-between min-w-0 overflow-hidden w-full">
                  <div className="space-y-3.5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="text-base font-bold text-slate-800 tracking-tight truncate">{project.name}</h3>
                        <p className="text-[10px] text-slate-400 mt-0.5 font-semibold">Active Campaign</p>
                      </div>
                      
                      {/* ⚠️ LIVE OVERRUN ALERT (Flashing) */}
                      {isOverrun ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-50 border border-rose-100 text-rose-600 flex items-center gap-1 shrink-0 animate-pulse">
                          <AlertTriangle size={12} /> Overrun
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-50 border border-green-100 text-green-700 shrink-0">
                          Healthy
                        </span>
                      )}
                    </div>

                    {/* 🔹 Planned, Actual, Remaining: કમ્પેક્ટ અને રિસ્પોન્સિવ સેક્શન */}
                    <div className="grid grid-cols-3 gap-2 sm:gap-4 text-[10px] sm:text-xs font-semibold">
                      <div className="bg-slate-50 p-2 sm:p-3 rounded-xl border min-w-0 overflow-hidden">
                        <span className="text-slate-400 block mb-0.5 truncate">Planned</span>
                        <span className="text-slate-800 font-bold block truncate">₹{planned.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="bg-slate-50 p-2 sm:p-3 rounded-xl border min-w-0 overflow-hidden">
                        <span className="text-slate-400 block mb-0.5 truncate">Actual</span>
                        <span className="text-rose-500 font-bold block truncate">₹{actual.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="bg-slate-50 p-2 sm:p-3 rounded-xl border min-w-0 overflow-hidden">
                        <span className="text-slate-400 block mb-0.5 truncate">Remaining</span>
                        <span className={`${remaining >= 0 ? "text-emerald-600" : "text-rose-500"} font-bold block truncate`}>
                          ₹{remaining.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>

                    {/* Progress */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] sm:text-xs font-bold text-slate-500">
                        <span>Burn Rate</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden border">
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
                      <div className="pt-2.5 border-t border-slate-100 space-y-1.5">
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Completed Milestones</span>
                        <div className="flex flex-wrap gap-1.5">
                          {localData.milestones.map((m, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-indigo-50 border border-indigo-100 rounded-lg text-[9px] font-bold text-indigo-700 flex items-center gap-0.5">
                              ✓ {m.text}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <button
                    onClick={() => openExpenseModal(project)}
                    className="w-full h-9 sm:h-10 bg-slate-50 border hover:bg-indigo-50/10 hover:border-indigo-100 text-slate-700 hover:text-indigo-600 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition mt-3 cursor-pointer"
                  >
                    <PlusCircle size={13} /> Record Expense & Milestone
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
          <div className="w-full max-w-md bg-white rounded-2xl p-5 sm:p-6 shadow-2xl space-y-5 mx-auto">
            <div className="flex justify-between items-center pb-2.5 border-b">
              <h2 className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-1.5">
                <Coins size={18} className="text-indigo-600" /> Record Expense & Milestones
              </h2>
              <button onClick={() => setShowExpenseModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer"><X size={16} /></button>
            </div>

            <form onSubmit={handleSaveExpense} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Add Expense Amount (INR)</label>
                <input
                  type="number"
                  min="1"
                  value={expenseInput}
                  onChange={(e) => setExpenseInput(e.target.value)}
                  placeholder="e.g. 5000"
                  className="w-full h-10 border border-slate-200 rounded-xl px-3.5 text-xs sm:text-sm bg-slate-50/50 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Add Milestone Achieved (Optional)</label>
                <input
                  type="text"
                  value={milestoneInput}
                  onChange={(e) => setMilestoneInput(e.target.value)}
                  placeholder="e.g. Phase 1 Frontend Complete"
                  className="w-full h-10 border border-slate-200 rounded-xl px-3.5 text-xs sm:text-sm bg-slate-50/50 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowExpenseModal(false)}
                  className="flex-1 h-10 border rounded-xl font-bold text-xs text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || (!expenseInput && !milestoneInput)}
                  className="flex-1 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                >
                  {saving ? <Loader2 className="animate-spin h-3.5 w-3.5" /> : <Check size={14} />}
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