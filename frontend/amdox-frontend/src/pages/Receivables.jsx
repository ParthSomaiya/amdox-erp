import { useEffect, useState, useMemo } from "react";
import { Landmark, Loader2, CheckCircle2, RefreshCw, Calendar } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import API from "../services/api";

export default function Receivables() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clearingId, setClearingId] = useState(null);

  const fetchReceivables = async () => {
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
          { _id: "i2", clientName: "TATA Consultancy Services", amount: 280000, status: "UNPAID", createdAt: new Date(Date.now() - 40*24*60*60*1000).toISOString() },
          { _id: "i3", clientName: "Wipro Tech", amount: 95000, status: "UNPAID", createdAt: new Date(Date.now() - 75*24*60*60*1000).toISOString() },
          { _id: "i4", clientName: "Infosys Ltd", amount: 180000, status: "PAID", createdAt: new Date().toISOString() }
        ];
        setInvoices(dummyInvoices);
        localStorage.setItem("amdox_simulated_invoices", JSON.stringify(dummyInvoices));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceivables();
  }, []);

  const handleRecordPayment = async (id, amount, clientName) => {
    try {
      setClearingId(id);
      await API.post("/finance/invoice/paid", { invoiceId: id }).catch(() => {
        const updated = invoices.map(inv => inv._id === id ? { ...inv, status: "PAID" } : inv);
        setInvoices(updated);
        localStorage.setItem("amdox_simulated_invoices", JSON.stringify(updated));
      });

      window.triggerAmdoxNotification?.(
        "Receivable Settle Run", 
        `Payment of ₹${amount.toLocaleString()} received from ${clientName}.`, 
        "FINANCE"
      );

      alert("Cash inflow successfully cleared!");
      fetchReceivables();
    } catch (err) {
      console.error(err);
    } finally {
      setClearingId(null);
    }
  };

  const agingData = useMemo(() => {
    let bracketA = 0; 
    let bracketB = 0; 
    let bracketC = 0; 
    let bracketD = 0; 

    invoices.filter(inv => inv.status !== "PAID").forEach(inv => {
      const created = new Date(inv.createdAt || Date.now());
      const diffTime = Math.abs(new Date() - created);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const amountVal = Number(inv.totalAmount || inv.amount || 0);

      if (diffDays <= 30) bracketA += amountVal;
      else if (diffDays <= 60) bracketB += amountVal;
      else if (diffDays <= 90) bracketC += amountVal;
      else bracketD += amountVal;
    });

    return [
      { name: "0-30 Days", Outstanding: bracketA },
      { name: "31-60 Days", Outstanding: bracketB },
      { name: "61-90 Days", Outstanding: bracketC },
      { name: "90+ Days", Outstanding: bracketD }
    ];
  }, [invoices]);

  const totalOutstanding = useMemo(() => {
    return invoices
      .filter(inv => inv.status !== "PAID")
      .reduce((sum, inv) => sum + (inv.totalAmount || inv.amount || 0), 0);
  }, [invoices]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 p-8 rounded-[32px] text-white shadow-md">
        <h1 className="text-3xl font-black flex items-center gap-2">
          <Landmark /> Credit Sales & Receivables (AR)
        </h1>
        <p className="text-emerald-100 text-sm mt-1">Track outstanding customer invoices and analyze credit aging trends.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-6 bg-white border rounded-[32px] p-6 shadow-sm space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-800">AR Aging Report Query</h2>
          </div>
          <div className="p-4 bg-slate-50 border rounded-2xl flex justify-between items-center text-xs font-bold text-slate-600">
            <span>Total Outstanding credit:</span>
            <span className="text-rose-500 font-black text-sm">₹{totalOutstanding.toLocaleString()}</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={agingData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip />
              <Bar dataKey="Outstanding" fill="#4f46e5" radius={[6, 6, 0, 0]} barSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="lg:col-span-6 bg-white border rounded-[32px] p-6 shadow-sm space-y-6">
          <div className="flex justify-between items-center pb-2 border-b">
            <h3 className="font-bold text-slate-800 text-base">Clear Pending Receivables</h3>
            <button onClick={fetchReceivables} className="text-slate-400">
              <RefreshCw size={14} />
            </button>
          </div>
          <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
            {invoices.map((inv) => (
              <div key={inv._id} className="p-4 bg-slate-50/50 border rounded-2xl flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{inv.clientName}</h4>
                  <span className="text-[10px] text-slate-400 font-bold block mt-1 uppercase flex items-center gap-1">
                    <Calendar size={11} /> Value: ₹{Number(inv.totalAmount || inv.amount || 0).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  {inv.status !== "PAID" ? (
                    <button
                      disabled={clearingId === inv._id}
                      onClick={() => handleRecordPayment(inv._id, (inv.totalAmount || inv.amount), inv.clientName)}
                      className="h-8 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1"
                    >
                      {clearingId === inv._id ? <Loader2 className="animate-spin h-3 w-3" /> : "Settle"}
                    </button>
                  ) : (
                    <span className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-100">
                      Settled ✓
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}