import { useState, useEffect } from "react";
import { Plus, Send, Loader2 } from "lucide-react";
import API from "../../services/api";

export default function CreatePO() {
  const [vendor, setVendor] = useState("");
  const [product, setProduct] = useState("");
  const [quantity, setQuantity] = useState("");
  const [creating, setCreating] = useState(false);

  const handleCreatePO = async (e) => {
    e.preventDefault();
    try {
      setCreating(true);
      await API.post("/inventory/purchase-order", { vendor, product, quantity });
      alert("Purchase Order Created Successfully!");
      setVendor("");
      setProduct("");
      setQuantity("");
    } catch (err) {
      console.error(err);
      alert("Failed to create Purchase Order");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl border p-8 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Create Purchase Order (PO)</h2>
        <form onSubmit={handleCreatePO} className="space-y-4">
          <input
            type="text"
            placeholder="Vendor Name"
            required
            value={vendor}
            onChange={(e) => setVendor(e.target.value)}
            className="w-full h-11 border rounded-xl px-4 text-sm outline-none focus:border-indigo-500 bg-slate-50/50"
          />
          <input
            type="text"
            placeholder="Product Name"
            required
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            className="w-full h-11 border rounded-xl px-4 text-sm outline-none focus:border-indigo-500 bg-slate-50/50"
          />
          <input
            type="number"
            placeholder="Quantity"
            required
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full h-11 border rounded-xl px-4 text-sm outline-none focus:border-indigo-500 bg-slate-50/50"
          />
          <button type="submit" disabled={creating} className="w-full h-11 bg-indigo-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2">
            {creating ? <Loader2 className="animate-spin h-4 w-4" /> : <Send size={16} />}
            Create Order
          </button>
        </form>
      </div>
    </div>
  );
}