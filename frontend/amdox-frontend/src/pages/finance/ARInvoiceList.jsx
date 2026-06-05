import { useState, useEffect, useMemo } from "react";
import { Landmark, Loader2, Calendar, ShieldCheck } from "lucide-react";
import API from "../../services/api";

export default function ARInvoiceList() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInvoices();
  }, []);

  const loadInvoices = async () => {
    try {
      setLoading(true);
      const res = await API.get("/finance/invoice");
      setInvoices(res.data || []);
    } catch (err) {
      const savedInvoices = localStorage.getItem("amdox_simulated_invoices");
      if (savedInvoices) {
        setInvoices(JSON.parse(savedInvoices));
      } else {
        const dummyInvoices = [
          { _id: "i1", clientName: "Reliance Industries", amount: 150000, status: "UNPAID", createdAt: new Date(Date.now() - 10*24*60*60*1000).toISOString() },
          { _id: "i2", clientName: "TATA Consultancy Services", amount: 280000, status: "UNPAID", createdAt: new Date(Date.now() - 40*24*60*60*1000).toISOString() }
        ];
        setInvoices(dummyInvoices);
        localStorage.setItem("amdox_simulated_invoices", JSON.stringify(dummyInvoices));
      }
    } finally {
      setLoading(false);
    }
  };

  const totalOutstanding = useMemo(() => {
    return invoices
      .filter(inv => inv.status !== "PAID")
      .reduce((sum, inv) => sum + (inv.amount || 0), 0);
  }, [invoices]);

  return (
    <div className="bg-white border rounded-[32px] p-6 shadow-sm space-y-6 max-w-5xl mx-auto">
      <div className="pb-4 border-b flex justify-between items-center">
        <div>
          <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
            <Landmark className="text-indigo-600" /> Accounts Receivable (AR) Ledger
          </h2>
          <p className="text-xs text-slate-400 mt-1">Monitor outstanding client invoices and incoming credit turnover cashflow</p>
        </div>
        <span className="font-black text-rose-500 text-sm">Outstanding: ₹{totalOutstanding.toLocaleString()}</span>
      </div>

      {loading ? (
        <div className="p-12 text-center"><Loader2 className="animate-spin text-indigo-600 mx-auto" /></div>
      ) : invoices.length === 0 ? (
        <p className="text-xs text-slate-400 italic text-center py-6">No credit sales registered in the ledger.</p>
      ) : (
        <div className="space-y-4">
          {invoices.map(inv => (
            <div key={inv._id} className="p-4 border rounded-2xl bg-slate-50/50 flex items-center justify-between gap-4">
              <div>
                <h4 className="font-extrabold text-slate-800 text-sm">{inv.clientName}</h4>
                <p className="text-[10px] text-slate-400 font-bold mt-1">Invoice Date: {new Date(inv.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-black text-slate-800 text-sm">₹{inv.amount?.toLocaleString()}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                  inv.status === "PAID" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-rose-50 text-rose-700 border border-rose-100"
                }`}>
                  {inv.status || "UNPAID"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}