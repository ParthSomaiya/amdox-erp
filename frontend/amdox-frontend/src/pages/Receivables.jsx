import { useEffect, useState } from "react";
import { Landmark, ArrowUpRight, RefreshCw, Loader2, ShieldCheck } from "lucide-react";
import API from "../services/api";
import notifier from "../utils/notifier";

export default function Receivables() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReceivables = async () => {
    try {
      setLoading(true);
      const res = await API.get("/ar");
      notifier.receivablesViewed();
      setData(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceivables();
  }, []);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-500 p-8 rounded-[32px] text-white shadow-md flex items-center justify-between">
        <div>
          <span className="text-xs uppercase tracking-widest text-emerald-100 font-bold">Outstanding Inflows</span>
          <h1 className="text-3xl font-black mt-1 flex items-center gap-2">
            <Landmark /> Accounts Receivable (AR)
          </h1>
          <p className="text-emerald-100 text-sm mt-2">Monitor pending payments from corporate clients.</p>
        </div>
        <button
          onClick={fetchReceivables}
          className="h-10 w-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center border border-white/10 transition"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="p-20 text-center">
          <Loader2 className="animate-spin h-10 w-10 text-emerald-600 mx-auto" />
        </div>
      ) : data.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border text-slate-400">
          No active accounts receivables.
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((i) => (
            <div key={i._id} className="bg-white border rounded-3xl p-6 shadow-sm flex items-center justify-between hover:shadow-md transition">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Landmark size={22} />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-800 text-sm">{i.customerName || "Customer Client"}</h3>
                  <p className="text-xs text-slate-400 mt-1">Pending Inflow Reference</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-black text-emerald-600 text-lg">₹{i.amount?.toLocaleString("en-IN")}</span>
                <ArrowUpRight className="text-emerald-500" size={18} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}