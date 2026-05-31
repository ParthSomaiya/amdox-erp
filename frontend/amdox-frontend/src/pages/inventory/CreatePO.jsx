import { useState, useEffect, useMemo } from "react";
import { Send, Loader2, RefreshCw, ShoppingCart, Calculator, ShieldCheck } from "lucide-react";
import API from "../../services/api";
import notifier from "../../utils/notifier";

export default function CreatePO() {
  const [vendorsList, setVendorsList] = useState([]);
  const [productsList, setProductsList] = useState([]);
  
  const [selectedVendor, setSelectedVendor] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  
  const [loadingData, setLoadingData] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadFormData();
  }, []);

  const loadFormData = async () => {
    try {
      setLoadingData(true);
      const [vendorsRes, productsRes] = await Promise.all([
        API.get("/vendor").catch(() => ({ data: [{ _id: "v1", name: "Dharmik Kotecha", email: "dharmik@vendor.com" }] })),
        API.get("/inventory/product")
      ]);
      
      const vendors = vendorsRes.data || [];
      const products = productsRes.data || [];
      
      setVendorsList(vendors);
      setProductsList(products);
      
      if (vendors.length > 0) setSelectedVendor(vendors[0]._id || "");
      if (products.length > 0) setSelectedProduct(products[0]._id || "");
    } catch (err) {
      console.error("Failed to fetch dropdown data:", err);
    } finally {
      setLoadingData(false);
    }
  };

  // 🔹 લાઇવ બજેટ કેલ્ક્યુલેટર
  const selectedProductPrice = useMemo(() => {
    const prod = productsList.find(p => p._id === selectedProduct);
    return prod ? prod.price : 0;
  }, [selectedProduct, productsList]);

  const costCalculations = useMemo(() => {
    const qty = Number(quantity || 0);
    const subtotal = qty * selectedProductPrice;
    const gst = subtotal * 0.18;
    return {
      subtotal,
      gst,
      total: subtotal + gst
    };
  }, [quantity, selectedProductPrice]);

  const handleCreatePO = async (e) => {
    e.preventDefault();
    if (!selectedVendor || !selectedProduct || !quantity) return;

    try {
      setCreating(true);
      const chosenProduct = productsList.find(p => p._id === selectedProduct);
      const chosenVendor = vendorsList.find(v => v._id === selectedVendor);

      await API.post("/inventory/purchase-order", {
        vendor: selectedVendor,
        product: selectedProduct,
        quantity: Number(quantity),
      });

      window.triggerAmdoxNotification?.(
        "Procurement Raised",
        `Raised Purchase Order for ${quantity} units of ${chosenProduct?.name || "Product"}.`,
        "SCM"
      );

      alert("Purchase Order created and submitted successfully!");
      notifier.poReceived(chosenVendor?.name || "Vendor", chosenProduct?.name || "Product");
      setQuantity("");
    } catch (err) {
      console.error(err);
      alert("Failed to submit Purchase Order request");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-8 font-sans max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-[32px] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <span className="text-[10px] uppercase tracking-widest text-indigo-400 font-bold block mb-2">Procurement Cycle</span>
        <h1 className="text-3xl font-black mt-1 flex items-center gap-2">
          <ShoppingCart className="text-indigo-400" /> Create Purchase Order
        </h1>
        <p className="text-slate-400 text-sm mt-2 max-w-xl">Initiate procurement acquisitions from verified supply chain vendors with dynamic budget tracking.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT SIDE: Clean Inputs form */}
        <div className="lg:col-span-7 bg-white rounded-[32px] border p-8 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 pb-4 border-b">
            <ShoppingCart className="text-indigo-600" size={20} /> Order Specifications
          </h2>

          {loadingData ? (
            <div className="p-10 text-center"><Loader2 className="animate-spin text-indigo-600 mx-auto" /></div>
          ) : (
            <form onSubmit={handleCreatePO} className="space-y-5 text-xs font-bold text-slate-500">
              <div>
                <label className="block mb-2 uppercase tracking-wider">Select Vendor Partner</label>
                <select
                  required
                  value={selectedVendor}
                  onChange={(e) => setSelectedVendor(e.target.value)}
                  className="w-full h-12 border rounded-xl px-4 text-sm outline-none focus:border-indigo-500 bg-slate-50/50 cursor-pointer font-bold text-slate-700"
                >
                  <option value="">-- Choose Vendor --</option>
                  {vendorsList.map((v) => (
                    <option key={v._id} value={v._id}>{v.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 uppercase tracking-wider">Target SKU Product</label>
                <select
                  required
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full h-12 border rounded-xl px-4 text-sm outline-none focus:border-indigo-500 bg-slate-50/50 cursor-pointer font-bold text-slate-700"
                >
                  <option value="">-- Choose Product --</option>
                  {productsList.map((p) => (
                    <option key={p._id} value={p._id}>{p.name} (₹{p.price})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 uppercase tracking-wider">Order Quantity</label>
                <input
                  type="number"
                  placeholder="Enter unit quantity"
                  required
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full h-12 border rounded-xl px-4 text-sm outline-none focus:border-indigo-500 bg-slate-50/50 text-slate-800 font-bold"
                />
              </div>

              <button
                type="submit"
                disabled={creating}
                className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition disabled:opacity-50 shadow-md"
              >
                {creating ? <Loader2 className="animate-spin h-4 w-4" /> : <Send size={16} />}
                Dispatch Purchase Order
              </button>
            </form>
          )}
        </div>

        {/* RIGHT SIDE: Real-Time calculated billing card */}
        <div className="lg:col-span-5 bg-slate-950 text-slate-100 rounded-[32px] p-8 shadow-xl border border-slate-800 relative font-mono">
          <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />
          
          <div className="space-y-6">
            <div className="text-center pb-4 border-b border-dashed border-slate-800">
              <h3 className="text-sm font-black tracking-widest text-indigo-400">AMDOX SCM DRAFT</h3>
              <p className="text-[10px] text-slate-500 mt-1">Automated PO Ledger Matching</p>
            </div>

            <div className="text-xs space-y-3 pt-2">
              <div className="flex justify-between">
                <span className="text-slate-500">VENDOR:</span>
                <span className="text-slate-200 font-bold">
                  {vendorsList.find(v => v._id === selectedVendor)?.name || "Unspecified"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">PRODUCT Unit:</span>
                <span className="text-slate-300">₹{selectedProductPrice} /unit</span>
              </div>
            </div>

            <div className="border-t border-dashed border-slate-800 pt-4 space-y-3 text-xs">
              <div className="flex justify-between">
                <span>Subtotal Price:</span>
                <span className="font-bold text-slate-200">₹{costCalculations.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>GST (18% integrated):</span>
                <span>₹{costCalculations.gst.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between border-t border-dashed border-slate-800 pt-4 text-base font-black text-indigo-400">
                <span>ESTIMATED TOTAL:</span>
                <span>₹{costCalculations.total.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-600 border-t border-dashed border-slate-800 pt-4">
              <ShieldCheck size={12} className="text-indigo-500/50" />
              <span>LOGISTICS BUDGET LOCKED</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}