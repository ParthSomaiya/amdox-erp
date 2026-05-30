import { useEffect, useState, useMemo } from "react";
import { Loader2, RefreshCw, BarChart2, Coins, ArrowUpDown, ShieldCheck } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import API from "../../services/api";

export default function InventoryAnalytics() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await API.get("/inventory/product");
      setProducts(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const totalProducts = products.length;
    const totalStock = products.reduce((acc, p) => acc + (p.quantity || p.stock || 0), 0);
    const totalValue = products.reduce((acc, p) => acc + (p.price * (p.quantity || p.stock || 0)), 0);

    return { totalProducts, totalStock, totalValue };
  }, [products]);

  const chartData = useMemo(() => {
    return products.map((p) => ({
      name: p.name,
      stock: p.quantity || p.stock || 0,
    }));
  }, [products]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 p-8 rounded-[32px] text-white shadow-sm flex items-center justify-between">
        <div>
          <span className="text-xs uppercase tracking-widest text-indigo-100 font-bold">Metrics Dashboard</span>
          <h1 className="text-3xl font-black mt-1 flex items-center gap-2">
            <BarChart2 /> Inventory Analytics
          </h1>
          <p className="text-indigo-100 text-sm mt-2">Overview of financial asset valuations and stock turnovers.</p>
        </div>
        <button
          onClick={fetchAnalytics}
          className="h-10 w-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center border border-white/10 transition"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase">Items Registered</span>
            <h2 className="text-3xl font-black text-slate-800 mt-2">{stats.totalProducts}</h2>
          </div>
          <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center"><BarChart2 /></div>
        </div>

        <div className="bg-white border rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase">Total Volume</span>
            <h2 className="text-3xl font-black text-slate-800 mt-2">{stats.totalStock}</h2>
          </div>
          <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"><ArrowUpDown /></div>
        </div>

        <div className="bg-white border rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase">Valuation (INR)</span>
            <h2 className="text-3xl font-black text-emerald-600 mt-2">₹{stats.totalValue?.toLocaleString()}</h2>
          </div>
          <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><Coins /></div>
        </div>
      </div>

      {/* Recharts Allocation Area */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6">
        <div className="pb-4 border-b">
          <h2 className="text-lg font-bold text-slate-800">Stock Volume Metrics</h2>
          <p className="text-xs text-slate-400">Distribution analysis of available product stock sizes</p>
        </div>

        {loading ? (
          <div className="p-10 text-center">
            <Loader2 className="animate-spin h-8 w-8 text-indigo-600 mx-auto" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip />
              <Bar dataKey="stock" fill="#4f46e5" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-semibold pt-4">
        <ShieldCheck size={14} /> SaaS Multi-Tenant Warehouse Analytics System Active
      </div>
    </div>
  );
}