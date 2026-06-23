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
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  TrendingDown,
  CalendarDays,
  Target
} from "lucide-react";
import API from "../services/api";
import notifier from "../utils/notifier";

export default function ProjectDashboard() {
  const navigate = useNavigate(); 
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // લોકલ સ્ટોરેજ ટ્રેકિંગ ફોર એક્સપેન્સ, બજેટ અપગ્રેડ અને માઇલસ્ટોન્સ
  const [customData, setCustomData] = useState({});
  
  // મોડલ પોપ-અપ સ્ટેટ્સ
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  const [activeProj, setActiveProj] = useState(null);
  
  const [expenseInput, setExpenseInput] = useState("");
  const [milestoneInput, setMilestoneInput] = useState("");
  const [budgetUpgradeInput, setBudgetUpgradeInput] = useState("");
  
  const [saving, setSaving] = useState(false);

  useEffect(() => {
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
      const serverData = res.data || [];
      
      if (serverData.length > 0) {
        setProjects(serverData);
      } else {
        loadFallbackProjects();
      }
      notifier?.projectsDashboardViewed?.();
    } catch (err) {
      console.warn("Using offline fallback project list.");
      loadFallbackProjects();
    } finally {
      setLoading(false);
    }
  };

  const loadFallbackProjects = () => {
    const savedProjects = localStorage.getItem("amdox_simulated_projects");
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    } else {
      const defaultProjects = [
        { _id: "proj-1", name: "AMDOX Cloud ERP Development", budget: 150000, spent: 45000, status: "ACTIVE" },
        { _id: "proj-2", name: "Warehouse IoT Scanner Integration", budget: 50000, spent: 48000, status: "ACTIVE" },
        { _id: "proj-3", name: "AI Demand Forecasting Module", budget: 100000, spent: 35000, status: "ACTIVE" },
        { _id: "proj-4", name: "Dharmik Kotecha Portal", budget: 170000, spent: 150000, status: "ACTIVE" }
      ];
      localStorage.setItem("amdox_simulated_projects", JSON.stringify(defaultProjects));
      setProjects(defaultProjects);
    }
  };

  const openExpenseModal = (proj) => {
    setActiveProj(proj);
    setExpenseInput("");
    setMilestoneInput("");
    setShowExpenseModal(true);
  };

  const openUpgradeModal = (proj) => {
    const localData = customData[proj._id] || { budgetUpgrade: 0 };
    const currentLimit = localData.budgetUpgrade || proj.budget || 0;
    setActiveProj(proj);
    setBudgetUpgradeInput(currentLimit);
    setShowUpgradeModal(true);
  };

  const handleSaveExpense = (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      const projId = activeProj._id;
      
      const currentProjData = customData[projId] || { spent: 0, milestones: [], budgetUpgrade: 0 };
      const newSpent = currentProjData.spent + Number(expenseInput || 0);
      const newMilestones = milestoneInput.trim() 
        ? [...currentProjData.milestones, { text: milestoneInput, date: new Date().toLocaleDateString("en-IN") }]
        : currentProjData.milestones;

      const updatedData = {
        ...customData,
        [projId]: {
          ...currentProjData,
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

  const handleUpgradeBudgetSubmit = (e) => {
    e.preventDefault();
    const upgradeValue = Number(budgetUpgradeInput);
    if (upgradeValue <= 0 || !activeProj) return;

    try {
      setSaving(true);
      const projId = activeProj._id;
      const currentProjData = customData[projId] || { spent: 0, milestones: [], budgetUpgrade: 0 };
      
      const updatedData = {
        ...customData,
        [projId]: {
          ...currentProjData,
          budgetUpgrade: upgradeValue
        }
      };

      setCustomData(updatedData);
      localStorage.setItem("amdox_project_custom_data", JSON.stringify(updatedData));
      
      alert(`Project [${activeProj.name}] budget upgraded to ₹${upgradeValue.toLocaleString()} successfully!`);
      setShowUpgradeModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const stats = useMemo(() => {
    let totalBudget = 0;
    let totalSpent = 0;
    let overBudgetCount = 0;

    projects.forEach((p) => {
      const localData = customData[p._id] || { spent: 0, budgetUpgrade: 0 };
      const planned = Number(localData.budgetUpgrade || p.budget || 0);
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
    <div className="space-y-8 max-w-full overflow-x-hidden px-1 font-sans antialiased text-slate-900">
      
      {/* GLOWING HERO HEADER */}
      <div className="relative overflow-hidden rounded-[32px] bg-slate-950 p-6 sm:p-8 md:p-10 text-white border border-slate-800 shadow-xl">
        <div className="absolute -top-12 -right-12 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3.5 py-1 text-xs font-semibold text-indigo-300">
              <FolderKanban size={13} className="animate-pulse" />
              SaaS Portfolio Manager
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-none">Workspace Projects</h1>
            <p className="text-slate-400 text-xs sm:text-sm max-w-xl font-medium">
              Track project budgets, spent costs, milestone alerts, and manage financial overruns dynamically.
            </p>
          </div>

          <button
            onClick={() => navigate("/projects/create")}
            className="h-11 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-lg shrink-0 z-10 active:scale-95"
          >
            <Plus size={14} /> Create Project
          </button>
        </div>
      </div>

      {/* REFINED KPI CARDS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
        <div className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="min-w-0 space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Active Sprints</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">{stats.totalProjects}</h2>
          </div>
          <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0"><Target size={18} /></div>
        </div>

        <div className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="min-w-0 space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Allocated</span>
            <h2 className="text-base sm:text-lg font-black text-slate-900 truncate">₹{stats.totalBudget.toLocaleString()}</h2>
          </div>
          <div className="h-10 w-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">₹</div>
        </div>

        <div className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="min-w-0 space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Actual Burned</span>
            <h2 className="text-base sm:text-lg font-black text-rose-500 truncate">₹{stats.totalSpent.toLocaleString()}</h2>
          </div>
          <div className="h-10 w-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0"><TrendingDown size={18} /></div>
        </div>

        <div className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="min-w-0 space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Remaining Pool</span>
            <h2 className={`text-base sm:text-lg font-black truncate ${stats.totalRemaining >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
              ₹{stats.totalRemaining.toLocaleString()}
            </h2>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0"><TrendingUp size={18} /></div>
        </div>

        <div className="rounded-2xl bg-white p-5 border border-slate-200/80 shadow-xs flex items-center justify-between col-span-2 lg:col-span-1">
          <div className="min-w-0 space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Overruns</span>
            <h2 className="text-xl sm:text-2xl font-black text-rose-500">{stats.overBudget}</h2>
          </div>
          <div className="h-10 w-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0"><AlertTriangle size={18} /></div>
        </div>
      </div>

      {/* PROJECTS LIST GRID */}
      <div className="rounded-3xl bg-white shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 sm:px-8 py-5 border-b border-slate-100 gap-4">
          <div className="space-y-0.5">
            <h2 className="text-base sm:text-lg font-bold text-slate-800">Project Financial & Status</h2>
            <p className="text-[11px] sm:text-xs text-slate-400 font-medium">Live budget usage progress and custom alert triggers</p>
          </div>
          <button
            onClick={fetchProjects}
            className="inline-flex items-center gap-1.5 rounded-xl bg-slate-50 border border-slate-200 px-3.5 py-1.5 text-slate-600 text-xs font-bold hover:bg-slate-100 transition active:scale-95 cursor-pointer"
          >
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="py-24 text-center">
            <Loader2 className="animate-spin h-10 w-10 text-indigo-600 mx-auto" />
            <p className="text-slate-400 text-xs font-bold mt-4">Compiling workspace parameters...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
            {projects.map((project) => {
              const localData = customData[project._id] || { spent: 0, milestones: [], budgetUpgrade: 0 };
              const planned = Number(localData.budgetUpgrade || project.budget || 0);
              const actual = Number(project.spent || 0) + localData.spent;
              const remaining = planned - actual;
              const progress = planned > 0 ? Math.min(((actual / planned) * 100).toFixed(0), 100) : 0;
              
              const isOverrun = actual > planned;
              const isNearLimit = !isOverrun && progress >= 85;

              return (
                <div key={project._id} className="rounded-3xl border border-slate-200/80 p-5 sm:p-6 space-y-5 flex flex-col justify-between min-w-0 overflow-hidden w-full bg-slate-50/20 hover:border-slate-300 transition duration-150">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0 space-y-1">
                        <h3 className="text-sm sm:text-base font-extrabold text-slate-800 tracking-tight truncate">{project.name}</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Project ID: {project._id?.slice(-6)}</p>
                      </div>
                      
                      {/* Pulsing Alert Badges */}
                      <div className="shrink-0">
                        {isOverrun ? (
                          <span className="px-2.5 py-1 rounded-full text-[9px] font-black bg-rose-50 text-rose-700 border border-rose-100 flex items-center gap-1.5 shrink-0 animate-pulse">
                            <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping" /> Overrun
                          </span>
                        ) : isNearLimit ? (
                          <span className="px-2.5 py-1 rounded-full text-[9px] font-black bg-amber-50 text-amber-700 border border-amber-100 flex items-center gap-1.5 shrink-0">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Near Limit
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full text-[9px] font-black bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center gap-1.5 shrink-0">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Healthy
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Financial Cards Grid */}
                    <div className="grid grid-cols-3 gap-3 text-[10px] sm:text-xs font-semibold text-slate-500">
                      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/60 min-w-0 flex flex-col justify-between">
                        <span className="text-[9px] text-slate-400 font-bold uppercase block tracking-wider truncate">Planned</span>
                        <div className="flex flex-col items-start mt-2">
                          <span className="text-slate-800 font-extrabold text-xs sm:text-sm truncate">₹{planned.toLocaleString()}</span>
                          <button 
                            type="button" 
                            onClick={() => openUpgradeModal(project)}
                            className="text-[9px] text-indigo-600 hover:underline shrink-0 block mt-1.5 font-bold cursor-pointer"
                          >
                            Upgrade
                          </button>
                        </div>
                      </div>

                      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/60 min-w-0 flex flex-col justify-between">
                        <span className="text-[9px] text-slate-400 font-bold uppercase block tracking-wider truncate">Actual</span>
                        <span className="text-rose-500 font-extrabold text-xs sm:text-sm block mt-4 truncate">₹{actual.toLocaleString()}</span>
                      </div>
                      
                      <div className="bg-white p-3.5 rounded-2xl border border-slate-200/60 min-w-0 flex flex-col justify-between">
                        <span className="text-[9px] text-slate-400 font-bold uppercase block tracking-wider truncate">Remaining</span>
                        <span className={`text-xs sm:text-sm font-extrabold block mt-4 truncate ${remaining >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                          ₹{remaining.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar with Glowing Line */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] sm:text-xs font-bold text-slate-500">
                        <span>Burn Rate</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/40 shadow-inner">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            isOverrun ? "bg-rose-500 shadow-md shadow-rose-500/20" : isNearLimit ? "bg-amber-500" : "bg-indigo-600 shadow-md shadow-indigo-600/20"
                          }`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    {/* Completed Milestones timeline */}
                    {localData.milestones.length > 0 && (
                      <div className="pt-3 border-t border-slate-200/60 space-y-2">
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Completed Milestones</span>
                        <div className="flex flex-wrap gap-2">
                          {localData.milestones.map((m, idx) => (
                            <span key={idx} className="px-2.5 py-0.5 bg-indigo-50 border border-indigo-100 rounded-lg text-[9px] font-bold text-indigo-700 flex items-center gap-1">
                              ✓ {m.text}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Triggers */}
                  <button
                    onClick={() => openExpenseModal(project)}
                    className="w-full h-10 bg-white border border-slate-200 hover:bg-indigo-50/10 hover:border-indigo-100 text-slate-700 hover:text-indigo-600 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition mt-4 cursor-pointer active:scale-95 shadow-xs"
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
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-6 mx-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center pb-2.5 border-b border-slate-100">
              <h2 className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-1.5">
                <Coins size={18} className="text-indigo-600" /> Record Expense & Milestones
              </h2>
              <button onClick={() => setShowExpenseModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer"><X size={16} /></button>
            </div>

            <form onSubmit={handleSaveExpense} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Add Expense Amount (INR)</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={expenseInput}
                  onChange={(e) => setExpenseInput(e.target.value)}
                  placeholder="e.g. 5000"
                  className="w-full h-11 border border-slate-200 rounded-xl px-3.5 text-xs bg-slate-50 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Add Milestone Achieved (Optional)</label>
                <input
                  type="text"
                  value={milestoneInput}
                  onChange={(e) => setMilestoneInput(e.target.value)}
                  placeholder="e.g. Phase 1 Frontend Complete"
                  className="w-full h-11 border border-slate-200 rounded-xl px-3.5 text-xs bg-slate-50 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setShowExpenseModal(false)}
                  className="flex-1 h-11 border rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || (!expenseInput && !milestoneInput)}
                  className="flex-1 h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer active:scale-95"
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

      {/* BUDGET UPGRADE MODAL */}
      {showUpgradeModal && activeProj && createPortal(
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl space-y-5 mx-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center pb-2.5 border-b border-slate-100">
              <h2 className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-1.5">
                <TrendingUp size={18} className="text-indigo-600 animate-bounce" /> Upgrade Budget Limit
              </h2>
              <button onClick={() => setShowUpgradeModal(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer"><X size={16} /></button>
            </div>

            <form onSubmit={handleUpgradeBudgetSubmit} className="space-y-4">
              <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl text-xs space-y-1">
                <span className="text-slate-400 font-bold block">TARGET PROJECT</span>
                <span className="font-extrabold text-slate-800">{activeProj.name}</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Set New Budget Allocation (INR)</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={budgetUpgradeInput}
                  onChange={(e) => setBudgetUpgradeInput(e.target.value)}
                  placeholder="e.g. 200000"
                  className="w-full h-11 border border-slate-200 rounded-xl px-3.5 text-xs bg-slate-50 outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex gap-2.5 pt-3">
                <button
                  type="button"
                  onClick={() => setShowUpgradeModal(false)}
                  className="flex-1 h-11 border rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || !budgetUpgradeInput}
                  className="flex-1 h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer active:scale-95"
                >
                  {saving ? <Loader2 className="animate-spin h-3.5 w-3.5" /> : <Check size={14} />}
                  Upgrade Limit
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-semibold pt-4">
        <ShieldCheck size={14} /> Unified Budget Optimization and SCM Procurement Checked
      </div>
    </div>
  );
}