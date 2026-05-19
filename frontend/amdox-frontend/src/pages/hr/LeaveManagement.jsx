import { useEffect, useState } from "react";
import API from "../services/api";

export default function LeaveManagement() {
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    API.get("/hr/leaves").then((res) => {
      setLeaves(res.data);
    });
  }, []);

  const updateStatus = async (id, status) => {
    await API.put(`/hr/leave/${id}/${status}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">
        📝 Leave Management
      </h1>

      {leaves.map((l) => (
        <div
          key={l._id}
          className="bg-white p-4 shadow mt-3 flex justify-between"
        >
          <div>
            <p>{l.reason}</p>
            <p>Status: {l.status}</p>
          </div>

          <div className="space-x-2">
            <button
              onClick={() =>
                updateStatus(l._id, "approve")
              }
              className="bg-green-500 px-3 py-1 text-white"
            >
              Approve
            </button>

            <button
              onClick={() =>
                updateStatus(l._id, "reject")
              }
              className="bg-red-500 px-3 py-1 text-white"
            >
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}