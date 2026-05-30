import { useState, useEffect } from "react";
import { Loader2, Plus, BarChart2, Check, TrendingUp, Sparkles, Layers } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import API from "../../services/api";

export default function ChartBuilder() {
  const [dataset, setDataset] = useState("revenue"); // revenue, stock, tasks
  const [chartType, setChartType] = useState("bar"); // bar, line, area
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDynamicData();
  }, [dataset]);

  const loadDynamicData = async () => {
    try {
      setLoading(true);
      if (dataset === "revenue") {
        const res = await API.get("/finance/invoice").catch(() => ({ data: [] }));
        const paid = (res.data || []).filter(inv => inv.status === "PAID");
        const monthly = { Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0 };
        paid.forEach(inv => {
          const m = new Date(inv.createdAt).toLocaleString("default", { month: "short" });
          if (monthly[m] !== undefined) monthly[m] += (inv.amount || 0);
        });
        setChartData(Object.keys(monthly).map(key => ({ name: key, value: monthly[key] })));
      } else if (dataset === "stock") {
        const res = await API.get("/inventory/product").catch(() => ({ data: [] }));
        const formatted = (res.data || []).map(p => ({ name: p.name, value: p.quantity || p.stock || 0 }));
        setChartData(formatted);
      } else if (dataset === "tasks") {
        const res = await API.get("/tasks").catch(() => ({ data: [] }));
        const grouped = (res.data || []).reduce((acc, t) => {
          const key = t.status || "TODO";
          acc[key] = (acc[key] || 0) + 1;
          return acc;
        }, {});
        setChartData(Object.keys(grouped).map(key => ({ name: key, value: grouped[key] })));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 p-8 rounded-[32px] text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <span className="text-xs uppercase tracking-widest text-indigo-100 font-bold">Dynamic Engine</span>
        <h1 className="text-3xl font-black mt-1 flex items-center gap-2">
          <Sparkles className="animate-pulse" /> Custom Chart Builder
        </h1>
        <p className="text-indigo-100 text-sm mt-2">Generate custom reports on revenue, warehouse stocks, or agile taskboards.</p>
      </div>

      {/* Control Filters Toolbar */}
      <div className="bg-white rounded-3xl border p-6 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Select Dataset</label>
          <select value={dataset} onChange={(e) => setDataset(e.target.value)} className="w-full h-11 rounded-xl border px-3 bg-slate-50/50 outline-none text-xs font-bold text-slate-600 cursor-pointer">
            <option value="revenue">Financial Revenue & Inflows</option>
            <option value="stock">Warehouse Products Stock Levels</option>
            <option value="tasks">Agile Sprint Tasks Progress</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Select Chart Type</label>
          <select value={chartType} onChange={(e) => setChartType(e.target.value)} className="w-full h-11 rounded-xl border px-3 bg-slate-50/50 outline-none text-xs font-bold text-slate-600 cursor-pointer">
            <option value="bar">Bar Chart</option>
            <option value="line">Line Chart</option>
            <option value="area">Area Chart</option>
          </select>
        </div>
      </div>

      {/* Visual Chart Card */}
      <div className="bg-white rounded-[32px] border p-6 shadow-sm space-y-6">
        <div className="pb-4 border-b">
          <h3 className="text-base font-bold text-slate-800">Live Compiled Analytics Graph</h3>
        </div>

        {loading ? (
          <div className="p-20 text-center"><Loader2 className="animate-spin h-8 w-8 text-indigo-600 mx-auto" /></div>
        ) : chartData.length === 0 ? (
          <p className="p-10 text-center text-slate-400 text-sm">Please insert database records first to compile chart.</p>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            {chartType === "bar" ? (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip />
                <Bar dataKey="value" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              </BarChart>
            ) : chartType === "line" ? (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={3} />
              </LineChart>
            ) : (
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#06b6d4" fill="#ecfeff" strokeWidth={2} />
              </AreaChart>
            )}
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}