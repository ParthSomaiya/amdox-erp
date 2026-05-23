import {
  PieChart,
  Pie,
  Tooltip,
} from "recharts";

const data = [
  {
    name: "Matched",
    value: 80,
  },
  {
    name: "Unmatched",
    value: 20,
  },
];

export default function Reconciliation() {

  return (

    <div className="p-6">

      <h2 className="text-2xl font-bold mb-5">
        Bank Reconciliation
      </h2>

      <PieChart
        width={400}
        height={300}
      >

        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          outerRadius={100}
        />

        <Tooltip />

      </PieChart>

    </div>

  );

}