import {
  useEffect,
  useState,
} from "react";

import API from "../../services/api";

export default function EmployeeTimeline() {

  const [data, setData] =
    useState([]);

  useEffect(() => {

    fetchTimeline();

  }, []);

  const fetchTimeline =
    async () => {

      try {

        const res =
          await API.get(
            "/hr/timeline"
          );

        setData(res.data);

      } catch (err) {

        console.log(err);

      }

    };

  return (

    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6">

        Employee Timeline

      </h1>

      <div className="space-y-5">

        {data.map((item) => (

          <div
            key={item._id}
            className="bg-white shadow rounded p-5 border-l-4 border-blue-600"
          >

            <h2 className="font-bold text-lg">

              {item.employee?.name}

            </h2>

            <p className="text-gray-600">

              {item.action}

            </p>

            <p className="text-sm text-gray-400 mt-2">

              {new Date(
                item.createdAt
              ).toLocaleString()}

            </p>

          </div>

        ))}

      </div>

    </div>

  );

}