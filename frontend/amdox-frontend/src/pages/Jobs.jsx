import { useEffect, useState } from "react";
import axios from "axios";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/jobs")
      .then(res => setJobs(res.data));
  }, []);

  return (
    <div>
      <h2>Jobs</h2>
      {jobs.map(j => (
        <div key={j._id}>
          <h3>{j.title}</h3>
          <p>{j.description}</p>
          <a href={`/apply/${j._id}`}>Apply</a>
        </div>
      ))}
    </div>
  );
}