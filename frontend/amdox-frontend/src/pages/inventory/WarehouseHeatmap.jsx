import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const data = [

  { x: 10, y: 20, stock: 50 },

  { x: 30, y: 40, stock: 80 },

  { x: 50, y: 10, stock: 20 },

];

export default function WarehouseHeatmap() {

  return (

    <div className="p-6">

      <h2 className="text-2xl font-bold mb-6">
        Warehouse Heatmap
      </h2>

      <div className="bg-white p-5 rounded shadow">

        <ScatterChart
          width={700}
          height={400}
        >

          <XAxis
            dataKey="x"
            name="X"
          />

          <YAxis
            dataKey="y"
            name="Y"
          />

          <Tooltip />

          <Scatter
            data={data}
            fill="#2563eb"
          />

        </ScatterChart>

      </div>

    </div>

  );

}