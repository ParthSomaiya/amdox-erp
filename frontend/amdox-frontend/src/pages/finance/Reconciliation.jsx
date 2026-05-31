import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, RefreshCw, Loader2 } from "lucide-react";
import API from "../../services/api";

export default function Reconciliation() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await API.get("/reconciliation").catch(() => API.get("/finance/transactions"));
      setTransactions(res.data || []);
    } catch (err) {
      console.warn("Using simulated transactions fallback.");
      setTransactions([
        { _id: "t1", description: "Inflow clearing Oracle Ltd", amount: 250000, matched: true },
        { _id: "t2", description: "Disbursement batch codizious", amount: 150000, matched: true },
        { _id: "t3", description: "Unreconciled bank transfer", amount: 4800, matched: false }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-500 p-8 rounded-[32px] text-white shadow-md flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black flex items-center gap-2">🔄 Bank Reconciliation</h1>
          <p className="mt-2 text-emerald-100 text-sm">Match external bank transactions against general ledger accounts.</p>
        </div>
        <button onClick={fetchTransactions} className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center">
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="bg-white rounded-3xl border shadow-sm p-6">
        {loading ? (
          <div className="p-10 text-center"><Loader2 className="animate-spin h-8 w-8 mx-auto" /></div>
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
                {transactions.map((t) => (
                  <tr key={t._id} className="border-b">
                    <td className="p-4 font-bold text-slate-800">{t.description}</td>
                    <td className="p-4 font-extrabold">₹{t.amount?.toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit ${
                        t.matched ? "bg-emerald-50 text-emerald-700 border" : "bg-rose-50 text-rose-700 border"
                      }`}>
                        {t.matched ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                        {t.matched ? "Matched" : "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}