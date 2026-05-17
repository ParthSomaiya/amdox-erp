import { useEffect, useState } from "react";
import axios from "axios";

export default function Applicants() {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/applications/applicants", {
      headers: { Authorization: localStorage.getItem("token") }
    })
    .then(res => setApps(res.data));
  }, []);

  const updateStatus = async (id, status) => {
    await axios.put(
      `http://localhost:5000/api/applications/${id}/status`,
      { status },
      {
        headers: { Authorization: localStorage.getItem("token") }
      }
    );

    alert("Updated");
  };

  return (
    <div>
      <h2>Applicants</h2>

      {apps.map(a => (
        <div key={a._id}>
          <p>{a.userId?.email}</p>
          <p>{a.jobId?.title}</p>

          <select
            onChange={(e) =>
              updateStatus(a._id, e.target.value)
            }
          >
            <option>APPLIED</option>
            <option>SHORTLISTED</option>
            <option>REJECTED</option>
          </select>

          <a href={`http://localhost:5000/${a.resume}`} target="_blank">
            View Resume
          </a>
        </div>
      ))}
    </div>
  );
}