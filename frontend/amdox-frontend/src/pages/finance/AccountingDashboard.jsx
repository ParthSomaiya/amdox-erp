import { useEffect, useState } from "react";
import { Loader2, TrendingUp, CheckCircle, ShieldAlert } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import API from "../../services/api";

export default function AccountingDashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/finance/analytics")
      .then((res) => {
        const raw = res.data || [];
        const formatted = Array.isArray(raw) ? raw : [
          { month: "Jan", revenue: 50000, expense: 32000, profit: 18000 },
          { month: "Feb", revenue: 72000, expense: 41000, profit: 31000 },
          { month: "Mar", revenue: 85000, expense: 50000, profit: 35000 }
        ];
        setData(formatted);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 p-8 rounded-[32px] text-white shadow-md">
        <h1 className="text-3xl font-black flex items-center gap-2">📘 Accounting Dashboard</h1>
        <p className="mt-2 text-indigo-100 text-sm">Monitor corporate general ledgers, cash turn-overs, and profit distributions.</p>
      </div>

      {loading ? (
        <div className="p-20 text-center">
          <Loader2 className="animate-spin h-10 w-10 text-indigo-600 mx-auto" />
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