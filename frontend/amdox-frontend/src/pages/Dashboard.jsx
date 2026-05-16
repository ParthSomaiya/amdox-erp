import { useEffect, useState } from "react";
import API from "../services/api";
import MainLayout from "../layouts/MainLayout";

export default function Dashboard() {
  const [data, setData] = useState({});

  useEffect(() => {
    API.get("/dashboard").then((res) => setData(res.data));
  }, []);

  return (
    <MainLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white p-5 rounded shadow">
          <h3 className="text-gray-500">Employees</h3>
          <p className="text-2xl font-bold">{data?.stats?.employees || 0}</p>
        </div>

        <div className="bg-white p-5 rounded shadow">
          <h3 className="text-gray-500">Leaves</h3>
          <p className="text-2xl font-bold">{data?.stats?.leaves || 0}</p>
        </div>

        <div className="bg-white p-5 rounded shadow">
          <h3 className="text-gray-500">Payroll</h3>
          <p className="text-2xl font-bold">{data?.stats?.payroll || 0}</p>
        </div>

      </div>
    </MainLayout>
  );
}