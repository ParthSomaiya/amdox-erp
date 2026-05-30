import { useEffect, useState } from "react";
import { Loader2, Flame, Package, Info, Layers } from "lucide-react";
import API from "../../services/api";
import notifier from "../../utils/notifier";

export default function WarehouseHeatmap() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // લોડ ન થઈ શકેલી ઈમેજીસને ટ્રેક કરવા માટેનું સ્ટેટ
  const [failedImages, setFailedImages] = useState({});

  useEffect(() => {
    API.get("/inventory/product")
      .then((res) => setProducts(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleImageError = (id) => {
    setFailedImages((prev) => ({ ...prev, [id]: true }));
  };

  // ડાયનેમિક હીટ કલર્સ અને સ્ટેટસ રિટર્ન કરતું ફંક્શન
  const getHeatLevel = (qty) => {
    if (qty >= 100) {
      return {
        borderClass: "hover:border-emerald-500/50",
        bgClass: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
        badgeClass: "bg-emerald-500 text-white",
        status: "Overstock",
      };
    }
    if (qty >= 30) {
      return {
        borderClass: "hover:border-sky-500/50",
        bgClass: "bg-sky-500/10 text-sky-700 border-sky-200",
        badgeClass: "bg-sky-500 text-white",
        status: "Adequate",
      };
    }
    if (qty >= 10) {
      return {
        borderClass: "hover:border-amber-500/50",
        bgClass: "bg-amber-500/10 text-amber-700 border-amber-200",
        badgeClass: "bg-amber-500 text-white",
        status: "Low Stock",
      };
    }
    return {
      borderClass: "hover:border-rose-500/50",
      bgClass: "bg-rose-500/10 text-rose-700 border-rose-200",
      badgeClass: "bg-rose-500 text-white",
      status: "Critical",
    };
  };

  if (loading) {
    notifier.heatmapViewed();
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-10 w-10 text-indigo-600 mx-auto" />
          <p className="mt-4 text-slate-500 text-sm font-semibold">Generating warehouse heatmap...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 🚀 Header Banner */}
      <div className="bg-gradient-to-r from-orange-500 via-red-500 to-indigo-700 p-8 rounded-[32px] text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest text-orange-100 font-bold">Warehouse Analytics</span>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight flex items-center gap-2">
              <Flame className="animate-pulse" /> Warehouse Stock Heatmap
            </h1>
            <p className="text-orange-100 text-sm max-w-xl">
              Visual stock density indicator. Automatically color-codes warehouse positions by inventory depth.
            </p>
          </div>
          <div className="hidden sm:flex h-16 w-16 rounded-2xl bg-white/10 backdrop-blur-md items-center justify-center border border-white/20">
            <Layers size={28} />
          </div>
        </div>
      </div>

      {/* 🚀 Heatmap Color Legend Guide */}
      <div className="bg-white border rounded-3xl p-5 shadow-sm space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <Info size={14} /> Stock Level Color Guide
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-100 rounded-2xl text-xs font-bold text-emerald-700">
            <span className="h-3.5 w-3.5 rounded-full bg-emerald-500 shrink-0" />
            <span>Overstock (≥ 100 units)</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-sky-50 border border-sky-100 rounded-2xl text-xs font-bold text-sky-700">
            <span className="h-3.5 w-3.5 rounded-full bg-sky-500 shrink-0" />
            <span>Adequate (30 - 99 units)</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-100 rounded-2xl text-xs font-bold text-amber-700">
            <span className="h-3.5 w-3.5 rounded-full bg-amber-500 shrink-0" />
            <span>Low Stock (10 - 29 units)</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-rose-50 border border-rose-100 rounded-2xl text-xs font-bold text-rose-700">
            <span className="h-3.5 w-3.5 rounded-full bg-rose-500 shrink-0" />
            <span>Critical (&lt; 10 units)</span>
          </div>
        </div>
      </div>

      {/* 🚀 Heatmap Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {products.length === 0 ? (
          <div className="col-span-full bg-white p-20 border rounded-[32px] text-center space-y-4">
            <Package size={48} className="mx-auto text-slate-300" />
            <h3 className="text-xl font-bold text-slate-700">No Inventory Found</h3>
            <p className="text-slate-400 text-sm">Please register products first to view warehouse heatmap.</p>
          </div>
        ) : (
          products.map((p) => {
            const qty = p.quantity || p.stock || 0;
            const heat = getHeatLevel(qty);
            
            // જો ઈમેજ મોજુદ હોય અને અગાઉ લોડ થવામાં ફેલ ન ગઈ હોય
            const hasValidImage = p.image && !failedImages[p._id];

            return (
              <div
                key={p._id}
                className={`bg-white border rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border-slate-200/80 ${heat.borderClass} flex flex-col justify-between`}
              >
                {/* Product Image Panel */}
                <div className="h-36 bg-slate-100 border-b relative flex items-center justify-center overflow-hidden">
                  {hasValidImage ? (
                    <img
                      src={`http://localhost:5000/${p.image}`}
                      alt={p.name}
                      crossOrigin="anonymous" // 🔹 બ્રાઉઝર ક્રોસ-ઓરીજીન પોલિસી માટે
                      onError={() => handleImageError(p._id)} // 🔹 ફેઇલ થાય તો ફોલબેક લોડ કરશે
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-slate-400 text-center space-y-1">
                      <Package size={28} className="mx-auto" />
                      <span className="text-[10px] uppercase font-bold tracking-wider">No Image</span>
                    </div>
                  )}
                  {/* Floating Unit Status Badge */}
                  <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-black tracking-wide uppercase shadow-sm ${heat.badgeClass}`}>
                    {heat.status}
                  </span>
                </div>

                {/* Content Panel */}
                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <h4 className="font-extrabold text-slate-800 text-sm truncate" title={p.name}>
                      {p.name}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">SKU Position</p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase">Unit Price</span>
                      <span className="font-bold text-slate-800 text-sm">₹{p.price?.toLocaleString()}</span>
                    </div>
                    
                    <div className={`px-3 py-1.5 rounded-xl text-xs font-black border ${heat.bgClass}`}>
                      {qty} Units
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}