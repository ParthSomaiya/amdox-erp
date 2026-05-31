import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Loader2, RefreshCw, Layers3 } from "lucide-react";
import API from "../../services/api";
import notifier from "../../utils/notifier";

export default function StockCharts() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChartData();
  }, []);

  const fetchChartData = async () => {
    try {
      setLoading(true);
      const res = await API.get("/inventory/product");
      const formatted = (res.data || []).map((p) => ({
        name: p.name,
        stock: p.quantity || p.stock || 0,
      }));
      setData(formatted);
      notifier.stockChartsViewed();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 p-8 rounded-[32px] text-white shadow-sm flex items-center justify-between">
        <div>
          <span className="text-xs uppercase tracking-widest text-indigo-100 font-bold">Data Visualization</span>
          <h1 className="text-3xl font-black mt-1 flex items-center gap-2">
            <Layers3 /> Stock Charts Overview
          </h1>
          <p className="text-indigo-100 text-sm mt-2">Analytical breakdown of current warehouse volumes.</p>
        </div>
      </div>

      {/* Chart Box */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Product Volume Allocation</h2>
            <p className="text-xs text-slate-400">Total available SKU units mapped side-by-side</p>
          </div>
          <button
            onClick={fetchChartData}
            className="h-10 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 text-xs font-bold flex items-center justify-center gap-2 border"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
          </button>
        </div>

        {loading ? (
          <div className="p-20 text-center">
            <Loader2 className="animate-spin h-10 w-10 text-indigo-600 mx-auto" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={380}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip />
              <Bar dataKey="stock" fill="#4f46e5" radius={[12, 12, 0, 0]} barSize={60} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}