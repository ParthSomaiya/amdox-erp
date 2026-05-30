import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, RefreshCw, Loader2, DollarSign } from "lucide-react";
import API from "../../services/api";

export default function Reconciliation() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await API.get("/reconciliation").catch(() => API.get("/finance/transactions"));
      setTransactions(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-500 p-8 rounded-[32px] text-white shadow-md flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black flex items-center gap-2">🔄 Bank Reconciliation</h1>
          <p className="mt-2 text-emerald-100 text-sm">Match external bank transactions against general ledger accounts.</p>
        </div>
        <button
          onClick={fetchTransactions}
          className="h-10 w-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center border border-white/10 transition"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Grid Table */}
      <div className="bg-white rounded-3xl border shadow-sm overflow-hidden p-6">
        {loading ? (
          <div className="p-20 text-center">
            <Loader2 className="animate-spin h-8 w-8 text-indigo-600 mx-auto" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-slate-600">
              <thead className="bg-slate-50 border-b text-xs uppercase font-bold text-slate-700">
                <tr>
                  <th className="p-4 text-left">Description</th>
                  <th className="p-4 text-left">Amount</th>
                  <th className="p-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center p-8 text-slate-400">No bank transactions found.</td>
                  </tr>
                ) : (
                  transactions.map((t) => (
                    <tr key={t._id} className="border-b hover:bg-slate-50/50 transition">
                      <td className="p-4 font-bold text-slate-800">{t.description || "Wire Transfer"}</td>
                      <td className="p-4 font-extrabold text-slate-700">₹{t.amount}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit ${
                          t.matched ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-rose-50 text-rose-700 border border-rose-100"
                        }`}>
                          {t.matched ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                          {t.matched ? "Matched" : "Pending"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}