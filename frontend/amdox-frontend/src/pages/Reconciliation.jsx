import { useEffect, useState } from "react";
import API from "../services/api";

export default function Reconciliation() {
  const [data, setData] = useState([]);

  useEffect(() => {
    API.get("/reconciliation").then((res) => setData(res.data || []));
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm">
        <h2 className="text-2xl font-black text-slate-800 mb-6">Bank Reconciliation</h2>

        <div className="space-y-4">
          {data.length === 0 ? (
            <p className="text-slate-500">No reconciliation records found.</p>
          ) : (
            data.map((t) => (
              <div key={t._id} className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-800">Amount: ₹{t.amount}</p>
                  <p className="text-sm text-slate-400 mt-1">{t.description || "Bank transfer log"}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${t.matched ? "bg-emerald-50 text-emerald-700 border" : "bg-rose-50 text-rose-700 border"}`}>
                  {t.matched ? "Matched ✅" : "Pending ❌"}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}