import { useState, useEffect, useMemo } from "react";
import { Send, Loader2, ShoppingCart, ShieldCheck } from "lucide-react";
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

  // Live price calculations
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
    <div className="space-y-6 font-sans max-w-6xl mx-auto overflow-x-hidden px-1">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-5 sm:p-8 rounded-2xl sm:rounded-[32px] text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <span className="text-[10px] uppercase tracking-widest text-indigo-400 font-bold block mb-1.5">Procurement Cycle</span>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-black mt-1 flex items-center gap-2">
          <ShoppingCart className="text-indigo-400 shrink-0" size={22} /> Create Purchase Order
        </h1>
        <p className="text-slate-400 text-xs mt-1.5 max-w-xl">Initiate procurement acquisitions from verified supply chain vendors with dynamic budget tracking.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full max-w-full overflow-hidden">
        
        {/* LEFT SIDE: Clean Inputs form */}
        <div className="lg:col-span-7 bg-white rounded-2xl sm:rounded-[32px] border p-4 sm:p-6 shadow-sm space-y-4 sm:space-y-6 w-full max-w-full">
          <h2 className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-1.5 pb-3 border-b">
            <ShoppingCart className="text-indigo-600 shrink-0" size={18} /> Order Specifications
          </h2>

          {loadingData ? (
            <div className="p-10 text-center"><Loader2 className="animate-spin text-indigo-600 mx-auto" /></div>
          ) : (
            <form onSubmit={handleCreatePO} className="space-y-4 text-[10px] sm:text-xs font-bold text-slate-500">
              <div>
                <label className="block mb-1.5 uppercase tracking-wider">Select Vendor Partner</label>
                <select
                  required
                  value={selectedVendor}
                  onChange={(e) => setSelectedVendor(e.target.value)}
                  className="w-full h-10 sm:h-12 border border-slate-200 rounded-xl px-3 text-xs outline-none focus:border-indigo-500 bg-slate-50/50 cursor-pointer font-bold text-slate-700"
                >
                  <option value="">-- Choose Vendor --</option>
                  {vendorsList.map((v) => (
                    <option key={v._id} value={v._id}>{v.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1.5 uppercase tracking-wider">Target SKU Product</label>
                <select
                  required
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="w-full h-10 sm:h-12 border border-slate-200 rounded-xl px-3 text-xs outline-none focus:border-indigo-500 bg-slate-50/50 cursor-pointer font-bold text-slate-700"
                >
                  <option value="">-- Choose Product --</option>
                  {productsList.map((p) => (
                    <option key={p._id} value={p._id}>{p.name} (₹{p.price})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1.5 uppercase tracking-wider">Order Quantity</label>
                <input
                  type="number"
                  placeholder="Enter unit quantity"
                  required
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full h-10 sm:h-12 border border-slate-200 rounded-xl px-4 text-xs sm:text-sm outline-none focus:border-indigo-500 bg-slate-50/50 text-slate-800 font-bold"
                />
              </div>

              <button
                type="submit"
                disabled={creating}
                className="w-full h-10 sm:h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition disabled:opacity-50 shadow-md cursor-pointer"
              >
                {creating ? <Loader2 className="animate-spin h-3.5 w-3.5" /> : <Send size={14} />}
                Dispatch Purchase Order
              </button>
            </form>
          )}
        </div>

        {/* RIGHT SIDE: Real-Time calculated billing card */}
        <div className="lg:col-span-5 bg-slate-950 text-slate-100 rounded-2xl sm:rounded-[32px] p-4 sm:p-6 shadow-xl border border-slate-800 relative font-mono w-full max-w-full overflow-hidden">
          <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />
          
          <div className="space-y-4 sm:space-y-6">
            <div className="text-center pb-3 border-b border-dashed border-slate-800">
              <h3 className="text-xs sm:text-sm font-black tracking-widest text-indigo-400">AMDOX SCM DRAFT</h3>
              <p className="text-[9px] text-slate-500 mt-0.5">Automated PO Ledger Matching</p>
            </div>

            <div className="text-[11px] space-y-3 pt-1">
              <div className="flex justify-between items-center gap-2">
                <span className="text-slate-500 shrink-0">VENDOR:</span>
                <span className="text-slate-200 font-bold truncate max-w-[130px] sm:max-w-[180px]">
                  {vendorsList.find(v => v._id === selectedVendor)?.name || "Unspecified"}
                </span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span className="text-slate-500 shrink-0">PRODUCT Unit:</span>
                <span className="text-slate-300">₹{selectedProductPrice} /unit</span>
              </div>
            </div>

            <div className="border-t border-dashed border-slate-800 pt-3 space-y-3 text-[11px]">
              <div className="flex justify-between items-center gap-2">
                <span className="text-slate-400">Subtotal Price:</span>
                <span className="font-bold text-slate-200">₹{costCalculations.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-slate-400 gap-2">
                <span>GST (18% integrated):</span>
                <span>₹{costCalculations.gst.toLocaleString()}</span>
              </div>
              
              <div className="flex justify-between items-center border-t border-dashed border-slate-800 pt-3 text-sm font-black text-indigo-400 gap-2">
                <span>ESTIMATED TOTAL:</span>
                <span>₹{costCalculations.total.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[9px] text-slate-600 border-t border-dashed border-slate-800 pt-3">
              <ShieldCheck size={11} className="text-indigo-500/50" />
              <span>LOGISTICS BUDGET LOCKED</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}