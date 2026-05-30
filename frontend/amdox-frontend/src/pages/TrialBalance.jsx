import { useEffect, useState } from "react";
import API from "../services/api";
import notifier from "../utils/notifier";

export default function TrialBalance() {
  const [data, setData] = useState({});
  const [from, setFrom] = useState("2026-01-01");
  const [to, setTo] = useState("2026-12-31");

  const fetchData = async () => {
    try {
      const res = await API.get(`/reports/trial-balance?from=${from}&to=${to}`);
      notifier.statementDownloaded("Trial Balance Statement");
      setData(res.data || {});
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm">
        <h2 className="text-2xl font-black text-slate-800 mb-4">Trial Balance</h2>

        <div className="flex gap-4 mb-6">
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="border p-2 rounded-xl text-sm" />
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="border p-2 rounded-xl text-sm" />
          <button onClick={fetchData} className="bg-indigo-600 text-white px-4 rounded-xl text-sm font-bold">
            Apply
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-slate-600">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="p-4 text-left font-semibold">Account</th>
                <th className="p-4 text-left font-semibold">Debit</th>
                <th className="p-4 text-left font-semibold">Credit</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(data).length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center p-8 text-slate-400">No balance records found.</td>
                </tr>
              ) : (
                Object.keys(data).map((acc) => (
                  <tr key={acc} className="border-b hover:bg-slate-50/50 transition">
                    <td className="p-4 font-bold text-slate-800">{acc}</td>
                    <td className="p-4 text-green-600 font-bold">₹{data[acc].debit}</td>
                    <td className="p-4 text-rose-500 font-bold">₹{data[acc].credit}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}