import {
  useEffect,
  useState,
} from "react";

import API from "../../services/api";

export default function Sprints() {

  const [sprints, setSprints] =
    useState([]);

  const [name, setName] =
    useState("");

  const [goal, setGoal] =
    useState("");

  useEffect(() => {

    fetchSprints();

  }, []);

  const fetchSprints =
    async () => {

      const res =
        await API.get(
          "/sprint/PROJECT_ID"
        );

      setSprints(res.data);

    };

  const createSprint =
    async () => {

      await API.post(
        "/sprint",
        {
          projectId:
            "PROJECT_ID",

          name,

          goal,
        }
      );

      fetchSprints();

    };

  return (

    <div className="p-6">

      <h2 className="text-2xl font-bold mb-5">
        Sprint Management
      </h2>

      <input
        placeholder="Sprint Name"
        className="border p-2 w-full mb-3"
        onChange={(e) =>
          setName(e.target.value)
        }
      />

      <input
        placeholder="Sprint Goal"
        className="border p-2 w-full mb-3"
        onChange={(e) =>
          setGoal(e.target.value)
        }
      />

      <button
        onClick={createSprint}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Create Sprint
      </button>

      <div className="mt-6">

        {sprints.map((s) => (

          <div
            key={s._id}
            className="bg-white p-4 rounded shadow mb-3"
          >

            <h3 className="font-bold">
              {s.name}
            </h3>

            <p>{s.goal}</p>

            <p>
              {s.status}
            </p>

          </div>

        ))}

      </div>

    </div>

  );

}