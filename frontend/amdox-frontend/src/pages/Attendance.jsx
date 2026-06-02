import { useEffect, useMemo, useState } from "react";
import { Calendar, Search, Users, ShieldCheck, Loader2, CheckCircle, Clock } from "lucide-react";
import API from "../services/api";

export default function Attendance() {
  const [attendance, setAttendance] = useState([]);
  const [employees, setEmployees] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [marking, setMarking] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isEmployee = user?.role === "EMPLOYEE";

  const fetchAttendanceAndEmployees = async () => {
    try {
      setLoading(true);
      
      // એમ્પ્લોયી લિસ્ટ લોડ કરો
      const empRes = await API.get("/hr/employees").catch(() => null);
      const serverEmps = empRes && Array.isArray(empRes.data) ? empRes.data : [];
      const localEmps = JSON.parse(localStorage.getItem("amdox_employees") || "[]");
      const mergedEmps = [...serverEmps];
      localEmps.forEach((item) => {
        if (!mergedEmps.some((m) => m._id === item._id)) {
          mergedEmps.push(item);
        }
      });
      setEmployees(mergedEmps);

      // હાજરી ડેટા લોડ કરો
      const endpoint = isEmployee ? "/attendance/my" : "/attendance";
      const res = await API.get(endpoint);
      const serverData = Array.isArray(res.data?.data || res.data) ? (res.data?.data || res.data) : [];
      
      const localData = JSON.parse(localStorage.getItem("amdox_simulated_attendance") || "[]");
      const merged = [...serverData];

      localData.forEach((item) => {
        if (!merged.some((m) => m._id === item._id)) {
          merged.push(item);
        }
      });
      setAttendance(merged);
    } catch (error) {
      const saved = JSON.parse(localStorage.getItem("amdox_simulated_attendance") || "[]");
      setAttendance(saved);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendanceAndEmployees();
  }, []);

  // 🧠 ચોક્કસ નેમ રીઝોલ્યુશન (Typo અને Fallback ફિક્સ)
  const resolveEmployeeName = (item) => {
    if (!item) return "Staff Member";

    if (item.employeeId && typeof item.employeeId === "object") {
      if (item.employeeId.name && item.employeeId.name !== "Employee" && item.employeeId.name !== "Staff") {
        return item.employeeId.name;
      }
      if (item.employeeId.userId?.name) return item.employeeId.userId.name;
    }

    const empIdStr = typeof item.employeeId === "string" ? item.employeeId : item.employeeId?._id;
    if (empIdStr && employees.length > 0) {
      const matched = employees.find(
        (e) => String(e._id) === String(empIdStr) || String(e.userId?._id) === String(empIdStr)
      );
      if (matched) {
        return matched.userId?.name || matched.name || "Staff Member";
      }
    }

    if (isEmployee) {
      return user.name || "Staff Member";
    }

    return "Staff Member";
  };

  const todayRecord = useMemo(() => {
    const todayStr = new Date().toISOString().split("T")[0];
    return attendance.find((item) => (item.date || "").slice(0, 10) === todayStr);
  }, [attendance]);

  const handleCheckIn = async () => {
    try {
      setMarking(true);
      const newRecord = {
        _id: `at-${Date.now()}`,
        employeeId: { 
          _id: user.id || user._id, 
          name: user.name || "Employee" 
        },
        date: new Date().toISOString().split("T")[0],
        checkIn: new Date().toISOString(),
        checkOut: null
      };

      // ૧. રિકવેસ્ટ સક્સેસ થાય કે ફેઇલ, ડેટા લોકલી સુરક્ષિત સેવ કરી લો
      const existing = JSON.parse(localStorage.getItem("amdox_simulated_attendance") || "[]");
      localStorage.setItem("amdox_simulated_attendance", JSON.stringify([newRecord, ...existing]));

      await API.post("/attendance/check-in");

      window.triggerAmdoxNotification?.("Attendance Check-In", `${user.name} clocked-in successfully.`, "GENERAL");
      alert("Checked-in successfully!");
      fetchAttendanceAndEmployees();
    } catch (err) {
      console.error(err);
    } finally {
      setMarking(false);
    }
  };

  const handleCheckOut = async () => {
    try {
      setMarking(true);
      
      // ૨. ચેક-આઉટ વખતે પણ લોકલ ડેટા અપડેટ કરી લો
      const localData = JSON.parse(localStorage.getItem("amdox_simulated_attendance") || "[]");
      const updatedLocal = localData.map(item => {
        if ((item.date || "").slice(0, 10) === new Date().toISOString().split("T")[0]) {
          return { ...item, checkOut: new Date().toISOString() };
        }
        return item;
      });
      localStorage.setItem("amdox_simulated_attendance", JSON.stringify(updatedLocal));

      await API.post("/attendance/check-out");

      window.triggerAmdoxNotification?.("Attendance Check-Out", `${user.name} clocked-out successfully.`, "GENERAL");
      alert("Checked-out successfully!");
      fetchAttendanceAndEmployees();
    } catch (err) {
      console.error(err);
    } finally {
      setMarking(false);
    }
  };

  const computeOvertime = (checkInStr, checkOutStr, recordDate) => {
    if (!checkInStr) return { totalHrs: 0, otHrs: 0 };
    const start = new Date(checkInStr);
    let end = checkOutStr ? new Date(checkOutStr) : new Date();
    
    const todayStr = new Date().toISOString().split("T")[0];
    const recDateStr = (recordDate || "").slice(0, 10);
    if (!checkOutStr && recDateStr !== todayStr) {
      return { totalHrs: 8.0, otHrs: 0 };
    }

    const diffMs = end - start;
    const totalHrs = Number(Math.max(0, diffMs / (1000 * 60 * 60)).toFixed(2));
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
        const { totalHrs, otHrs } = computeOvertime(item.checkIn, item.checkOut, item.date);
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
        const empName = resolveEmployeeName(item);
        return empName.toLowerCase().includes(search.toLowerCase());
      }
      return true;
    });
  }, [attendance, search, isEmployee, employees]);

  return (
    <div className="space-y-6">
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
                <button onClick={handleCheckIn} disabled={marking} className="h-11 px-6 bg-white hover:bg-slate-50 text-emerald-600 rounded-xl font-bold text-sm shadow-sm transition cursor-pointer">Check-In</button>
              ) : !todayRecord.checkOut ? (
                <button onClick={handleCheckOut} disabled={marking} className="h-11 px-6 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-sm shadow-sm transition cursor-pointer">Check-Out</button>
              ) : (
                <span className="h-11 px-6 bg-emerald-500 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-1.5 shadow-sm"><CheckCircle size={16} /> Completed</span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white border rounded-3xl p-5 shadow-sm flex items-center justify-between">
          <div><span className="text-xs text-slate-400 font-bold uppercase">Total Shifts</span><h2 className="text-3xl font-black text-slate-800 mt-1">{summary.shifts} Shifts</h2></div>
          <div className="h-11 w-11 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center"><Calendar size={18} /></div>
        </div>
        <div className="bg-white border rounded-3xl p-5 shadow-sm flex items-center justify-between">
          <div><span className="text-xs text-slate-400 font-bold uppercase">Total Worked</span><h2 className="text-3xl font-black text-slate-800 mt-1">{summary.totalHours} Hrs</h2></div>
          <div className="h-11 w-11 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center"><Clock size={18} /></div>
        </div>
        <div className="bg-white border rounded-3xl p-5 shadow-sm flex items-center justify-between">
          <div><span className="text-xs text-slate-400 font-bold uppercase">Overtime (OT)</span><h2 className="text-3xl font-black text-amber-600 mt-1">{summary.totalOT} Hrs</h2></div>
          <div className="h-11 w-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center"><Clock size={18} className="animate-pulse" /></div>
        </div>
        <div className="bg-white border rounded-3xl p-5 shadow-sm flex items-center justify-between">
          <div><span className="text-xs text-slate-400 font-bold uppercase">Estimated OT Pay</span><h2 className="text-3xl font-black text-emerald-600 mt-1">₹{summary.estimatedPay.toLocaleString()}</h2></div>
          <div className="h-11 w-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">₹</div>
        </div>
      </div>

      {!isEmployee && (
        <div className="bg-white rounded-3xl border p-5 shadow-sm">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Search employee attendance..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full h-11 rounded-xl border pl-11 outline-none text-sm bg-slate-50/50" />
          </div>
        </div>
      )}

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
                const { totalHrs, otHrs } = computeOvertime(item.checkIn, item.checkOut, item.date);
                const resolvedName = resolveEmployeeName(item);
                return (
                  <tr key={item._id} className="border-b hover:bg-slate-50/50 transition">
                    <td className="p-4 font-bold text-slate-800">{resolvedName}</td>
                    <td className="p-4">{new Date(item.date).toLocaleDateString("en-IN")}</td>
                    <td className="p-4 text-green-600 font-semibold">{item.checkIn ? new Date(item.checkIn).toLocaleTimeString() : "-"}</td>
                    <td className="p-4 text-rose-600 font-semibold">{item.checkOut ? new Date(item.checkOut).toLocaleTimeString() : "-"}</td>
                    <td className="p-4 font-bold text-slate-700">{item.checkIn ? (item.checkOut ? `${totalHrs} Hrs` : `${totalHrs} Hrs (Active)`) : "-"}</td>
                    <td className="p-4">
                      {otHrs > 0 ? (
                        <span className="px-3 py-1 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-black rounded-full">+ {otHrs} Hrs Overtime</span>
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