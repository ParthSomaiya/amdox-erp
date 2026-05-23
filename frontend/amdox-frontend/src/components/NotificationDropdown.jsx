import { useEffect, useState } from "react";

import API from "../services/api";

export default function NotificationDropdown() {

  const [data, setData] =
    useState([]);

  useEffect(() => {

    API.get("/notifications")
      .then((res) =>
        setData(res.data)
      );

  }, []);

  return (

    <div className="absolute right-0 mt-2 w-96 bg-white shadow-lg rounded-lg p-4 z-50">

      <h3 className="font-bold text-lg mb-4">
        Notifications
      </h3>

      <div className="space-y-3 max-h-96 overflow-auto">

        {data.map((n) => (

          <div
            key={n._id}
            className="border-b pb-2"
          >

            <p className="font-semibold">
              {n.title}
            </p>

            <p className="text-sm text-gray-600">
              {n.message}
            </p>

          </div>

        ))}

      </div>

    </div>

  );

}