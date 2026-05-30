import { useEffect, useState } from "react";
import { Receipt, FileText, Check, Loader2, RefreshCw } from "lucide-react";
import API from "../services/api";

export default function Bills() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState(null);

  const fetchBills = async () => {
    try {
      setLoading(true);
      const res = await API.get("/ap");
      setBills(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const payBill = async (id) => {
    try {
      setPayingId(id);
      await API.put("/ap/pay", { id });
      alert("Bill paid successfully!");
      await fetchBills(); // રીલોડ ડેટા
    } catch (err) {
      console.error(err);
      alert("Failed to process bill payment");
    } finally {
      setPayingId(null);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 p-8 rounded-[32px] text-white shadow-md flex items-center justify-between">
        <div>
          <span className="text-xs uppercase tracking-widest text-indigo-100 font-bold">Accounts Payable</span>
          <h1 className="text-3xl font-black mt-1 flex items-center gap-2">
            <Receipt /> Vendor Bills Overview
          </h1>
          <p className="text-indigo-100 text-sm mt-2">Manage and clear outstanding bills from your third-party suppliers.</p>
        </div>
        <button
          onClick={fetchBills}
          className="h-10 w-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center border border-white/10 transition"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* List */}
      {loading ? (
        <div className="p-20 text-center">
          <Loader2 className="animate-spin h-10 w-10 text-indigo-600 mx-auto" />
        </div>
      ) : bills.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border text-slate-400">
          No pending bills found. All clear!
        </div>
      ) : (
        <div className="space-y-4">
          {bills.map((b) => (
            <div key={b._id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex items-center justify-between hover:shadow-md transition">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center">
                  <FileText size={22} />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-800 text-sm">{b.vendorId?.name || "Vendor Supplier"}</h3>
                  <p className="text-xs text-slate-400 mt-1">Pending Inflow Reference</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span className="font-black text-rose-500 text-lg">₹{b.amount?.toLocaleString("en-IN")}</span>
                
                {b.status === "UNPAID" ? (
                  <button
                    disabled={payingId === b._id}
                    onClick={() => payBill(b._id)}
                    className="h-10 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition disabled:opacity-50"
                  >
                    {payingId === b._id ? <Loader2 className="animate-spin h-3.5 w-3.5" /> : <Check size={14} />}
                    Pay Bill
                  </button>
                ) : (
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-100">
                    Paid ✓
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}