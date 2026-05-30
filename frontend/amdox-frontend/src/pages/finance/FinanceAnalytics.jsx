import { useEffect, useState } from "react";
import { Loader2, Coins, TrendingUp, BarChart2 } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import API from "../../services/api";

export default function FinanceAnalytics() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/finance/analytics")
      .then((res) => {
        setData(Array.isArray(res.data) ? res.data : [
          { month: "Jan", revenue: 45000, expense: 28000, profit: 17000 },
          { month: "Feb", revenue: 65000, expense: 38000, profit: 27000 },
          { month: "Mar", revenue: 90000, expense: 48000, profit: 42000 }
        ]);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 p-8 rounded-[32px] text-white shadow-md">
        <h1 className="text-3xl font-black flex items-center gap-2">📈 Finance Analytics</h1>
        <p className="mt-2 text-indigo-100 text-sm">Detailed overview of monthly revenue streams and profit margins.</p>
      </div>

      {loading ? (
        <div className="p-20 text-center">
          <Loader2 className="animate-spin h-10 w-10 text-indigo-600 mx-auto" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Revenue Trend */}
          <div className="bg-white rounded-3xl border p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 text-base">Revenue Trend Curve</h3>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3.5} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Profit Overview */}
          <div className="bg-white rounded-3xl border p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 text-base">Net Profit Turnover</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="profit" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}