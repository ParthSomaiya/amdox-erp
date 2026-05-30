import { useState, useEffect } from "react";
import { ScanBarcode, Loader2, Play, Package, ShieldCheck } from "lucide-react";
import API from "../../services/api";

export default function BarcodeScanner() {
  const [scannedData, setScannedData] = useState("");
  const [scanning, setScanning] = useState(false);
  const [productDetails, setProductDetails] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // સિમ્યુલેશન માટે પ્રોડક્ટ્સ લિસ્ટ લોડ કરો
    API.get("/inventory/product")
      .then((res) => setProducts(res.data || []))
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
      // રેન્ડમ કોઈપણ પ્રોડક્ટ સિલેક્ટ કરીને તેને સિમ્યુલેટ કરો
      const randomIndex = Math.floor(Math.random() * products.length);
      const chosenProduct = products[randomIndex];
      
      setScannedData(chosenProduct.barcode || `AMD-${Date.now()}`);
      setProductDetails(chosenProduct);
      setScanning(false);
    }, 1500);
  };

  return (
    <div className="space-y-8 max-w-xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 p-8 rounded-[32px] text-white shadow-sm flex items-center justify-between">
        <div>
          <span className="text-xs uppercase tracking-widest text-indigo-100 font-bold">Hardware Terminal</span>
          <h1 className="text-3xl font-black mt-1 flex items-center gap-2">
            <ScanBarcode /> Barcode Scanner
          </h1>
          <p className="text-indigo-100 text-sm mt-2">Scan barcodes or QR codes to lookup items instantly.</p>
        </div>
      </div>

      {/* Terminal Viewfinder */}
      <div className="bg-white rounded-[32px] border border-slate-200/80 p-8 shadow-sm space-y-6 text-center">
        <h3 className="font-extrabold text-slate-800 text-base">Barcode Scanner Terminal</h3>
        
        {/* Animated Viewport Viewfinder */}
        <div className="h-44 border-2 border-indigo-200 rounded-2xl relative bg-slate-50/50 overflow-hidden flex items-center justify-center">
          {scanning ? (
            <div className="absolute inset-0 bg-indigo-500/5 flex flex-col items-center justify-center space-y-2">
              <Loader2 className="animate-spin text-indigo-600 h-8 w-8" />
              <span className="text-xs text-indigo-600 font-bold animate-pulse">READING BARCODE...</span>
            </div>
          ) : (
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Position Barcode Inside Viewport</span>
          )}
          {/* Animated Red Laser Scanline */}
          <div className="absolute left-0 right-0 h-0.5 bg-rose-500 shadow-md shadow-rose-500/50 animate-pulse" style={{ top: "50%" }} />
        </div>

        {/* Action Trigger */}
        <button
          onClick={handleSimulateScan}
          disabled={scanning}
          className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 transition shadow-sm disabled:opacity-50"
        >
          <Play size={16} /> {scanning ? "Scanning..." : "Simulate Product Scan"}
        </button>
      </div>

      {/* Scanned Output Card */}
      {scannedData && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b text-emerald-600 font-bold text-sm">
            <ShieldCheck size={18} /> Verified Scanned Result
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-slate-50 p-4 rounded-xl border">
              <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Barcode Value</span>
              <span className="font-black text-indigo-600 tracking-wider text-xs">{scannedData}</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border">
              <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Stock Position</span>
              <span className="font-extrabold text-slate-800">
                {productDetails ? `${productDetails.quantity || productDetails.stock || 0} Units` : "N/A"}
              </span>
            </div>
          </div>
          {productDetails && (
            <div className="p-4 bg-indigo-50/30 rounded-xl border border-indigo-100 flex items-center gap-3">
              <Package className="text-indigo-600 shrink-0" size={20} />
              <div>
                <p className="text-xs text-slate-400 font-bold uppercase">Linked Product</p>
                <h4 className="font-black text-slate-800 text-sm mt-0.5">{productDetails.name}</h4>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}