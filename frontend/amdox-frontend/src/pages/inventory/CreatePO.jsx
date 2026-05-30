import { useState, useEffect } from "react";
import { Send, Loader2, ClipboardList, RefreshCw, ShoppingCart } from "lucide-react";
import API from "../../services/api";

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
        API.get("/vendor").catch(() => API.get("/inventory/vendor")),
        API.get("/inventory/product")
      ]);
      
      const vendors = vendorsRes.data || [];
      const products = productsRes.data || [];
      
      setVendorsList(vendors);
      setProductsList(products);
      
      if (vendors.length > 0) {
        setSelectedVendor(vendors[0]._id || vendors[0].id || "");
      }
      if (products.length > 0) {
        setSelectedProduct(products[0]._id || products[0].id || "");
      }
    } catch (err) {
      console.error("Failed to fetch dropdown data:", err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleCreatePO = async (e) => {
    e.preventDefault();
    if (!selectedVendor || !selectedProduct) {
      alert("Please select a vendor and product first.");
      return;
    }
    
    try {
      setCreating(true);
      
      await API.post("/inventory/purchase-order", {
        vendor: selectedVendor,
        product: selectedProduct,
        quantity: Number(quantity),
      });
      
      alert("Purchase Order Created Successfully!");
      setQuantity("");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to create Purchase Order");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* 🚀 Header Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 p-8 rounded-[32px] text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest text-indigo-100 font-bold">Procurement Cycle</span>
            <h1 className="text-3xl font-black mt-1 flex items-center gap-2">
              <ShoppingCart /> Create Purchase Order
            </h1>
            <p className="text-indigo-100 text-sm max-w-xl">
              Initiate acquisition of products from verified external vendors.
            </p>
          </div>
          <button
            onClick={loadFormData}
            disabled={loadingData}
            className="h-12 w-12 rounded-2xl bg-white/10 hover:bg-white/20 flex items-center justify-center border border-white/10 transition shrink-0"
          >
            <RefreshCw size={18} className={loadingData ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* 🚀 Form Card */}
      <div className="bg-white rounded-[32px] border border-slate-200/80 p-8 shadow-sm max-w-2xl mx-auto">
        {loadingData ? (
          <div className="py-10 text-center space-y-2">
            <Loader2 className="animate-spin h-8 w-8 text-indigo-600 mx-auto" />
            <p className="text-sm text-slate-500">Loading active database parameters...</p>
          </div>
        ) : (
          <form onSubmit={handleCreatePO} className="space-y-6">
            {/* Vendor Select */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                Select Vendor
              </label>
              <select
                required
                value={selectedVendor}
                onChange={(e) => setSelectedVendor(e.target.value)}
                className="w-full h-12 border rounded-2xl px-4 text-sm outline-none focus:border-indigo-500 bg-slate-50/50 cursor-pointer"
              >
                <option value="">-- Choose Vendor --</option>
                {vendorsList.map((v) => (
                  <option key={v._id || v.id} value={v._id || v.id}>
                    {v.name} ({v.email || "No Email"})
                  </option>
                ))}
              </select>
            </div>

            {/* Product Select */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                Select Product
              </label>
              <select
                required
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full h-12 border rounded-2xl px-4 text-sm outline-none focus:border-indigo-500 bg-slate-50/50 cursor-pointer"
              >
                <option value="">-- Choose Product --</option>
                {productsList.map((p) => (
                  <option key={p._id || p.id} value={p._id || p.id}>
                    {p.name} (Available Stock: {p.quantity || p.stock || 0})
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                Order Quantity
              </label>
              <input
                type="number"
                placeholder="Enter quantity"
                required
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full h-12 border rounded-2xl px-4 text-sm outline-none focus:border-indigo-500 bg-slate-50/50"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={creating}
              className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition disabled:opacity-50 shadow-md"
            >
              {creating ? <Loader2 className="animate-spin h-4 w-4" /> : <Send size={16} />}
              Create Order
            </button>
          </form>
        )}
      </div>
    </div>
  );
}