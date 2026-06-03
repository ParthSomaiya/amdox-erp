import { useEffect, useState, useMemo } from "react";
import { Users, CalendarDays, Wallet, Clock, ShieldCheck, Loader2 } from "lucide-react";
import API from "../services/api";

export default function EmployeeDashboard() {
  const user = useMemo(() => {
    return JSON.parse(localStorage.getItem("user") || "{}");
  }, []);

  const userId = user.id || user._id;

  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [payrolls, setPayrolls] = useState([]);
  const [activities, setActivities] = useState([]);

  const fetchDashboardMetrics = async () => {
    try {
      setLoading(true);

      // ૧. કટોકટીમાં સિંક જાળવવા માટે તમામ સોર્સમાંથી ડેટા લોડ કરો
      const [attRes, leaveRes, payRes] = await Promise.all([
        API.get("/attendance/my").catch(() => ({ data: [] })),
        API.get("/leave/my").catch(() => ({ data: [] })),
        API.get(`/payroll/my/${userId}`).catch(() => ({ data: [] }))
      ]);

      // ૨. Attendance ડેટા પ્રોસેસિંગ (API + LocalStorage Fallback)
      const serverAtt = attRes.data?.data || attRes.data || [];
      const localAtt = JSON.parse(localStorage.getItem("amdox_simulated_attendance") || "[]");
      const myLocalAtt = localAtt.filter(
        (item) => String(item.employeeId?._id || item.employeeId) === String(userId)
      );
      const mergedAtt = [...serverAtt];
      myLocalAtt.forEach((item) => {
        if (!mergedAtt.some((m) => m._id === item._id)) mergedAtt.push(item);
      });
      setAttendance(mergedAtt);

      // ૩. Leaves ડેટા પ્રોસેસિંગ
      const serverLeaves = leaveRes.data || [];
      const localLeaves = JSON.parse(localStorage.getItem("amdox_applied_leaves") || "[]");
      const myLocalLeaves = localLeaves.filter(
        (item) => String(item.employeeId?._id || item.employeeId || item.userId) === String(userId)
      );
      const mergedLeaves = [...serverLeaves];
      myLocalLeaves.forEach((item) => {
        if (!mergedLeaves.some((m) => m._id === item._id)) mergedLeaves.push(item);
      });
      setLeaves(mergedLeaves);

      // ૪. Payroll ડેટા પ્રોસેસિંગ
      const serverPay = payRes.data?.data || payRes.data || [];
      const localPay = JSON.parse(localStorage.getItem("amdox_simulated_payrolls") || "[]");
      const myLocalPay = localPay.filter(
        (item) => String(item.employeeId?._id || item.employeeId) === String(userId)
      );
      const mergedPay = [...serverPay];
      myLocalPay.forEach((item) => {
        if (!mergedPay.some((m) => m._id === item._id)) mergedPay.push(item);
      });
      setPayrolls(mergedPay);

      // ૫. લાઈવ પ્રવૃત્તિઓ (Activities Stream) કમ્પાઈલર
      compileRecentActivities(mergedAtt, mergedLeaves, mergedPay);

    } catch (err) {
      console.error("Error building dynamic dashboard metrics:", err);
    } finally {
      setLoading(false);
    }
  };

  const compileRecentActivities = (attList, leaveList, payList) => {
    const stream = [];

    // હાજરીની તાજી એન્ટ્રી ઉમેરો
    if (attList.length > 0) {
      const sortedAtt = [...attList].sort((a, b) => new Date(b.checkIn) - new Date(a.checkIn));
      const last = sortedAtt[0];
      stream.push({
        id: "act-att",
        title: "Attendance Clocked-In",
        desc: `Logged check-in at ${new Date(last.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        time: new Date(last.checkIn).toLocaleDateString(),
        timestamp: new Date(last.checkIn)
      });
    }

    // રજાઓની વિનંતીઓ ઉમેરો
    leaveList.forEach((leave, idx) => {
      stream.push({
        id: `act-leave-${idx}`,
        title: `${leave.leaveType || "CASUAL"} Leave Application`,
        desc: `Status: ${leave.status || "PENDING"} - Reason: ${leave.reason}`,
        time: leave.createdAt ? new Date(leave.createdAt).toLocaleDateString() : "Recent",
        timestamp: leave.createdAt ? new Date(leave.createdAt) : new Date(Date.now() - 24 * 60 * 60 * 1000)
      });
    });

    // છેલ્લો પગાર ક્રેડિટ
    payList.forEach((pay, idx) => {
      stream.push({
        id: `act-pay-${idx}`,
        title: `Salary Disbursed`,
        desc: `Monthly salary credited for ${pay.month}.`,
        time: pay.createdAt ? new Date(pay.createdAt).toLocaleDateString() : "Recent",
        timestamp: pay.createdAt ? new Date(pay.createdAt) : new Date(Date.now() - 48 * 60 * 60 * 1000)
      });
    });

    // તારીખ મુજબ ક્રમબદ્ધ કરો
    stream.sort((a, b) => b.timestamp - a.timestamp);
    setActivities(stream.slice(0, 4));
  };

  useEffect(() => {
    fetchDashboardMetrics();
  }, []);

  // હાજરી દરની સાચી ટકાવારી (ધારો કે એક મહિનાના ૨૨ દિવસો છે)
  const attendanceRate = useMemo(() => {
    if (attendance.length === 0) return "0%";
    const rate = Math.min(Math.round((attendance.length / 22) * 100), 100);
    return `${rate}%`;
  }, [attendance]);

  // બાકી રજાઓ (સ્ટાન્ડર્ડ ૧૫ રજાઓમાંથી બાદ કરો)
  const leavesRemaining = useMemo(() => {
    const approvedCount = leaves.filter(l => l.status === "APPROVED").length;
    return String(Math.max(15 - approvedCount, 0)).padStart(2, "0");
  }, [leaves]);

  const salaryStatus = useMemo(() => {
    return payrolls.length > 0 ? "PAID" : "PENDING";
  }, [payrolls]);

  const cards = useMemo(() => [
    {
      title: "Attendance Rate",
      value: attendanceRate,
      icon: <CalendarDays size={26} />,
      color: "from-cyan-500 to-blue-600",
    },
    {
      title: "Leaves Left",
      value: leavesRemaining,
      icon: <Clock size={26} />,
      color: "from-green-500 to-emerald-600",
    },
    {
      title: "Salary Status",
      value: salaryStatus,
      icon: <Wallet size={26} />,
      color: "from-orange-500 to-red-500",
    },
  ], [attendanceRate, leavesRemaining, salaryStatus]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-10 w-10 text-indigo-600 mx-auto" />
          <p className="mt-4 text-slate-500 text-sm font-semibold">Aggregating live portal metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-sans">
      {/* HERO BANNER */}
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-600 p-10 text-white shadow-2xl">
        <div className="absolute right-0 top-0 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
        <div className="relative z-10">
          <p className="text-cyan-100 text-lg font-medium">Welcome Back,</p>
          <h1 className="text-5xl font-black mt-3 tracking-tight">{user?.name || "Staff Member"}</h1>
          <p className="mt-4 text-cyan-100 text-lg font-semibold">Employee Portal</p>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((item, index) => (
          <div key={index} className="bg-white rounded-[28px] p-6 shadow-sm border flex items-center justify-between hover:shadow-md transition-all duration-300">
            <div>
              <p className="text-slate-400 font-bold text-xs uppercase tracking-wider">{item.title}</p>
              <h2 className="text-3xl font-black mt-3 text-slate-800">{item.value}</h2>
            </div>
            <div className={`h-16 w-16 rounded-2xl flex items-center justify-center bg-gradient-to-r ${item.color} text-white shadow-lg`}>
              {item.icon}
            </div>
          </div>
        ))}
      </div>

      {/* MAIN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* RECENT ACTIVITY */}
        <div className="lg:col-span-2 bg-white rounded-[28px] p-8 border shadow-sm space-y-6">
          <h2 className="text-2xl font-black text-slate-800 pb-3 border-b">Recent Activity</h2>

          <div className="space-y-4">
            {activities.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-6 text-center">No recent activities recorded.</p>
            ) : (
              activities.map((act) => (
                <div key={act.id} className="flex items-center justify-between border-b last:border-0 pb-4 last:pb-0 gap-4">
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">{act.title}</h3>
                    <p className="text-slate-500 text-xs mt-1 leading-normal">{act.desc}</p>
                  </div>
                  <span className="text-xs text-slate-400 font-bold shrink-0">{act.time}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* COMPACT PROFILE CARD */}
        <div className="bg-white rounded-[28px] p-8 border shadow-sm text-center space-y-5">
          <div className="h-24 w-24 mx-auto rounded-[28px] bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-black shadow-md">
            {user?.name?.charAt(0)?.toUpperCase() || "A"}
          </div>

          <div className="space-y-1">
            <h2 className="text-xl font-black text-slate-800">{user?.name || "Staff"}</h2>
            <p className="text-xs text-slate-400 font-semibold">{user?.email}</p>
          </div>

          <div className="inline-flex px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-black uppercase tracking-wider">
            {user?.role || "EMPLOYEE"}
          </div>
        </div>

      </div>

      <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-semibold pt-4">
        <ShieldCheck size={14} className="text-indigo-600" /> Secure AMDOX Employee Session Protocol Active
      </div>
    </div>
  );
}