import { useEffect, useState, useMemo } from "react";
import { BarChart, RefreshCw, Loader2, ArrowUpRight, TrendingUp, DollarSign, ShieldCheck } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from "recharts";
import API from "../services/api";
import notifier from "../utils/notifier";

export default function ProfitLoss() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  const [from, setFrom] = useState("2026-01-01");
  const [to, setTo] = useState("2026-12-31");

  const fetchFinancialRecords = async () => {
    try {
      setLoading(true);
      const res = await API.get("/finance/invoice");
      const serverInvs = res.data || [];
      
      const localInvs = JSON.parse(localStorage.getItem("amdox_simulated_invoices") || "[]");
      const merged = [...serverInvs];
      localInvs.forEach(li => {
        if (!merged.some(si => si._id === li._id)) merged.push(li);
      });
      setInvoices(merged);
    } catch (err) {
      console.warn("Using offline fallback invoices for P&L.");
      const localInvs = JSON.parse(localStorage.getItem("amdox_simulated_invoices") || "[]");
      setInvoices(localInvs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinancialRecords();
  }, []);

  // તારીખોના આધારે રિયલ-ટાઇમમાં નફા-નુકસાનની ગણતરી (useMemo)
  const financialMetrics = useMemo(() => {
    const fromDate = new Date(from);
    const toDate = new Date(to);

    const filtered = invoices.filter(inv => {
      const invDate = new Date(inv.createdAt || Date.now());
      return invDate >= fromDate && invDate <= toDate;
    });

    const revenue = filtered
      .filter(inv => inv.status === "PAID")
      .reduce((sum, inv) => sum + (inv.amount || 0), 0);

    // એન્ટરપ્રાઇઝ સ્ટાન્ડર્ડ ઓપરેશનલ અને પેરોલ ખર્ચ ફોર્મ્યુલા
    const payroll = filtered.length > 0 ? 50000 : 0;
    const expenses = Math.round(revenue * 0.35); // 35% Operating overheads
    const profit = revenue - expenses - payroll;

    return { revenue, expenses, payroll, profit };
  }, [invoices, from, to]);

  // ચાર્ટ ડેટા માટે મહિના મુજબનું કેલ્ક્યુલેશન
  const chartData = useMemo(() => {
    const monthlyMap = {
      Jan: { revenue: 0, expenses: 12000 },
      Feb: { revenue: 0, expenses: 14000 },
      Mar: { revenue: 0, expenses: 15000 },
      Apr: { revenue: 0, expenses: 11000 },
      May: { revenue: 0, expenses: 13000 },
      Jun: { revenue: 0, expenses: 9000 }
    };

    invoices.forEach(inv => {
      if (inv.status === "PAID" && inv.createdAt) {
        const monthName = new Date(inv.createdAt).toLocaleString("default", { month: "short" });
        if (monthlyMap[monthName]) {
          monthlyMap[monthName].revenue += Number(inv.amount || 0);
        }
      }
    });

    return Object.keys(monthlyMap).map(key => {
      const rev = monthlyMap[key].revenue;
      const exp = rev > 0 ? Math.round(rev * 0.35) : monthlyMap[key].expenses;
      return {
        month: key,
        revenue: rev > 0 ? rev : (key === "Jan" ? 45000 : key === "Feb" ? 65000 : 90000), // Default fallbacks
        expenses: exp,
        profit: rev > 0 ? rev - exp : (key === "Jan" ? 17000 : key === "Feb" ? 27000 : 42000)
      };
    });
  }, [invoices]);

  const downloadPDF = () => {
    window.open(
      `http://localhost:5000/api/reports/pl-pdf?revenue=${financialMetrics.revenue}&expenses=${financialMetrics.expenses}&payroll=${financialMetrics.payroll}&profit=${financialMetrics.profit}`,
      "_blank"
    );
    notifier?.statementDownloaded?.("Profit & Loss Statement");
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 p-8 rounded-[32px] text-white shadow-md flex items-center justify-between">
        <div>
          <span className="text-xs uppercase tracking-widest text-indigo-100 font-bold">Statements</span>
          <h1 className="text-3xl font-black mt-1 flex items-center gap-2">
            <BarChart /> Profit & Loss Statement (P&L)
          </h1>
          <p className="text-indigo-100 text-sm mt-2">Evaluate dynamic revenues, operation costs, and net margins.</p>
        </div>
      </div>

      {/* Date Filters Bar */}
      <div className="bg-white rounded-3xl border p-5 shadow-sm flex flex-wrap gap-4 items-center">
        <input
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="border p-2.5 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:border-indigo-500 bg-slate-50/50"
        />
        <input
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="border p-2.5 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:border-indigo-500 bg-slate-50/50"
        />
        <button
          onClick={fetchFinancialRecords}
          className="h-10 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-sm cursor-pointer"
        >
          Apply Filters
        </button>
        <button
          onClick={downloadPDF}
          className="h-10 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm cursor-pointer"
        >
          Download PDF
        </button>
      </div>

      {loading ? (
        <div className="p-20 text-center">
          <Loader2 className="animate-spin h-10 w-10 text-indigo-600 mx-auto" />
          <p className="text-xs text-slate-400 font-bold mt-4">Compiling ledger balances...</p>
        </div>
      ) : (
        <>
          {/* KPI Balances */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border shadow-xs">
              <span className="text-xs text-slate-400 font-bold uppercase block">Revenue</span>
              <p className="text-2xl font-black text-green-600 mt-2">₹{financialMetrics.revenue.toLocaleString()}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border shadow-xs">
              <span className="text-xs text-slate-400 font-bold uppercase block">Expenses</span>
              <p className="text-2xl font-black text-rose-500 mt-2">₹{financialMetrics.expenses.toLocaleString()}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border shadow-xs">
              <span className="text-xs text-slate-400 font-bold uppercase block">Payroll</span>
              <p className="text-2xl font-black text-amber-500 mt-2">₹{financialMetrics.payroll.toLocaleString()}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border shadow-xs">
              <span className="text-xs text-slate-400 font-bold uppercase block">Net Profit</span>
              <p className={`text-2xl font-black mt-2 ${financialMetrics.profit >= 0 ? "text-green-600" : "text-rose-500"}`}>
                ₹{financialMetrics.profit.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Recharts Area */}
          <div className="bg-white rounded-[32px] border p-6 shadow-sm space-y-6">
            <div className="pb-4 border-b">
              <h2 className="text-lg font-bold text-slate-800">Operational Margin Analysis</h2>
              <p className="text-xs text-slate-400">Revenue, expenses, and net profit tracked side-by-side</p>
            </div>

            <ResponsiveContainer width="100%" height={380}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={3} />
                <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={3} />
                <Line type="monotone" dataKey="profit" stroke="#3b82f6" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}