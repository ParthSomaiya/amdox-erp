import { useEffect, useState } from "react";
import axios from "axios";

export default function ProjectDashboard() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get("/api/projects");
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📊 Project Dashboard</h1>

      <div className="grid grid-cols-3 gap-4">
        {projects.map((p) => (
          <div key={p._id} className="bg-white shadow p-4 rounded">
            <h2 className="font-bold text-lg">{p.name}</h2>
            <p>Budget: ₹{p.budget}</p>
            <p>Spent: ₹{p.spent}</p>

            <div className="mt-2">
              <div className="bg-gray-200 h-2 rounded">
                <div
                  className="bg-blue-500 h-2 rounded"
                  style={{
                    width: `${(p.spent / p.budget) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}