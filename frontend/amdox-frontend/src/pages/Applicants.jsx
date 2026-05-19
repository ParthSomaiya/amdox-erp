import { useEffect, useState } from "react";
import axios from "axios";

// 🔥 Resume Viewer Component (same file ma add kariyu)
function ResumeViewer({ url }) {
  return (
    <iframe
      src={`http://localhost:5000/${url}`}
      className="w-full h-[500px] border rounded mt-2"
      title="Resume Viewer"
    />
  );
}

export default function Applicants() {
  const [apps, setApps] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);

  useEffect(() => {
    fetchApplicants();
  }, []);

  // 🔥 Fetch applicants
  const fetchApplicants = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/applications/applicants",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setApps(res.data);
    } catch (err) {
      console.error("Error fetching applicants", err);
    }
  };

  // 🔥 Update status
  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/applications/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Updated");
      fetchApplicants(); // refresh list
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">👨‍💼 Applicants</h2>

      <div className="space-y-4">
        {apps.map((a) => (
          <div
            key={a._id}
            className="border p-4 rounded shadow bg-white"
          >
            <p className="font-semibold">{a.userId?.email}</p>
            <p className="text-sm text-gray-600">{a.jobId?.title}</p>

            {/* 🔥 Status Dropdown */}
            <select
              className="mt-2 border p-1 rounded"
              value={a.status}
              onChange={(e) =>
                updateStatus(a._id, e.target.value)
              }
            >
              <option value="APPLIED">APPLIED</option>
              <option value="SHORTLISTED">SHORTLISTED</option>
              <option value="REJECTED">REJECTED</option>
            </select>

            {/* 🔥 Resume Button */}
            <button
              onClick={() => setSelectedResume(a.resume)}
              className="block mt-2 text-blue-600 underline"
            >
              View Resume
            </button>
          </div>
        ))}
      </div>

      {/* 🔥 Resume Viewer Section */}
      {selectedResume && (
        <div className="mt-6">
          <h3 className="font-bold mb-2">📄 Resume Preview</h3>
          <ResumeViewer url={selectedResume} />
        </div>
      )}
    </div>
  );
}