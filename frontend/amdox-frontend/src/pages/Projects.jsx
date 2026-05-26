import { useEffect, useState } from "react";
import API from "../services/api";

export default function Projects() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    API.get("/projects").then(res => setProjects(res.data));
  }, []);

  return (
    <MainLayout>
      <h2 className="text-xl mb-4">Projects</h2>

      {projects.map(p => (
        <div key={p._id} className="bg-white p-4 mb-3 shadow">
          <h3 className="font-semibold">{p.name}</h3>
          <p>Budget: ₹{p.budget}</p>
          <p>Spent: ₹{p.spent}</p>
        </div>
      ))}
    </MainLayout>
  );
}