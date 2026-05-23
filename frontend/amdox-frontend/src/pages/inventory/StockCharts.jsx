import {

  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,

} from "recharts";

const data = [

  {
    name: "Product A",
    stock: 50,
  },

  {
    name: "Product B",
    stock: 10,
  },

];

export default function StockCharts() {

  return (

    <div className="p-6">

      <BarChart
        width={700}
        height={300}
        data={data}
      >

        <XAxis dataKey="name" />

        <YAxis />

        <Tooltip />

        <Bar dataKey="stock" />

      </BarChart>

    </div>

  );

}