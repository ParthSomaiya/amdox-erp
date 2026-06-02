import { useEffect, useState, useMemo } from "react";
import { Calendar, UserCheck, Clock, Loader2, Layers } from "lucide-react";
import API from "../../services/api";

export default function AttendanceCalendar() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const monthsList = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const res = await API.get("/attendance");
      const data = res.data?.data || res.data || [];
      
      const serverData = Array.isArray(data) ? data : [];
      const localData = JSON.parse(localStorage.getItem("amdox_simulated_attendance") || "[]");
      const merged = [...serverData];

      localData.forEach((item) => {
        if (!merged.some((m) => m._id === item._id)) {
          merged.push(item);
        }
      });

      setAttendance(merged);
    } catch (err) {
      console.warn("Fallback to Local Storage logs for Calendar:");
      const localData = JSON.parse(localStorage.getItem("amdox_simulated_attendance") || "[]");
      setAttendance(localData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const calculateHours = (checkInStr, checkOutStr) => {
    if (!checkInStr) return 0;
    const end = checkOutStr ? new Date(checkOutStr) : new Date();
    const diffMs = end - new Date(checkInStr);
    return Number((diffMs / (1000 * 60 * 60)).toFixed(2));
  };

  const totalShiftCompleted = useMemo(() => {
    return attendance.filter(a => calculateHours(a.checkIn, a.checkOut) >= 8).length;
  }, [attendance]);

  return (
    <div className="space-y-8 font-sans">
      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 p-8 rounded-[32px] text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-56 h-56 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <span className="text-[10px] uppercase tracking-widest text-emerald-100 font-bold block mb-2">Workforce Timesheets</span>
        <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
          <Calendar /> Attendance Calendar View
        </h1>
        <p className="mt-2 text-emerald-100 text-sm max-w-xl">Monitor daily shifts, log times, and analyze completion rates for local office departments.</p>
      </div>

      {/* Filter toolbar */}
      <div className="bg-white border rounded-2xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex gap-3">
          <select
            value={currentMonth}
            onChange={(e) => setCurrentMonth(Number(e.target.value))}
            className="h-10 rounded-xl border bg-slate-50 px-3 text-xs font-bold text-slate-700 outline-none"
          >
            {monthsList.map((m, idx) => (
              <option key={idx} value={idx}>{m}</option>
            ))}
          </select>
          <select
            value={currentYear}
            onChange={(e) => setCurrentYear(Number(e.target.value))}
            className="h-10 rounded-xl border bg-slate-50 px-3 text-xs font-bold text-slate-700 outline-none"
          >
            <option value={2026}>2026</option>
            <option value={2025}>2025</option>
          </select>
        </div>

        <div className="flex gap-4 text-xs font-bold text-slate-500">
          <span className="flex items-center gap-1.5"><Layers size={14} className="text-indigo-600" /> Active Logins: {attendance.length}</span>
          <span className="flex items-center gap-1.5"><UserCheck size={14} className="text-emerald-600" /> 8+ Hr Shifts: {totalShiftCompleted}</span>
        </div>
      </div>

      {/* Grid container */}
      {loading ? (
        <div className="p-20 text-center">
          <Loader2 className="animate-spin h-10 w-10 text-emerald-600 mx-auto" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {attendance.map((a) => {
            const empName = a.employeeId?.name || "Staff Member";
            const hrs = calculateHours(a.checkIn, a.checkOut);
            const isFullShift = hrs >= 8;

            return (
              <div key={a._id} className="bg-white border rounded-3xl p-6 shadow-sm hover:shadow-md transition space-y-4 border-slate-200/80">
                <div className="flex items-center justify-between border-b pb-3">
                  <div>
                    <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 font-bold flex items-center justify-center text-xs">
                        {empName.charAt(0)}
                      </div>
                      {empName}
                    </h3>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${
                    isFullShift ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-amber-50 text-amber-700 border border-amber-100"
                  }`}>
                    {isFullShift ? "Full Shift" : "Part Shift"}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-500 font-semibold">
                  <div className="flex justify-between">
                    <span>Date Logged:</span>
                    <span className="text-slate-800">{a.date ? new Date(a.date).toLocaleDateString("en-IN") : "-"}</span>
                  </div>
                  <div className="flex justify-between text-emerald-600">
                    <span>Check-In:</span>
                    <span>{a.checkIn ? new Date(a.checkIn).toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' }) : "-"}</span>
                  </div>
                  <div className="flex justify-between text-rose-500">
                    <span>Check-Out:</span>
                    <span>{a.checkOut ? new Date(a.checkOut).toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' }) : "-"}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2.5 font-bold text-slate-800">
                    <span>Net Active:</span>
                    <span className="text-indigo-600 font-black">{hrs.toFixed(2)} Hours {!a.checkOut && "(Active)"}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}