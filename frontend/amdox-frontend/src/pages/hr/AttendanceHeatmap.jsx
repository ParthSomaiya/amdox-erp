import { useEffect, useState } from "react";

import API from "../../services/api";

export default function AttendanceHeatmap() {

  const [data, setData] =
    useState([]);

  useEffect(() => {

    API.get("/attendance")
      .then((res) =>
        setData(res.data)
      );

  }, []);

  return (

    <div className="p-6">

      <h2 className="text-2xl font-bold mb-6">
        Attendance Heatmap
      </h2>

      <div className="grid grid-cols-7 gap-3">

        {data.map((a) => (

          <div
            key={a._id}
            className={`p-4 rounded text-white text-center
            ${
              a.totalHours >= 8
                ? "bg-green-600"
                : a.totalHours >= 5
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}
          >

            <p>
              {new Date(
                a.date
              ).toLocaleDateString()}
            </p>

            <p>
              {a.totalHours} hrs
            </p>

          </div>

        ))}

      </div>

    </div>

  );

}