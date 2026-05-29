import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Package, Loader2 } from "lucide-react";
import API from "../../services/api";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/inventory/product`)
      .then((res) => {
        const found = (res.data || []).find(p => p._id === id);
        setProduct(found);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="p-20 text-center"><Loader2 className="animate-spin h-10 w-10 text-indigo-600 mx-auto" /></div>
    );
  }

  if (!product) {
    return <div className="p-10 text-center">Product not found.</div>;
  }

  return (
    <div className="bg-white rounded-3xl p-8 border shadow-sm space-y-6 max-w-xl mx-auto">
      <Package size={48} className="text-indigo-600" />
      <h2 className="text-2xl font-bold text-slate-800">{product.name}</h2>
      <div className="space-y-2 text-sm text-slate-600">
        <p>Price: ₹{product.price}</p>
        <p>Stock: {product.quantity || product.stock || 0} units</p>
        <p>Low Stock Limit: {product.lowStockLimit || 5}</p>
      </div>
    </div>
  );
}