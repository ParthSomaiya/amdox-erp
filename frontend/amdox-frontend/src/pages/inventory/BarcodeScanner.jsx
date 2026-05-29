import { useState } from "react";
import { ScanBarcode, AlertCircle, CheckCircle2 } from "lucide-react";

export default function BarcodeScanner() {
  const [scannedData, setScannedData] = useState("");
  const [success, setSuccess] = useState(false);

  const simulateScan = () => {
    setSuccess(false);
    const mockBarcode = `AMD-BARCODE-${Math.floor(100000 + Math.random() * 900000)}`;
    setScannedData(mockBarcode);
    setTimeout(() => {
      setSuccess(true);
    }, 800);
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="bg-white border rounded-3xl p-8 shadow-sm text-center space-y-6">
        <ScanBarcode size={48} className="text-indigo-600 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">Barcode Scanner Terminal</h2>
        
        {/* Animated Scan Box Viewport */}
        <div className="h-44 w-full border-2 border-indigo-500 rounded-2xl relative bg-slate-50 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-x-0 h-1 bg-red-500 animate-bounce" />
          <span className="text-xs text-slate-400 font-semibold uppercase">Position Barcode inside viewport</span>
        </div>

        <button onClick={simulateScan} className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm">
          Simulate Product Scan
        </button>

        {scannedData && (
          <div className={`p-4 rounded-xl border flex items-center gap-3 text-sm font-semibold ${
            success ? "bg-green-50 text-green-700 border-green-100" : "bg-slate-50 text-slate-500"
          }`}>
            {success ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{success ? `Scanned successfully: ${scannedData}` : "Processing..."}</span>
          </div>
        )}
      </div>
    </div>
  );
}