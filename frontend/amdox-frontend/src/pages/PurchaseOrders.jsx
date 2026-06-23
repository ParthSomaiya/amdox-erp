import { useEffect, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { ClipboardList, CheckCircle2, RefreshCw, Loader2, ArrowDownLeft, X, Check, ShieldCheck, Trash2 } from "lucide-react";
import API from "../services/api";
import notifier from "../utils/notifier";

export default function PurchaseOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [receivingId, setReceivingId] = useState(null);

  // સક્સેસ અને ડિલીટ પોપ-અપ સ્ટેટ્સ
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successData, setSuccessData] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  // 🚀 ૧. ડીલીટ થયેલા આઈડીને ટ્રેક કરવા માટેના હેલ્પર ફંક્શન્સ
  const getDeletedOrderIds = () => {
    try {
      return JSON.parse(localStorage.getItem("amdox_deleted_po_ids") || "[]");
    } catch {
      return [];
    }
  };

  const addDeletedOrderId = (id) => {
    const deletedIds = getDeletedOrderIds();
    if (!deletedIds.includes(id)) {
      deletedIds.push(id);
      localStorage.setItem("amdox_deleted_po_ids", JSON.stringify(deletedIds));
    }
  };

  // લોકલ સ્ટોરેજ સેફ લોડર
  const loadFallbackOrders = () => {
    const saved = localStorage.getItem("amdox_simulated_pos");
    if (saved) {
      return JSON.parse(saved);
    } else {
      const defaultOrders = [
        { _id: "po-1", vendorName: "Dharmik Kotecha", productName: "Amdox ProjectFlow", quantity: 5, total: 44999, status: "PENDING", createdAt: new Date().toISOString() }
      ];
      localStorage.setItem("amdox_simulated_pos", JSON.stringify(defaultOrders));
      return defaultOrders;
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await API.get("/inventory/po");
      const serverData = Array.isArray(res.data) ? res.data : [];
      
      const localData = loadFallbackOrders();
      const merged = [...serverData];
      localData.forEach(lo => {
        if (!merged.some(so => so._id === lo._id)) merged.push(lo);
      });

      // 🚀 ૨. ફિલ્ટરઆઉટ ગાર્ડ: ડીલીટ થયેલા ઓર્ડર્સને લિસ્ટમાં ફિલ્ટર કરો
      const deletedIds = getDeletedOrderIds();
      const activeOrders = merged.filter(o => !deletedIds.includes(o._id));
      
      setOrders(activeOrders);
    } catch (err) {
      console.warn("Using consolidated local offline storage registry.");
      const localData = loadFallbackOrders();
      const deletedIds = getDeletedOrderIds();
      const activeOrders = localData.filter(o => !deletedIds.includes(o._id));
      setOrders(activeOrders);
    } finally {
      setLoading(false);
    }
  };

  const handleReceiveOrder = async (orderObj) => {
    try {
      setReceivingId(orderObj._id);
      await API.put(`/inventory/po/${orderObj._id}/receive`);

      const vendorName = orderObj.vendorName || orderObj.vendorId?.name || "Vendor Partner";
      const productName = orderObj.productName || orderObj.productId?.name || orderObj.product || "Product SKU";
      const qty = Number(orderObj.quantity || orderObj.qty || 5);

      window.triggerAmdoxNotification?.(
        "Inventory Stock Received", 
        `Successfully received shipment from ${vendorName} (${productName}). Warehouse stock incremented.`, 
        "SCM"
      );

      setSuccessData({
        vendorName,
        productName,
        quantity: qty,
        orderId: orderObj._id,
        status: "RECEIVED"
      });
      setShowSuccessModal(true);
      await fetchOrders();
    } catch (err) {
      console.warn("API offline: Executing local receipt processing.");
      const localData = loadFallbackOrders();
      const updated = localData.map(o => o._id === orderObj._id ? { ...o, status: "RECEIVED" } : o);
      localStorage.setItem("amdox_simulated_pos", JSON.stringify(updated));
      setOrders(updated);

      setSuccessData({
        vendorName: orderObj.vendorName || orderObj.vendorId?.name || "Vendor Partner",
        productName: orderObj.productName || orderObj.productId?.name || "Product SKU",
        quantity: Number(orderObj.quantity || orderObj.qty || 5),
        orderId: orderObj._id,
        status: "RECEIVED"
      });
      setShowSuccessModal(true);
    } finally {
      setReceivingId(null);
    }
  };

  // 🚨 ડીલીટ ફંક્શન - બ્રાઉઝર મેમરીમાં કાયમી રેકોર્ડ સાથે ડિલીટ કરો
  const handleDeleteOrder = async (orderObj) => {
    if (!window.confirm("Are you sure you want to permanently DELETE this Purchase Order?")) return;
    try {
      setReceivingId(orderObj._id);
      
      // ૩. રિયલ-ટાઇમ રદ થયેલ ઓર્ડર આઈડી લોકલ સ્ટોરેજમાં રજીસ્ટર કરો
      addDeletedOrderId(orderObj._id);

      await API.delete(`/inventory/po/${orderObj._id}`).catch(() => {
        console.warn("API delete offline, handled locally.");
      });

      const vendorName = orderObj.vendorName || orderObj.vendorId?.name || "Vendor";
      const productName = orderObj.productName || orderObj.productId?.name || "Product";

      window.triggerAmdoxNotification?.(
        "Purchase Order Purged", 
        `Purchase order of ${productName} from ${vendorName} was purged.`, 
        "SCM"
      );

      // ઓટોમેટિક સ્ટેટ અપડેટ
      setOrders(prev => prev.filter(o => o._id !== orderObj._id));

      setSuccessData({
        vendorName,
        productName,
        quantity: orderObj.quantity || 0,
        orderId: orderObj._id,
        status: "DELETED"
      });
      setShowSuccessModal(true);
    } catch (err) {
      console.error(err);
    } finally {
      setReceivingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 p-8 rounded-3xl text-white shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Purchase Orders</h1>
          <p className="mt-2 text-indigo-100 text-sm">Monitor vendor purchase cycles, orders, and receive stocks.</p>
        </div>
        <button
          onClick={fetchOrders}
          className="h-11 px-5 rounded-xl bg-white hover:bg-slate-50 text-indigo-600 text-sm font-bold flex items-center justify-center gap-2 transition shadow-sm cursor-pointer animate-none"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {/* Orders List */}
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
            {orders.map((o, index) => {
              const vendorName = o.vendorId?.name || o.vendorName || o.vendor || "Vendor Partner";
              const productName = o.productName || o.productId?.name || o.product || "Product SKU";
              const qty = Number(o.quantity || o.qty || 5);
              const amount = o.total || o.amount || o.totalAmount || (qty * 5000);

              const isPending = !o.status || o.status === "PENDING";

              return (
                <div key={o._id || index} className="bg-white p-6 rounded-2xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-md transition">
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
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase ${
                        o.status === "RECEIVED" ? "bg-green-50 text-green-700 border-green-100" :
                        o.status === "REJECTED" ? "bg-rose-50 text-rose-700 border-rose-100" : "bg-amber-50 text-amber-700 border-amber-100"
                      }`}>
                        {o.status || "PENDING"}
                      </span>

                      {isPending && (
                        <div className="flex gap-1.5">
                          <button
                            disabled={receivingId === o._id}
                            onClick={() => handleReceiveOrder(o)}
                            className="h-9 px-3.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1 transition disabled:opacity-50 cursor-pointer"
                          >
                            Mark Received
                          </button>
                          <button
                            disabled={receivingId === o._id}
                            onClick={() => handleDeleteOrder(o)}
                            className="h-9 px-3 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 font-bold text-xs flex items-center justify-center gap-1 cursor-pointer"
                            title="Delete Purchase Order"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* DEDICATED TRANSACTION RESPONSE MODAL (SUCCESS/DELETE) */}
      {showSuccessModal && successData && createPortal(
        <div className="fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-5 mx-auto animate-in fade-in zoom-in-95 duration-150 text-center">
            
            <div className={`h-14 w-14 rounded-full flex items-center justify-center mx-auto ${
              successData.status === "RECEIVED" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
            }`}>
              {successData.status === "RECEIVED" ? (
                <Check className="stroke-[3]" size={28} />
              ) : (
                <X className="stroke-[3]" size={28} />
              )}
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-slate-900">
                {successData.status === "RECEIVED" ? "Shipment Received Successfully!" : "Purchase Order Purged"}
              </h3>
              <p className="text-xs text-slate-500">The procurement transaction status has been updated in the SCM general ledger.</p>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs font-semibold text-slate-700 space-y-2 text-left font-mono">
              <div className="flex justify-between border-b pb-1.5">
                <span className="text-slate-400">Order Ref:</span>
                <span>#{successData.orderId?.slice(-6)}</span>
              </div>
              <div className="flex justify-between border-b pb-1.5">
                <span className="text-slate-400">Vendor Partner:</span>
                <span className="truncate max-w-[200px]">{successData.vendorName}</span>
              </div>
              <div className="flex justify-between border-b pb-1.5">
                <span className="text-slate-400">Product:</span>
                <span className="truncate max-w-[200px]">{successData.productName}</span>
              </div>
              <div className={`flex justify-between ${
                successData.status === "RECEIVED" ? "text-emerald-600" : "text-rose-600"
              }`}>
                <span>{successData.status === "RECEIVED" ? "Stock Incremented:" : "Registry Status:"}</span>
                <span>{successData.status === "RECEIVED" ? `+${successData.quantity} Units` : "PURGED/DELETED"}</span>
              </div>
            </div>

            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl transition active:scale-95 shadow-md shadow-indigo-600/10 cursor-pointer"
            >
              Continue Dashboard
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}