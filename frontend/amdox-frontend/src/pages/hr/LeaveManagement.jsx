import { useEffect, useMemo, useState } from "react";
import { CheckCircle, Clock3, Search, XCircle, Loader2 } from "lucide-react";
import io from "socket.io-client";
import API from "../../services/api";
import notifier from "../../utils/notifier";

const socket = io("http://localhost:5000", {
  transports: ["websocket", "polling"],
});

export default function LeaveManagement() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchLeaves();

    socket.on("receiveMessage", () => {
      fetchLeaves();
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  // 🚀 સેલ્ફ-હીલિંગ અને પ્રોટેક્ટેડ ડ્યુઅલ લોડર્સ અલ્ગોરિધમ
  const fetchLeaves = async () => {
    try {
      setLoading(true);
      let serverLeaves = [];

      // ૧. પહેલા માસ્ટર એચઆર લિસ્ટ એપીઆઈ કોલ ટ્રાય કરો
      try {
        const res = await API.get("/hr/leaves");
        if (res.data && Array.isArray(res.data)) {
          serverLeaves = res.data;
        }
      } catch (err) {
        console.warn("/hr/leaves endpoint was unreachable, falling back to /leave API.");
      }

      // ૨. જો માસ્ટર લિસ્ટ ખાલી હોય અથવા ઉપરનો કોલ નિષ્ફળ ગયો હોય, તો /leave એન્ડપોઇન્ટ ટ્રાય કરો
      if (serverLeaves.length === 0) {
        try {
          const res = await API.get("/leave");
          if (res.data && Array.isArray(res.data)) {
            serverLeaves = res.data;
          }
        } catch (err) {
          console.error("All server leave endpoints failed:", err);
        }
      }

      // ૩. લોકલ સ્ટોરેજ સિંક અને રિયલ-ટાઇમ મર્જર પ્રક્રિયા
      const localLeaves = JSON.parse(localStorage.getItem("amdox_applied_leaves") || "[]");
      const mergedLeaves = [...serverLeaves];

      localLeaves.forEach((ll) => {
        if (!mergedLeaves.some((sl) => sl._id === ll._id)) {
          mergedLeaves.push(ll);
        }
      });

      // ૪. તારીખ મુજબ સચોટ સોર્ટિંગ
      mergedLeaves.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      setLeaves(mergedLeaves);
    } catch (err) {
      console.warn("Using LocalStorage fallback list for leaves:");
      const localLeaves = JSON.parse(localStorage.getItem("amdox_applied_leaves") || "[]");
      setLeaves(localLeaves);
    } finally {
      setLoading(false);
    }
  };

  const resolveEmployeeName = (leave) => {
    if (!leave) return "Employee";
    if (leave.employeeId?.userId?.name) return leave.employeeId.userId.name;
    if (leave.employeeId?.name) return leave.employeeId.name;
    if (leave.userId?.name) return leave.userId.name;
    if (leave.employeeName) return leave.employeeName;
    return "Employee";
  };

  const filteredLeaves = useMemo(() => {
    return leaves.filter((leave) => {
      const empName = resolveEmployeeName(leave).toLowerCase();
      return empName.includes(search.toLowerCase());
    });
  }, [leaves, search]);

  const updateStatus = async (leaveId, status) => {
    try {
      setUpdatingId(leaveId);
      
      await API.put("/hr/leave/status", { leaveId, status });
      
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
      setLeaves((prev) =>
        prev.map((leave) => (leave._id === leaveId ? { ...leave, status } : leave))
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const statusStyle = (status) => {
    switch (status) {
      case "APPROVED":
        return "bg-green-100 text-green-700 border border-green-200";
      case "REJECTED":
        return "bg-rose-100 text-rose-700 border border-rose-200";
      default:
        return "bg-yellow-100 text-yellow-700 border border-yellow-200";
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
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 rounded-3xl p-8 text-white shadow-sm">
        <h1 className="text-3xl font-extrabold tracking-tight">Leave Requests</h1>
        <p className="mt-2 text-indigo-100">Review, approve, and manage employee leave submissions.</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm">
        <div className="relative max-w-xs">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search employee..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 rounded-xl border border-slate-300 pl-11 pr-4 outline-none focus:border-indigo-500 text-sm"
          />
        </div>
      </div>

      {/* Request Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-700 border-b">
              <tr>
                <th className="p-4 text-left">Employee</th>
                <th className="p-4 text-left">Leave Type</th>
                <th className="p-4 text-left">Dates</th>
                <th className="p-4 text-left">Reason</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeaves.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-12 text-slate-400">
                    <Clock3 className="mx-auto text-slate-300 mb-2" size={32} />
                    No leave requests found.
                  </td>
                </tr>
              ) : (
                filteredLeaves.map((leave) => {
                  const empName = resolveEmployeeName(leave);
                  return (
                    <tr key={leave._id} className="border-b hover:bg-slate-50/50 transition">
                      <td className="p-4 font-bold text-slate-800">{empName}</td>
                      <td className="p-4">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {leave.leaveType || "CASUAL"}
                        </span>
                      </td>
                      <td className="p-4 text-slate-500 text-xs">
                        <div>From: {new Date(leave.fromDate).toLocaleDateString()}</div>
                        <div className="mt-1">To: {new Date(leave.toDate).toLocaleDateString()}</div>
                      </td>
                      <td className="p-4 max-w-xs truncate text-slate-500">{leave.reason}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${statusStyle(leave.status)}`}>
                          {leave.status || "PENDING"}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button
                            disabled={updatingId === leave._id}
                            onClick={() => updateStatus(leave._id, "APPROVED")}
                            className="h-9 px-3 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold text-xs flex items-center gap-1 transition disabled:opacity-50 cursor-pointer"
                          >
                            <CheckCircle size={14} />
                            Approve
                          </button>
                          <button
                            disabled={updatingId === leave._id}
                            onClick={() => updateStatus(leave._id, "REJECTED")}
                            className="h-9 px-3 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs flex items-center gap-1 transition disabled:opacity-50 cursor-pointer"
                          >
                            <XCircle size={14} />
                            Reject
                          </button>
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
    </div>
  );
}