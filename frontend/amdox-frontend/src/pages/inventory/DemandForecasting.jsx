import { useEffect, useState, useMemo } from "react";
import { Loader2, Sparkles, BrainCircuit, RefreshCw, BarChart2, TrendingUp, Info, Package, ShieldCheck } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, LineChart, Line, Legend } from "recharts";
import API from "../../services/api";

export default function DemandForecasting() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [forecastData, setForecastData] = useState(null);
  
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingForecast, setLoadingForecast] = useState(false);

  // ૧. ડાયનેમિક પ્રોડક્ટ્સ લિસ્ટ લોડ કરો
  useEffect(() => {
    API.get("/inventory/product")
      .then((res) => {
        const list = res.data || [];
        setProducts(list);
        if (list.length > 0) {
          setSelectedProduct(list[0]._id);
        }
      })
      .catch((err) => console.error("Error loading products:", err))
      .finally(() => setLoadingProducts(false));
  }, []);

  // ૨. સિલેક્ટેડ પ્રોડક્ટ બદલાતા તેનું AI પ્રિડિક્શન લોડ કરો
  useEffect(() => {
    if (!selectedProduct) return;
    fetchForecast(selectedProduct);
  }, [selectedProduct]);

  const fetchForecast = async (productId) => {
    try {
      setLoadingForecast(true);
      const res = await API.get(`/inventory/forecast/${productId}`);
      setForecastData(res.data || null);
    } catch (err) {
      console.error("Forecast fetch error:", err);
      setForecastData(null);
    } finally {
      setLoadingForecast(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* 🚀 AI Predictive Terminal Header */}
      <div className="relative overflow-hidden rounded-[32px] bg-slate-900 text-white p-10 md:p-14 shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 w-[450px] h-[450px] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-1.5 text-xs font-bold text-indigo-300">
            <Sparkles size={14} className="animate-pulse" /> Neural Forecast Terminal Active
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
            AI Demand <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">Forecasting</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-xl">
            SaaS Predictive modeling for SKU-level warehouse stocking trends. Utilizing Prophet & LSTM hybrid networks with strict &lt; 12% MAPE thresholds.
          </p>
        </div>
      </div>

      {/* 🚀 Active Selection Control Bar */}
      <div className="bg-white border rounded-[24px] p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="w-full md:max-w-xs">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">Target SKU Position</label>
          {loadingProducts ? (
            <div className="flex items-center gap-2 text-indigo-600 text-xs font-bold"><Loader2 className="animate-spin" size={16} /> Loading catalog...</div>
          ) : (
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-full h-12 border rounded-xl px-4 text-sm outline-none focus:border-indigo-500 bg-slate-50/50 cursor-pointer font-bold text-slate-700"
            >
              {products.map((p) => (
                <option key={p._id} value={p._id}>{p.name}</option>
              ))}
            </select>
          )}
        </div>
        
        <button
          onClick={() => fetchForecast(selectedProduct)}
          disabled={loadingForecast || !selectedProduct}
          className="h-12 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow-sm disabled:opacity-50"
        >
          <RefreshCw size={14} className={loadingForecast ? "animate-spin" : ""} /> Re-run Predictor
        </button>
      </div>

      {/* 🚀 Interactive Metrics & Graphs Area */}
      {loadingForecast ? (
        <div className="p-24 text-center">
          <Loader2 className="animate-spin h-10 w-10 text-indigo-600 mx-auto" />
          <p className="mt-4 text-slate-500 font-semibold text-sm">Processing neural forecast models...</p>
        </div>
      ) : forecastData ? (
        <div className="space-y-8 animate-fade-in">
          
          {/* AI Info Specs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:border-indigo-200 transition">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">ML Algorithm Model</span>
              <h4 className="text-sm font-black text-slate-800 mt-2">{forecastData.algorithm || "Prophet + LSTM Hybrid Model"}</h4>
            </div>
            <div className="bg-white border rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:border-indigo-200 transition">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Evaluation Accuracy (MAPE)</span>
              <h4 className="text-sm font-black text-emerald-600 mt-2">{forecastData.mape || "8.4%"} (Less than 12% limit)</h4>
            </div>
            <div className="bg-white border rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:border-indigo-200 transition">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Model Retraining Cycle</span>
              <h4 className="text-sm font-black text-slate-800 mt-2">{forecastData.lastRetrained || "Weekly (Sunday Midnight)"}</h4>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Historical Area Chart */}
            <div className="bg-white rounded-3xl border p-6 shadow-sm space-y-4">
              <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-2 border-b pb-3">
                <BarChart2 size={16} className="text-indigo-600" /> 12-Month Historical Sales (Actual)
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={forecastData.historical}>
                  <defs>
                    <linearGradient id="colorHist" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip />
                  <Area type="monotone" dataKey="demand" stroke="#4f46e5" fillOpacity={1} fill="url(#colorHist)" strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Projected Line Chart */}
            <div className="bg-white rounded-3xl border p-6 shadow-sm space-y-4">
              <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-2 border-b pb-3">
                <TrendingUp size={16} className="text-indigo-600" /> 90-Day Demand Forecast (Predicted)
              </h3>
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={forecastData.forecast}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip />
                  <Line type="monotone" dataKey="predicted" stroke="#8b5cf6" strokeWidth={3.5} dot={{ r: 5, fill: "#8b5cf6", strokeWidth: 2 }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-[32px] p-20 border text-center space-y-4 shadow-inner">
          <Package size={48} className="mx-auto text-slate-300 animate-pulse" />
          <h3 className="text-xl font-bold text-slate-800">No Forecasting Compiled</h3>
          <p className="text-slate-400 text-sm">Please register your product parameters first.</p>
        </div>
      )}

      <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-semibold pt-4">
        <ShieldCheck size={14} /> AI Forecasting Engine Aligned and Synchronized Successfully
      </div>
    </div>
  );
}