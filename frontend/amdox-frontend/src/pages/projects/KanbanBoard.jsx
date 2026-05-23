import { useEffect, useState } from "react";

import API from "../../services/api";

export default function KanbanBoard() {

  const [tasks, setTasks] =
    useState([]);

  useEffect(() => {

    API.get(
      "/projects/task/PROJECT_ID"
    ).then((res) =>
      setTasks(res.data)
    );

  }, []);

  const updateStatus =
    async (id, status) => {

      await API.put(
        `/projects/task/${id}`,
        { status }
      );

      window.location.reload();

    };

  return (

    <div className="grid grid-cols-3 gap-4 p-6">

      {/* TODO */}

      <div className="bg-gray-100 p-4 rounded">

        <h2 className="font-bold mb-4">
          TODO
        </h2>

        {tasks
          .filter(
            (t) =>
              t.status === "TODO"
          )
          .map((t) => (

            <div
              key={t._id}
              className="bg-white p-3 mb-3 rounded shadow"
            >

              <h3>{t.title}</h3>

              <button
                onClick={() =>
                  updateStatus(
                    t._id,
                    "IN_PROGRESS"
                  )
                }
                className="bg-blue-600 text-white px-3 py-1 mt-2 rounded"
              >
                Start
              </button>

            </div>

          ))}

      </div>


      {/* IN PROGRESS */}

      <div className="bg-yellow-100 p-4 rounded">

        <h2 className="font-bold mb-4">
          IN PROGRESS
        </h2>

        {tasks
          .filter(
            (t) =>
              t.status ===
              "IN_PROGRESS"
          )
          .map((t) => (

            <div
              key={t._id}
              className="bg-white p-3 mb-3 rounded shadow"
            >

              <h3>{t.title}</h3>

              <button
                onClick={() =>
                  updateStatus(
                    t._id,
                    "DONE"
                  )
                }
                className="bg-green-600 text-white px-3 py-1 mt-2 rounded"
              >
                Complete
              </button>

            </div>

          ))}

      </div>


      {/* DONE */}

      <div className="bg-green-100 p-4 rounded">

        <h2 className="font-bold mb-4">
          DONE
        </h2>

        {tasks
          .filter(
            (t) =>
              t.status === "DONE"
          )
          .map((t) => (

            <div
              key={t._id}
              className="bg-white p-3 mb-3 rounded shadow"
            >

              <h3>{t.title}</h3>

            </div>

          ))}

      </div>

    </div>

  );

}