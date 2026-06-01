import { useEffect, useState, useMemo } from "react";
import { CalendarDays, Clock3, FileText, Send, ShieldCheck, Loader2 } from "lucide-react";
import io from "socket.io-client";
import API from "../services/api";
import notifier from "../utils/notifier";

const socket = io("http://localhost:5000", {
  transports: ["websocket", "polling"],
});

export default function ApplyLeave() {
  const user = useMemo(() => {
    return JSON.parse(localStorage.getItem("user") || "{}");
  }, []);

  const [loading, setLoading] = useState(false);
  const [myLeaves, setMyLeaves] = useState([]);
  
  const [leaveBalance, setLeaveBalance] = useState({
    casual: 8,
    sick: 5,
    paid: 12,
  });

  const [form, setForm] = useState({
    leaveType: "CASUAL",
    fromDate: "",
    toDate: "",
    reason: "",
  });

  useEffect(() => {
    fetchMyLeaves();
    fetchLeaveBalance();
  }, []);

  // કર્મચારીની રજાઓ મેળવવા અને સિંક કરવાનું ફંક્શન
  const fetchMyLeaves = async () => {
    try {
      const res = await API.get("/leave/my");
      const serverLeaves = Array.isArray(res.data) ? res.data : [];
      
      const localApplies = JSON.parse(localStorage.getItem("amdox_applied_leaves") || "[]");
      const userId = user.id || user._id;
      
      const myLocal = localApplies.filter(l => {
        const lSenderId = l.employeeId?._id || l.userId || l.employeeId;
        return String(lSenderId) === String(userId);
      });

      const merged = [...serverLeaves];
      myLocal.forEach(l => {
        if (!merged.some(sl => sl._id === l._id)) {
          merged.push(l);
        }
      });
      setMyLeaves(merged);
    } catch (err) {
      console.error(err);
      const localApplies = JSON.parse(localStorage.getItem("amdox_applied_leaves") || "[]");
      const userId = user.id || user._id;
      const myLocal = localApplies.filter(l => {
        const lSenderId = l.employeeId?._id || l.userId || l.employeeId;
        return String(lSenderId) === String(userId);
      });
      setMyLeaves(myLocal);
    }
  };

  const fetchLeaveBalance = async () => {
    try {
      const res = await API.get("/leave/balance");
      if (res.data?.success && res.data?.balance) {
        setLeaveBalance({
          casual: res.data.balance.casual || 8,
          sick: res.data.balance.sick || 5,
          paid: res.data.balance.paid || 12,
        });
      }
    } catch (err) {
      console.error("Error fetching leave balance:", err);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const validateDates = () => {
    if (!form.fromDate || !form.toDate) return false;
    const from = new Date(form.fromDate);
    const to = new Date(form.toDate);
    return from <= to;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateDates()) {
      alert("From Date cannot be greater than To Date");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        _id: `leave-${Date.now()}`,
        leaveType: form.leaveType,
        fromDate: form.fromDate,
        toDate: form.toDate,
        reason: form.reason,
        status: "PENDING",
        employeeId: {
          _id: user.id || user._id,
          name: user.name,
          userId: {
            name: user.name,
            email: user.email
          }
        },
        createdAt: new Date().toISOString()
      };

      await API.post("/leave/apply", form);

      const localLeaves = JSON.parse(localStorage.getItem("amdox_applied_leaves") || "[]");
      localStorage.setItem("amdox_applied_leaves", JSON.stringify([payload, ...localLeaves]));

      socket.emit("sendMessage", {
        room: "general",
        text: `📢 Leave Application Alert: ${user.name} applied for ${form.leaveType} Leave.`,
        sender: { id: user.id || user._id, name: user.name, role: "EMPLOYEE" }
      });

      notifier.leaveApplied(form.leaveType, form.reason);

      alert("Leave Applied Successfully");
      setForm({
        leaveType: "CASUAL",
        fromDate: "",
        toDate: "",
        reason: "",
      });

      fetchMyLeaves();
      fetchLeaveBalance();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to apply leave");
    } finally {
      setLoading(false);
    }
  };

  const badgeColor = (status) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-700";
      case "REJECTED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  return (
    <div className="space-y-8">
      {/* HERO & DYNAMIC CARDS */}
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 p-8 text-white shadow-2xl">
        <div className="absolute right-0 top-0 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-14 w-14 rounded-2xl bg-white/20 flex items-center justify-center">
              <CalendarDays size={28} />
            </div>
            <div>
              <h1 className="text-4xl font-black">Leave Management</h1>
              <p className="text-orange-100 mt-1">Apply and track your leave requests</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-6">
            <div className="bg-white/15 rounded-2xl px-5 py-4 min-w-[150px]">
              <p className="text-sm text-orange-100">Casual Leave</p>
              <h3 className="text-3xl font-black">{leaveBalance.casual}</h3>
            </div>
            <div className="bg-white/15 rounded-2xl px-5 py-4 min-w-[150px]">
              <p className="text-sm text-orange-100">Sick Leave</p>
              <h3 className="text-3xl font-black">{leaveBalance.sick}</h3>
            </div>
            <div className="bg-white/15 rounded-2xl px-5 py-4 min-w-[150px]">
              <p className="text-sm text-orange-100">Paid Leave</p>
              <h3 className="text-3xl font-black">{leaveBalance.paid}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 bg-white rounded-[30px] shadow-lg border border-gray-100 p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-12 w-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
              <FileText size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800">Apply New Leave</h2>
              <p className="text-slate-500">Fill the details below</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-2">Leave Type</label>
              <select
                name="leaveType"
                value={form.leaveType}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 px-4 py-4 outline-none focus:border-blue-500"
              >
                <option value="CASUAL">Casual Leave</option>
                <option value="SICK">Sick Leave</option>
                <option value="PAID">Paid Leave</option>
                <option value="EMERGENCY">Emergency Leave</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-2">From Date</label>
                <input
                  type="date"
                  name="fromDate"
                  value={form.fromDate}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-slate-200 px-4 py-4 outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700 block mb-2">To Date</label>
                <input
                  type="date"
                  name="toDate"
                  value={form.toDate}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-slate-200 px-4 py-4 outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-2">Reason</label>
              <textarea
                rows="6"
                name="reason"
                value={form.reason}
                onChange={handleChange}
                placeholder="Enter detailed reason..."
                required
                className="w-full rounded-2xl border border-slate-200 px-4 py-4 outline-none resize-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 py-4 text-lg font-bold text-white shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-3 cursor-pointer"
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <Send size={20} />}
              {loading ? "Submitting..." : "Apply Leave"}
            </button>
          </form>
        </div>

        {/* History Panel */}
        <div className="bg-white rounded-[30px] shadow-lg border border-gray-100 p-6 h-fit">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center">
              <Clock3 size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-800">My Leaves</h2>
              <p className="text-slate-500">Recent leave requests</p>
            </div>
          </div>

          <div className="space-y-4">
            {myLeaves.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-300 p-6 text-center">
                <ShieldCheck size={42} className="mx-auto text-slate-400 mb-3" />
                <p className="text-slate-500">No leave requests found</p>
              </div>
            )}

            {myLeaves.map((leave) => (
              <div key={leave._id} className="rounded-2xl border border-slate-200 p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-800">{leave.leaveType || "CASUAL"}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${badgeColor(leave.status)}`}>
                    {leave.status}
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-2">
                  {leave.fromDate?.slice(0, 10)} to {leave.toDate?.slice(0, 10)}
                </p>
                <p className="text-sm text-slate-600 mt-3">{leave.reason}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}