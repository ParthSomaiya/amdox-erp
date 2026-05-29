import { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  Clock,
  Search,
  CheckCircle2,
  XCircle,
  TimerReset,
  Users,
} from "lucide-react";
import API from "../services/api";

export default function Attendance() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [marking, setMarking] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isEmployee = user?.role === "EMPLOYEE";

  useEffect(() => {
    fetchAttendance();
  }, []);

  // 🔹 સાચા એન્ડપોઇન્ટ દ્વારા ડેટા મેળવો
  const fetchAttendance = async () => {
    try {
      setLoading(true);
      
      const endpoint = isEmployee ? "/attendance/my" : "/attendance";
      const res = await API.get(endpoint);

      const records = res.data?.data || res.data || [];
      setAttendance(Array.isArray(records) ? records : []);
    } catch (error) {
      console.error("Attendance fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 કર્મચારીએ આજે ચેક-ઇન કરેલું છે કે નહીં તે તપાસો
  const todayRecord = useMemo(() => {
    if (!isEmployee) return null;
    const todayStr = new Date().toISOString().split("T")[0];
    return attendance.find((item) => {
      const itemDate = item.date ? item.date.slice(0, 10) : "";
      return itemDate === todayStr;
    });
  }, [attendance, isEmployee]);

  // 🔹 ચેક-ઇન પ્રોસેસ
  const handleCheckIn = async () => {
    try {
      setMarking(true);
      await API.post("/attendance/check-in");
      await fetchAttendance();
      alert("Check-in successful! Have a great shift.");
    } catch (error) {
      console.error("Check-in error:", error);
      alert(error?.response?.data?.message || "Check-in failed");
    } finally {
      setMarking(false);
    }
  };

  // 🔹 ચેક-આઉટ પ્રોસેસ
  const handleCheckOut = async () => {
    try {
      setMarking(true);
      await API.post("/attendance/check-out");
      await fetchAttendance();
      alert("Check-out successful! Goodbye.");
    } catch (error) {
      console.error("Check-out error:", error);
      alert(error?.response?.data?.message || "Check-out failed");
    } finally {
      setMarking(false);
    }
  };

  // 🔹 કલાકો, મિનિટો અને સેકન્ડો દર્શાવવા માટેનું હેલ્પર ફંક્શન (Fixed 0 hrs display issue)
  const formatHoursWorked = (checkInStr, checkOutStr, totalHours) => {
    if (!checkInStr || !checkOutStr) return "-";

    const start = new Date(checkInStr);
    const end = new Date(checkOutStr);
    const diffMs = end.getTime() - start.getTime();

    if (isNaN(diffMs) || diffMs < 0) return "-";

    const totalSeconds = Math.floor(diffMs / 1000);
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    const parts = [];
    if (hrs > 0) parts.push(`${hrs} hr${hrs > 1 ? "s" : ""}`);
    if (mins > 0) parts.push(`${mins} min${mins > 1 ? "s" : ""}`);
    if (secs > 0 || parts.length === 0) parts.push(`${secs} sec${secs > 1 ? "s" : ""}`);

    return parts.join(" ");
  };

  const filteredAttendance = useMemo(() => {
    return attendance.filter((item) => {
      if (!isEmployee) {
        return item?.employeeId?.name?.toLowerCase().includes(search.toLowerCase());
      }
      return true;
    });
  }, [attendance, search, isEmployee]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <h2 className="mt-4 text-slate-600 font-semibold">Loading Attendance Records...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 p-8 text-white shadow-sm">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-cyan-100 font-semibold">Employee Portal</p>
            <h1 className="mt-2 text-3xl font-extrabold tracking-tight">Attendance Logging</h1>
            <p className="mt-3 text-cyan-100 text-sm max-w-xl">Track, log, and verify daily workspace logins.</p>
          </div>
          <div className="hidden sm:flex h-16 w-16 rounded-2xl bg-white/10 backdrop-blur-md items-center justify-center">
            <Calendar size={28} />
          </div>
        </div>
      </div>

      {/* Control Actions */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm">
        {!isEmployee ? (
          <div className="relative w-full sm:max-w-xs">
            <Search size={18} className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search employee..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-11 rounded-xl border border-slate-300 pl-11 pr-4 outline-none focus:border-indigo-500 text-sm"
            />
          </div>
        ) : (
          <div className="text-sm font-semibold text-slate-600">
            {todayRecord ? (
              todayRecord.checkOut ? (
                <span className="text-green-600">✓ You have completed your shift for today.</span>
              ) : (
                <span className="text-amber-600">⚡ You are currently Checked-In. Remember to Check-Out!</span>
              )
            ) : (
              <span className="text-slate-500">👋 You haven't checked in today yet.</span>
            )}
          </div>
        )}

        {isEmployee && (
          <div className="flex gap-3">
            {!todayRecord ? (
              <button
                onClick={handleCheckIn}
                disabled={marking}
                className="h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-sm transition disabled:opacity-50"
              >
                {marking ? "Logging..." : "Check-In"}
              </button>
            ) : !todayRecord.checkOut ? (
              <button
                onClick={handleCheckOut}
                disabled={marking}
                className="h-11 px-6 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold shadow-sm transition disabled:opacity-50"
              >
                {marking ? "Logging..." : "Check-Out"}
              </button>
            ) : (
              <button
                disabled
                className="h-11 px-6 rounded-xl bg-slate-100 text-slate-400 text-sm font-bold border border-slate-200 cursor-not-allowed"
              >
                Completed
              </button>
            )}
          </div>
        )}
      </div>

      {/* Grid List */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 border-b">
              <tr>
                <th className="p-4 text-left">Employee</th>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Check-In Time</th>
                <th className="p-4 text-left">Check-Out Time</th>
                <th className="p-4 text-left">Hours Worked</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendance.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center p-12 text-slate-400">
                    <Users size={32} className="mx-auto text-slate-300 mb-2" />
                    No attendance records found.
                  </td>
                </tr>
              ) : (
                filteredAttendance.map((item) => (
                  <tr key={item._id} className="border-b hover:bg-slate-50/50 transition">
                    <td className="p-4 font-bold text-slate-800">
                      {isEmployee ? user.name : (item?.employeeId?.name || "Employee")}
                    </td>
                    <td className="p-4">
                      {item.date ? new Date(item.date).toLocaleDateString() : ""}
                    </td>
                    <td className="p-4 text-green-600 font-semibold">
                      {item.checkIn ? new Date(item.checkIn).toLocaleTimeString() : "-"}
                    </td>
                    <td className="p-4 text-rose-600 font-semibold">
                      {item.checkOut ? new Date(item.checkOut).toLocaleTimeString() : "-"}
                    </td>
                    {/* 🔹 FIXED: Displaying proper detailed hours/minutes/seconds format */}
                    <td className="p-4 font-bold text-slate-700">
                      {formatHoursWorked(item.checkIn, item.checkOut, item.totalHours)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}