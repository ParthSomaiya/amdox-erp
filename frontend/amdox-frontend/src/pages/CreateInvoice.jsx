import { useState, useEffect } from "react";
import { IndianRupee, Percent, Plus, FileText, CheckCircle2, Calculator, Loader2, User } from "lucide-react";
import API from "../services/api";

export default function CreateInvoice() {
  const [clientName, setClientName] = useState("");
  const [amount, setAmount] = useState("");
  const [gstRate, setGstRate] = useState(18);
  const [result, setResult] = useState({ cgst: 0, sgst: 0, total: 0 });
  const [loading, setLoading] = useState(false);

  // કિંમતો બદલાતા ઓટોમેટીક GST કેલ્ક્યુલેટ થશે
  useEffect(() => {
    const amt = Number(amount || 0);
    const rate = Number(gstRate || 0);
    const gst = (amt * rate) / 100;
    setResult({
      cgst: Number((gst / 2).toFixed(2)),
      sgst: Number((gst / 2).toFixed(2)),
      total: Number((amt + gst).toFixed(2)),
    });
  }, [amount, gstRate]);

  const handleCreateInvoice = async (e) => {
    e.preventDefault();
    if (!clientName.trim()) {
      alert("Please enter a Client Name.");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      alert("Please enter a valid Amount.");
      return;
    }

    try {
      setLoading(true);
      
      // એનાલિટિક્સ અને ઇન્વોઇસ હિસ્ટ્રી સાથે સિંક કરવા માટે સાચો પેલોડ
      await API.post("/finance/invoice", {
        clientName: clientName,
        amount: Number(amount),
        gst: Number(gstRate),
        totalAmount: result.total,
      });

      alert("Invoice Created Successfully!");
      setClientName("");
      setAmount("");
      setGstRate(18);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to create invoice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* 🚀 Header Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 p-8 rounded-[32px] text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest text-indigo-100 font-bold">Billing Control</span>
            <h1 className="text-3xl font-black mt-1 flex items-center gap-2">
              <Plus /> Create Invoice
            </h1>
            <p className="text-indigo-100 text-sm max-w-xl">
              Compile corporate transactions, auto-calculate tax indices, and generate ledgers.
            </p>
          </div>
        </div>
      </div>

      {/* 🚀 Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side Form Card */}
        <div className="lg:col-span-7 bg-white rounded-[32px] border p-8 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 pb-4 border-b">
            <Calculator className="text-indigo-600" size={20} /> Invoice Parameters
          </h2>

          <form onSubmit={handleCreateInvoice} className="space-y-5">
            {/* Client Name */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Client / Customer Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Acme Corporation"
                  className="w-full h-12 rounded-xl border border-slate-300 pl-11 pr-4 outline-none focus:border-indigo-500 text-sm bg-slate-50/50 focus:bg-white"
                />
              </div>
            </div>

            {/* Base Amount */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                Base Amount (INR)
              </label>
              <div className="relative">
                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                <input
                  type="number"
                  required
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full h-12 rounded-xl border border-slate-300 pl-11 pr-4 outline-none focus:border-indigo-500 text-sm bg-slate-50/50 focus:bg-white"
                />
              </div>
            </div>

            {/* GST Rate */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                GST Rate (%)
              </label>
              <div className="relative">
                <Percent className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                <input
                  type="number"
                  required
                  min="0"
                  max="100"
                  value={gstRate}
                  onChange={(e) => setGstRate(e.target.value)}
                  placeholder="18"
                  className="w-full h-12 rounded-xl border border-slate-300 pl-11 pr-4 outline-none focus:border-indigo-500 text-sm bg-slate-50/50 focus:bg-white"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !amount}
              className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition disabled:opacity-50 shadow-md"
            >
              {loading ? <Loader2 className="animate-spin h-4 w-4" /> : <Plus size={16} />}
              Create Invoice
            </button>
          </form>
        </div>

        {/* Right Side Live Receipt Preview */}
        <div className="lg:col-span-5 bg-slate-950 text-slate-100 rounded-[32px] p-6 shadow-xl relative overflow-hidden font-mono border border-slate-800">
          <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />
          
          <div className="space-y-6">
            {/* Brand */}
            <div className="text-center pb-4 border-b border-dashed border-slate-800">
              <h3 className="text-sm font-black tracking-widest text-indigo-400 uppercase">AMDOX BILLING</h3>
              <p className="text-[10px] text-slate-500 mt-1">SaaS Multi-Tenant Accounting</p>
            </div>

            {/* Metadata */}
            <div className="text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">CLIENT:</span>
                <span className="text-slate-200 font-bold truncate max-w-[180px]">
                  {clientName.trim() ? clientName : "Unspecified"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">DATE:</span>
                <span className="text-slate-300">{new Date().toLocaleDateString("en-IN")}</span>
              </div>
            </div>

            {/* Calculations Table */}
            <div className="border-t border-dashed border-slate-800 pt-4 space-y-3 text-xs">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-bold text-slate-200">₹{Number(amount || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>CGST ({(gstRate / 2).toFixed(1)}%):</span>
                <span>₹{result.cgst.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>SGST ({(gstRate / 2).toFixed(1)}%):</span>
                <span>₹{result.sgst.toLocaleString()}</span>
              </div>

              {/* Total Summary */}
              <div className="flex justify-between border-t border-dashed border-slate-800 pt-4 text-base font-black text-indigo-400">
                <span>GRAND TOTAL:</span>
                <span>₹{result.total.toLocaleString()}</span>
              </div>
            </div>

            {/* Verified seal */}
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-600 border-t border-dashed border-slate-800 pt-4">
              <CheckCircle2 size={12} className="text-indigo-500/50" />
              <span>DYNAMIC TAX SYSTEM SECURED</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}