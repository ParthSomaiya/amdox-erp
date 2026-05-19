import { useEffect, useState } from "react";
import API from "../services/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function FinanceDashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    API.get("/finance/analytics").then((res) => {
      setData([
        { name: "Revenue", value: res.data.totalRevenue },
        { name: "GST", value: res.data.totalGST },
        { name: "Invoices", value: res.data.totalInvoices },
      ]);
    });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">💰 Finance Dashboard</h1>

      <div className="bg-white p-4 rounded shadow">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#4f46e5" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}