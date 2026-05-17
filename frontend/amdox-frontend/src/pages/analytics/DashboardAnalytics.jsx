import { useEffect, useState } from "react";
import axios from "axios";

export default function DashboardAnalytics() {
  const [data, setData] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/analytics/dashboard", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => setData(res.data));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl mb-4">📊 Dashboard Analytics</h2>

      <div className="grid grid-cols-4 gap-4">
        <div className="bg-blue-500 p-4 text-white rounded">
          Employees: {data.employees}
        </div>
        <div className="bg-green-500 p-4 text-white rounded">
          Revenue: ₹{data.revenue}
        </div>
        <div className="bg-yellow-500 p-4 text-white rounded">
          Leaves: {data.leaves}
        </div>
        <div className="bg-purple-500 p-4 text-white rounded">
          Attendance: {data.attendance}
        </div>
      </div>
    </div>
  );
}