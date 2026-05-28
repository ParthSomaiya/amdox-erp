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
  const [todayStatus, setTodayStatus] = useState("PRESENT");
  const [marking, setMarking] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const res = await API.get("/attendance");
      setAttendance(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Attendance fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = async () => {
    try {
      setMarking(true);
      await API.post("/attendance", { status: todayStatus });
      await fetchAttendance();
      alert("Attendance marked successfully");
    } catch (error) {
      console.error("Mark attendance error:", error);
      alert(error?.response?.data?.message || "Failed to mark attendance");
    } finally {
      setMarking(false);
    }
  };

  const filteredAttendance = useMemo(() => {
    return attendance.filter((item) =>
      item?.employeeId?.name?.toLowerCase().includes(search.toLowerCase())
    );
  }, [attendance, search]);

  const totalPresent = attendance.filter((item) => item.status === "PRESENT").length;
  const totalAbsent = attendance.filter((item) => item.status === "ABSENT").length;
  const totalHalfDay = attendance.filter((item) => item.status === "HALF_DAY").length;

  const getStatusStyles = (status) => {
    switch (status) {
      case "PRESENT":
        return "bg-green-100 text-green-700 border border-green-200";
      case "ABSENT":
        return "bg-red-100 text-red-700 border border-red-200";
      case "HALF_DAY":
        return "bg-yellow-100 text-yellow-700 border border-yellow-200";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200";
    }
  };

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
            <p className="mt-3 text-cyan-500 text-sm max-w-xl">Track, log, and verify daily workspace logins.</p>
          </div>
          <div className="hidden sm:flex h-16 w-16 rounded-2xl bg-white/10 backdrop-blur-md items-center justify-center">
            <Calendar size={28} />
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200/85 rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Present</span>
            <h2 className="text-3xl font-black text-green-600 mt-2">{totalPresent}</h2>
          </div>
          <div className="h-12 w-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
            <CheckCircle2 size={22} />
          </div>
        </div>

        <div className="bg-white border border-slate-200/85 rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Absent</span>
            <h2 className="text-3xl font-black text-red-600 mt-2">{totalAbsent}</h2>
          </div>
          <div className="h-12 w-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
            <XCircle size={22} />
          </div>
        </div>

        <div className="bg-white border border-slate-200/85 rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Half Day</span>
            <h2 className="text-3xl font-black text-yellow-500 mt-2">{totalHalfDay}</h2>
          </div>
          <div className="h-12 w-12 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center">
            <TimerReset size={22} />
          </div>
        </div>
      </div>

      {/* Control Actions */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm">
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

        {user?.role === "EMPLOYEE" && (
          <div className="flex gap-3">
            <select
              value={todayStatus}
              onChange={(e) => setTodayStatus(e.target.value)}
              className="h-11 rounded-xl border border-slate-300 px-4 text-sm bg-white outline-none"
            >
              <option value="PRESENT">PRESENT</option>
              <option value="HALF_DAY">HALF DAY</option>
              <option value="ABSENT">ABSENT</option>
            </select>
            <button
              onClick={markAttendance}
              disabled={marking}
              className="h-11 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-sm transition disabled:opacity-50"
            >
              {marking ? "Logging..." : "Mark Attendance"}
            </button>
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
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Check-in Time</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendance.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center p-12 text-slate-400">
                    <Users size={32} className="mx-auto text-slate-300 mb-2" />
                    No attendance records found.
                  </td>
                </tr>
              ) : (
                filteredAttendance.map((item) => (
                  <tr key={item._id} className="border-b hover:bg-slate-50/50 transition">
                    <td className="p-4 font-bold text-slate-800">{item?.employeeId?.name || "Employee"}</td>
                    <td className="p-4">{new Date(item.date).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getStatusStyles(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400">{new Date(item.createdAt).toLocaleTimeString()}</td>
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