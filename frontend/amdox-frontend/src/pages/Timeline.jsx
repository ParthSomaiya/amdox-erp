import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Gantt from "frappe-gantt";

import "../styles/gantt.css";

export default function Timeline() {
  const ganttRef = useRef(null);

  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (!tasks.length) return;

    const formattedTasks = tasks.map((task) => ({
      id: task._id,
      name: task.title,
      start: task.startDate,
      end: task.endDate,
      progress: task.progress || 0,
    }));

    ganttRef.current.innerHTML = "";

    new Gantt(ganttRef.current, formattedTasks, {
      view_mode: "Day",
      language: "en",
    });
  }, [tasks]);

  const fetchTasks = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/tasks",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "token"
            )}`,
          },
        }
      );

      setTasks(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        📅 Project Timeline
      </h1>

      <div className="bg-white rounded shadow p-4 overflow-auto">
        <svg ref={ganttRef}></svg>
      </div>
    </div>
  );
}