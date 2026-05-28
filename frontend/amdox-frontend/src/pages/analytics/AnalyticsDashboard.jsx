import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";

import { Bar, Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

import {
  BarChart,
  Bar as ReBar,
  XAxis,
  YAxis,
  Tooltip as ReTooltip,
  ResponsiveContainer,
  LineChart,
  Line as ReLine,
} from "recharts";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function AnalyticsDashboard() {
  // ================= STATE =================
  const [data, setData] = useState(null);
  const [kpis, setKpis] = useState({});
  const [finance, setFinance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [liveAnalytics, setLiveAnalytics] = useState(null);

  // ================= SOCKET REF (IMPORTANT FIX) =================
  const socketRef = useRef(null);

  // ================= FETCH DATA =================
  const fetchAllData = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const [dashboardRes, kpiRes, financeRes, advancedRes] =
        await Promise.all([
          axios.get("http://localhost:5000/api/analytics/dashboard", { headers }),
          axios.get("http://localhost:5000/api/analytics/kpis", { headers }),
          axios.get("http://localhost:5000/api/analytics/finance", { headers }),
          axios.get("http://localhost:5000/api/analytics/advanced", { headers }),
        ]);

      setData(dashboardRes.data);
      setKpis(kpiRes.data);
      setFinance(financeRes.data.revenue || []);
      setLiveAnalytics(advancedRes.data);
    } catch (err) {
      console.log("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ================= INITIAL LOAD =================
  useEffect(() => {
    fetchAllData();
  }, []);

  // ================= SOCKET FIX (IMPORTANT) =================
  useEffect(() => {
    socketRef.current = io("http://localhost:5000", {
      transports: ["websocket", "polling"],
    });

    socketRef.current.on("connect", () => {
      console.log("Socket connected");
    });

    socketRef.current.on("analytics_update", (newData) => {
      console.log("Live update:", newData);
      setLiveAnalytics(newData);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  // ================= AUTO REFRESH =================
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchAllData();
    }, 10000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  // ================= FILTER =================
  const applyFilters = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const res = await axios.get(
        `http://localhost:5000/api/analytics/dashboard?from=${from}&to=${to}`,
        { headers }
      );

      setData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="p-10 text-xl font-semibold">
        Loading Analytics...
      </div>
    );
  }

  // ================= CHART DATA =================
  const employeeChart = {
    labels: data?.employeeRoles?.map((i) => i._id) || [],
    datasets: [
      {
        label: "Employees",
        data: data?.employeeRoles?.map((i) => i.count) || [],
        backgroundColor: "#3B82F6",
      },
    ],
  };

  const leaveChart = {
    labels: data?.leaveStats?.map((i) => i._id) || [],
    datasets: [
      {
        data: data?.leaveStats?.map((i) => i.count) || [],
        backgroundColor: ["#10B981", "#EF4444", "#F59E0B"],
      },
    ],
  };

  const financeChart = {
    labels: data?.monthlyFinance?.map((i) => i.month) || [],
    datasets: [
      {
        label: "Revenue",
        data: data?.monthlyFinance?.map((i) => i.revenue) || [],
        borderColor: "#2563EB",
        backgroundColor: "#93C5FD",
        tension: 0.4,
      },
    ],
  };

  // ================= UI =================
  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="flex flex-col md:flex-row md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold">📊 Analytics Dashboard</h1>
          <p className="text-gray-500">Real-time insights</p>
        </div>

        <div className="flex gap-3">
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />

          <button onClick={applyFilters} className="bg-blue-600 text-white px-4 py-2 rounded">
            Filter
          </button>

          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            {autoRefresh ? "Live ON" : "Live OFF"}
          </button>
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-10">
        <div className="bg-white p-5 rounded shadow">Revenue ₹{kpis.revenue || 0}</div>
        <div className="bg-white p-5 rounded shadow">Expenses ₹{kpis.expenses || 0}</div>
        <div className="bg-white p-5 rounded shadow">Profit ₹{kpis.profit || 0}</div>
        <div className="bg-white p-5 rounded shadow">Employees {kpis.employees || 0}</div>
      </div>

      {/* CHARTS */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white p-5 rounded shadow">
          <Bar data={employeeChart} />
        </div>

        <div className="bg-white p-5 rounded shadow">
          <Pie data={leaveChart} />
        </div>
      </div>

      <div className="bg-white p-5 rounded shadow mt-10">
        <Line data={financeChart} />
      </div>

    </div>
  );
}