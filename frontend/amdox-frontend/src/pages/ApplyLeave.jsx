import { useEffect, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { CalendarDays, Clock3, FileText, Send, ShieldCheck, Loader2, X, Eye } from "lucide-react";
import io from "socket.io-client";
import API from "../services/api";
import notifier from "../utils/notifier";

const socket = io("http://localhost:5000", {
  transports: ["websocket", "polling"],
});

// 🛡️ SAFEST LOCAL STORAGE DECORATOR (Wipe-out protection on logout)
const originalClear = localStorage.clear;
localStorage.clear = function() {
  const employees = localStorage.getItem("amdox_employees");
  const leaves = localStorage.getItem("amdox_applied_leaves");
  const attendance = localStorage.getItem("amdox_simulated_attendance");
  const payrolls = localStorage.getItem("amdox_simulated_payrolls");
  const webhooks = localStorage.getItem("amdox_webhooks");

  originalClear.call(localStorage);

  if (employees) localStorage.setItem("amdox_employees", employees);
  if (leaves) localStorage.setItem("amdox_applied_leaves", leaves);
  if (attendance) localStorage.setItem("amdox_simulated_attendance", attendance);
  if (payrolls) localStorage.setItem("amdox_simulated_payrolls", payrolls);
  if (webhooks) localStorage.setItem("amdox_webhooks", webhooks);
};

export default function ApplyLeave() {
  const user = useMemo(() => {
    return JSON.parse(localStorage.getItem("user") || "{}");
  }, []);

  const userId = useMemo(() => {
    return user.id || user._id || (user.email ? `mock-usr-${user.email.replace(/[@.]/g, "-")}` : "guest-user");
  }, [user]);

  const [loading, setLoading] = useState(false);
  const [myLeaves, setMyLeaves] = useState([]);
  
  const [proofFile, setProofFile] = useState(null);
  const [proofBase64, setProofBase64] = useState("");

  // 🚀 લાઈવ પ્રૂફ પ્રીવ્યૂ સ્ટેટ્સ
  const [previewProof, setPreviewProof] = useState(null);
  const [showProofModal, setShowProofModal] = useState(false);

  const [baseBalance, setBaseBalance] = useState({
    casual: 8,
    sick: 5,
    paid: 12,
  });

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

  const calculateDays = (start, end) => {
    if (!start || !end) return 1;
    const from = new Date(start);
    const to = new Date(end);
    const diffTime = Math.abs(to - from);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const calculateDynamicBalance = (allLeaves, currentBase) => {
    let casualUsed = 0;
    let sickUsed = 0;
    let paidUsed = 0;

    allLeaves.forEach(leave => {
      if (leave.status === "APPROVED") {
        const days = calculateDays(leave.fromDate, leave.toDate);
        if (leave.leaveType === "CASUAL") casualUsed += days;
        if (leave.leaveType === "SICK") sickUsed += days;
        if (leave.leaveType === "PAID") paidUsed += days;
      }
    });

    setLeaveBalance({
      casual: Math.max(currentBase.casual - casualUsed, 0),
      sick: Math.max(currentBase.sick - sickUsed, 0),
      paid: Math.max(currentBase.paid - paidUsed, 0),
    });
  };

  const fetchMyLeaves = async (currentBase = baseBalance) => {
    try {
      const res = await API.get("/leave/my");
      const serverLeaves = Array.isArray(res.data) ? res.data : [];
      
      const localApplies = JSON.parse(localStorage.getItem("amdox_applied_leaves") || "[]");
      const myLocal = localApplies.filter(l => {
        const lSenderId = l.employeeId?._id || l.userId?._id || l.userId || l.employeeId;
        return String(lSenderId) === String(userId);
      });

      const merged = [...serverLeaves];
      
      myLocal.forEach(l => {
        const isDuplicate = merged.some(sl => {
          const slStart = sl.fromDate ? sl.fromDate.slice(0, 10) : "";
          const lStart = l.fromDate ? l.fromDate.slice(0, 10) : "";
          const slEnd = sl.toDate ? sl.toDate.slice(0, 10) : "";
          const lEnd = l.toDate ? l.toDate.slice(0, 10) : "";

          return sl._id === l._id || (slStart === lStart && slEnd === lEnd && sl.leaveType === l.leaveType);
        });
        if (!isDuplicate) {
          merged.push(l);
        }
      });

      merged.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      setMyLeaves(merged);
      calculateDynamicBalance(merged, currentBase);
    } catch (err) {
      console.warn("Using offline fallback storage.");
      const localApplies = JSON.parse(localStorage.getItem("amdox_applied_leaves") || "[]");
      const myLocal = localApplies.filter(l => {
        const lSenderId = l.employeeId?._id || l.userId?._id || l.userId || l.employeeId;
        return String(lSenderId) === String(userId);
      });
      setMyLeaves(myLocal);
      calculateDynamicBalance(myLocal, currentBase);
    }
  };

  const fetchLeaveBalance = async () => {
    try {
      const res = await API.get("/leave/balance");
      if (res.data?.success && res.data?.balance) {
        const incomingBase = {
          casual: res.data.balance.casual || 8,
          sick: res.data.balance.sick || 5,
          paid: res.data.balance.paid || 12,
        };
        setBaseBalance(incomingBase);
        fetchMyLeaves(incomingBase);
      } else {
        fetchMyLeaves(baseBalance);
      }
    } catch (err) {
      fetchMyLeaves(baseBalance);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    fetchLeaveBalance();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProofFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProofBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    if (!form.fromDate || !form.toDate || !form.reason.trim()) {
      alert("From date, to date, and reason are required");
      return false;
    }
    
    const from = new Date(form.fromDate);
    const to = new Date(form.toDate);
    const today = new Date();
    today.setHours(0,0,0,0);

    if (from < today) {
      alert("From Date cannot be in the past");
      return false;
    }

    if (from > to) {
      alert("From Date cannot be greater than To Date");
      return false;
    }

    const requestedDays = calculateDays(form.fromDate, form.toDate);
    const currentCategory = form.leaveType.toLowerCase();
    const availableBalance = leaveBalance[currentCategory] || 0;

    if (requestedDays > availableBalance) {
      alert(`You only have ${availableBalance} ${form.leaveType.replace("_", " ")} leaves remaining. You cannot apply for ${requestedDays} days.`);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setLoading(true);

      const payload = {
        _id: `leave-${Date.now()}`,
        leaveType: form.leaveType,
        fromDate: form.fromDate,
        toDate: form.toDate,
        reason: form.reason,
        status: "PENDING",
        proof: proofBase64 || null,
        employeeName: user.name || "Employee",
        employeeId: {
          _id: userId,
          name: user.name,
          userId: {
            _id: userId,
            name: user.name,
            email: user.email
          }
        },
        createdAt: new Date().toISOString()
      };

      let apiSuccess = false;
      try {
        await API.post("/leave/apply", {
          leaveType: form.leaveType,
          fromDate: form.fromDate,
          toDate: form.toDate,
          reason: form.reason,
          employeeId: userId,
          userId: userId,
          employeeName: user.name,
          proof: proofBase64 || null
        });
        apiSuccess = true;
      } catch (apiErr) {
        console.warn("Backend token unauthorized. Saved locally.");
      }

      if (!apiSuccess) {
        const localLeaves = JSON.parse(localStorage.getItem("amdox_applied_leaves") || "[]");
        localStorage.setItem("amdox_applied_leaves", JSON.stringify([payload, ...localLeaves]));
      }

      socket.emit("sendMessage", {
        room: "general",
        text: `📢 Leave Application Alert: ${user.name} applied for ${form.leaveType} Leave.`,
        sender: { id: userId, name: user.name, role: "EMPLOYEE" }
      });

      notifier.leaveApplied(form.leaveType, form.reason);

      alert(apiSuccess ? "Leave Applied Successfully!" : "Leave Applied & Saved Offline!");
      
      setForm({
        leaveType: "CASUAL",
        fromDate: "",
        toDate: "",
        reason: "",
      });
      setProofFile(null);
      setProofBase64("");

      fetchMyLeaves();
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred while applying leave.");
    } finally {
      setLoading(false);
    }
  };

  const badgeColor = (status) => {
    switch (status) {
      case "APPROVED": return "bg-green-100 text-green-700";
      case "REJECTED": return "bg-red-100 text-red-700";
      default: return "bg-yellow-100 text-yellow-700";
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
                  className="w-full h-11 border rounded-xl px-4 text-sm bg-slate-50/50 outline-none"
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
                  className="w-full h-11 border rounded-xl px-4 text-sm bg-slate-50/50 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-2">Reason</label>
              <textarea
                rows="4"
                name="reason"
                value={form.reason}
                onChange={handleChange}
                placeholder="Enter detailed reason..."
                required
                className="w-full rounded-2xl border border-slate-200 px-4 py-4 outline-none resize-none focus:border-blue-500"
              />
            </div>

            {/* Proof Selection */}
            <div>
              <label className="text-sm font-semibold text-slate-700 block mb-2">Upload Medical / Event Proof (Optional)</label>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleFileChange}
                className="w-full text-xs text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 cursor-pointer"
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
                {leave.proof && (
                  <button
                    onClick={() => {
                      setPreviewProof(leave.proof);
                      setShowProofModal(true);
                    }}
                    className="mt-3 inline-flex items-center gap-1.5 text-xs text-indigo-600 font-bold hover:underline cursor-pointer"
                  >
                    📎 View Attached Proof
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 🚀 DYNAMIC INLINE PROOF PREVIEW MODAL */}
      {showProofModal && previewProof && createPortal(
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] p-6 w-full max-w-2xl max-h-[85vh] flex flex-col justify-between shadow-2xl relative">
            
            {/* Header */}
            <div className="flex justify-between items-center pb-3 border-b mb-4">
              <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                <FileText size={18} className="text-indigo-600" /> Attached Proof Preview
              </h3>
              <button 
                onClick={() => { setShowProofModal(false); setPreviewProof(null); }}
                className="text-slate-400 hover:text-slate-600 bg-slate-50 p-1.5 rounded-xl border cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>
            
            {/* Body Viewport */}
            <div className="flex-1 overflow-auto bg-slate-50 border rounded-2xl p-2 min-h-[320px] flex items-center justify-center">
              {previewProof.startsWith("data:image/") || previewProof.match(/\.(jpeg|jpg|gif|png)$/i) ? (
                <img src={previewProof} alt="Proof Document" className="max-w-full max-h-[55vh] object-contain rounded-xl" />
              ) : previewProof.startsWith("data:application/pdf") || previewProof.endsWith(".pdf") ? (
                <iframe src={previewProof} className="w-full h-[55vh] border-0 rounded-xl" title="Proof PDF" />
              ) : (
                <div className="text-center p-10 space-y-4">
                  <FileText size={48} className="text-indigo-600 mx-auto" />
                  <p className="text-xs text-slate-500 font-bold uppercase">Dynamic File Attachment</p>
                  <a href={previewProof} download="Proof_Attachment" className="inline-flex h-9 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold items-center justify-center transition">
                    Download Attachment File
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}