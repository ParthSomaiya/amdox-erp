import { useEffect, useState } from "react";
import { Receipt, Loader2, CheckCircle2, ShieldCheck } from "lucide-react";
import API from "../../services/api";
import ReportExportButtons from "./ReportExportButtons";
import notifier from "../../utils/notifier";

export default function InvoicePage() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchInvoices = async () => {
    try {
      const res = await API.get("/finance/invoice");
      setInvoices(res.data || []);
    } catch (err) {
      console.error("Failed to fetch invoices:", err);
    }
  };

  useEffect(() => {
    fetchInvoices().finally(() => setLoading(false));
    notifier.invoiceHistoryAudited();
  }, []);

  // PAID સ્ટેટસ અપડેટ કરવાનું ફંક્શન
  const handleMarkPaid = async (id) => {
    try {
      setUpdatingId(id);
      await API.post("/finance/invoice/paid", { invoiceId: id });
      alert("Invoice marked as PAID successfully!");
      await fetchInvoices(); // ટેબલ ડેટા રીલોડ કરો
    } catch (err) {
      console.error(err);
      alert("Failed to mark invoice as paid");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto overflow-x-hidden px-1">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 p-5 sm:p-8 rounded-2xl sm:rounded-[32px] text-white shadow-md">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-black flex items-center gap-2">
          <Receipt className="shrink-0" size={22} /> Invoice History
        </h1>
        <p className="mt-1.5 text-indigo-100 text-xs">Review, track, and download compliance invoice structures.</p>
      </div>

      {loading ? (
        <div className="p-20 text-center">
          <Loader2 className="animate-spin h-10 w-10 text-indigo-600 mx-auto" />
        </div>
      ) : (
        <div className="bg-white rounded-2xl sm:rounded-3xl border shadow-sm overflow-hidden p-4 sm:p-6 space-y-4 sm:space-y-6 w-full max-w-full">
          
          {/* 🔹 ટેબલ હોરિઝોન્ટલ સ્ક્રોલ ગાર્ડ */}
          <div className="overflow-x-auto w-full scrollbar-none">
            <table className="w-full text-xs sm:text-sm text-slate-600 min-w-[550px]">
              <thead className="bg-slate-50 border-b border-slate-100 text-[10px] uppercase font-bold text-slate-700">
                <tr>
                  <th className="p-3.5 text-left">Invoice No</th>
                  <th className="p-3.5 text-left">Customer</th>
                  <th className="p-3.5 text-left">Amount</th>
                  <th className="p-3.5 text-left">Status</th>
                  <th className="p-3.5 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center p-8 text-slate-400 italic">No invoices registered.</td>
                  </tr>
                ) : (
                  invoices.map((inv) => (
                    <tr key={inv._id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 transition text-slate-700">
                      <td className="p-3.5 font-bold text-slate-800">{inv.invoiceNumber || `INV-${inv._id.slice(-6)}`}</td>
                      <td className="p-3.5 font-medium">{inv.clientName || "Customer"}</td>
                      <td className="p-3.5 font-black text-emerald-600">₹{inv.amount}</td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${inv.status === "PAID" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-rose-50 text-rose-700 border border-rose-100"
                          }`}>
                          {inv.status || "UNPAID"}
                        </span>
                      </td>
                      <td className="p-3.5">
                        {inv.status !== "PAID" ? (
                          <button
                            disabled={updatingId === inv._id}
                            onClick={() => handleMarkPaid(inv._id)}
                            className="h-8 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer shrink-0"
                          >
                            {updatingId === inv._id ? <Loader2 className="animate-spin h-3 w-3" /> : <CheckCircle2 size={13} />}
                            Mark Paid
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Completed</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* 🔹 કમ્પેક્ટ કરેલ નીચેનું બટન સેક્શન */}
          <div className="pt-4 border-t border-slate-100 w-full max-w-full overflow-hidden">
            <div className="scale-[0.93] sm:scale-100 origin-left">
              <ReportExportButtons invoices={invoices} />
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-center gap-1.5 text-[10px] sm:text-xs text-slate-400 font-semibold pt-2">
        <ShieldCheck size={13} className="text-indigo-600 shrink-0" /> Enterprise Financial Invoicing Service Active
      </div>
    </div>
  );
}