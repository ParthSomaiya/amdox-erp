import { useEffect, useState } from "react";
import API from "../services/api";

export default function GL() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    API.get("/gl").then((res) => setEntries(res.data));
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm">
        <h2 className="text-2xl font-black text-slate-800 mb-6">General Ledger</h2>

        <div className="space-y-4">
          {entries.length === 0 ? (
            <p className="text-slate-500">No ledger entries found.</p>
          ) : (
            entries.map((e) => (
              <div key={e._id} className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <p className="font-bold text-slate-800 text-lg mb-3">{e.description}</p>
                {e.entries?.map((item, i) => (
                  <div key={i} className="text-sm text-slate-600 flex justify-between py-1 border-b border-slate-100 last:border-0">
                    <span className="font-medium">{item.account}</span>
                    <span>
                      Debit: ₹{item.debit} / Credit: ₹{item.credit}
                    </span>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}