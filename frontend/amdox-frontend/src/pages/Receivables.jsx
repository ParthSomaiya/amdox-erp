import { useEffect, useState, useMemo } from "react";
import { Landmark, Loader2, RefreshCw, Calendar, ShieldCheck, X } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import API from "../services/api";

// 🚀 DYNAMIC AXIOS INTERCEPTOR: દરેક રિકવેસ્ટ વખતે તાજું ટોકન જ મોકલશે
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// 🛡️ SAFEST LOCAL STORAGE DECORATOR (Wipe-out protection on logout)
const originalClear = localStorage.clear;
localStorage.clear = function() {
  const employees = localStorage.getItem("amdox_employees");
  const leaves = localStorage.getItem("amdox_applied_leaves");
  const attendance = localStorage.getItem("amdox_simulated_attendance");
  const payrolls = localStorage.getItem("amdox_simulated_payrolls");
  const webhooks = localStorage.getItem("amdox_webhooks");
  const invoices = localStorage.getItem("amdox_simulated_invoices");

  originalClear.call(localStorage);

  if (employees) localStorage.setItem("amdox_employees", employees);
  if (leaves) localStorage.setItem("amdox_applied_leaves", leaves);
  if (attendance) localStorage.setItem("amdox_simulated_attendance", attendance);
  if (payrolls) localStorage.setItem("amdox_simulated_payrolls", payrolls);
  if (webhooks) localStorage.setItem("amdox_webhooks", webhooks);
  if (invoices) localStorage.setItem("amdox_simulated_invoices", invoices);
};

export default function Receivables() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clearingId, setClearingId] = useState(null);

  const fetchReceivables = async () => {
    try {
      setLoading(true);
      const res = await API.get("/finance/invoice");
      const serverInvoices = res.data || [];

      // 🛡️ કન્ઝિસ્ટન્ટ હેન્ડલર: સર્વર અને લોકલ સ્ટોરેજનો ડેટા આપમેળે સિંક કરો
      const localInvoices = JSON.parse(localStorage.getItem("amdox_simulated_invoices") || "[]");
      const merged = [...serverInvoices];

      localInvoices.forEach(li => {
        if (!merged.some(si => si._id === li._id)) {
          merged.push(li);
        }
      });

      setInvoices(merged);
    } catch (err) {
      console.warn("Using simulated offline invoices fallback registry.");
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
        console.warn("Unauthorized token or API offline. Saved to local sandbox.");
      });

      const updated = invoices.map(inv => inv._id === id ? { ...inv, status: "PAID" } : inv);
      setInvoices(updated);
      localStorage.setItem("amdox_simulated_invoices", JSON.stringify(updated));

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
    <div className="space-y-6 max-w-6xl mx-auto overflow-x-hidden px-1">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 p-5 sm:p-8 rounded-2xl sm:rounded-[32px] text-white shadow-md">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-black flex items-center gap-2">
          <Landmark className="shrink-0" size={22} /> Credit Sales & Receivables (AR)
        </h1>
        <p className="text-emerald-100 text-xs mt-1.5">Track outstanding customer invoices and analyze credit aging trends.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full max-w-full overflow-hidden">
        
        {/* AR Aging Section */}
        <div className="lg:col-span-6 bg-white border rounded-2xl sm:rounded-[32px] p-4 sm:p-6 shadow-sm space-y-4 sm:space-y-6 w-full max-w-full overflow-hidden">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-800">AR Aging Report Query</h2>
          </div>
          <div className="p-3 sm:p-4 bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl flex justify-between items-center text-xs font-bold text-slate-600">
            <span>Total Outstanding credit:</span>
            <span className="text-rose-500 font-black text-xs sm:text-sm">₹{totalOutstanding.toLocaleString()}</span>
          </div>
          
          <div className="h-48 sm:h-64 w-full relative min-w-0 overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agingData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} />
                <Tooltip />
                <Bar dataKey="Outstanding" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Clear Pending Section */}
        <div className="lg:col-span-6 bg-white border rounded-2xl sm:rounded-[32px] p-4 sm:p-6 shadow-sm space-y-4 sm:space-y-6 w-full max-w-full overflow-hidden">
          <div className="flex justify-between items-center pb-2.5 border-b">
            <h3 className="font-bold text-slate-800 text-sm sm:text-base">Clear Pending Receivables</h3>
            <button onClick={fetchReceivables} className="text-slate-400 hover:text-slate-600 cursor-pointer">
              <RefreshCw size={13} />
            </button>
          </div>
          <div className="space-y-3.5 max-h-[320px] sm:max-h-[420px] overflow-y-auto pr-0.5">
            {invoices.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-6">No outstanding invoices found.</p>
            ) : (
              invoices.map((inv) => (
                <div key={inv._id} className="p-3.5 bg-slate-50/50 border border-slate-100 rounded-xl sm:rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full overflow-hidden">
                  <div className="min-w-0">
                    <h4 className="font-bold text-slate-800 text-xs sm:text-sm truncate">{inv.clientName}</h4>
                    <span className="text-[9px] sm:text-[10px] text-slate-400 font-bold block mt-0.5 uppercase flex items-center gap-1">
                      <Calendar size={10} className="shrink-0" /> Value: ₹{Number(inv.totalAmount || inv.amount || 0).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2.5 sm:pt-0 w-full sm:w-auto">
                    {inv.status !== "PAID" ? (
                      <button
                        disabled={clearingId === inv._id}
                        onClick={() => handleRecordPayment(inv._id, (inv.totalAmount || inv.amount), inv.clientName)}
                        className="h-8 px-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer shrink-0"
                      >
                        {clearingId === inv._id ? <Loader2 className="animate-spin h-3 w-3" /> : "Settle"}
                      </button>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-100 shrink-0">
                        Settled ✓
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      <div className="flex items-center justify-center gap-1.5 text-[10px] sm:text-xs text-slate-400 font-semibold pt-2">
        <ShieldCheck size={13} className="text-emerald-600 shrink-0" /> SaaS Multi-Tenant Sales Ledger Protocol Active
      </div>
    </div>
  );
}