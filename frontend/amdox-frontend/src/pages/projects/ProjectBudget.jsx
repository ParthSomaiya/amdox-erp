import { useEffect, useState, useMemo } from "react";
import { Loader2, RefreshCw, Landmark, Coins, AlertTriangle, ShieldCheck, BarChart3, TrendingUp, Info } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import API from "../../services/api";

export default function ProjectBudget() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customData, setCustomData] = useState({});

  useEffect(() => {
    loadDynamicBudgetData();
  }, []);

  // 🔄 લાઈવ ડેટાબેઝ અને લોકલ સ્ટોરેજ સિંક્રોનાઈઝર
  const loadDynamicBudgetData = async () => {
    try {
      setLoading(true);
      
      // ૧. કસ્ટમ પ્રોજેક્ટ ડેટા લોડ કરો (ખર્ચ અને માઇલસ્ટોન્સ)
      const savedData = localStorage.getItem("amdox_project_custom_data");
      const parsedCustom = savedData ? JSON.parse(savedData) : {};
      setCustomData(parsedCustom);

      // ૨. ડેટાબેઝમાંથી પ્રોજેક્ટ્સ લોડ કરો
      const res = await API.get("/projects");
      setBudgets(res.data || []);
    } catch (err) {
      console.error("Failed to load budget parameters:", err);
    } finally {
      setLoading(false);
    }
  };

  // 📊 વિઝ્યુઅલ ચાર્ટ ડેટા કમ્પાઈલેશન (હાલના ખર્ચ મુજબ ગતિશીલ)
  const chartData = useMemo(() => {
    return budgets.map((b) => {
      const planned = Number(b.budget || 0);
      const localData = customData[b._id] || { spent: 0 };
      const actual = Number(b.spent || 0) + localData.spent;

      return {
        name: b.name,
        "Planned Budget": planned,
        "Actual Spent": actual
      };
    });
  }, [budgets, customData]);

  // ગ્લોબલ કેપીઆઈ કેલ્ક્યુલેશન્સ
  const metrics = useMemo(() => {
    let totalPlanned = 0;
    let totalActual = 0;

    budgets.forEach((b) => {
      const planned = Number(b.budget || 0);
      const localData = customData[b._id] || { spent: 0 };
      const actual = Number(b.spent || 0) + localData.spent;

      totalPlanned += planned;
      totalActual += actual;
    });

    return {
      totalPlanned,
      totalActual,
      remaining: totalPlanned - totalActual
    };
  }, [budgets, customData]);

  return (
    <div className="space-y-8 font-sans">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 p-8 rounded-[32px] text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <span className="text-[10px] uppercase tracking-widest text-emerald-100 font-bold block mb-2">Financial Overruns</span>
        <h1 className="text-3xl font-black mt-1 flex items-center gap-2">
          <Landmark /> Project Budgets & Burn Rates
        </h1>
        <p className="text-emerald-100 text-sm mt-2 max-w-xl">Monitor assigned budgets, actual expenditures, and live remaining balance reserves.</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase block">Total Planned Budget</span>
            <h2 className="text-2xl font-black text-slate-800 mt-2">₹{metrics.totalPlanned.toLocaleString("en-IN")}</h2>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center"><BarChart3 size={20} /></div>
        </div>

        <div className="bg-white border rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase block">Actual Spent to Date</span>
            <h2 className="text-2xl font-black text-rose-500 mt-2">₹{metrics.totalActual.toLocaleString("en-IN")}</h2>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center"><Coins size={20} /></div>
        </div>

        <div className="bg-white border rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase block">Remaining Balance Pool</span>
            <h2 className={`text-2xl font-black mt-2 ${metrics.remaining >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
              ₹{metrics.remaining.toLocaleString("en-IN")}
            </h2>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><TrendingUp size={20} /></div>
        </div>
      </div>

      {/* Chart visualization */}
      {chartData.length > 0 && (
        <div className="bg-white rounded-[32px] border p-6 shadow-sm space-y-4">
          <h3 className="font-extrabold text-slate-800 text-sm">Budget vs Expense Analytics</h3>
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip />
                <Legend />
                <Bar dataKey="Planned Budget" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Actual Spent" fill="#f43f5e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Sinks list */}
      <div className="bg-white rounded-[32px] border p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b">
          <div>
            <h3 className="font-bold text-slate-800 text-base">Project Breakdowns</h3>
            <p className="text-xs text-slate-400 mt-0.5">Live remaining balance and calculated burn rates</p>
          </div>
          <button
            onClick={loadDynamicBudgetData}
            disabled={loading}
            className="h-10 px-4 rounded-xl bg-slate-50 border hover:bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center gap-2"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>

        {loading ? (
          <div className="p-20 text-center"><Loader2 className="animate-spin h-8 w-8 text-indigo-600 mx-auto" /></div>
        ) : budgets.length === 0 ? (
          <p className="p-10 text-center text-slate-400 text-sm">No project budgets compiled.</p>
        ) : (
          <div className="space-y-6">
            {budgets.map((b) => {
              const planned = Number(b.budget || 0);
              const localData = customData[b._id] || { spent: 0 };
              const actual = Number(b.spent || 0) + localData.spent;
              const remaining = planned - actual;
              const burnRate = planned > 0 ? Math.min(((actual / planned) * 100).toFixed(0), 100) : 0;
              const isOverrun = actual > planned;

              return (
                <div key={b._id} className="p-5 border rounded-2xl bg-slate-50/50 space-y-4 hover:border-indigo-150 transition">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-sm">{b.name}</h4>
                      <p className="text-[10px] text-slate-400 font-semibold mt-1">Status: Active Track</p>
                    </div>

                    {isOverrun ? (
                      <span className="px-2.5 py-0.5 rounded text-[9px] font-black uppercase bg-rose-50 text-rose-700 border border-rose-100 flex items-center gap-1.5 animate-pulse">
                        <AlertTriangle size={12} /> Overrun
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded text-[9px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-100">
                        In Limit
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-[10px] text-slate-400 font-bold uppercase">
                    <div>
                      <span>Planned</span>
                      <span className="text-slate-800 text-xs font-black block mt-1">₹{planned.toLocaleString("en-IN")}</span>
                    </div>
                    <div>
                      <span>Spent</span>
                      <span className="text-rose-500 text-xs font-black block mt-1">₹{actual.toLocaleString("en-IN")}</span>
                    </div>
                    <div>
                      <span>Remaining</span>
                      <span className={`text-xs font-black block mt-1 ${remaining >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                        ₹{remaining.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  {/* Progress indicators */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-bold text-slate-400">
                      <span>Burn Progress</span>
                      <span>{burnRate}%</span>
                    </div>
                    <div className="h-2 bg-slate-200/60 rounded-full overflow-hidden border">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isOverrun ? "bg-rose-500" : burnRate >= 85 ? "bg-amber-500" : "bg-indigo-600"
                        }`}
                        style={{ width: `${burnRate}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-semibold pt-4">
        <ShieldCheck size={14} /> SaaS Multi-Tenant Financial Analytics Core Active
      </div>
    </div>
  );
}