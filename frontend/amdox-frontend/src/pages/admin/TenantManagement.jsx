import { useEffect, useState } from "react";
import API from "../../services/api";
import MainLayout from "../../layouts/MainLayout";

export default function TenantManagement() {
  // ================= STATE =================
  const [analytics, setAnalytics] = useState({
    totalTenants: 0,
    totalUsers: 0,
    activeUsers: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================= FETCH DATA =================
  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.get("/admin/tenant-analytics");

      setAnalytics({
        totalTenants: res.data?.totalTenants || 0,
        totalUsers: res.data?.totalUsers || 0,
        activeUsers: res.data?.activeUsers || 0,
      });
    } catch (err) {
      console.error("Tenant analytics error:", err);
      setError("Failed to load tenant analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // ================= LOADING =================
  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[300px] text-lg font-semibold">
          Loading Tenant Analytics...
        </div>
      </MainLayout>
    );
  }

  // ================= ERROR =================
  if (error) {
    return (
      <MainLayout>
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          {error}
        </div>
      </MainLayout>
    );
  }

  // ================= UI =================
  return (
    <MainLayout>
      <div className="space-y-8">

        {/* HERO */}
        <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 rounded-3xl p-8 text-white shadow-xl">
          <h1 className="text-4xl font-black">
            Tenant Management
          </h1>
          <p className="mt-2 text-cyan-100">
            Monitor system tenants and user activity
          </p>
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* TENANTS */}
          <div className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition">
            <h2 className="text-gray-500 font-medium">
              Total Tenants
            </h2>
            <p className="text-4xl font-black mt-3 text-blue-600">
              {analytics.totalTenants}
            </p>
          </div>

          {/* USERS */}
          <div className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition">
            <h2 className="text-gray-500 font-medium">
              Total Users
            </h2>
            <p className="text-4xl font-black mt-3 text-indigo-600">
              {analytics.totalUsers}
            </p>
          </div>

          {/* ACTIVE USERS */}
          <div className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition">
            <h2 className="text-gray-500 font-medium">
              Active Users
            </h2>
            <p className="text-4xl font-black mt-3 text-green-600">
              {analytics.activeUsers}
            </p>
          </div>

        </div>

        {/* FOOTER NOTE */}
        <div className="text-sm text-gray-500 text-center">
          Real-time tenant analytics dashboard
        </div>

      </div>
    </MainLayout>
  );
}