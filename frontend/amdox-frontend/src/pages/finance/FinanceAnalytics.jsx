import { useEffect, useState, useMemo } from "react";
import { Loader2, Coins, TrendingUp, BarChart2 } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import API from "../../services/api";
import notifier from "../../utils/notifier";

export default function FinanceAnalytics() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const compileDynamicAnalytics = async () => {
    try {
      setLoading(true);
      
      const res = await API.get("/finance/invoice").catch(() => ({ data: [] }));
      const serverInvs = res.data || [];
      
      const localInvs = JSON.parse(localStorage.getItem("amdox_simulated_invoices") || "[]");
      const mergedInvoices = [...serverInvs];
      localInvs.forEach(li => {
        if (!mergedInvoices.some(si => si._id === li._id)) mergedInvoices.push(li);
      });

      const monthlyMetrics = {
        Jan: { revenue: 0, expense: 10000 },
        Feb: { revenue: 0, expense: 12000 },
        Mar: { revenue: 0, expense: 15000 },
        Apr: { revenue: 0, expense: 11000 },
        May: { revenue: 0, expense: 13000 },
        Jun: { revenue: 0, expense: 9000 }
      };

      mergedInvoices.forEach(inv => {
        if (inv.status === "PAID" && inv.createdAt) {
          const monthName = new Date(inv.createdAt).toLocaleString("default", { month: "short" });
          if (monthlyMetrics[monthName]) {
            monthlyMetrics[monthName].revenue += Number(inv.amount || 0);
          }
        }
      });

      const formatted = Object.keys(monthlyMetrics).map(key => {
        const rev = monthlyMetrics[key].revenue;
        const exp = monthlyMetrics[key].expense || (rev * 0.45);
        return {
          month: key,
          revenue: rev > 0 ? rev : (key === "Jan" ? 45000 : key === "Feb" ? 65000 : 90000), // Default mock values if empty
          expense: exp,
          profit: rev > 0 ? Number((rev - exp).toFixed(0)) : (key === "Jan" ? 17000 : key === "Feb" ? 27000 : 42000)
        };
      });

      setData(formatted);
      notifier?.financeAnalyticsViewed?.();
    } catch (err) {
      console.error("Failed to compile financial analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    compileDynamicAnalytics();
  }, []);

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 p-8 rounded-[32px] text-white shadow-md">
        <h1 className="text-3xl font-black flex items-center gap-2">📈 Finance Analytics</h1>
        <p className="mt-2 text-indigo-100 text-sm">Detailed overview of monthly revenue streams and profit margins.</p>
      </div>

      {loading ? (
        <div className="p-20 text-center">
          <Loader2 className="animate-spin h-10 w-10 text-indigo-600 mx-auto" />
          <p className="text-xs text-slate-400 font-bold mt-4">Analyzing cash trends...</p>
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