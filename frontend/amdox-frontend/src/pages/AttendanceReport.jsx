import { useEffect, useState } from "react";
import API from "../services/api";

export default function AttendanceReport() {
  const [data, setData] = useState([]);

  useEffect(() => {
    API.get("/attendance").then((res) => setData(res.data));
  }, []);

  return (
    <div>
      <h2>Attendance Report</h2>

      {data.map((a) => (
        <div key={a._id}>
          {a.employeeId?.email} | {a.date} | {a.totalHours} hrs
        </div>
      ))}
    </div>
  );
}