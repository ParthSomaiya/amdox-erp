import { useEffect, useState } from "react";
import API from "../services/api";

export default function Bills() {
  const [bills, setBills] = useState([]);

  useEffect(() => {
    API.get("/ap").then((res) => setBills(res.data));
  }, []);

  const payBill = async (id) => {
    await API.put("/ap/pay", { id });
    window.location.reload();
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm">
        <h2 className="text-2xl font-black text-slate-800 mb-6">Bills Overview</h2>

        <div className="space-y-4">
          {bills.length === 0 ? (
            <p className="text-slate-500">No bills found.</p>
          ) : (
            bills.map((b) => (
              <div key={b._id} className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex justify-between items-center">
                <div>
                  <p className="font-bold text-slate-800">{b.vendorId?.name || "Unknown Vendor"}</p>
                  <p className="text-sm text-slate-500 mt-1">Amount Due: ₹{b.amount}</p>
                </div>

                {b.status === "UNPAID" && (
                  <button
                    onClick={() => payBill(b._id)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-xl transition"
                  >
                    Pay Bill
                  </button>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}