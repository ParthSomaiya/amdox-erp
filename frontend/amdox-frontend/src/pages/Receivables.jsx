import { useEffect, useState } from "react";
import API from "../services/api";

export default function Receivables() {
  const [data, setData] = useState([]);

  useEffect(() => {
    API.get("/ar").then((res) => setData(res.data));
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm">
        <h2 className="text-2xl font-black text-slate-800 mb-6">Receivables</h2>

        <div className="space-y-4">
          {data.length === 0 ? (
            <p className="text-slate-500">No receivables found.</p>
          ) : (
            data.map((i) => (
              <div key={i._id} className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex justify-between items-center">
                <p className="font-bold text-slate-800">{i.customerName || "Customer"}</p>
                <p className="font-extrabold text-emerald-600">₹{i.amount}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}