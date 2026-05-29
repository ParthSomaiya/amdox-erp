import { useEffect, useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import API from "../../services/api";

export default function LowStock() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/inventory/low-stock")
      .then((res) => {
        setProducts(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

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
        <h2 className="text-lg font-bold text-rose-600 mb-6 flex items-center gap-2">
          <AlertTriangle size={20} /> Low Stock Alerts
        </h2>
        <div className="space-y-3">
          {products.length === 0 ? (
            <p className="text-slate-500 text-sm">All products are healthy. No stock alerts.</p>
          ) : (
            products.map((p) => (
              <div key={p._id} className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex justify-between items-center">
                <span className="font-bold text-rose-800">{p.name}</span>
                <span className="font-bold text-rose-600">Only {p.quantity || p.stock || 0} left</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}