import {
  useEffect,
  useState,
} from "react";

import API from "../../services/api";

import {
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
} from "recharts";

export default function WarehouseHeatmap() {

  const [data,
    setData] =
    useState([]);

  useEffect(() => {

    loadData();

  }, []);

  const loadData =
    async () => {

      const res =
        await API.get(
          "/inventory"
        );

      const formatted =
        res.data.map(
          (item, index) => ({

            x:
              index + 1,

            y:
              item.stock,

            z:
              item.stock,

            name:
              item.name,

          })
        );

      setData(
        formatted
      );

    };

  return (

    <div className="bg-white p-6 rounded shadow">

      <h2 className="text-2xl font-bold mb-5">

        Warehouse Heatmap

      </h2>

      <ResponsiveContainer
        width="100%"
        height={500}
      >

        <ScatterChart>

          <XAxis
            dataKey="x"
            name="Shelf"
          />

          <YAxis
            dataKey="y"
            name="Stock"
          />

          <ZAxis
            dataKey="z"
            range={[100, 1000]}
          />

          <Tooltip
            cursor={{
              strokeDasharray:
                "3 3",
            }}
          />

          <Scatter
            data={data}
          />

        </ScatterChart>

      </ResponsiveContainer>

    </div>

  );

}