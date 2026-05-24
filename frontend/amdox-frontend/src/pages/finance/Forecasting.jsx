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

export default function Forecasting() {

  const [data, setData] =
    useState([]);

  useEffect(() => {

    fetchForecast();

  }, []);

  const fetchForecast =
    async () => {

      try {

        const res =
          await API.get(
            "/analytics/forecast"
          );

        setData(res.data);

      } catch (err) {

        console.log(err);

      }

    };

  return (

    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">

        Financial Forecasting

      </h1>

      <div className="bg-white p-5 rounded shadow">

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
              dataKey="forecast"
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>

  );

}