import { useState, useEffect } from "react";
import { ScanBarcode, Loader2, Play, Package, ShieldCheck, Cpu, RefreshCw, Layers } from "lucide-react";
import API from "../../services/api";
import notifier from "../../utils/notifier";

export default function BarcodeScanner() {
  const [scannedData, setScannedData] = useState("");
  const [scanning, setScanning] = useState(false);
  const [productDetails, setProductDetails] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // સિમ્યુલેશન માટે પ્રોડક્ટ્સ લિસ્ટ લોડ કરો
    API.get("/inventory/product")
      .then((res) => {
        const list = res.data || [];
        setProducts(list);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleSimulateScan = () => {
    if (products.length === 0) {
      alert("No products available to scan. Please add products first.");
      return;
    }
    setScanning(true);
    setScannedData("");
    setProductDetails(null);

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * products.length);
      const chosenProduct = products[randomIndex];
      
      const barValue = chosenProduct.barcode || `AMD-${Date.now()}`;
      setScannedData(barValue);
      setProductDetails(chosenProduct);
      setScanning(false);
      
      notifier.barcodeScanned(barValue, chosenProduct.name);
    }, 2000); // ૨ સેકન્ડનું વાસ્તવિક હાઇ-ટેક સ્કેનિંગ ડિલે
  };

  return (
    <div className="space-y-8 max-w-xl mx-auto">
      {/* 🚀 CUSTOM KEYFRAME FOR SLIDING LASER */}
      <style>{`
        @keyframes laserScan {
          0%, 100% { top: 0%; }
          50% { top: 100%; }
        }
        .laser-line-anim {
          animation: laserScan 2.5s ease-in-out infinite;
        }
      `}</style>

      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 rounded-[32px] text-white shadow-md relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-1.5">
          <span className="text-[10px] uppercase tracking-widest text-indigo-400 font-bold block">Hardware Emulator</span>
          <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
            <ScanBarcode className="text-indigo-400" /> Barcode Terminal
          </h1>
          <p className="text-slate-400 text-xs">Simulate real-time camera viewfinder sweeps to lookup warehouse product units.</p>
        </div>
      </div>

      {/* Terminal Viewfinder */}
      <div className="bg-white rounded-[32px] border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6 text-center relative overflow-hidden">
        <div className="absolute -top-12 -right-12 h-32 w-32 bg-slate-50 rounded-full pointer-events-none" />
        
        <div className="space-y-1">
          <h3 className="font-extrabold text-slate-800 text-sm sm:text-base">Laser Sweeper Viewport</h3>
          <p className="text-[11px] text-slate-400 font-medium">Place the asset barcode tag parallel to the red laser beam</p>
        </div>
        
        {/* Animated Holographic Viewport */}
        <div className={`h-48 border-2 rounded-2xl relative overflow-hidden flex items-center justify-center transition-all duration-350 ${
          scanning ? "border-indigo-500 bg-slate-950" : "border-slate-200 bg-slate-50/50"
        }`}>
          {/* Holographic Radar Grid Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,24,38,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(18,24,38,0.03)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

          {/* 📐 SCI-FI CORNER BRACKETS */}
          <div className={`absolute top-3 left-3 h-4 w-4 border-t-2 border-l-2 transition-colors ${scanning ? "border-indigo-400" : "border-slate-400"}`} />
          <div className={`absolute top-3 right-3 h-4 w-4 border-t-2 border-r-2 transition-colors ${scanning ? "border-indigo-400" : "border-slate-400"}`} />
          <div className={`absolute bottom-3 left-3 h-4 w-4 border-b-2 border-l-2 transition-colors ${scanning ? "border-indigo-400" : "border-slate-400"}`} />
          <div className={`absolute bottom-3 right-3 h-4 w-4 border-b-2 border-r-2 transition-colors ${scanning ? "border-indigo-400" : "border-slate-400"}`} />

          {scanning ? (
            <div className="absolute inset-0 bg-indigo-500/5 flex flex-col items-center justify-center space-y-2 z-10">
              <Loader2 className="animate-spin text-indigo-400 h-8 w-8" />
              <span className="text-[10px] text-indigo-400 font-black uppercase tracking-widest animate-pulse">Scanning Active...</span>
            </div>
          ) : (
            <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest z-10">Terminal Standby</span>
          )}

          {/* ⚡ ACTIVE SLIDING RED LASER SCANLINE */}
          <div className={`absolute left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-rose-500 to-transparent shadow-[0_0_12px_rgba(244,63,94,0.8)] z-10 ${
            scanning ? "laser-line-anim" : "top-1/2 -translate-y-1/2 opacity-40"
          }`} />
        </div>

        {/* Simulate Button */}
        <button
          onClick={handleSimulateScan}
          disabled={scanning}
          className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-md shadow-indigo-600/10 active:scale-[0.98] disabled:opacity-50 cursor-pointer"
        >
          {scanning ? <RefreshCw className="animate-spin" size={14} /> : <Play size={14} />}
          {scanning ? "Calibrating Beam..." : "Simulate Product Tag Scan"}
        </button>
      </div>

      {/* Scanned Output Card (Sleek High-Fidelity Design) */}
      {scannedData && (
        <div className="bg-white rounded-[32px] border border-slate-200/80 p-6 shadow-sm space-y-4 animate-fade-in relative overflow-hidden">
          <div className="absolute -top-12 -right-12 h-24 w-24 bg-emerald-500/5 rounded-full pointer-events-none" />
          
          <div className="flex items-center gap-2 pb-3 border-b text-emerald-600 font-black text-xs sm:text-sm">
            <ShieldCheck size={18} className="shrink-0" /> Verified Decrypted Asset Tag
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-400">
            <div className="bg-slate-50 border p-3.5 rounded-2xl min-w-0">
              <span className="text-[9px] block uppercase tracking-wider">Decrypted Key</span>
              <span className="font-black text-indigo-600 tracking-wider text-xs block mt-1.5 truncate">{scannedData}</span>
            </div>
            <div className="bg-slate-50 border p-3.5 rounded-2xl min-w-0">
              <span className="text-[9px] block uppercase tracking-wider">Storage Stock</span>
              <span className="font-black text-slate-800 text-xs sm:text-sm block mt-1">
                {productDetails ? `${productDetails.quantity || productDetails.stock || 0} Units` : "N/A"}
              </span>
            </div>
          </div>

          {productDetails && (
            <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-100/60 text-emerald-600 flex items-center justify-center shrink-0">
                <Package size={20} />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Linked SCM Product</span>
                <h4 className="font-black text-slate-800 text-xs sm:text-sm mt-0.5 truncate">{productDetails.name}</h4>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}