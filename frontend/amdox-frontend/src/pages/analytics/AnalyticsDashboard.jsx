import {
  useEffect,
  useState,
} from "react";

import axios from "axios";
import io from "socket.io-client";

import {
  Bar,
  Pie,
  Line,
} from "react-chartjs-2";

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

// ================= SOCKET =================

const socket =
  io("http://localhost:5000");

export default function AnalyticsDashboard() {

  // ===================================
  // STATES
  // ===================================

  const [data, setData] =
    useState(null);

  const [kpis, setKpis] =
    useState({});

  const [finance, setFinance] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [from, setFrom] =
    useState("");

  const [to, setTo] =
    useState("");

  const [autoRefresh, setAutoRefresh] =
    useState(true);

  const [selectedChart, setSelectedChart] =
    useState("revenue");

  const [liveAnalytics, setLiveAnalytics] =
    useState(null);

  // ===================================
  // FETCH ALL DATA
  // ===================================

  const fetchAllData =
    async () => {

      try {

        setLoading(true);

        const token =
          localStorage.getItem(
            "token"
          );

        const headers = {
          Authorization:
            `Bearer ${token}`,
        };

        // =========================
        // DASHBOARD
        // =========================

        const dashboardRes =
          await axios.get(
            "http://localhost:5000/api/analytics/dashboard",
            { headers }
          );

        setData(
          dashboardRes.data
        );

        // =========================
        // KPI
        // =========================

        const kpiRes =
          await axios.get(
            "http://localhost:5000/api/analytics/kpis",
            { headers }
          );

        setKpis(
          kpiRes.data
        );

        // =========================
        // FINANCE
        // =========================

        const financeRes =
          await axios.get(
            "http://localhost:5000/api/analytics/finance",
            { headers }
          );

        setFinance(
          financeRes.data.revenue || []
        );

        // =========================
        // ADVANCED AI ANALYTICS
        // =========================

        const advancedRes =
          await axios.get(
            "http://localhost:5000/api/analytics/advanced",
            { headers }
          );

        setLiveAnalytics(
          advancedRes.data
        );

      } catch (err) {

        console.log(err);

      } finally {

        setLoading(false);

      }

    };

  // ===================================
  // INITIAL LOAD
  // ===================================

  useEffect(() => {

    fetchAllData();

  }, []);

  // ===================================
  // SOCKET LIVE UPDATE
  // ===================================

  useEffect(() => {

    socket.on(
      "analytics_update",
      (newData) => {

        console.log(
          "📊 Live Analytics:",
          newData
        );

        setLiveAnalytics(
          newData
        );

      }
    );

    return () => {

      socket.off(
        "analytics_update"
      );

    };

  }, []);

  // ===================================
  // AUTO REFRESH
  // ===================================

  useEffect(() => {

    if (!autoRefresh) return;

    const interval =
      setInterval(() => {

        fetchAllData();

      }, 10000);

    return () =>
      clearInterval(interval);

  }, [autoRefresh]);

  // ===================================
  // APPLY FILTER
  // ===================================

  const applyFilters =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "token"
          );

        const headers = {
          Authorization:
            `Bearer ${token}`,
        };

        const res =
          await axios.get(

            `http://localhost:5000/api/analytics/dashboard?from=${from}&to=${to}`,

            { headers }

          );

        setData(res.data);

      } catch (err) {

        console.log(err);

      }

    };

  // ===================================
  // LOADING
  // ===================================

  if (loading) {

    return (

      <div className="p-10 text-xl font-semibold">

        Loading Analytics...

      </div>

    );

  }

  // ===================================
  // CHART DATA
  // ===================================

  const employeeChart = {

    labels:
      data?.employeeRoles?.map(
        (i) => i._id
      ) || [],

    datasets: [

      {
        label: "Employees",

        data:
          data?.employeeRoles?.map(
            (i) => i.count
          ) || [],

        backgroundColor:
          "#3B82F6",
      },

    ],

  };

  const leaveChart = {

    labels:
      data?.leaveStats?.map(
        (i) => i._id
      ) || [],

    datasets: [

      {
        data:
          data?.leaveStats?.map(
            (i) => i.count
          ) || [],

        backgroundColor: [
          "#10B981",
          "#EF4444",
          "#F59E0B",
        ],
      },

    ],

  };

  const financeChart = {

    labels:
      data?.monthlyFinance?.map(
        (i) => i.month
      ) || [],

    datasets: [

      {
        label: "Revenue",

        data:
          data?.monthlyFinance?.map(
            (i) => i.revenue
          ) || [],

        borderColor:
          "#2563EB",

        backgroundColor:
          "#93C5FD",

        tension: 0.4,
      },

    ],

  };

  // ===================================
  // UI
  // ===================================

  return (

    <div className="min-h-screen bg-gray-100 p-6">

      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">

        <div>

          <h1 className="text-4xl font-bold">
            📊 Analytics Dashboard
          </h1>

          <p className="text-gray-500 mt-1">
            Real-time company insights
          </p>

        </div>

        {/* FILTERS */}

        <div className="flex flex-wrap gap-3">

          <input
            type="date"
            value={from}
            onChange={(e) =>
              setFrom(e.target.value)
            }
            className="border px-3 py-2 rounded bg-white"
          />

          <input
            type="date"
            value={to}
            onChange={(e) =>
              setTo(e.target.value)
            }
            className="border px-3 py-2 rounded bg-white"
          />

          <button
            onClick={applyFilters}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Apply Filter
          </button>

          <button
            onClick={() =>
              setAutoRefresh(
                !autoRefresh
              )
            }
            className={`px-4 py-2 rounded text-white ${
              autoRefresh
                ? "bg-green-600"
                : "bg-gray-500"
            }`}
          >
            {
              autoRefresh
                ? "Live ON"
                : "Live OFF"
            }
          </button>

        </div>

      </div>

      {/* KPI */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">

        <div className="bg-white rounded-xl shadow p-6 border-l-4 border-blue-600">

          <p className="text-gray-500">
            Revenue
          </p>

          <h2 className="text-3xl font-bold mt-2">
            ₹{kpis.revenue || 0}
          </h2>

        </div>

        <div className="bg-white rounded-xl shadow p-6 border-l-4 border-red-500">

          <p className="text-gray-500">
            Expenses
          </p>

          <h2 className="text-3xl font-bold mt-2">
            ₹{kpis.expenses || 0}
          </h2>

        </div>

        <div className="bg-white rounded-xl shadow p-6 border-l-4 border-green-600">

          <p className="text-gray-500">
            Profit
          </p>

          <h2 className="text-3xl font-bold mt-2">
            ₹{kpis.profit || 0}
          </h2>

        </div>

        <div className="bg-white rounded-xl shadow p-6 border-l-4 border-yellow-500">

          <p className="text-gray-500">
            Employees
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {kpis.employees || 0}
          </h2>

        </div>

      </div>

      {/* AI INSIGHTS */}

      {liveAnalytics?.insights && (

        <div className="grid md:grid-cols-2 gap-4 mb-10">

          {liveAnalytics.insights.map(
            (i, index) => (

              <div
                key={index}
                className="bg-white p-5 rounded shadow"
              >

                <h3 className="font-bold text-lg mb-2">

                  🤖 AI Insight

                </h3>

                <p>{i}</p>

              </div>

            )
          )}

        </div>

      )}

      {/* PREDICTION CHART */}

      {liveAnalytics?.predictions && (

        <div className="bg-white p-5 rounded shadow mb-10">

          <h2 className="text-2xl font-bold mb-5">

            Revenue Prediction

          </h2>

          <ResponsiveContainer
            width="100%"
            height={400}
          >

            <LineChart
              data={
                liveAnalytics.predictions
              }
            >

              <XAxis
                dataKey="month"
              />

              <YAxis />

              <ReTooltip />

              <ReLine
                dataKey="predictedRevenue"
                stroke="#2563EB"
                strokeWidth={3}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

      )}

      {/* CHARTS */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">

        <div className="bg-white rounded-xl shadow p-5">

          <h2 className="text-xl font-bold mb-5">
            Employee Roles
          </h2>

          <Bar data={employeeChart} />

        </div>

        <div className="bg-white rounded-xl shadow p-5">

          <h2 className="text-xl font-bold mb-5">
            Leave Analytics
          </h2>

          <Pie data={leaveChart} />

        </div>

      </div>

      {/* MONTHLY REVENUE */}

      <div className="bg-white rounded-xl shadow p-5 mb-10">

        <h2 className="text-2xl font-bold mb-6">
          Monthly Revenue
        </h2>

        <Line data={financeChart} />

      </div>

      {/* RECHARTS */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="bg-white rounded-xl shadow p-5">

          <h2 className="text-2xl font-bold mb-5">
            Revenue Analytics
          </h2>

          <ResponsiveContainer
            width="100%"
            height={350}
          >

            <BarChart data={finance}>

              <XAxis
                dataKey="_id.month"
              />

              <YAxis />

              <ReTooltip />

              <ReBar
                dataKey="revenue"
                fill="#2563EB"
              />

            </BarChart>

          </ResponsiveContainer>

        </div>

        <div className="bg-white rounded-xl shadow p-5">

          <h2 className="text-2xl font-bold mb-5">
            Revenue Trend
          </h2>

          <ResponsiveContainer
            width="100%"
            height={350}
          >

            <LineChart data={finance}>

              <XAxis
                dataKey="_id.month"
              />

              <YAxis />

              <ReTooltip />

              <ReLine
                type="monotone"
                dataKey="revenue"
                stroke="#16A34A"
                strokeWidth={3}
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

      </div>

    </div>

  );

}