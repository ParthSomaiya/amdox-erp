import { useEffect, useState } from "react";
import API from "../services/api";
import MainLayout from "../layouts/MainLayout";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    API.get("/tasks?projectId=PROJECT_ID").then(res =>
      setTasks(res.data)
    );
  }, []);

  return (
    <MainLayout>
      <h2 className="text-xl mb-4">Tasks</h2>

      {tasks.map(t => (
        <div key={t._id} className="bg-white p-3 mb-2 shadow">
          {t.title} - {t.status}
        </div>
      ))}
    </MainLayout>
  );
}