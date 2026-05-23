import { useEffect, useState } from "react";
import API from "../services/api";
import MainLayout from "../layouts/MainLayout";
import CardSkeleton from "../components/CardSkeleton";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [data, setData] = useState({
    stats: {},
    monthly: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/dashboard")
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const [analytics, setAnalytics] =
    useState({});

  useEffect(() => {

    API.get("/hr/analytics")
      .then((res) =>
        setAnalytics(res.data)
      );

  }, []);
  return (
    <MainLayout>

      {/* 🔹 LOADING */}
      {loading ? (
        <div className="grid md:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : (
        <>
          {/* 🔹 STATS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

            <div className="bg-white p-5 rounded shadow hover:shadow-md transition">
              <h3 className="text-gray-500">Employees</h3>
              <p className="text-2xl font-bold">
                {data?.stats?.employees || 0}
              </p>
            </div>

            <div className="bg-white p-5 rounded shadow hover:shadow-md transition">
              <h3 className="text-gray-500">Leaves</h3>
              <p className="text-2xl font-bold">
                {data?.stats?.leaves || 0}
              </p>
            </div>

            <div className="bg-white p-5 rounded shadow hover:shadow-md transition">
              <h3 className="text-gray-500">Payroll</h3>
              <p className="text-2xl font-bold">
                {data?.stats?.payroll || 0}
              </p>
            </div>

            <div className="bg-white p-5 shadow rounded">
              <h3>Total Employees</h3>

              <p className="text-2xl font-bold">
                {analytics.totalEmployees}
              </p>
            </div>

            <div className="bg-white p-5 shadow rounded">
              <h3>Total Leaves</h3>

              <p className="text-2xl font-bold">
                {analytics.totalLeaves}
              </p>
            </div>

          </div>

          {/* 📈 CHART */}
          <div className="bg-white p-5 rounded shadow">
            <h3 className="text-lg font-semibold mb-4">
              Monthly Growth
            </h3>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.monthly}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="employees"
                  stroke="#8884d8"
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#82ca9d"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

    </MainLayout>
  );
}