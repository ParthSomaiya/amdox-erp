import { useEffect, useState } from "react";
import { Grid, Loader2 } from "lucide-react";
import API from "../../services/api";

export default function WarehouseHeatmap() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/inventory/product")
      .then((res) => setProducts(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const getHeatColor = (qty) => {
    if (qty > 100) return "bg-emerald-500 text-white";
    if (qty > 30) return "bg-sky-500 text-white";
    if (qty > 10) return "bg-amber-500 text-white";
    return "bg-rose-500 text-white";
  };

  if (loading) {
    return (
      <div className="p-20 text-center">
        <Loader2 className="animate-spin h-10 w-10 text-indigo-600 mx-auto" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 border shadow-sm">
        <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
          <Grid size={20} className="text-indigo-600" /> Warehouse Stock Heatmap
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          {products.length === 0 ? (
            <p className="text-slate-500 text-sm col-span-full">No products in inventory registry.</p>
          ) : (
            products.map((p) => {
              const qty = p.quantity || p.stock || 0;
              return (
                <div key={p._id} className={`p-4 rounded-2xl border text-center font-bold ${getHeatColor(qty)}`}>
                  <p className="text-xs truncate">{p.name}</p>
                  <p className="text-lg mt-2">{qty} U</p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}