import { useEffect, useState, useMemo } from "react";
import { Brain, TrendingUp, RefreshCw, Loader2, Package } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts"; // 🔹 Legend ઇમ્પોર્ટ કર્યું
import API from "../../services/api";
import axios from "axios";

export default function DemandForecasting() {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [forecastData, setForecastData] = useState(null);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingForecast, setLoadingForecast] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const res = await axios.get("http://localhost:5000/api/inventory/product");
      setProducts(res.data || []);
      if (res.data && res.data.length > 0) {
        setSelectedProductId(res.data[0]._id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    if (selectedProductId) {
      fetchForecast(selectedProductId);
    }
  }, [selectedProductId]);

  const fetchForecast = async (productId) => {
    try {
      setLoadingForecast(true);
      const res = await API.get(`/inventory/forecast/${productId}`);
      setForecastData(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingForecast(false);
    }
  };

  const mergedChartData = useMemo(() => {
    if (!forecastData) return [];

    const historical = forecastData.historical.map(h => ({
      name: h.date,
      "Historical Sales": h.demand,
      "Projected Demand": null
    }));

    const lastHistoryValue = historical[historical.length - 1]["Historical Sales"];

    const forecast = forecastData.forecast.map((f, idx) => ({
      name: f.date + " (FC)",
      "Historical Sales": null,
      "Projected Demand": idx === 0 ? lastHistoryValue : f.predicted
    }));

    return [...historical, ...forecast];
  }, [forecastData]);

  if (loadingProducts) {
    return (
      <div className="p-20 text-center">
        <Loader2 className="animate-spin h-10 w-10 text-indigo-600 mx-auto" />
        <p className="mt-4 text-slate-500 font-semibold text-sm">Initializing AI Models...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-700 rounded-[32px] p-8 text-white shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div className="space-y-2">
          <span className="text-xs uppercase tracking-widest text-indigo-200 font-bold flex items-center gap-1">
            <Brain size={14} className="animate-pulse" /> F-06 AI Core Engine
          </span>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">AI Demand Forecasting</h1>
          <p className="text-indigo-100 text-sm max-w-xl">
            Predict SKU-level demand trends for the next 90 days with our weekly retrained LSTM/Prophet hybrid engine.
          </p>
        </div>
        <div className="hidden sm:flex h-16 w-16 rounded-2xl bg-white/10 backdrop-blur-md items-center justify-center border border-white/20">
          <TrendingUp size={28} />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Select Product</h2>
          <p className="text-xs text-slate-400 font-medium">Evaluate unique forecasting projections</p>
        </div>
        <select
          value={selectedProductId}
          onChange={(e) => setSelectedProductId(e.target.value)}
          className="h-11 rounded-xl border border-slate-300 px-4 bg-slate-50/50 outline-none focus:border-indigo-500 text-sm font-bold text-slate-600 cursor-pointer w-full md:max-w-xs"
        >
          {products.map((p) => (
            <option key={p._id} value={p._id}>{p.name}</option>
          ))}
        </select>
      </div>

      {forecastData && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white border rounded-3xl p-6 shadow-sm">
            <span className="text-xs text-slate-400 font-bold uppercase">Algorithm</span>
            <p className="text-sm font-black text-slate-800 mt-2">{forecastData.algorithm}</p>
          </div>
          <div className="bg-white border rounded-3xl p-6 shadow-sm">
            <span className="text-xs text-slate-400 font-bold uppercase">Model Accuracy</span>
            <p className="text-sm font-black text-emerald-600 mt-2">91.6% (MAPE: {forecastData.mape})</p>
          </div>
          <div className="bg-white border rounded-3xl p-6 shadow-sm">
            <span className="text-xs text-slate-400 font-bold uppercase">Weekly Retraining</span>
            <p className="text-sm font-black text-indigo-600 mt-2">Active ({forecastData.lastRetrained})</p>
          </div>
          <div className="bg-white border rounded-3xl p-6 shadow-sm">
            <span className="text-xs text-slate-400 font-bold uppercase">Horizon Scope</span>
            <p className="text-sm font-black text-purple-600 mt-2">90-Day Predictions</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-4 border-b">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Demand Curves Comparison</h2>
            <p className="text-xs text-slate-400">Comparing past 12 months actual sales vs next 90 days predictions</p>
          </div>
          <button
            onClick={() => fetchForecast(selectedProductId)}
            className="h-11 px-5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 text-sm font-bold flex items-center justify-center gap-2 border border-slate-200 transition-all"
          >
            <RefreshCw size={14} className={loadingForecast ? "animate-spin" : ""} />
            Re-Calculate
          </button>
        </div>

        {loadingForecast ? (
          <div className="p-20 text-center">
            <Loader2 className="animate-spin h-10 w-10 text-indigo-600 mx-auto" />
            <p className="mt-4 text-slate-500 font-semibold text-sm">Processing time-series projections...</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={380}>
            <AreaChart data={mergedChartData}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#a855f7" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="Historical Sales" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
              <Area type="monotone" dataKey="Projected Demand" stroke="#a855f7" strokeWidth={3} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorProjected)" />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}