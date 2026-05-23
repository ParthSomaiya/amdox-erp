import { useEffect, useState } from "react";
import API from "../services/api";
import MainLayout from "../layouts/MainLayout";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

export default function Reports() {
  const [finance, setFinance] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const financeRes =
        await API.get("/analytics/finance");

      const employeeRes =
        await API.get("/analytics/employees");

      const projectRes =
        await API.get("/analytics/projects");

      setFinance(financeRes.data || []);
      setEmployees(employeeRes.data || []);
      setProjects(projectRes.data || []);

      setLoading(false);

    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const exportCSV = () => {
    let csv =
      "Month,Revenue,Expense,Profit\n";

    finance.forEach((f) => {
      csv += `${f.month},${f.revenue},${f.expense},${f.profit}\n`;
    });

    const blob =
      new Blob([csv], {
        type: "text/csv",
      });

    const url =
      window.URL.createObjectURL(blob);

    const a =
      document.createElement("a");

    a.href = url;
    a.download = "reports.csv";

    a.click();
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="p-6">
          Loading Reports...
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>

      <div className="p-6">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">

          <h1 className="text-3xl font-bold">
            Reports & Analytics
          </h1>

          <button
            onClick={exportCSV}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Export CSV
          </button>

        </div>

        {/* KPI */}
        <div className="grid md:grid-cols-4 gap-5 mb-8">

          <div className="bg-white shadow rounded p-5">
            <p className="text-gray-500">
              Revenue
            </p>

            <h2 className="text-3xl font-bold text-green-600">
              ₹
              {finance.reduce(
                (a, b) =>
                  a + b.revenue,
                0
              )}
            </h2>
          </div>

          <div className="bg-white shadow rounded p-5">
            <p className="text-gray-500">
              Expenses
            </p>

            <h2 className="text-3xl font-bold text-red-500">
              ₹
              {finance.reduce(
                (a, b) =>
                  a + b.expense,
                0
              )}
            </h2>
          </div>

          <div className="bg-white shadow rounded p-5">
            <p className="text-gray-500">
              Profit
            </p>

            <h2 className="text-3xl font-bold text-blue-600">
              ₹
              {finance.reduce(
                (a, b) =>
                  a + b.profit,
                0
              )}
            </h2>
          </div>

          <div className="bg-white shadow rounded p-5">
            <p className="text-gray-500">
              Employees
            </p>

            <h2 className="text-3xl font-bold">
              {employees.length}
            </h2>
          </div>

        </div>

        {/* CHARTS */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* REVENUE */}
          <div className="bg-white rounded shadow p-5">

            <h2 className="text-xl font-bold mb-4">
              Revenue Trend
            </h2>

            <ResponsiveContainer
              width="100%"
              height={300}
            >

              <LineChart data={finance}>

                <XAxis dataKey="month" />

                <YAxis />

                <Tooltip />

                <Legend />

                <Line
                  type="monotone"
                  dataKey="revenue"
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

          {/* EXPENSE */}
          <div className="bg-white rounded shadow p-5">

            <h2 className="text-xl font-bold mb-4">
              Expense Trend
            </h2>

            <ResponsiveContainer
              width="100%"
              height={300}
            >

              <BarChart data={finance}>

                <XAxis dataKey="month" />

                <YAxis />

                <Tooltip />

                <Legend />

                <Bar dataKey="expense" />

              </BarChart>

            </ResponsiveContainer>

          </div>

          {/* PROJECT STATUS */}
          <div className="bg-white rounded shadow p-5">

            <h2 className="text-xl font-bold mb-4">
              Project Status
            </h2>

            <ResponsiveContainer
              width="100%"
              height={300}
            >

              <PieChart>

                <Pie
                  data={projects}
                  dataKey="count"
                  nameKey="status"
                  outerRadius={100}
                  label
                >

                  {projects.map(
                    (entry, index) => (
                      <Cell
                        key={index}
                      />
                    )
                  )}

                </Pie>

                <Tooltip />

              </PieChart>

            </ResponsiveContainer>

          </div>

          {/* EMPLOYEE CHART */}
          <div className="bg-white rounded shadow p-5">

            <h2 className="text-xl font-bold mb-4">
              Employee Analytics
            </h2>

            <ResponsiveContainer
              width="100%"
              height={300}
            >

              <BarChart data={employees}>

                <XAxis
                  dataKey="department"
                />

                <YAxis />

                <Tooltip />

                <Bar dataKey="count" />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>

    </MainLayout>
  );
}