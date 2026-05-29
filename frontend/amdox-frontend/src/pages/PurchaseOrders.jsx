import { useEffect, useState } from "react";
import { Search, Loader2, ClipboardList } from "lucide-react";
import API from "../services/api";

export default function PurchaseOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/po")
      .then((res) => {
        setOrders(res.data || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-sm">
        <h1 className="text-3xl font-extrabold tracking-tight">Purchase Orders</h1>
        <p className="mt-2 text-indigo-100 text-sm">Monitor vendor purchase cycles, orders, and fulfillment statuses.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-20 text-center">
            <Loader2 className="animate-spin h-10 w-10 text-indigo-600 mx-auto" />
            <p className="mt-4 text-slate-500 font-semibold text-sm">Loading purchase orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-20 text-center text-slate-400 space-y-4">
            <ClipboardList size={48} className="mx-auto text-slate-300" />
            <h3 className="text-xl font-bold text-slate-700">No Purchase Orders Found</h3>
          </div>
        ) : (
          <div className="p-8 space-y-4">
            {orders.map((o) => (
              <div key={o._id} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex justify-between items-center">
                <div>
                  <h4 className="font-bold text-slate-800 text-base">Vendor: {o.vendorName || o.vendorId?.name || "AWS Cloud Services"}</h4>
                  <p className="text-sm text-slate-400 mt-1">Product: {o.productName || "Server Node License"}</p>
                </div>
                <div className="text-right">
                  <p className="font-extrabold text-indigo-600 text-lg">₹{o.total?.toLocaleString()}</p>
                  <span className="inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-100 mt-2">
                    {o.status || "APPROVED"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}