import { useEffect, useState } from "react";
import { Loader2, RefreshCw, Briefcase, CheckCircle } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import API from "../../services/api";
import notifier from "../../utils/notifier";

export default function ProjectAnalytics() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProjectData = async () => {
    try {
      setLoading(true);
      const res = await API.get("/projects");
      const formatted = (res.data || []).map(p => ({
        name: p.name,
        budget: p.budget || 0,
        spent: p.spent || 0
      }));
      setData(formatted);
      notifier.projectAnalyticsViewed();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 p-8 rounded-[32px] text-white shadow-md flex items-center justify-between">
        <div>
          <span className="text-xs uppercase tracking-widest text-indigo-100 font-bold">Campaign Turn-overs</span>
          <h1 className="text-3xl font-black mt-1 flex items-center gap-2">📊 Project Analytics</h1>
          <p className="text-indigo-100 text-sm mt-2">Evaluate dynamic project budgets allocation and spent burn rates.</p>
        </div>
        <button
          onClick={fetchProjectData}
          className="h-10 w-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center border border-white/10 transition"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Chart Box */}
      <div className="bg-white rounded-[32px] border p-6 shadow-sm space-y-6">
        <h3 className="font-bold text-slate-800 text-sm">Project Budget Utilizations</h3>

        {loading ? (
          <div className="p-20 text-center"><Loader2 className="animate-spin h-8 w-8 text-indigo-600 mx-auto" /></div>
        ) : data.length === 0 ? (
          <p className="p-10 text-center text-slate-400 text-sm">No project budgets compiled.</p>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip />
              <Area type="monotone" dataKey="budget" stroke="#4f46e5" fill="#e0e7ff" strokeWidth={2} />
              <Area type="monotone" dataKey="spent" stroke="#f43f5e" fill="#ffe4e6" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}