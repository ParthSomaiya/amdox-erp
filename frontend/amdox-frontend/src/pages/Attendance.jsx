import { useEffect, useMemo, useState } from "react";
import { Calendar, Search, Users, ShieldCheck, Loader2, CheckCircle, Clock } from "lucide-react";
import API from "../services/api";

export default function Attendance() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [marking, setMarking] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isEmployee = user?.role === "EMPLOYEE";

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const endpoint = isEmployee ? "/attendance/my" : "/attendance";
      const res = await API.get(endpoint);
      const records = res.data?.data || res.data || [];
      setAttendance(Array.isArray(records) ? records : []);
    } catch (error) {
      console.warn("Using local storage fallback.");
      const saved = JSON.parse(localStorage.getItem("amdox_simulated_attendance") || "[]");
      if (saved.length > 0) {
        setAttendance(saved);
      } else {
        const dummy = [
          { _id: "at-1", employeeId: { name: "Jaydeep Patel" }, date: "2026-05-28", checkIn: "2026-05-28T09:00:00", checkOut: "2026-05-28T18:30:00" }, 
          { _id: "at-2", employeeId: { name: "Dharmik Kotecha" }, date: "2026-05-28", checkIn: "2026-05-28T09:00:00", checkOut: "2026-05-28T17:00:00" }, 
          { _id: "at-3", employeeId: { name: "Hardik Patel" }, date: "2026-05-28", checkIn: "2026-05-28T09:00:00", checkOut: "2026-05-28T20:00:00" }  
        ];
        setAttendance(dummy);
        localStorage.setItem("amdox_simulated_attendance", JSON.stringify(dummy));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const todayRecord = useMemo(() => {
    const todayStr = new Date().toISOString().split("T")[0];
    return attendance.find((item) => (item.date || "").slice(0, 10) === todayStr);
  }, [attendance]);

  const handleCheckIn = async () => {
    try {
      setMarking(true);
      await API.post("/attendance/check-in").catch(() => {
        const newRecord = {
          _id: `at-${Date.now()}`,
          employeeId: { name: user.name || "Employee" },
          date: new Date().toISOString().split("T")[0],
          checkIn: new Date().toISOString(),
          checkOut: null
        };
        const updated = [newRecord, ...attendance];
        setAttendance(updated);
        localStorage.setItem("amdox_simulated_attendance", JSON.stringify(updated));
      });

      window.triggerAmdoxNotification?.("Attendance Check-In", `${user.name} clocked-in successfully.`, "GENERAL");
      alert("Checked-in successfully!");
      fetchAttendance();
    } catch (err) {
      console.error(err);
    } finally {
      setMarking(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setMarking(true);
      await API.post("/attendance/check-out").catch(() => {
        const updated = attendance.map(item => {
          if (item._id === todayRecord._id) {
            return { ...item, checkOut: new Date().toISOString() };
          }
          return item;
        });
        setAttendance(updated);
        localStorage.setItem("amdox_simulated_attendance", JSON.stringify(updated));
      });

      window.triggerAmdoxNotification?.("Attendance Check-Out", `${user.name} clocked-out successfully.`, "GENERAL");
      alert("Checked-out successfully!");
      fetchAttendance();
    } catch (err) {
      console.error(err);
    } finally {
      setMarking(false);
    }
  };

  const computeOvertime = (checkInStr, checkOutStr) => {
    if (!checkInStr) return { totalHrs: 0, otHrs: 0 };
    const end = checkOutStr ? new Date(checkOutStr) : new Date();
    const diffMs = end - new Date(checkInStr);
    const totalHrs = Number((diffMs / (1000 * 60 * 60)).toFixed(2));
    const otHrs = totalHrs > 8 ? Number((totalHrs - 8).toFixed(2)) : 0;
    return { totalHrs, otHrs };
  };

  const summary = useMemo(() => {
    let shifts = 0;
    let totalHours = 0;
    let totalOT = 0;

    attendance.forEach(item => {
      if (item.checkIn) {
        shifts++;
        const { totalHrs, otHrs } = computeOvertime(item.checkIn, item.checkOut);
        totalHours += totalHrs;
        totalOT += otHrs;
      }
    });

    return {
      shifts,
      totalHours: Number(totalHours.toFixed(1)),
      totalOT: Number(totalOT.toFixed(1)),
      estimatedPay: Number((totalOT * 500).toFixed(0))
    };
  }, [attendance]);

  const filteredAttendance = useMemo(() => {
    return attendance.filter((item) => {
      if (!isEmployee) {
        const empName = item?.employeeId?.name || "";
        return empName.toLowerCase().includes(search.toLowerCase());
      }
      return true;
    });
  }, [attendance, search, isEmployee]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 p-8 text-white shadow-md">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <span className="text-xs uppercase tracking-widest text-cyan-100 font-bold">HR & Payroll Sync</span>
            <h1 className="text-3xl font-black mt-1">📅 Attendance & Overtime Tracker</h1>
            <p className="text-cyan-100 text-sm mt-1">Live calculations of shifts, overtime hours, and estimated payouts.</p>
          </div>

          {isEmployee && (
            <div className="flex gap-3 z-10">
              {!todayRecord ? (
                <button onClick={handleCheckIn} disabled={marking} className="h-11 px-6 bg-white hover:bg-slate-50 text-emerald-600 rounded-xl font-bold text-sm shadow-sm transition cursor-pointer">
                  Check-In
                </button>
              ) : !todayRecord.checkOut ? (
                <button onClick={handleCheckOut} disabled={marking} className="h-11 px-6 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-sm shadow-sm transition cursor-pointer">
                  Check-Out
                </button>
              ) : (
                <span className="h-11 px-6 bg-emerald-500 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-1.5 shadow-sm"><CheckCircle size={16} /> Completed</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border rounded-3xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase">Total Shifts</span>
            <h2 className="text-3xl font-black text-slate-800 mt-1">{summary.shifts} Shifts</h2>
          </div>
          <div className="h-11 w-11 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center"><Calendar size={18} /></div>
        </div>

        <div className="bg-white border rounded-3xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase">Total Worked</span>
            <h2 className="text-3xl font-black text-slate-800 mt-1">{summary.totalHours} Hrs</h2>
          </div>
          <div className="h-11 w-11 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center"><Clock size={18} /></div>
        </div>

        <div className="bg-white border rounded-3xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase">Overtime (OT)</span>
            <h2 className="text-3xl font-black text-amber-600 mt-1">{summary.totalOT} Hrs</h2>
          </div>
          <div className="h-11 w-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center"><Clock size={18} className="animate-pulse" /></div>
        </div>

        <div className="bg-white border rounded-3xl p-5 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase">Estimated OT Pay</span>
            <h2 className="text-3xl font-black text-emerald-600 mt-1">₹{summary.estimatedPay.toLocaleString()}</h2>
          </div>
          <div className="h-11 w-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">₹</div>
        </div>
      </div>

      {/* Search & Filter */}
      {!isEmployee && (
        <div className="bg-white rounded-3xl border p-5 shadow-sm">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search employee attendance..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-11 rounded-xl border pl-11 outline-none text-sm bg-slate-50/50"
            />
          </div>
        </div>
      )}

      {/* Attendance Grid Table */}
      <div className="bg-white rounded-[32px] border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 border-b">
              <tr>
                <th className="p-4 text-left">Employee Name</th>
                <th className="p-4 text-left">Date</th>
                <th className="p-4 text-left">Check-In</th>
                <th className="p-4 text-left">Check-Out</th>
                <th className="p-4 text-left">Shifts Duration</th>
                <th className="p-4 text-left">Overtime (OT)</th>
              </tr>
            </thead>
            <tbody>
              {filteredAttendance.map((item) => {
                const { totalHrs, otHrs } = computeOvertime(item.checkIn, item.checkOut);
                return (
                  <tr key={item._id} className="border-b hover:bg-slate-50/50 transition">
                    <td className="p-4 font-bold text-slate-800">{isEmployee ? user.name : (item.employeeId?.name || "Staff")}</td>
                    <td className="p-4">{new Date(item.date).toLocaleDateString("en-IN")}</td>
                    <td className="p-4 text-green-600 font-semibold">{item.checkIn ? new Date(item.checkIn).toLocaleTimeString() : "-"}</td>
                    <td className="p-4 text-rose-600 font-semibold">{item.checkOut ? new Date(item.checkOut).toLocaleTimeString() : "-"}</td>
                    <td className="p-4 font-bold text-slate-700">
                      {item.checkIn ? (
                        item.checkOut ? `${totalHrs} Hrs` : `${totalHrs} Hrs (Active)`
                      ) : "-"}
                    </td>
                    <td className="p-4">
                      {otHrs > 0 ? (
                        <span className="px-3 py-1 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-black rounded-full">
                          + {otHrs} Hrs Overtime
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs">Standard Shift</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}