import {
  useState,
} from "react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function ChartBuilder({

  data,

}) {

  const [type,
    setType] =
    useState("bar");

  return (

    <div className="bg-white p-5 rounded shadow">

      <div className="flex justify-between mb-5">

        <h2 className="text-2xl font-bold">

          Custom Chart Builder

        </h2>

        <select
          value={type}
          onChange={(e) =>
            setType(
              e.target.value
            )
          }
          className="border p-2 rounded"
        >

          <option value="bar">
            Bar
          </option>

          <option value="line">
            Line
          </option>

          <option value="pie">
            Pie
          </option>

        </select>

      </div>

      <ResponsiveContainer
        width="100%"
        height={400}
      >

        {type === "bar" && (

          <BarChart data={data}>

            <XAxis
              dataKey="name"
            />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="value"
            />

          </BarChart>

        )}

        {type === "line" && (

          <LineChart data={data}>

            <XAxis
              dataKey="name"
            />

            <YAxis />

            <Tooltip />

            <Line
              dataKey="value"
            />

          </LineChart>

        )}

        {type === "pie" && (

          <PieChart>

            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={150}
              label
            />

            <Tooltip />

          </PieChart>

        )}

      </ResponsiveContainer>

    </div>

  );

}