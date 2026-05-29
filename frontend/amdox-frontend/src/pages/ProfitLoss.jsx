import { useEffect, useState } from "react";
import API from "../services/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function ProfitLoss() {
  const [data, setData] = useState({});
  const [chartData, setChartData] = useState([]);

  const [from, setFrom] = useState("2026-01-01");
  const [to, setTo] = useState("2026-12-31");

  const fetchData = async () => {
    try {
      const res = await API.get(`/reports/profit-loss?from=${from}&to=${to}`);
      setData(res.data || {});
    } catch (err) {
      console.error(err);
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
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-slate-800">Profit & Loss</h2>

      {/* 🔹 Filters */}
      <div className="flex gap-4 mb-6">
        <input
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="border p-2 rounded-xl text-sm"
        />
        <input
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="border p-2 rounded-xl text-sm"
        />
        <button
          onClick={fetchData}
          className="bg-indigo-600 text-white px-4 rounded-xl text-sm font-bold"
        >
          Apply
        </button>

        {/* 📄 PDF Button */}
        <button
          onClick={downloadPDF}
          className="bg-emerald-600 text-white px-4 rounded-xl text-sm font-bold"
        >
          Download PDF
        </button>
      </div>

      {/* 🔹 Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-2xl border shadow-sm">
          <h3 className="text-xs text-slate-400 font-bold uppercase tracking-wider">Revenue</h3>
          <p className="text-2xl font-black text-green-600 mt-2">
            ₹{data.revenue || 0}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border shadow-sm">
          <h3 className="text-xs text-slate-400 font-bold uppercase tracking-wider">Expenses</h3>
          <p className="text-2xl font-black text-rose-500 mt-2">
            ₹{data.expenses || 0}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border shadow-sm">
          <h3 className="text-xs text-slate-400 font-bold uppercase tracking-wider">Payroll</h3>
          <p className="text-2xl font-black text-amber-500 mt-2">
            ₹{data.payroll || 50000}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border shadow-sm">
          <h3 className="text-xs text-slate-400 font-bold uppercase tracking-wider">Profit</h3>
          <p
            className={`text-2xl font-black mt-2 ${
              data.profit >= 0 ? "text-green-600" : "text-rose-500"
            }`}
          >
            ₹{data.profit || 0}
          </p>
        </div>
      </div>

      {/* 📈 CHART */}
      <div className="bg-white p-6 rounded-3xl border shadow-sm mt-8">
        <h3 className="text-lg font-bold text-slate-800 mb-4">P&L Trend</h3>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />

            <Line type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2.5} />
            <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2.5} />
            <Line type="monotone" dataKey="profit" stroke="#3b82f6" strokeWidth={2.5} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}