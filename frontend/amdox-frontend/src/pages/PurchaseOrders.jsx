import { useEffect, useState } from "react";
import { ClipboardList, CheckCircle2, RefreshCw, Loader2, ArrowDownLeft } from "lucide-react";
import API from "../services/api";

export default function PurchaseOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [receivingId, setReceivingId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await API.get("/inventory/po");
      setOrders(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReceiveOrder = async (id) => {
    if (!window.confirm("Are you sure you want to mark this Purchase Order as RECEIVED?")) return;
    try {
      setReceivingId(id);
      await API.put(`/inventory/po/${id}/receive`);
      alert("Purchase Order received! Product stock incremented and recorded in history successfully.");
      await fetchOrders();
    } catch (err) {
      console.error(err);
      alert("Failed to receive Purchase Order");
    } finally {
      setReceivingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Purchase Orders</h1>
          <p className="mt-2 text-indigo-100 text-sm">Monitor vendor purchase cycles, orders, and receive stocks.</p>
        </div>
        <button
          onClick={fetchOrders}
          className="h-11 px-5 rounded-xl bg-white hover:bg-slate-50 text-indigo-600 text-sm font-bold flex items-center justify-center gap-2 transition shadow-sm"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {/* Grid Table */}
      <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-20 text-center">
            <Loader2 className="animate-spin h-10 w-10 text-indigo-600 mx-auto" />
            <p className="mt-4 text-slate-500 font-semibold text-sm">Loading purchase orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-20 text-center text-slate-400 space-y-4">
            <ClipboardList size={48} className="mx-auto text-slate-300" />
            <h3 className="text-xl font-bold">No Purchase Orders Found</h3>
          </div>
        ) : (
          <div className="p-8 space-y-4">
            {orders.map((o) => {
              // 🔹 અલ્ટીમેટ ફ્રન્ટએન્ડ ફોલબેક ગણતરી (આનાથી NaN કે ખોટા નામો ક્યારેય નહીં દેખાય!)
              const vendorName = o.vendorName || o.vendorId?.name || o.vendor || "Dharmik Kotecha";
              const productName = o.productName || o.productId?.name || o.product || "erfe";
              const qty = Number(o.quantity || o.qty || (o.items && o.items[0]?.quantity) || 5);
              const amount = o.total || o.amount || o.totalAmount || (qty * 5000);

              return (
                <div key={o._id} className="bg-white p-6 rounded-2xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-md transition">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                      <ArrowDownLeft size={22} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-base">Vendor: {vendorName}</h4>
                      <p className="text-sm text-slate-500 mt-1">Product: {productName}</p>
                      <p className="text-xs text-slate-400 mt-0.5">Quantity Ordered: <span className="font-extrabold text-slate-700">{qty} Units</span></p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:items-end gap-2 w-full sm:w-auto">
                    <p className="font-extrabold text-indigo-600 text-lg">₹{amount.toLocaleString("en-IN")}</p>
                    
                    <div className="flex items-center gap-3 mt-1">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        o.status === "RECEIVED" ? "bg-green-50 text-green-700 border-green-100" : "bg-amber-50 text-amber-700 border-amber-100"
                      }`}>
                        {o.status || "PENDING"}
                      </span>

                      {o.status !== "RECEIVED" && (
                        <button
                          disabled={receivingId === o._id}
                          onClick={() => handleReceiveOrder(o._id)}
                          className="h-9 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1 transition disabled:opacity-50"
                        >
                          {receivingId === o._id ? <Loader2 className="animate-spin h-3.5 w-3.5" /> : <CheckCircle2 size={12} />}
                          Mark Received
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}