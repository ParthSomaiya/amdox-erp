import { useEffect, useState, useMemo } from "react";
import { Landmark, RefreshCw, Loader2 } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import API from "../services/api";

export default function BillingReports() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const res = await API.get("/finance/invoice").catch(() => ({ data: [] }));
      const serverInvoices = res.data || [];

      const localInvoices = JSON.parse(localStorage.getItem("amdox_simulated_invoices") || "[]");
      const merged = [...serverInvoices];
      localInvoices.forEach(li => {
        if (!merged.some(si => si._id === li._id)) merged.push(li);
      });

      setInvoices(merged);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const chartData = useMemo(() => {
    const monthly = { Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0 };
    invoices.forEach(inv => {
      if (inv.createdAt) {
        const m = new Date(inv.createdAt).toLocaleString("default", { month: "short" });
        if (monthly[m] !== undefined) monthly[m] += Number(inv.amount || inv.totalAmount || 0);
      }
    });

    return Object.keys(monthly).map(k => ({ name: k, Billing: monthly[k] }));
  }, [invoices]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-1">
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 rounded-3xl text-white shadow-md flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <Landmark /> Dynamic Billing Reports
          </h1>
          <p className="text-slate-400 text-xs">Review total monthly sales invoices and receivables volumes.</p>
        </div>
        <button onClick={fetchInvoices} className="h-10 w-10 bg-white/10 hover:bg-white/20 text-white border rounded-xl flex items-center justify-center transition">
          <RefreshCw size={15} />
        </button>
      </div>

      <div className="bg-white border rounded-3xl p-6 shadow-sm space-y-4">
        {loading ? (
          <div className="py-20 text-center"><Loader2 className="animate-spin text-indigo-600 mx-auto" /></div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Bar dataKey="Billing" fill="#4f46e5" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}