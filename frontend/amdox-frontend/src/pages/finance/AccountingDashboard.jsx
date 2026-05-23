import {
  useEffect,
  useState,
} from "react";

import API
  from "../../services/api";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AccountingDashboard() {

  const [data, setData] =
    useState([]);

  useEffect(() => {

    API.get("/finance/analytics")
      .then((res) =>
        setData(res.data)
      );

  }, []);

  return (

    <div className="p-6">

      <h2 className="text-3xl font-bold mb-6">
        Accounting Dashboard
      </h2>

      <div className="bg-white p-5 rounded shadow">

        <ResponsiveContainer
          width="100%"
          height={400}
        >

          <BarChart data={data}>

            <XAxis
              dataKey="month"
            />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="revenue"
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

    </div>

  );

}