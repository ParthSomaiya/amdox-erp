import { useEffect, useState } from "react";
import axios from "axios";

export default function Timeline() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await axios.get("/api/tasks");
    setTasks(res.data);
  };

  const getDuration = (start, end) => {
    const s = new Date(start);
    const e = new Date(end);
    return Math.max((e - s) / (1000 * 60 * 60 * 24), 1);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">📅 Timeline (Gantt)</h1>

      <div className="space-y-3">
        {tasks.map((task) => {
          const days = getDuration(task.startDate, task.endDate);

          return (
            <div key={task._id}>
              <p className="text-sm">{task.title}</p>

              <div className="bg-gray-200 h-4 rounded">
                <div
                  className="bg-green-500 h-4 rounded"
                  style={{ width: `${days * 20}px` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}