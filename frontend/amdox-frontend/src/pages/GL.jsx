import { useEffect, useState } from "react";
import { BookOpen, RefreshCw, Loader2, ArrowUpRight, ArrowDownLeft, ShieldCheck } from "lucide-react";
import API from "../services/api";

export default function GL() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLedger = async () => {
    try {
      setLoading(true);
      const res = await API.get("/gl");
      setEntries(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLedger();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 p-8 rounded-[32px] text-white shadow-md flex items-center justify-between">
        <div>
          <span className="text-xs uppercase tracking-widest text-indigo-100 font-bold">Accounting Core</span>
          <h1 className="text-3xl font-black mt-1 flex items-center gap-2">
            <BookOpen /> General Ledger
          </h1>
          <p className="text-indigo-100 text-sm mt-2">Double-entry ledger logs, balanced debits and credits.</p>
        </div>
        <button
          onClick={fetchLedger}
          className="h-10 w-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center border border-white/10 transition"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Ledger List */}
      {loading ? (
        <div className="p-20 text-center">
          <Loader2 className="animate-spin h-10 w-10 text-indigo-600 mx-auto" />
        </div>
      ) : entries.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border text-slate-400">
          No ledger entries registered. Create invoices or pay bills to populate entries.
        </div>
      ) : (
        <div className="space-y-6">
          {entries.map((e) => (
            <div key={e._id} className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-extrabold text-slate-800 text-base">{e.description}</h3>
                <span className="text-xs text-slate-400 font-bold">ID: {e._id.slice(-6)}</span>
              </div>
              <div className="space-y-3">
                {e.entries?.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50/50 rounded-xl border text-sm">
                    <span className="font-bold text-slate-700">{item.account}</span>
                    <div className="flex gap-4 font-semibold text-xs">
                      <span className="text-emerald-600 flex items-center gap-1">
                        <ArrowDownLeft size={14} /> Debit: ₹{item.debit}
                      </span>
                      <span className="text-rose-500 flex items-center gap-1">
                        <ArrowUpRight size={14} /> Credit: ₹{item.credit}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}