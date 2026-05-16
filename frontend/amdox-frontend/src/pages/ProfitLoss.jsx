import { useEffect, useState } from "react";
import API from "../services/api";
import MainLayout from "../layouts/MainLayout";
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

  // 📊 Fetch P&L summary
  const fetchData = async () => {
    const res = await API.get(`/reports/profit-loss?from=${from}&to=${to}`);
    setData(res.data);
  };

  // 📈 Fetch chart data
  const fetchChart = async () => {
    const res = await API.get("/reports/monthly-pl");
    setChartData(res.data);
  };

  // 📄 Download PDF
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
    <MainLayout>
      <h2 className="text-xl font-semibold mb-4">Profit & Loss</h2>

      {/* 🔹 Filters */}
      <div className="flex gap-4 mb-6">
        <input
          type="date"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />
        <input
          type="date"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
        <button
          onClick={fetchData}
          className="bg-blue-600 text-white px-4 rounded"
        >
          Apply
        </button>

        {/* 📄 PDF Button */}
        <button
          onClick={downloadPDF}
          className="bg-green-600 text-white px-4 rounded"
        >
          Download PDF
        </button>
      </div>

      {/* 🔹 Cards */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded shadow">
          <h3 className="text-gray-500">Revenue</h3>
          <p className="text-2xl font-bold text-green-600">
            ₹{data.revenue || 0}
          </p>
        </div>

        <div className="bg-white p-5 rounded shadow">
          <h3 className="text-gray-500">Expenses</h3>
          <p className="text-2xl font-bold text-red-500">
            ₹{data.expenses || 0}
          </p>
        </div>

        <div className="bg-white p-5 rounded shadow">
          <h3 className="text-gray-500">Payroll</h3>
          <p className="text-2xl font-bold text-yellow-600">
            ₹{data.payroll || 0}
          </p>
        </div>

        <div className="bg-white p-5 rounded shadow">
          <h3 className="text-gray-500">Profit</h3>
          <p
            className={`text-2xl font-bold ${
              data.profit >= 0 ? "text-green-600" : "text-red-500"
            }`}
          >
            ₹{data.profit || 0}
          </p>
        </div>
      </div>

      {/* 📈 CHART */}
      <div className="bg-white p-5 rounded shadow mt-8">
        <h3 className="text-lg font-semibold mb-4">P&L Trend</h3>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />

            <Line type="monotone" dataKey="revenue" stroke="#22c55e" />
            <Line type="monotone" dataKey="expenses" stroke="#ef4444" />
            <Line type="monotone" dataKey="profit" stroke="#3b82f6" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </MainLayout>
  );
}