import { useEffect, useState } from "react";
import { BarChart, RefreshCw, Loader2, ArrowUpRight, TrendingUp, DollarSign } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from "recharts";
import API from "../services/api";

export default function ProfitLoss() {
  const [data, setData] = useState({});
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [from, setFrom] = useState("2026-01-01");
  const [to, setTo] = useState("2026-12-31");

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/reports/profit-loss?from=${from}&to=${to}`);
      setData(res.data || {});
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchChart = async () => {
    try {
      const res = await API.get("/reports/monthly-pl");
      setChartData(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const downloadPDF = () => {
    window.open(
      `http://localhost:5000/api/reports/pl-pdf?revenue=${data.revenue || 0}&expenses=${data.expenses || 0}&payroll=${data.payroll || 0}&profit=${data.profit || 0}`,
      "_blank"
    );
  };

  useEffect(() => {
    fetchData();
    fetchChart();
  }, []);

  return (
    <div className="space-y-8">
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
          className="border p-2.5 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:border-indigo-500"
        />
        <input
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="border p-2.5 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:border-indigo-500"
        />
        <button
          onClick={fetchData}
          className="h-10 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-sm"
        >
          Apply Filters
        </button>
        <button
          onClick={downloadPDF}
          className="h-10 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm"
        >
          Download PDF
        </button>
      </div>

      {loading ? (
        <div className="p-20 text-center">
          <Loader2 className="animate-spin h-10 w-10 text-indigo-600 mx-auto" />
        </div>
      ) : (
        <>
          {/* KPI Balances */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-5 rounded-2xl border shadow-sm">
              <span className="text-xs text-slate-400 font-bold uppercase block">Revenue</span>
              <p className="text-2xl font-black text-green-600 mt-2">₹{data.revenue || 0}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border shadow-sm">
              <span className="text-xs text-slate-400 font-bold uppercase block">Expenses</span>
              <p className="text-2xl font-black text-rose-500 mt-2">₹{data.expenses || 0}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border shadow-sm">
              <span className="text-xs text-slate-400 font-bold uppercase block">Payroll</span>
              <p className="text-2xl font-black text-amber-500 mt-2">₹{data.payroll || 50000}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border shadow-sm">
              <span className="text-xs text-slate-400 font-bold uppercase block">Net Profit</span>
              <p className={`text-2xl font-black mt-2 ${data.profit >= 0 ? "text-green-600" : "text-rose-500"}`}>
                ₹{data.profit || 0}
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