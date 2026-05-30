import { useEffect, useState } from "react";
import { AlertTriangle, ChevronRight, PackageOpen, RefreshCw, Loader2 } from "lucide-react";
import API from "../../services/api";

export default function LowStock() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLowStock();
  }, []);

  const fetchLowStock = async () => {
    try {
      setLoading(true);
      const res = await API.get("/inventory/low-stock");
      setProducts(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-600 to-red-600 rounded-3xl p-8 text-white shadow-md flex items-center justify-between">
        <div>
          <span className="text-xs uppercase tracking-widest text-rose-100 font-bold">Real-time Warning</span>
          <h1 className="text-3xl font-black mt-1 flex items-center gap-2">
            <AlertTriangle className="animate-bounce" /> Low Stock Alerts
          </h1>
          <p className="text-rose-100 text-sm mt-2">These products are below their minimum threshold limits.</p>
        </div>
        <button
          onClick={fetchLowStock}
          className="h-10 w-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center border border-white/10 transition"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="p-20 text-center">
          <Loader2 className="animate-spin h-10 w-10 text-rose-600 mx-auto" />
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-3xl border p-20 text-center space-y-4 shadow-sm">
          <PackageOpen size={48} className="mx-auto text-emerald-500" />
          <h3 className="text-xl font-bold text-slate-800">All Stocks are Healthy!</h3>
          <p className="text-slate-400 text-sm">Every single product is above safety limits.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {products.map((p) => {
            const qty = p.quantity || p.stock || 0;
            return (
              <div
                key={p._id}
                className="bg-white rounded-2xl border border-rose-100 p-5 flex items-center justify-between shadow-sm hover:shadow-md transition duration-200 border-l-4 border-l-rose-500"
              >
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                    <AlertTriangle size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">{p.name}</h3>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                      Limit Set: {p.lowStockLimit || 15} Units
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="px-4 py-1.5 rounded-full text-xs font-black bg-rose-50 text-rose-700 border border-rose-100">
                    Only {qty} left
                  </span>
                  <ChevronRight size={18} className="text-slate-300" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}