import {
  useEffect,
  useState,
} from "react";

import axios from "axios";

import io from "socket.io-client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const socket =
  io("http://localhost:5000");

export default function BurndownChart() {

  const [data,
    setData] =
    useState([]);

  useEffect(() => {

    fetchData();

    socket.on(

      "burndown_update",

      (newData) => {

        setData(newData);

      }

    );

    return () => {

      socket.off(
        "burndown_update"
      );

    };

  }, []);

  const fetchData =
    async () => {

      try {

        const res =
          await axios.get(

            "http://localhost:5000/api/projects/burndown"

          );

        setData(
          res.data
        );

      } catch (err) {

        console.log(err);

      }

    };

  return (

    <div className="p-6 bg-gray-100 min-h-screen">

      <div className="bg-white rounded-xl shadow p-6">

        <h1 className="text-3xl font-bold mb-6">

          🔥 Sprint Burndown

        </h1>

        <ResponsiveContainer
          width="100%"
          height={400}
        >

          <LineChart data={data}>

            <XAxis
              dataKey="day"
            />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="remaining"
              stroke="#2563EB"
              strokeWidth={3}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>

  );

}