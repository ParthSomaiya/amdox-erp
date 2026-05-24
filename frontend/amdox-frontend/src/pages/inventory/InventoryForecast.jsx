import {
  useEffect,
  useState,
} from "react";

import API from "../../services/api";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

export default function InventoryForecast() {

  const [data,
    setData] =
    useState([]);

  useEffect(() => {

    loadForecast();

  }, []);

  const loadForecast =
    async () => {

      const res =
        await API.get(
          "/inventory/reorder-ai"
        );

      const formatted =
        res.data.map(
          (item, index) => ({

            month:
              `W${index + 1}`,

            stock:
              item.suggestedQty,

          })
        );

      setData(
        formatted
      );

    };

  return (

    <div className="bg-white p-6 rounded shadow">

      <h2 className="text-2xl font-bold mb-5">

        Inventory Forecast

      </h2>

      <ResponsiveContainer
        width="100%"
        height={400}
      >

        <LineChart
          data={data}
        >

          <XAxis
            dataKey="month"
          />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="stock"
          />

        </LineChart>

      </ResponsiveContainer>

    </div>

  );

}