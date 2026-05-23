import { useEffect, useState } from "react";

import API from "../../services/api";

export default function ProjectsDashboard() {

  const [data, setData] =
    useState({});

  useEffect(() => {

    API.get(
      "/projects/analytics/dashboard"
    ).then((res) =>
      setData(res.data)
    );

  }, []);

  return (

    <div className="p-6">

      <h2 className="text-3xl font-bold mb-6">
        📅 Project Dashboard
      </h2>

      <div className="grid md:grid-cols-4 gap-4">

        <div className="bg-white p-5 rounded shadow">
          <h3>Total Projects</h3>

          <p className="text-2xl font-bold">
            {data.totalProjects}
          </p>
        </div>

        <div className="bg-white p-5 rounded shadow">
          <h3>Total Tasks</h3>

          <p className="text-2xl font-bold">
            {data.totalTasks}
          </p>
        </div>

        <div className="bg-white p-5 rounded shadow">
          <h3>Completed</h3>

          <p className="text-2xl font-bold text-green-600">
            {data.completedTasks}
          </p>
        </div>

        <div className="bg-white p-5 rounded shadow">
          <h3>Pending</h3>

          <p className="text-2xl font-bold text-red-500">
            {data.pendingTasks}
          </p>
        </div>

      </div>

    </div>

  );

}