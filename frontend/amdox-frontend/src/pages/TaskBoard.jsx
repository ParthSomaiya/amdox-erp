import { useEffect, useState } from "react";
import axios from "axios";

export default function TaskBoard() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await axios.get("/api/tasks");
    setTasks(res.data);
  };

  const updateStatus = async (taskId, status) => {
    await axios.put(`/api/tasks/${taskId}`, { status });
    fetchTasks();
  };

  const columns = ["TODO", "IN_PROGRESS", "DONE"];

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">🧩 Task Board</h1>

      <div className="grid grid-cols-3 gap-4">
        {columns.map((col) => (
          <div key={col} className="bg-gray-100 p-3 rounded">
            <h2 className="font-bold mb-2">{col}</h2>

            {tasks
              .filter((t) => t.status === col)
              .map((task) => (
                <div
                  key={task._id}
                  className="bg-white p-2 mb-2 shadow rounded"
                >
                  <p>{task.title}</p>

                  <div className="flex gap-1 mt-2">
                    {columns.map((c) => (
                      <button
                        key={c}
                        onClick={() => updateStatus(task._id, c)}
                        className="text-xs bg-blue-500 text-white px-2 py-1 rounded"
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}