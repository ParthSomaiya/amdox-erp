import { useEffect, useState, useMemo } from "react";
import { 
  Receipt, Loader2, ShieldCheck, 
  Upload, Sparkles 
} from "lucide-react";
import API from "../services/api";

export default function Bills() {
  const [activeTab, setActiveTab] = useState("payable");

  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [payingId, setPayingId] = useState(null);

  const [selectedBills, setSelectedBills] = useState({});
  const [processingBatch, setProcessingBatch] = useState(false);

  const [selectedPO, setSelectedPO] = useState("PO-101");
  const [selectedGR, setSelectedGR] = useState("GR-101");
  const [selectedInv, setSelectedInv] = useState("INV-101");

  const [ocrScanning, setOcrScanning] = useState(false);
  const [ocrCompleted, setOcrCompleted] = useState(false);
  const [ocrData, setOcrData] = useState(null);

  const poData = {
    "PO-101": { item: "Dell Latitude Laptops", qty: 50, price: 50000, total: 2500000 },
    "PO-102": { item: "Ergonomic Chairs", qty: 120, price: 4500, total: 540000 }
  };

  const grData = {
    "GR-101": { item: "Dell Latitude Laptops", qty: 50, status: "ACCEPTED" },
    "GR-102": { item: "Ergonomic Chairs", qty: 115, status: "ACCEPTED" }
  };

  const invData = {
    "INV-101": { item: "Dell Latitude Laptops", qty: 50, price: 50000, total: 2500000 },
    "INV-102": { item: "Ergonomic Chairs", qty: 120, price: 4500, total: 540000 }
  };

  const currentMatch = useMemo(() => {
    const po = poData[selectedPO] || {};
    const gr = grData[selectedGR] || {};
    const inv = ocrCompleted && ocrData ? ocrData : (invData[selectedInv] || {});

    const qtyMatch = po.qty === gr.qty && gr.qty === inv.qty;
    const priceMatch = po.price === inv.price;
    const itemMatch = po.item === gr.item && gr.item === inv.item;

    return {
      po, gr, inv,
      qtyMatch,
      priceMatch,
      itemMatch,
      allMatched: qtyMatch && priceMatch && itemMatch
    };
  }, [selectedPO, selectedGR, selectedInv, ocrCompleted, ocrData]);

  const fetchBills = async () => {
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
          { _id: "b2", vendorId: { name: "Amdox Office Rental Corp" }, amount: 150000, status: "UNPAID", dueDate: "2026-06-10" },
          { _id: "b3", vendorId: { name: "Global Logistics Hub" }, amount: 24000, status: "PAID", dueDate: "2026-05-20" }
        ];
        setBills(defaultBills);
        localStorage.setItem("amdox_simulated_bills", JSON.stringify(defaultBills));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const payBill = async (id, amount) => {
    try {
      setPayingId(id);
      await API.put("/ap/pay", { id }).catch(() => {
        const updated = bills.map(b => b._id === id ? { ...b, status: "PAID" } : b);
        setBills(updated);
        localStorage.setItem("amdox_simulated_bills", JSON.stringify(updated));
      });

      window.triggerAmdoxNotification?.(
        "Vendor Bill Paid", 
        `Payment of ₹${amount.toLocaleString()} disbursed successfully to vendor.`, 
        "PAYROLL"
      );

      alert("Payment initiated successfully!");
    } catch (err) {
      console.error(err);
    } finally {
      setPayingId(null);
    }
  };

  const handleOCRScanSimulator = () => {
    setOcrScanning(true);
    setOcrCompleted(false);

    setTimeout(() => {
      const extracted = {
        item: "Dell Latitude Laptops",
        qty: 50,
        price: 50000,
        total: 2500000
      };
      setOcrData(extracted);
      setOcrScanning(false);
      setOcrCompleted(true);
      alert("OCR Document Parsing complete!");
    }, 1500);
  };

  const handleBulkPaymentRun = async () => {
    const idsToPay = Object.keys(selectedBills).filter(id => selectedBills[id]);
    if (idsToPay.length === 0) return;

    try {
      setProcessingBatch(true);
      await new Promise(resolve => setTimeout(resolve, 1500)); 

      const updated = bills.map(b => idsToPay.includes(b._id) ? { ...b, status: "PAID" } : b);
      setBills(updated);
      localStorage.setItem("amdox_simulated_bills", JSON.stringify(updated));
      
      const totalDisbursed = bills
        .filter(b => idsToPay.includes(b._id))
        .reduce((sum, b) => sum + b.amount, 0);

      window.triggerAmdoxNotification?.(
        "Bulk Payment Run Completed", 
        `Processed ${idsToPay.length} vendor invoices. Total disbursed: ₹${totalDisbursed.toLocaleString()}.`, 
        "PAYROLL"
      );

      alert("Bulk payment run executed successfully!");
      setSelectedBills({});
    } catch (err) {
      console.error(err);
    } finally {
      setProcessingBatch(false);
    }
  };

  const handlePostMatchedBill = () => {
    if (!currentMatch.allMatched) return;

    const newBill = {
      _id: `b-${Date.now()}`,
      vendorId: { name: "Codizious Logistics Group" },
      amount: currentMatch.inv.total,
      status: "UNPAID",
      dueDate: new Date(Date.now() + 15*24*60*60*1000).toISOString().split("T")[0]
    };

    const updated = [newBill, ...bills];
    setBills(updated);
    localStorage.setItem("amdox_simulated_bills", JSON.stringify(updated));

    window.triggerAmdoxNotification?.(
      "3-Way Match Approved", 
      `Invoice matched successfully. Created payable bill of ₹${newBill.amount.toLocaleString()}.`, 
      "FINANCE"
    );

    alert("3-Way Match Verified! Bill generated.");
    setActiveTab("payable");
  };

  const handleToggleSelectBill = (id) => {
    setSelectedBills(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto overflow-x-hidden px-1">
      {/* Dynamic Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 sm:p-8 rounded-2xl sm:rounded-[32px] text-white shadow-md">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-black flex items-center gap-2">
          <Receipt className="shrink-0" size={22} /> AP OCR Scanning & 3-Way Match Suite
        </h1>
        <p className="text-slate-400 text-xs mt-1.5">Simulate AI OCR document reading and match against active PO & Goods receipts.</p>
      </div>

      {/* 🔹 હોરિઝોન્ટલ સ્ક્રૉલેબલ ટેબ્સ */}
      <div className="flex border-b text-xs sm:text-sm overflow-x-auto whitespace-nowrap scrollbar-none w-full border-slate-200">
        <button onClick={() => setActiveTab("payable")} className={`px-4 sm:px-6 py-2.5 sm:py-3 font-bold border-b-2 transition shrink-0 ${activeTab === "payable" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-400"}`}>Payable Invoices</button>
        <button onClick={() => setActiveTab("matching")} className={`px-4 sm:px-6 py-2.5 sm:py-3 font-bold border-b-2 transition shrink-0 ${activeTab === "matching" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-400"}`}>3-Way Match Workspace</button>
        <button onClick={() => setActiveTab("payment-run")} className={`px-4 sm:px-6 py-2.5 sm:py-3 font-bold border-b-2 transition shrink-0 ${activeTab === "payment-run" ? "border-indigo-600 text-indigo-600" : "border-transparent text-slate-400"}`}>Payment Run (Batch)</button>
      </div>

      {activeTab === "payable" && (
        <div className="bg-white rounded-2xl sm:rounded-3xl border p-4 sm:p-6 space-y-4 sm:space-y-6 w-full max-w-full overflow-hidden">
          {loading ? (
            <div className="p-10 text-center"><Loader2 className="animate-spin mx-auto text-indigo-600" /></div>
          ) : (
            <div className="space-y-3.5">
              {bills.map((b) => (
                <div key={b._id} className="p-3.5 sm:p-4 border rounded-xl sm:rounded-2xl bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full overflow-hidden">
                  <div className="min-w-0">
                    <h4 className="font-bold text-slate-800 text-xs sm:text-sm truncate">{b.vendorId?.name || "Vendor Supplier"}</h4>
                    <p className="text-[9px] sm:text-[10px] text-slate-400 font-bold uppercase mt-0.5">Due Date: {b.dueDate}</p>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 pt-2.5 sm:pt-0 w-full sm:w-auto">
                    <span className="font-black text-rose-500 text-xs sm:text-sm">₹{b.amount?.toLocaleString("en-IN")}</span>
                    {b.status === "UNPAID" ? (
                      <button onClick={() => payBill(b._id, b.amount)} className="h-8 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold cursor-pointer shrink-0">Pay Bill</button>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[8px] font-black bg-emerald-50 text-emerald-700 border border-emerald-100 shrink-0">Paid ✓</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === "matching" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full max-w-full overflow-hidden">
          <div className="lg:col-span-4 space-y-4 sm:space-y-6 w-full">
            <div className="bg-white border rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-4">
              <h3 className="font-bold text-slate-800 text-xs sm:text-sm flex items-center gap-1"><Sparkles className="text-indigo-600 shrink-0" size={15} /> AI OCR Document Scan</h3>
              <button type="button" onClick={handleOCRScanSimulator} disabled={ocrScanning} className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition">
                {ocrScanning ? <Loader2 className="animate-spin" size={13} /> : <Upload size={13} />}
                {ocrScanning ? "Analyzing..." : "Upload & Analyze PDF"}
              </button>
            </div>
            
            <div className="bg-white border rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-4">
              <h3 className="font-bold text-slate-400 text-[10px] sm:text-xs uppercase">Match Targets</h3>
              <div className="space-y-3 text-xs font-semibold text-slate-700">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Target Purchase Order</label>
                  <select value={selectedPO} onChange={(e) => setSelectedPO(e.target.value)} className="w-full h-9 border border-slate-200 rounded-xl px-2 outline-none">
                    <option value="PO-101">PO-101 (Laptops)</option>
                    <option value="PO-102">PO-102 (Office Chairs)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 font-bold mb-1">Target Goods Receipt</label>
                  <select value={selectedGR} onChange={(e) => setSelectedGR(e.target.value)} className="w-full h-9 border border-slate-200 rounded-xl px-2 outline-none">
                    <option value="GR-101">GR-101 (Laptops Received)</option>
                    <option value="GR-102">GR-102 (Chairs Received)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* 🔹 ગ્રીડ રોઝોન્ટલ મલ્ટી-કોલમને રિસ્પોન્સિવ રેટ કરી */}
          <div className="lg:col-span-8 bg-white border rounded-2xl sm:rounded-3xl p-4 sm:p-6 space-y-4 sm:space-y-6 w-full max-w-full overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs font-semibold text-slate-600">
              <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl space-y-2">
                <span className="text-[9px] text-slate-400 font-bold uppercase block">1. PO Target</span>
                <p className="font-extrabold text-slate-800 text-xs truncate">{currentMatch.po.item}</p>
                <p className="text-[11px] text-slate-500">Qty: {currentMatch.po.qty}</p>
                <p className="text-indigo-600 font-bold text-xs">₹{currentMatch.po.total?.toLocaleString()}</p>
              </div>
              <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl space-y-2">
                <span className="text-[9px] text-slate-400 font-bold uppercase block">2. GR Fact</span>
                <p className="font-extrabold text-slate-800 text-xs truncate">{currentMatch.gr.item}</p>
                <p className={`text-[11px] ${currentMatch.qtyMatch ? "text-emerald-600 font-bold" : "text-rose-500 font-bold"}`}>Qty Recd: {currentMatch.gr.qty}</p>
              </div>
              <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl sm:rounded-2xl space-y-2">
                <span className="text-[9px] text-slate-400 font-bold uppercase block">3. OCR Invoice</span>
                {ocrCompleted ? (
                  <>
                    <p className="font-extrabold text-indigo-600 text-xs truncate">{currentMatch.inv.item}</p>
                    <p className="text-[11px] text-slate-500">Qty: {currentMatch.inv.qty}</p>
                    <p className="text-indigo-600 font-bold text-xs">₹{currentMatch.inv.total?.toLocaleString()}</p>
                  </>
                ) : (
                  <p className="text-slate-400 italic text-[10px] pt-3">Upload invoice to extract</p>
                )}
              </div>
            </div>
            
            <div className="flex justify-end pt-2">
              <button onClick={handlePostMatchedBill} disabled={!currentMatch.allMatched} className="h-10 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs disabled:opacity-50 transition cursor-pointer w-full sm:w-auto text-center">
                Authorize Post Match Bill
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "payment-run" && (
        <div className="bg-white border rounded-2xl sm:rounded-[32px] p-4 sm:p-6 shadow-sm space-y-4 sm:space-y-6 w-full max-w-full overflow-hidden">
          <div className="pb-3 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="space-y-0.5">
              <h2 className="text-sm sm:text-base font-bold text-slate-800">Automated Payment Run Batcher</h2>
              <p className="text-[10px] text-slate-400">Select pending bills to run a safe corporate payment batch.</p>
            </div>
            <button onClick={handleBulkPaymentRun} disabled={processingBatch || Object.keys(selectedBills).filter(id => selectedBills[id]).length === 0} className="h-9 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition disabled:opacity-50 cursor-pointer w-full sm:w-auto">
              Execute Selected Batch Run
            </button>
          </div>
          
          <div className="space-y-3">
            {bills.filter(b => b.status === "UNPAID").length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-6">No unpaid bills left in system.</p>
            ) : (
              bills.filter(b => b.status === "UNPAID").map((b) => (
                <div key={b._id} onClick={() => handleToggleSelectBill(b._id)} className={`p-3.5 border rounded-xl sm:rounded-2xl flex flex-col xs:flex-row xs:items-center justify-between gap-3 cursor-pointer transition ${selectedBills[b._id] ? "bg-indigo-50/50 border-indigo-200" : "bg-slate-50/50"}`}>
                  <div className="flex items-center gap-3 min-w-0">
                    <input type="checkbox" checked={!!selectedBills[b._id]} onChange={() => {}} className="h-3.5 w-3.5 cursor-pointer" />
                    <span className="font-bold text-slate-800 text-xs truncate">{b.vendorId?.name}</span>
                  </div>
                  <span className="font-black text-rose-500 text-xs sm:text-sm shrink-0 self-end xs:self-center">₹{b.amount?.toLocaleString()}</span>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      <div className="flex items-center justify-center gap-1.5 text-[10px] sm:text-xs text-slate-400 font-semibold pt-2">
        <ShieldCheck size={13} className="text-indigo-600 shrink-0" /> Enterprise Accounts Payable Integration Active
      </div>
    </div>
  );
}