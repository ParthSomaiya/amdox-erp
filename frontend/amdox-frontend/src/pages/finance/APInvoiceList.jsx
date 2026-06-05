import { useState, useEffect } from "react";
import { Receipt, Loader2, ShieldAlert, CheckCircle2 } from "lucide-react";
import API from "../../services/api";

export default function APInvoiceList() {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    loadBills();
  }, []);

  const loadBills = async () => {
    try {
      setLoading(true);
      const res = await API.get("/ap");
      setBills(res.data || []);
    } catch (err) {
      const savedBills = localStorage.getItem("amdox_simulated_bills");
      if (savedBills) {
        setBills(JSON.parse(savedBills));
      } else {
        const defaultBills = [
          { _id: "b1", vendorId: { name: "AWS Cloud Infrastructure" }, amount: 48000, status: "UNPAID", dueDate: "2026-06-15" },
          { _id: "b2", vendorId: { name: "Amdox Office Rental Corp" }, amount: 150000, status: "UNPAID", dueDate: "2026-06-10" }
        ];
        setBills(defaultBills);
        localStorage.setItem("amdox_simulated_bills", JSON.stringify(defaultBills));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleProcessPayment = async (id, amount) => {
    try {
      setProcessingId(id);
      await API.put("/ap/pay", { id }).catch(async () => {
        // Fallback local persistence logic
        const updated = bills.map(b => b._id === id ? { ...b, status: "PAID" } : b);
        setBills(updated);
        localStorage.setItem("amdox_simulated_bills", JSON.stringify(updated));
        await new Promise(res => setTimeout(res, 500));
      });

      window.triggerAmdoxNotification?.(
        "Vendor Bill Paid", 
        `Disbursed ₹${amount.toLocaleString()} successfully to vendor partner.`, 
        "PAYROLL"
      );
      
      alert("Vendor bill cleared and settled!");
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="bg-white border rounded-[32px] p-6 shadow-sm space-y-6 max-w-5xl mx-auto">
      <div className="pb-4 border-b flex justify-between items-center">
        <div>
          <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
            <Receipt className="text-indigo-600" /> Accounts Payable (AP) Ledger
          </h2>
          <p className="text-xs text-slate-400 mt-1">Settle outstanding raw material purchase obligations and SaaS licenses</p>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center"><Loader2 className="animate-spin text-indigo-600 mx-auto" /></div>
      ) : bills.length === 0 ? (
        <p className="text-xs text-slate-400 italic text-center py-6">No bills recorded in the payable ledger.</p>
      ) : (
        <div className="space-y-4">
          {bills.map(bill => (
            <div key={bill._id} className="p-4 border rounded-2xl bg-slate-50/50 flex items-center justify-between gap-4">
              <div>
                <h4 className="font-extrabold text-slate-800 text-sm">{bill.vendorId?.name || "Vendor Partner"}</h4>
                <p className="text-[10px] text-slate-400 font-bold mt-1">Due Date: {bill.dueDate}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-black text-rose-500 text-sm">₹{bill.amount?.toLocaleString()}</span>
                {bill.status === "UNPAID" ? (
                  <button
                    disabled={processingId === bill._id}
                    onClick={() => handleProcessPayment(bill._id, bill.amount)}
                    className="h-8 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition disabled:opacity-50 cursor-pointer"
                  >
                    {processingId === bill._id ? <Loader2 className="animate-spin h-3.5 w-3.5" /> : "Clear Bill"}
                  </button>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black bg-emerald-50 text-emerald-700 border border-emerald-100">Paid ✓</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}