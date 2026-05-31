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

  // 🔹 "PAID" સ્ટેટસ અપડેટ કરવાનું ફંક્શન
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
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 p-8 rounded-[32px] text-white shadow-md">
        <h1 className="text-3xl font-black flex items-center gap-2"><Receipt /> Invoice History</h1>
        <p className="mt-2 text-indigo-100 text-sm">Review, track, and download compliance invoice structures.</p>
      </div>

      {loading ? (
        <div className="p-20 text-center">
          <Loader2 className="animate-spin h-10 w-10 text-indigo-600 mx-auto" />
        </div>
      ) : (
        <div className="bg-white rounded-3xl border shadow-sm overflow-hidden p-6 space-y-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-slate-600">
              <thead className="bg-slate-50 border-b text-xs uppercase font-bold text-slate-700">
                <tr>
                  <th className="p-4 text-left">Invoice No</th>
                  <th className="p-4 text-left">Customer</th>
                  <th className="p-4 text-left">Amount</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {invoices.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center p-8 text-slate-400">No invoices registered.</td>
                  </tr>
                ) : (
                  invoices.map((inv) => (
                    <tr key={inv._id} className="border-b hover:bg-slate-50/50 transition text-slate-700">
                      <td className="p-4 font-bold">{inv.invoiceNumber || `INV-${inv._id.slice(-6)}`}</td>
                      <td className="p-4">{inv.clientName || "Customer"}</td>
                      <td className="p-4 font-black text-emerald-600">₹{inv.amount}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${inv.status === "PAID" ? "bg-emerald-50 text-emerald-700 border" : "bg-rose-50 text-rose-700 border"
                          }`}>
                          {inv.status || "UNPAID"}
                        </span>
                      </td>
                      <td className="p-4">
                        {inv.status !== "PAID" ? (
                          <button
                            disabled={updatingId === inv._id}
                            onClick={() => handleMarkPaid(inv._id)}
                            className="h-9 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 transition disabled:opacity-50"
                          >
                            {updatingId === inv._id ? <Loader2 className="animate-spin h-3 w-3" /> : <CheckCircle2 size={14} />}
                            Mark Paid
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400 font-bold uppercase">Completed</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="pt-6 border-t">
            <ReportExportButtons invoices={invoices} />
          </div>
        </div>
      )}
    </div>
  );
}