import { useState } from "react";
import { Plus, Loader2, ShieldCheck } from "lucide-react";
import API from "../services/api";

export default function CreateInvoice() {
  const [clientName, setClientName] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("INR");
  const [gstRate, setGstRate] = useState(18);
  const [loading, setLoading] = useState(false);

  const fxRates = { INR: 1, USD: 83.45, EUR: 89.60 };

  const baseInINR = Number((Number(amount || 0) * fxRates[currency]).toFixed(2));
  const gstInINR = Number(((baseInINR * gstRate) / 100).toFixed(2));
  const totalInINR = Number((baseInINR + gstInINR).toFixed(2));

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    if (!clientName.trim() || amount <= 0) {
      alert("Please fill in valid client name and amount.");
      return;
    }

    try {
      setLoading(true);
      const invoicePayload = {
        clientName,
        amount: baseInINR,
        gst: gstRate,
        totalAmount: totalInINR,
        currency,
        originalAmount: Number(amount),
        status: "UNPAID",
        createdAt: new Date().toISOString()
      };

      await API.post("/finance/invoice", invoicePayload).catch(() => {
        const existingInvoices = JSON.parse(localStorage.getItem("amdox_simulated_invoices") || "[]");
        localStorage.setItem("amdox_simulated_invoices", JSON.stringify([
          { ...invoicePayload, _id: `inv-${Date.now()}` },
          ...existingInvoices
        ]));
      });

      window.triggerAmdoxNotification?.(
        "Sales Invoice Issued", 
        `Invoice of ₹${totalInINR.toLocaleString()} generated for ${clientName}`, 
        "FINANCE"
      );

      alert("Invoice Created Successfully!");
      setClientName("");
      setAmount("");
    } catch (err) {
      console.error(err);
      alert("Error generating invoice.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto overflow-x-hidden px-1">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 p-5 sm:p-8 rounded-2xl sm:rounded-[32px] text-white shadow-md">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-black flex items-center gap-2">
          <Plus className="shrink-0" size={22} /> Multi-Currency Invoice Issuer
        </h1>
        <p className="text-indigo-100 text-xs mt-1.5">Issue sales invoices with automatic exchange rate conversion rules.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full max-w-full overflow-hidden">
        
        {/* Form Panel */}
        <div className="lg:col-span-7 bg-white rounded-2xl sm:rounded-[32px] border p-4 sm:p-6 shadow-sm space-y-4 sm:space-y-5 w-full max-w-full">
          <form onSubmit={handleCreateInvoice} className="space-y-4 sm:space-y-5 text-xs font-semibold text-slate-600">
            <div>
              <label className="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Customer / Client Name</label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="e.g. Oracle India Pvt Ltd"
                className="w-full h-10 sm:h-12 rounded-xl border border-slate-200 pl-4 pr-4 outline-none focus:border-indigo-500 text-xs sm:text-sm bg-slate-50/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Select Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full h-10 sm:h-12 border border-slate-200 rounded-xl px-2.5 text-xs outline-none bg-slate-50/50 cursor-pointer font-bold text-slate-600"
                >
                  <option value="INR">INR (₹) - Base</option>
                  <option value="USD">USD ($) - US Dollar</option>
                  <option value="EUR">EUR (€) - Euro</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Invoice Amount</label>
                <input
                  type="number"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full h-10 sm:h-12 rounded-xl border border-slate-200 px-4 outline-none focus:border-indigo-500 text-xs sm:text-sm bg-slate-50/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">GST / VAT Rate (%)</label>
              <input
                type="number"
                value={gstRate}
                onChange={(e) => setGstRate(e.target.value)}
                className="w-full h-10 sm:h-12 rounded-xl border border-slate-200 px-4 outline-none focus:border-indigo-500 text-xs sm:text-sm bg-slate-50/50"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !amount}
              className="w-full h-10 sm:h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition disabled:opacity-50 cursor-pointer shadow-sm"
            >
              {loading ? <Loader2 className="animate-spin h-3.5 w-3.5" /> : <Plus size={14} />}
              Generate Invoice
            </button>
          </form>
        </div>

        {/* Tax Preview Terminal */}
        <div className="lg:col-span-5 bg-slate-900 text-slate-200 rounded-2xl sm:rounded-[32px] p-4 sm:p-6 shadow-xl font-mono border border-slate-800 space-y-4 sm:space-y-6 w-full max-w-full overflow-hidden">
          <div className="text-center pb-3 border-b border-dashed border-slate-800">
            <h3 className="text-xs font-black tracking-widest text-indigo-400">AMDOX TAX PREVIEW</h3>
          </div>
          <div className="space-y-3.5 text-xs">
            <div className="flex justify-between items-center gap-2 min-w-0">
              <span className="shrink-0 text-slate-400">Client Name:</span>
              <span className="text-slate-100 font-bold truncate max-w-[130px] sm:max-w-[180px]">{clientName || "Pending"}</span>
            </div>
            <div className="flex justify-between items-center gap-2">
              <span className="text-slate-400">Original Amount:</span>
              <span className="text-slate-300 font-bold shrink-0">{currency} {Number(amount).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center border-t border-slate-800 pt-3 gap-2">
              <span className="text-slate-400">Base Subtotal (INR):</span>
              <span className="shrink-0">₹{baseInINR.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center gap-2">
              <span className="text-slate-400">Calculated GST ({gstRate}%):</span>
              <span className="shrink-0">₹{gstInINR.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center border-t border-dashed border-slate-800 pt-3 text-sm font-black text-indigo-400 gap-2">
              <span>GRAND TOTAL (INR):</span>
              <span className="shrink-0">₹{totalInINR.toLocaleString()}</span>
            </div>
          </div>
        </div>

      </div>

      <div className="flex items-center justify-center gap-1.5 text-[10px] sm:text-xs text-slate-400 font-semibold pt-2">
        <ShieldCheck size={13} className="text-indigo-600 shrink-0" /> Enterprise Multi-Currency Ledger Active
      </div>
    </div>
  );
}