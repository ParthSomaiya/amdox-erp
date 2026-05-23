import { useEffect, useState } from "react";

import API from "../services/api";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function AttendanceReport() {

  const [data, setData] = useState([]);

  useEffect(() => {

    API.get("/attendance")
      .then((res) =>
        setData(res.data)
      );

  }, []);

  return (

    <div>

      <h2 className="text-2xl font-bold mb-5">
        Attendance Report
      </h2>

      {/* ✅ CHART */}
      <div className="mb-10 bg-white p-5 rounded shadow">

        <BarChart
          width={700}
          height={300}
          data={data}
        >

          <XAxis dataKey="date" />

          <YAxis />

          <Tooltip />

          <Bar dataKey="totalHours" />

        </BarChart>

      </div>

      {/* ✅ LIST */}
      <div className="bg-white shadow rounded">

        {data.map((a) => (

          <div
            key={a._id}
            className="border-b p-4"
          >

            {a.employeeId?.email}
            {" | "}
            {a.date}
            {" | "}
            {a.totalHours} hrs

          </div>

        ))}

      </div>

    </div>

  );

}