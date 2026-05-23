import { useEffect, useState } from "react";

import axios from "axios";

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

  const [data, setData] =
    useState(null);

  const [kpis, setKpis] =
    useState({});

  const [finance, setFinance] =
    useState([]);

  const [from, setFrom] =
    useState("");

  const [to, setTo] =
    useState("");


  // =========================
  // FETCH DATA
  // =========================

  useEffect(() => {

    fetchAnalytics();

    fetchKpis();

    fetchFinance();

  }, []);


  // =========================
  // DASHBOARD ANALYTICS
  // =========================

  const fetchAnalytics =
    async () => {

      try {

        const res =
          await axios.get(

            "http://localhost:5000/api/analytics/dashboard",

            {
              headers: {

                Authorization:
                  `Bearer ${localStorage.getItem("token")}`,

              },
            }

          );

        setData(res.data);

      } catch (err) {

        console.log(err);

      }

    };


  // =========================
  // KPI DATA
  // =========================

  const fetchKpis =
    async () => {

      try {

        const res =
          await axios.get(

            "http://localhost:5000/api/analytics/kpis",

            {
              headers: {

                Authorization:
                  `Bearer ${localStorage.getItem("token")}`,

              },
            }

          );

        setKpis(res.data);

      } catch (err) {

        console.log(err);

      }

    };


  // =========================
  // FINANCE ANALYTICS
  // =========================

  const fetchFinance =
    async () => {

      try {

        const res =
          await axios.get(

            "http://localhost:5000/api/analytics/finance",

            {
              headers: {

                Authorization:
                  `Bearer ${localStorage.getItem("token")}`,

              },
            }

          );

        setFinance(
          res.data.revenue
        );

      } catch (err) {

        console.log(err);

      }

    };


  // =========================
  // LOADING
  // =========================

  if (!data) {

    return (
      <div className="p-6">
        Loading...
      </div>
    );

  }


  // =========================
  // CHART JS DATA
  // =========================

  // EMPLOYEE BAR CHART

  const employeeChart = {

    labels:
      data.employeeRoles.map(
        (i) => i._id
      ),

    datasets: [

      {
        label: "Employees",

        data:
          data.employeeRoles.map(
            (i) => i.count
          ),
      },

    ],

  };


  // LEAVE PIE CHART

  const leaveChart = {

    labels:
      data.leaveStats.map(
        (i) => i._id
      ),

    datasets: [

      {
        data:
          data.leaveStats.map(
            (i) => i.count
          ),
      },

    ],

  };


  // FINANCE LINE CHART

  const financeChart = {

    labels:
      data.monthlyFinance.map(
        (i) => i.month
      ),

    datasets: [

      {
        label: "Revenue",

        data:
          data.monthlyFinance.map(
            (i) => i.revenue
          ),
      },

    ],

  };


  // =========================
  // UI
  // =========================

  return (

    <div className="p-6 space-y-8 bg-gray-100 min-h-screen">

      {/* HEADER */}

      <div className="flex justify-between items-center">

        <h1 className="text-3xl font-bold">
          📊 Analytics Dashboard
        </h1>

        {/* DATE FILTERS */}

        <div className="flex gap-3">

          <input
            type="date"
            value={from}
            onChange={(e) =>
              setFrom(e.target.value)
            }
            className="border p-2 rounded"
          />

          <input
            type="date"
            value={to}
            onChange={(e) =>
              setTo(e.target.value)
            }
            className="border p-2 rounded"
          />

        </div>

      </div>


      {/* KPI CARDS */}

      <div className="grid grid-cols-4 gap-4">

        <div className="bg-blue-100 shadow rounded p-5">
          <p className="text-gray-500">
            Revenue
          </p>

          <h2 className="text-3xl font-bold">
            ₹{kpis.revenue || 0}
          </h2>
        </div>

        <div className="bg-red-100 shadow rounded p-5">
          <p className="text-gray-500">
            Expenses
          </p>

          <h2 className="text-3xl font-bold">
            ₹{kpis.expenses || 0}
          </h2>
        </div>

        <div className="bg-green-100 shadow rounded p-5">
          <p className="text-gray-500">
            Profit
          </p>

          <h2 className="text-3xl font-bold">
            ₹{kpis.profit || 0}
          </h2>
        </div>

        <div className="bg-yellow-100 shadow rounded p-5">
          <p className="text-gray-500">
            Employees
          </p>

          <h2 className="text-3xl font-bold">
            {kpis.employees || 0}
          </h2>
        </div>

      </div>


      {/* OLD CARDS */}

      <div className="grid grid-cols-4 gap-4">

        <div className="bg-white shadow rounded p-4">
          <p className="text-gray-500">
            Total Employees
          </p>

          <h2 className="text-3xl font-bold">
            {data.totalEmployees}
          </h2>
        </div>

        <div className="bg-white shadow rounded p-4">
          <p className="text-gray-500">
            Projects
          </p>

          <h2 className="text-3xl font-bold">
            {data.totalProjects}
          </h2>
        </div>

        <div className="bg-white shadow rounded p-4">
          <p className="text-gray-500">
            Jobs
          </p>

          <h2 className="text-3xl font-bold">
            {data.totalJobs}
          </h2>
        </div>

        <div className="bg-white shadow rounded p-4">
          <p className="text-gray-500">
            Total Revenue
          </p>

          <h2 className="text-3xl font-bold">
            ₹{data.totalRevenue}
          </h2>
        </div>

      </div>


      {/* CHARTJS CHARTS */}

      <div className="grid grid-cols-2 gap-6">

        {/* EMPLOYEE */}

        <div className="bg-white p-4 rounded shadow">

          <h2 className="font-bold mb-4">
            Employee Roles
          </h2>

          <Bar data={employeeChart} />

        </div>


        {/* LEAVE */}

        <div className="bg-white p-4 rounded shadow">

          <h2 className="font-bold mb-4">
            Leave Status
          </h2>

          <Pie data={leaveChart} />

        </div>

      </div>


      {/* MONTHLY REVENUE */}

      <div className="bg-white p-4 rounded shadow">

        <h2 className="font-bold mb-4">
          Monthly Revenue
        </h2>

        <Line data={financeChart} />

      </div>


      {/* RECHARTS */}

      <div className="bg-white p-6 rounded shadow">

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
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>

  );

}