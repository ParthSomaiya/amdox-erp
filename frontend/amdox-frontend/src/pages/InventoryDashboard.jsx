import { useEffect, useState, useMemo } from "react";
import { Package, AlertTriangle, Coins, RefreshCw, Loader2, ArrowUpRight, TrendingUp, ShieldCheck } from "lucide-react";
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
      setStats(res.data || {});
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* 🚀 Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 rounded-[32px] p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest text-emerald-100 font-bold">Warehouse Operations</span>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight flex items-center gap-2">
              📦 Inventory Dashboard
            </h1>
            <p className="text-emerald-100 text-sm max-w-xl">
              Monitor real-time warehouse stocks, total asset valuations, and low-level alerts.
            </p>
          </div>
          <button
            onClick={fetchDashboard}
            className="h-12 px-6 rounded-2xl bg-white hover:bg-slate-50 text-teal-600 text-sm font-bold flex items-center justify-center gap-2 transition shadow-lg shadow-teal-600/10 hover:scale-[1.02] shrink-0"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh Stats
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-20 text-center">
          <Loader2 className="animate-spin h-10 w-10 text-teal-600 mx-auto" />
        </div>
      ) : (
        <>
          {/* 🚀 Stats Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Total Products Card */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex items-center justify-between hover:shadow-md transition duration-200">
              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Products</span>
                <h2 className="text-4xl font-black text-slate-800">{stats.totalProducts || 0}</h2>
                <span className="text-[10px] text-slate-400 font-semibold block pt-1">Active items registered</span>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center shadow-inner">
                <Package size={26} />
              </div>
            </div>

            {/* Low Stock Alerts Card */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex items-center justify-between hover:shadow-md transition duration-200">
              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Low Stock Alerts</span>
                <h2 className="text-4xl font-black text-rose-600">{stats.lowStock || 0}</h2>
                <span className="text-[10px] text-rose-400 font-semibold block pt-1">Items needing reorder</span>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shadow-inner">
                <AlertTriangle size={26} className="animate-pulse" />
              </div>
            </div>

            {/* Total Value Card */}
            <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex items-center justify-between hover:shadow-md transition duration-200">
              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Stock Value</span>
                <h2 className="text-4xl font-black text-emerald-600">₹{(stats.totalValue || 0).toLocaleString()}</h2>
                <span className="text-[10px] text-emerald-400 font-semibold block pt-1">Net asset valuation</span>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner">
                <Coins size={26} />
              </div>
            </div>

          </div>

          {/* 🚀 Quick Insights Section */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-4 border-b">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Operational Health Check</h2>
                <p className="text-xs text-slate-400">Warehouse storage optimization index and safety thresholds</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center border text-slate-400">
                <ArrowUpRight size={14} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 bg-slate-50/50 border rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
                  <TrendingUp size={16} /> Asset Efficiency
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  The current total stock is distributed across {stats.totalProducts} active product SKUs. Keep threshold values optimized to maintain an ideal inventory turnover.
                </p>
              </div>

              <div className="p-5 bg-slate-50/50 border rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
                  <AlertTriangle size={16} /> Reorder Prompting
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  There are currently {stats.lowStock} products identified with critical stock levels. It is recommended to use the Reorder Forecasting model to draft purchase orders.
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-semibold pt-4">
        <ShieldCheck size={14} /> SaaS Multi-Tenant Warehouse Operations Engine Active
      </div>
    </div>
  );
}