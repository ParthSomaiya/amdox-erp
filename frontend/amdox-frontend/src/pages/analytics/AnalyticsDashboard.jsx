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
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/analytics/dashboard",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "token"
            )}`,
          },
        }
      );

      setData(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  if (!data) {
    return <div className="p-6">Loading...</div>;
  }

  // BAR
  const employeeChart = {
    labels: data.employeeRoles.map((i) => i._id),
    datasets: [
      {
        label: "Employees",
        data: data.employeeRoles.map((i) => i.count),
      },
    ],
  };

  // PIE
  const leaveChart = {
    labels: data.leaveStats.map((i) => i._id),
    datasets: [
      {
        data: data.leaveStats.map((i) => i.count),
      },
    ],
  };

  // LINE
  const financeChart = {
    labels: data.monthlyFinance.map((i) => i.month),
    datasets: [
      {
        label: "Revenue",
        data: data.monthlyFinance.map((i) => i.revenue),
      },
    ],
  };

  return (
    <div className="p-6 space-y-8">

      <h1 className="text-3xl font-bold">
        📊 Analytics Dashboard
      </h1>

      {/* CARDS */}
      <div className="grid grid-cols-4 gap-4">

        <div className="bg-white shadow rounded p-4">
          <p className="text-gray-500">Employees</p>
          <h2 className="text-3xl font-bold">
            {data.totalEmployees}
          </h2>
        </div>

        <div className="bg-white shadow rounded p-4">
          <p className="text-gray-500">Projects</p>
          <h2 className="text-3xl font-bold">
            {data.totalProjects}
          </h2>
        </div>

        <div className="bg-white shadow rounded p-4">
          <p className="text-gray-500">Jobs</p>
          <h2 className="text-3xl font-bold">
            {data.totalJobs}
          </h2>
        </div>

        <div className="bg-white shadow rounded p-4">
          <p className="text-gray-500">Revenue</p>
          <h2 className="text-3xl font-bold">
            ₹{data.totalRevenue}
          </h2>
        </div>

      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-2 gap-6">

        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-bold mb-4">
            Employee Roles
          </h2>

          <Bar data={employeeChart} />
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-bold mb-4">
            Leave Status
          </h2>

          <Pie data={leaveChart} />
        </div>

      </div>

      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-bold mb-4">
          Monthly Revenue
        </h2>

        <Line data={financeChart} />
      </div>

    </div>
  );
}