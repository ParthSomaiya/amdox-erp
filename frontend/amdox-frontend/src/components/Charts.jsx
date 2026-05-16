import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

const data = [
  { name: "Jan", employees: 30 },
  { name: "Feb", employees: 40 },
  { name: "Mar", employees: 50 },
];

export default function Charts() {
  return (
    <div className="bg-white p-5 rounded shadow mb-6">
      <h3 className="mb-4">Employee Growth</h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="employees" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}