import { useEffect, useState } from "react";
import API from "../services/api";

export default function LeaveManagement() {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    API.get("/leave").then((res) => setLeaves(res.data));
  }, []);

  const updateStatus = async (id, status) => {
    await API.put("/leave/status", { leaveId: id, status });
    window.location.reload();
  };

  return (
    <div>
      <h2>Leave Requests</h2>

      {leaves.map((l) => (
        <div key={l._id}>
          {l.employeeId?.email} | {l.fromDate} - {l.toDate} | {l.status}

          <button
            onClick={() =>
              API.put(
                `/hr/leave/approve/${leave._id}`
              )
            }
            className="bg-green-600 text-white px-3 py-1 rounded"
          >
            Approve
          </button>

          <button
            onClick={() =>
              API.put(
                `/hr/leave/reject/${leave._id}`
              )
            }
            className="bg-red-600 text-white px-3 py-1 rounded ml-2"
          >
            Reject
          </button>
        </div>
      ))}
    </div>
  );
}