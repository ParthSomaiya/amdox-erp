import { useEffect, useState, useMemo } from "react";
import { Loader2, TrendingUp, CheckCircle, ShieldAlert } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import API from "../../services/api";
import notifier from "../../utils/notifier";

export default function AccountingDashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const compileDynamicMetrics = async () => {
    try {
      setLoading(true);
      
      // ૧. બેકએન્ડ માંથી લાઈવ ઇન્વોઇસ લોડ કરો
      const res = await API.get("/finance/invoice").catch(() => ({ data: [] }));
      const serverInvs = res.data || [];
      
      // ૨. લોકલ કેશ માંથી ઇન્વોઇસ સિંક કરો
      const localInvs = JSON.parse(localStorage.getItem("amdox_simulated_invoices") || "[]");
      const mergedInvoices = [...serverInvs];
      localInvs.forEach(li => {
        if (!mergedInvoices.some(si => si._id === li._id)) mergedInvoices.push(li);
      });

      // ૩. મહિના મુજબ ડેટા એગ્રીગેટ કરો (Jan to Dec)
      const monthlyMetrics = {
        Jan: { revenue: 0, expense: 12000 },
        Feb: { revenue: 0, expense: 15000 },
        Mar: { revenue: 0, expense: 18000 },
        Apr: { revenue: 0, expense: 14000 },
        May: { revenue: 0, expense: 16000 },
        Jun: { revenue: 0, expense: 11000 }
      };

      mergedInvoices.forEach(inv => {
        if (inv.status === "PAID" && inv.createdAt) {
          const monthName = new Date(inv.createdAt).toLocaleString("default", { month: "short" });
          if (monthlyMetrics[monthName]) {
            monthlyMetrics[monthName].revenue += Number(inv.amount || 0);
          }
        }
      });

      // ૪. પ્રોફિટ અને ફોર્મેટિંગ કેલ્ક્યુલેશન
      const formatted = Object.keys(monthlyMetrics).map(key => {
        const rev = monthlyMetrics[key].revenue;
        const exp = monthlyMetrics[key].expense || (rev * 0.4); // 40% operating expenses limit fallback
        return {
          month: key,
          revenue: rev > 0 ? rev : (key === "Jan" ? 50000 : key === "Feb" ? 72000 : 85000), // Default mock values if empty
          expense: exp > 0 ? Number(exp.toFixed(0)) : (key === "Jan" ? 32000 : key === "Feb" ? 41000 : 50000),
          profit: Number((rev - exp).toFixed(0))
        };
      });

      setData(formatted);
      notifier?.accountingDashboardViewed?.();
    } catch (err) {
      console.error("Failed to compile accounting metrics:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    compileDynamicMetrics();
  }, []);

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 p-8 rounded-[32px] text-white shadow-md">
        <h1 className="text-3xl font-black flex items-center gap-2">📘 Accounting Dashboard</h1>
        <p className="mt-2 text-indigo-100 text-sm">Monitor corporate general ledgers, cash turn-overs, and profit distributions.</p>
      </div>

      {loading ? (
        <div className="p-20 text-center">
          <Loader2 className="animate-spin h-10 w-10 text-indigo-600 mx-auto" />
          <p className="text-xs text-slate-400 font-bold mt-4">Compiling ledger inflows...</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border p-6 shadow-sm space-y-6">
          <div className="pb-4 border-b">
            <h2 className="text-lg font-bold text-slate-800">Operational Inflows vs Outflows</h2>
            <p className="text-xs text-slate-400">Comparing gross revenue against expense reserves</p>
          </div>
          <ResponsiveContainer width="100%" height={380}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip />
              <Legend />
              <Bar dataKey="revenue" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              <Bar dataKey="expense" fill="#f43f5e" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}