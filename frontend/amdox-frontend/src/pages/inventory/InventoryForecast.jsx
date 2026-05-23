import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [

  {
    month: "Jan",
    stock: 120,
  },

  {
    month: "Feb",
    stock: 90,
  },

  {
    month: "Mar",
    stock: 70,
  },

  {
    month: "Apr",
    stock: 50,
  },

];

export default function InventoryForecast() {

  return (

    <div className="p-6">

      <h2 className="text-2xl font-bold mb-6">
        Inventory Forecast
      </h2>

      <div className="bg-white p-5 rounded shadow">

        <ResponsiveContainer
          width="100%"
          height={350}
        >

          <LineChart data={data}>

            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip />

            <Line dataKey="stock" />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>

  );

}