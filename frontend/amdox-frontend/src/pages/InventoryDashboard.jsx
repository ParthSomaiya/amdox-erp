import { useEffect, useState } from "react";
import { Package, AlertTriangle, Coins, RefreshCw, Loader2 } from "lucide-react";
import API from "../services/api";

export default function InventoryDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStock: 0,
    totalValue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await API.get("/inventory/dashboard");
      setStats(res.data || { totalProducts: 0, lowStock: 0, totalValue: 0 });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-20 text-center">
        <Loader2 className="animate-spin h-10 w-10 text-teal-600 mx-auto" />
        <p className="mt-4 text-slate-500 font-semibold text-sm">Aggregating live stock analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 rounded-[32px] p-8 text-white shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">📦 Inventory Dashboard</h1>
          <p className="mt-2 text-cyan-100 text-sm">Monitor real-time warehouse stocks, values, and alerts.</p>
        </div>
        <button
          onClick={fetchDashboard}
          className="h-11 px-5 rounded-xl bg-white hover:bg-slate-50 text-teal-600 text-sm font-bold flex items-center justify-center gap-2 transition shadow-sm"
        >
          <RefreshCw size={16} /> Refresh
        </button>
      </div>

      {/* 📊 KPI CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Products */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase">Total Products</span>
            <h2 className="text-3xl font-black text-slate-800 mt-2">{stats.totalProducts}</h2>
          </div>
          <div className="h-12 w-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
            <Package size={22} />
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase">Low Stock Alerts</span>
            <h2 className="text-3xl font-black text-rose-600 mt-2">{stats.lowStock}</h2>
          </div>
          <div className="h-12 w-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertTriangle size={22} className="animate-pulse" />
          </div>
        </div>

        {/* Total Value */}
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase">Total Stock Value</span>
            <h2 className="text-3xl font-black text-emerald-600 mt-2">₹{stats.totalValue?.toLocaleString()}</h2>
          </div>
          <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Coins size={22} />
          </div>
        </div>
      </div>
    </div>
  );
}