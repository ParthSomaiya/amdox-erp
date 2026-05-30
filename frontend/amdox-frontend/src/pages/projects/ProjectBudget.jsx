import { useEffect, useState } from "react";
import { Loader2, RefreshCw, Landmark, Coins, AlertCircle } from "lucide-react";
import API from "../../services/api";

export default function ProjectBudget() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      // પર્ફેક્ટ સિંકિંગ: પ્રોજેક્ટ મોડ્યુલમાંથી બજેટ અને સ્પેન્ટ વેલ્યુ મેળવો
      const res = await API.get("/projects");
      setBudgets(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-500 p-8 rounded-[32px] text-white shadow-md flex items-center justify-between">
        <div>
          <span className="text-xs uppercase tracking-widest text-emerald-100 font-bold">Financial Overruns</span>
          <h1 className="text-3xl font-black mt-1 flex items-center gap-2">💰 Project Budgets & Burn Rates</h1>
          <p className="text-emerald-100 text-sm mt-2">Track assigned budgets against actual expenses in real-time.</p>
        </div>
        <button
          onClick={fetchBudgets}
          className="h-10 w-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center border border-white/10 transition"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {loading ? (
        <div className="p-20 text-center"><Loader2 className="animate-spin h-10 w-10 text-emerald-600 mx-auto" /></div>
      ) : budgets.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border text-slate-400">No active budgets registered.</div>
      ) : (
        <div className="space-y-6">
          {budgets.map((b) => {
            const planned = b.budget || 0;
            const actual = b.spent || 0;
            const remaining = planned - actual;
            const burnRate = planned > 0 ? Math.min(((actual / planned) * 100).toFixed(0), 100) : 0;

            return (
              <div key={b._id} className="bg-white rounded-3xl border p-6 shadow-sm space-y-4 hover:shadow-md transition">
                <div className="flex items-center justify-between border-b pb-3">
                  <h3 className="font-extrabold text-slate-800 text-base">{b.name}</h3>
                  <span className="text-xs text-slate-400 font-bold">ID: {b._id.slice(-6)}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-semibold text-slate-500">
                  <div className="bg-slate-50 p-4 rounded-xl border">
                    <span>Planned Budget</span>
                    <h4 className="text-base font-black text-slate-800 mt-1">₹{planned.toLocaleString("en-IN")}</h4>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border">
                    <span>Actual Spent</span>
                    <h4 className="text-base font-black text-rose-500 mt-1">₹{actual.toLocaleString("en-IN")}</h4>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl border">
                    <span>Remaining Balance</span>
                    <h4 className={`text-base font-black mt-1 ${remaining >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                      ₹{remaining.toLocaleString("en-IN")}
                    </h4>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-xs font-bold text-slate-500">
                    <span>Budget Usage (Burn Rate)</span>
                    <span>{burnRate}%</span>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden border">
                    <div
                      className={`h-full rounded-full transition-all ${
                        burnRate >= 100 ? "bg-rose-500" : burnRate >= 80 ? "bg-amber-500" : "bg-indigo-600"
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
  );
}