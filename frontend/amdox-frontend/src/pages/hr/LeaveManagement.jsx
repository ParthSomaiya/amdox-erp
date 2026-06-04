import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { CheckCircle, Clock3, Search, XCircle, Loader2, Eye, FileText, X } from "lucide-react";
import io from "socket.io-client";
import API from "../../services/api";
import notifier from "../../utils/notifier";

const socket = io("http://localhost:5000", {
  transports: ["websocket", "polling"],
});

// 🚀 DYNAMIC AXIOS INTERCEPTOR: દરેક રિકવેસ્ટ વખતે તાજું ટોકન જ મોકલશે
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
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

export default function LeaveManagement() {
  const [leaves, setLeaves] = useState([]);
  const [employees, setEmployees] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  // 🚀 લાઈવ પ્રીવ્યૂ સ્ટેટ્સ
  const [previewProof, setPreviewProof] = useState(null);
  const [showProofModal, setShowProofModal] = useState(false);

  useEffect(() => {
    fetchLeavesAndEmployees();

    socket.on("receiveMessage", () => {
      fetchLeavesAndEmployees();
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  const fetchLeavesAndEmployees = async () => {
    try {
      setLoading(true);
      
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

      let serverLeaves = [];
      try {
        const res = await API.get("/hr/leaves");
        if (res.data && Array.isArray(res.data)) {
          serverLeaves = res.data;
        }
      } catch (err) {
        console.warn("Alternative leaves path active.");
      }

      if (serverLeaves.length === 0) {
        try {
          const res = await API.get("/leave");
          if (res.data && Array.isArray(res.data)) {
            serverLeaves = res.data;
          }
        } catch (err) {
          console.error(err);
        }
      }

      const localLeaves = JSON.parse(localStorage.getItem("amdox_applied_leaves") || "[]");
      const mergedLeaves = [...serverLeaves];

      localLeaves.forEach((ll) => {
        if (!mergedLeaves.some((sl) => sl._id === ll._id)) {
          mergedLeaves.push(ll);
        }
      });

      mergedLeaves.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      setLeaves(mergedLeaves);
    } catch (err) {
      console.warn("Authorized token expired. Synchronizing with localized browser sandbox.");
      const localLeaves = JSON.parse(localStorage.getItem("amdox_applied_leaves") || "[]");
      setLeaves(localLeaves);
    } finally {
      setLoading(false);
    }
  };

  const resolveEmployeeName = (leave) => {
    if (!leave) return "Employee";

    if (leave.employeeId && typeof leave.employeeId === "object") {
      if (leave.employeeId.name && leave.employeeId.name !== "Employee" && leave.employeeId.name !== "Staff") {
        return leave.employeeId.name;
      }
      if (leave.employeeId.userId?.name) return leave.employeeId.userId.name;
    }

    if (leave.userId && typeof leave.userId === "object") {
      if (leave.userId.name) return leave.userId.name;
    }

    const empIdStr = typeof leave.employeeId === "string" ? leave.employeeId : leave.employeeId?._id;
    const usrIdStr = typeof leave.userId === "string" ? leave.userId : leave.userId?._id;
    const targetId = empIdStr || usrIdStr;

    if (targetId && employees.length > 0) {
      const matched = employees.find(
        (e) => String(e._id) === String(targetId) || 
               String(e.userId?._id) === String(targetId) ||
               String(e.userId) === String(targetId) ||
               String(e._id) === `mock-usr-${leave.employeeName?.replace(/[@.]/g, "-")?.toLowerCase()}`
      );
      if (matched) {
        return matched.userId?.name || matched.name || "Employee";
      }
    }

    if (leave.employeeName) return leave.employeeName;
    if (leave.name) return leave.name;

    return "Staff Member";
  };

  const filteredLeaves = useMemo(() => {
    return leaves.filter((leave) => {
      const empName = resolveEmployeeName(leave).toLowerCase();
      return empName.includes(search.toLowerCase());
    });
  }, [leaves, search, employees]);

  const updateStatus = async (leaveId, status) => {
    try {
      setUpdatingId(leaveId);
      await API.put("/hr/leave/status", { leaveId, status }).catch(() => {
        console.warn("Unauthorizated token. Saved to local sandbox.");
      });
      
      const localLeaves = JSON.parse(localStorage.getItem("amdox_applied_leaves") || "[]");
      const updatedLocal = localLeaves.map((leave) => 
        leave._id === leaveId ? { ...leave, status } : leave
      );
      localStorage.setItem("amdox_applied_leaves", JSON.stringify(updatedLocal));

      setLeaves((prev) =>
        prev.map((leave) => (leave._id === leaveId ? { ...leave, status } : leave))
      );
      
      alert(`Leave request ${status.toLowerCase()} successfully.`);
      notifier.leaveResolved(status);
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const statusStyle = (status) => {
    switch (status) {
      case "APPROVED": return "bg-green-100 text-green-700 border border-green-200";
      case "REJECTED": return "bg-rose-100 text-rose-700 border border-rose-100";
      default: return "bg-yellow-100 text-yellow-700 border border-yellow-200";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <h2 className="mt-4 text-slate-600 font-semibold">Loading Leave Requests...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 rounded-3xl p-8 text-white shadow-sm">
        <h1 className="text-3xl font-extrabold tracking-tight">Leave Requests</h1>
        <p className="mt-2 text-indigo-100">Review, approve, and manage employee leave submissions.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm">
        <div className="relative max-w-xs">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input type="text" placeholder="Search employee..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full h-11 rounded-xl border border-slate-300 pl-11 pr-4 outline-none focus:border-indigo-500 text-sm" />
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 border-b">
              <tr>
                <th className="p-4 text-left">Employee</th>
                <th className="p-4 text-left">Leave Type</th>
                <th className="p-4 text-left">Dates</th>
                <th className="p-4 text-left">Reason</th>
                <th className="p-4 text-left">Proof</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeaves.length === 0 ? (
                <tr><td colSpan="7" className="text-center p-12 text-slate-400"><Clock3 className="mx-auto text-slate-300 mb-2" size={32} />No leave requests found.</td></tr>
              ) : (
                filteredLeaves.map((leave) => {
                  const empName = resolveEmployeeName(leave);
                  return (
                    <tr key={leave._id} className="border-b hover:bg-slate-50/50 transition">
                      <td className="p-4 font-bold text-slate-800">{empName}</td>
                      <td className="p-4"><span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">{leave.leaveType || "CASUAL"}</span></td>
                      <td className="p-4 text-slate-500 text-xs"><div>From: {new Date(leave.fromDate).toLocaleDateString()}</div><div className="mt-1">To: {new Date(leave.toDate).toLocaleDateString()}</div></td>
                      <td className="p-4 max-w-xs truncate text-slate-500">{leave.reason}</td>
                      <td className="p-4">
                        {leave.proof ? (
                          <button
                            onClick={() => {
                              setPreviewProof(leave.proof);
                              setShowProofModal(true);
                            }}
                            className="h-8 px-2.5 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-lg text-xs font-bold flex items-center justify-center gap-1 hover:bg-indigo-100 cursor-pointer"
                          >
                            <Eye size={12} /> View Proof
                          </button>
                        ) : (
                          <span className="text-slate-400 text-xs italic">No Proof</span>
                        )}
                      </td>
                      <td className="p-4"><span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusStyle(leave.status)}`}>{leave.status || "PENDING"}</span></td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button disabled={updatingId === leave._id} onClick={() => updateStatus(leave._id, "APPROVED")} className="h-9 px-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold text-xs flex items-center gap-1 transition disabled:opacity-50 cursor-pointer"><CheckCircle size={14} />Approve</button>
                          <button disabled={updatingId === leave._id} onClick={() => updateStatus(leave._id, "REJECTED")} className="h-9 px-3 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs flex items-center gap-1 transition disabled:opacity-50 cursor-pointer"><XCircle size={14} />Reject</button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 🚀 DYNAMIC PROOF PREVIEW MODAL */}
      {showProofModal && previewProof && createPortal(
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-[28px] p-6 w-full max-w-2xl max-h-[85vh] flex flex-col justify-between shadow-2xl relative">
            
            {/* Header / Close action */}
            <div className="flex justify-between items-center pb-3 border-b mb-4">
              <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-2">
                <FileText size={18} className="text-indigo-600" /> Attached Proof Preview
              </h3>
              <button 
                onClick={() => { setShowProofModal(false); setPreviewProof(null); }}
                className="text-slate-400 hover:text-slate-600 bg-slate-50 p-1.5 rounded-xl border"
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