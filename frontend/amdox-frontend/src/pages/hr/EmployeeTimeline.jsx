import { useEffect, useState } from "react";

import API from "../../services/api";

export default function EmployeeTimeline() {

  const [timeline, setTimeline] =
    useState([]);

  useEffect(() => {

    API.get("/audit")
      .then((res) =>
        setTimeline(res.data)
      );

  }, []);

  return (

    <div className="p-6">

      <h2 className="text-2xl font-bold mb-6">
        Employee Timeline
      </h2>

      <div className="space-y-4">

        {timeline.map((t) => (

          <div
            key={t._id}
            className="bg-white shadow rounded p-4"
          >

            <p className="font-semibold">
              {t.action}
            </p>

            <p className="text-gray-500">
              {new Date(
                t.createdAt
              ).toLocaleString()}
            </p>

          </div>

        ))}

      </div>

    </div>

  );

}