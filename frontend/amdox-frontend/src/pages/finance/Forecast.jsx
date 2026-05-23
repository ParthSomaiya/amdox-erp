import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const data = [

  {
    month: "Jan",
    revenue: 40000,
  },

  {
    month: "Feb",
    revenue: 60000,
  },

  {
    month: "Mar",
    revenue: 85000,
  },

  {
    month: "Apr",
    revenue: 100000,
  },

];

export default function Forecast() {

  return (

    <div className="p-6">

      <h2 className="text-2xl font-bold mb-6">
        Financial Forecast
      </h2>

      <LineChart
        width={700}
        height={300}
        data={data}
      >

        <XAxis
          dataKey="month"
        />

        <YAxis />

        <Tooltip />

        <Line
          dataKey="revenue"
        />

      </LineChart>

    </div>

  );

}