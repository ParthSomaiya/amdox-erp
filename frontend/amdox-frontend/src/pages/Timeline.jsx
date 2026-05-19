import { useEffect, useState }
from "react";

import api
from "../utils/axiosInstance";

export default function Timeline() {

  const [tasks, setTasks] =
    useState([]);

  useEffect(() => {

    fetchTasks();

  }, []);

  const fetchTasks =
    async () => {

      try {

        const res =
          await api.get(
            "/tasks"
          );

        setTasks(
          res.data
        );

      } catch (err) {

        console.log(err);

      }

    };

  const getDays =
    (start, end) => {

      const s =
        new Date(start);

      const e =
        new Date(end);

      const diff =
        Math.ceil(

          (e - s) /

          (1000 * 60 * 60 * 24)

        );

      return diff > 0
        ? diff
        : 1;

    };

  return (

    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">

        📅 Project Timeline

      </h1>

      <div className="space-y-5">

        {tasks.map((task) => {

          const days =
            getDays(

              task.startDate,

              task.endDate

            );

          return (

            <div
              key={task._id}
              className="bg-white p-4 rounded shadow"
            >

              <div className="flex justify-between mb-2">

                <h2 className="font-semibold">

                  {task.title}

                </h2>

                <span className="text-sm text-gray-500">

                  {task.status}

                </span>

              </div>

              <div className="w-full bg-gray-200 rounded h-6 overflow-hidden">

                <div
                  className="bg-blue-600 h-6 text-white text-xs flex items-center px-2"

                  style={{
                    width:
                      `${days * 40}px`,
                  }}
                >

                  {days} Days

                </div>

              </div>

              <div className="text-sm text-gray-500 mt-2">

                {new Date(
                  task.startDate
                ).toLocaleDateString()}

                {" → "}

                {new Date(
                  task.endDate
                ).toLocaleDateString()}

              </div>

            </div>

          );

        })}

      </div>

    </div>

  );

}