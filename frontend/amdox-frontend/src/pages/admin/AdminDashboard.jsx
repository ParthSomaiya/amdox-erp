import { useEffect, useState } from "react";
import API from "../../services/api";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

export default function AdminDashboard() {

  const [stats, setStats] =
    useState({});

  const [finance, setFinance] =
    useState([]);

  const [users, setUsers] =
    useState([]);

  const [tenants, setTenants] =
    useState([]);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard =
    async () => {

      try {

        const statsRes =
          await API.get(
            "/admin/stats"
          );

        const financeRes =
          await API.get(
            "/analytics/finance"
          );

        const usersRes =
          await API.get(
            "/analytics/users"
          );

        const tenantRes =
          await API.get(
            "/admin/tenants"
          );

        setStats(
          statsRes.data
        );

        setFinance(
          financeRes.data || []
        );

        setUsers(
          usersRes.data || []
        );

        setTenants(
          tenantRes.data || []
        );

      } catch (err) {
        console.log(err);
      }

    };

  return (

    <div className="p-6 bg-gray-100 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">

        <h1 className="text-3xl font-bold">
          Admin Dashboard
        </h1>

        <button
          onClick={fetchDashboard}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Refresh
        </button>

      </div>

      {/* KPI */}
      <div className="grid md:grid-cols-4 gap-5 mb-8">

        <div className="bg-white p-5 rounded shadow">

          <p className="text-gray-500">
            Total Users
          </p>

          <h2 className="text-3xl font-bold">
            {stats.users || 0}
          </h2>

        </div>

        <div className="bg-white p-5 rounded shadow">

          <p className="text-gray-500">
            Total Tenants
          </p>

          <h2 className="text-3xl font-bold">
            {stats.tenants || 0}
          </h2>

        </div>

        <div className="bg-white p-5 rounded shadow">

          <p className="text-gray-500">
            Revenue
          </p>

          <h2 className="text-3xl font-bold text-green-600">
            ₹{stats.revenue || 0}
          </h2>

        </div>

        <div className="bg-white p-5 rounded shadow">

          <p className="text-gray-500">
            Active Projects
          </p>

          <h2 className="text-3xl font-bold">
            {stats.projects || 0}
          </h2>

        </div>

      </div>

      {/* CHARTS */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* REVENUE */}
        <div className="bg-white p-5 rounded shadow">

          <h2 className="text-xl font-bold mb-4">
            Revenue Analytics
          </h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <LineChart data={finance}>

              <XAxis
                dataKey="month"
              />

              <YAxis />

              <Tooltip />

              <Line
                dataKey="revenue"
              />

            </LineChart>

          </ResponsiveContainer>

        </div>

        {/* USERS */}
        <div className="bg-white p-5 rounded shadow">

          <h2 className="text-xl font-bold mb-4">
            User Roles
          </h2>

          <ResponsiveContainer
            width="100%"
            height={300}
          >

            <PieChart>

              <Pie
                data={users}
                dataKey="count"
                nameKey="role"
                outerRadius={100}
                label
              >

                {users.map(
                  (u, index) => (
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

      </div>

      {/* TENANTS */}
      <div className="bg-white p-5 rounded shadow mt-8">

        <h2 className="text-2xl font-bold mb-5">
          Tenant Analytics
        </h2>

        <ResponsiveContainer
          width="100%"
          height={350}
        >

          <BarChart data={tenants}>

            <XAxis
              dataKey="name"
            />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="users"
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

      {/* QUICK ACTIONS */}
      <div className="grid md:grid-cols-4 gap-4 mt-8">

        <button className="bg-blue-600 text-white p-4 rounded shadow">
          Create Tenant
        </button>

        <button className="bg-green-600 text-white p-4 rounded shadow">
          Generate Report
        </button>

        <button className="bg-purple-600 text-white p-4 rounded shadow">
          Backup Database
        </button>

        <button className="bg-red-600 text-white p-4 rounded shadow">
          Manage Users
        </button>

      </div>

    </div>
  );
}