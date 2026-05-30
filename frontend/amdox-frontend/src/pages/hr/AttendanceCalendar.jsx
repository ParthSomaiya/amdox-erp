import { useEffect, useState } from "react";
import { Calendar, UserCheck, Clock, Loader2 } from "lucide-react";
import API from "../../services/api";

export default function AttendanceCalendar() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/attendance")
      .then((res) => {
        // Handle nested responses
        const data = res.data?.data || res.data || [];
        setAttendance(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-500 p-8 rounded-[32px] text-white shadow-md">
        <h1 className="text-3xl font-black flex items-center gap-2">📅 Attendance Calendar View</h1>
        <p className="mt-2 text-emerald-100 text-sm">Visualize daily logs and shift completion status.</p>
      </div>

      {loading ? (
        <div className="p-20 text-center">
          <Loader2 className="animate-spin h-10 w-10 text-emerald-600 mx-auto" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {attendance.map((a) => (
            <div key={a._id} className="bg-white border rounded-3xl p-6 shadow-sm space-y-4 hover:shadow-md transition">
              <div className="flex items-center justify-between border-b pb-3">
                <div>
                  <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
                    <UserCheck size={16} className="text-emerald-500" /> {a.employeeId?.name || "Employee"}
                  </h3>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-100">
                  Logged
                </span>
              </div>
              
              <div className="space-y-2 text-xs text-slate-500 font-semibold">
                <div className="flex items-center justify-between">
                  <span>Date:</span>
                  <span className="text-slate-700">{a.date ? new Date(a.date).toLocaleDateString() : "-"}</span>
                </div>
                <div className="flex items-center justify-between text-emerald-600">
                  <span>In Time:</span>
                  <span>{a.checkIn ? new Date(a.checkIn).toLocaleTimeString() : "-"}</span>
                </div>
                <div className="flex items-center justify-between text-rose-500">
                  <span>Out Time:</span>
                  <span>{a.checkOut ? new Date(a.checkOut).toLocaleTimeString() : "-"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}