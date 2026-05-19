import { useEffect, useState } from "react";
import API from "../services/api";

export default function AttendanceCalendar() {
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    API.get("/hr/attendance").then((res) => {
      setAttendance(res.data);
    });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">
        📅 Attendance Calendar
      </h1>

      <div className="grid grid-cols-3 gap-4 mt-4">
        {attendance.map((a) => (
          <div
            key={a._id}
            className="p-3 bg-white shadow rounded"
          >
            <p>👤 {a.userId?.name}</p>
            <p>🟢 In: {a.checkIn}</p>
            <p>🔴 Out: {a.checkOut}</p>
          </div>
        ))}
      </div>
    </div>
  );
}