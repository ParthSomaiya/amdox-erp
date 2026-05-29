import { useEffect, useState } from "react";
import { Search, Loader2, ClipboardList, CheckCircle } from "lucide-react";
import API from "../services/api";

export default function PurchaseOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    setLoading(true);
    setError("");
    API.get("/po")
      .then((res) => {
        setOrders(res.data || []);
      })
      .catch((err) => {
        console.error("Fetch orders error:", err);
        setError("Failed to load purchase orders. Please verify backend routes.");
      })
      .finally(() => setLoading(false));
  };

  // 🔹 ઓર્ડર એપ્રૂવ / રીસીવ હેન્ડલર
  const handleReceiveOrder = async (poId) => {
    try {
      setActionLoading(true);
      const res = await API.put(`/po/${poId}/receive`);
      alert(res.data.message || "Order marked as RECEIVED!");
      fetchOrders(); // લિસ્ટ અને સ્ટોક લાઈવ અપડેટ કરવા
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to process order receipt");
    } finally {
      setActionLoading(false);
    }
  };

  // 🔹 ડાયનેમિકલી પ્રોડક્ટનું નામ મેળવવાનું હેલ્પર
  const getProductName = (o) => {
    if (o.productName) return o.productName;
    if (o.items && o.items.length > 0) {
      return o.items.map(item => item.productId?.name || "Product").join(", ");
    }
    return "Server Node License";
  };

  // 🔹 ડાયનેમિકલી ટોટલ અમાઉન્ટ મેળવવાનું હેલ્પર
  const getTotalAmount = (o) => {
    if (o.total) return o.total;
    if (o.items && o.items.length > 0) {
      return o.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    }
    return 0;
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-sm">
        <h1 className="text-3xl font-extrabold tracking-tight">Purchase Orders</h1>
        <p className="mt-2 text-indigo-100 text-sm">Monitor vendor purchase cycles, orders, and fulfillment statuses.</p>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-600 rounded-2xl text-sm font-semibold">
          {error}
        </div>
      )}

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
              <div key={o._id} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h4 className="font-bold text-slate-800 text-base">
                    Vendor: {o.vendorName || o.vendorId?.name || "AWS Cloud Services"}
                  </h4>
                  <p className="text-sm text-slate-400 mt-1">
                    Product: {getProductName(o)}
                  </p>
                  
                  {/* 🔹 APPROVE / RECEIVE ACTION BUTTON FOR PENDING ORDERS */}
                  {o.status === "PENDING" && (
                    <button
                      onClick={() => handleReceiveOrder(o._id)}
                      disabled={actionLoading}
                      className="mt-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white disabled:text-slate-400 font-bold text-xs rounded-xl flex items-center gap-1.5 transition shadow-sm"
                    >
                      <CheckCircle size={14} /> Mark Received
                    </button>
                  )}
                </div>
                <div className="text-right flex flex-col items-end justify-center">
                  <p className="font-extrabold text-indigo-600 text-lg">
                    ₹{getTotalAmount(o).toLocaleString()}
                  </p>
                  <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold mt-2 border ${
                    o.status === "RECEIVED" 
                      ? "bg-green-50 text-green-700 border-green-100" 
                      : "bg-amber-50 text-amber-700 border-amber-100"
                  }`}>
                    {o.status || "PENDING"}
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