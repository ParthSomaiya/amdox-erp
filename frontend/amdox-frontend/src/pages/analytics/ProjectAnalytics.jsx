import { useEffect, useState } from "react";
import axios from "axios";

export default function ProjectAnalytics() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/analytics/projects", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => setData(res.data));
  }, []);

  return (
    <div className="p-6">
      <h2>📊 Project Analytics</h2>

      {data.map((d) => (
        <div key={d._id}>
          {d._id}: {d.count}
        </div>
      ))}
    </div>
  );
}