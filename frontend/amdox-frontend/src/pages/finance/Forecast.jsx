import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { Sparkles, Calendar } from "lucide-react";

const mockForecastData = [
  { month: "Jan", revenue: 40000 },
  { month: "Feb", revenue: 60000 },
  { month: "Mar", revenue: 85000 },
  { month: "Apr (AI Proj)", revenue: 105000 },
  { month: "May (AI Proj)", revenue: 125000 }
];

export default function Forecast() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-700 p-8 rounded-[32px] text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <span className="text-xs uppercase tracking-widest text-indigo-100 font-bold">Predictive Projections</span>
        <h1 className="text-3xl font-black mt-1 flex items-center gap-2">🔮 Cashflow Forecast</h1>
        <p className="text-indigo-100 text-sm mt-2">AI-powered trend modeling for estimated monthly income.</p>
      </div>

      {/* Chart Box */}
      <div className="bg-white rounded-3xl border p-6 shadow-sm space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Cash Flow Projections</h2>
          <p className="text-xs text-slate-400">Comparing previous ledger actuals against projected cash receipts</p>
        </div>

        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={mockForecastData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3.5} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}