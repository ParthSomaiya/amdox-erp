import { useEffect, useState } from "react";
import { History, ArrowDownLeft, ArrowUpRight, ClipboardList, Loader2 } from "lucide-react";
import API from "../services/api";

export default function StockHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await API.get("/inventory/history");
      setHistory(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-500 rounded-3xl p-8 text-white shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">🕒 Stock History</h1>
          <p className="mt-2 text-teal-100 text-sm">Trace the complete inbound and outbound inventory movements.</p>
        </div>
        <div className="hidden sm:flex h-16 w-16 rounded-2xl bg-white/10 backdrop-blur-md items-center justify-center">
          <History size={28} />
        </div>
      </div>

      {/* History Cards */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden p-6 space-y-4">
        {loading ? (
          <div className="p-20 text-center">
            <Loader2 className="animate-spin h-10 w-10 text-indigo-600 mx-auto" />
            <p className="mt-4 text-slate-500 font-semibold text-sm">Syncing stock logs...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="p-20 text-center text-slate-400">
            <ClipboardList size={48} className="mx-auto text-slate-300 mb-2" />
            <h3 className="text-xl font-bold">No History Logs Found</h3>
          </div>
        ) : (
          history.map((item) => (
            <div key={item._id} className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                  item.type === "IN" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                }`}>
                  {item.type === "IN" ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{item.productName || "Product"}</h4>
                  <p className="text-xs text-slate-500 mt-1">{item.reason}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  item.type === "IN" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                }`}>
                  {item.type === "IN" ? `+ ${item.quantity}` : `- ${item.quantity}`} Units
                </span>
                <p className="text-[10px] text-slate-400 font-medium mt-2">
                  {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}