import {

  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,

} from "recharts";

export default function BurndownChart() {

  const data = [

    {
      day: "Day 1",
      remaining: 100,
    },

    {
      day: "Day 2",
      remaining: 80,
    },

    {
      day: "Day 3",
      remaining: 60,
    },

    {
      day: "Day 4",
      remaining: 35,
    },

    {
      day: "Day 5",
      remaining: 10,
    },

  ];

  return (

    <div className="p-6 bg-white rounded shadow">

      <h2 className="text-2xl font-bold mb-4">
        Sprint Burndown
      </h2>

      <ResponsiveContainer
        width="100%"
        height={350}
      >

        <LineChart data={data}>

          <XAxis dataKey="day" />

          <YAxis />

          <Tooltip />

          <Line
            dataKey="remaining"
          />

        </LineChart>

      </ResponsiveContainer>

    </div>

  );

}