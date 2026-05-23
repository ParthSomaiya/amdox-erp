import { useEffect, useState } from "react";
import API from "../../services/api";
import MainLayout from "../../layouts/MainLayout";

export default function TenantManagement() {

  const [analytics, setAnalytics] =
    useState({});

  useEffect(() => {

    API.get(
      "/admin/tenant-analytics"
    ).then((res) => {
      setAnalytics(res.data);
    });

  }, []);

  return (
    <MainLayout>

      <h1 className="text-2xl font-bold mb-5">
        Tenant Management
      </h1>

      <div className="grid grid-cols-3 gap-5">

        <div className="bg-white p-5 shadow rounded">
          <h2 className="text-lg font-semibold">
            Total Tenants
          </h2>

          <p className="text-3xl mt-2">
            {analytics.totalTenants}
          </p>
        </div>

        <div className="bg-white p-5 shadow rounded">
          <h2 className="text-lg font-semibold">
            Total Users
          </h2>

          <p className="text-3xl mt-2">
            {analytics.totalUsers}
          </p>
        </div>

        <div className="bg-white p-5 shadow rounded">
          <h2 className="text-lg font-semibold">
            Active Users
          </h2>

          <p className="text-3xl mt-2">
            {analytics.activeUsers}
          </p>
        </div>

      </div>

    </MainLayout>
  );
}