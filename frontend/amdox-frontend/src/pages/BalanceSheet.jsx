import { useEffect, useState } from "react";
import API from "../services/api";
import notifier from "../utils/notifier";

export default function BalanceSheet() {
  const [data, setData] = useState({});

  const fetchData = async () => {
    try {
      const res = await API.get("/reports/balance-sheet");
      notifier.statementDownloaded("Balance Sheet Statement");
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
      <h2 className="text-2xl font-black text-slate-800 mb-6">Balance Sheet</h2>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white p-6 shadow-sm border rounded-3xl flex items-center justify-between">
          <div>
            <h3 className="text-xs text-slate-400 font-bold uppercase tracking-wider">Assets</h3>
            <p className="text-3xl font-black text-green-600 mt-2">
              ₹{data.assets || 0}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 shadow-sm border rounded-3xl flex items-center justify-between">
          <div>
            <h3 className="text-xs text-slate-400 font-bold uppercase tracking-wider">Liabilities</h3>
            <p className="text-3xl font-black text-rose-500 mt-2">
              ₹{data.liabilities || 0}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 shadow-sm border rounded-3xl flex items-center justify-between">
          <div>
            <h3 className="text-xs text-slate-400 font-bold uppercase tracking-wider">Equity</h3>
            <p className="text-3xl font-black text-indigo-600 mt-2">
              ₹{data.equity || 0}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}