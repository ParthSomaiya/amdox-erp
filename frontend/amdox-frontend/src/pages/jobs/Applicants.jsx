import { useEffect, useMemo, useState } from "react";
import API from "../../services/api";
import { Mail, CalendarDays, CheckCircle2, XCircle, Clock3, Search, Briefcase, User2, Eye, Loader2 } from "lucide-react";

export default function Applicants() {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const fetchApplicants = async () => {
    try {
      setLoading(true);

      // ડાયરેક્ટ સાચા એપીઆઈ પર હિટ કરો
      const res = await API.get("/applications");
      const serverData = Array.isArray(res.data)
        ? res.data
        : (Array.isArray(res.data?.data) ? res.data.data : []);

      let localData = JSON.parse(localStorage.getItem("amdox_applicants") || "[]");

      // ઇનિશિયલાઇઝેશન
      if (serverData.length === 0 && localData.length === 0) {
        const defaultMockApplicants = [
          {
            _id: "app-default-1",
            name: "Dharmik Kotecha",
            email: "dharmikkotecha@gmail.com",
            phone: "+91 98765 43210",
            position: "Frontend Developer",
            status: "PENDING",
            resume: "uploads/Dharmik_Kotecha_Resume.pdf",
            createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
          },
          {
            _id: "app-default-2",
            name: "Jaydeep Patel",
            email: "jaydeep.patel@gmail.com",
            phone: "+91 91234 56789",
            position: "Backend Engineer",
            status: "ACCEPTED",
            resume: "uploads/Jaydeep_Patel_Resume.pdf",
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
          }
        ];
        localStorage.setItem("amdox_applicants", JSON.stringify(defaultMockApplicants));
        localData = defaultMockApplicants;
      }

      const merged = [...serverData];
      localData.forEach((item) => {
        if (!merged.some((m) => m._id === item._id)) {
          merged.push(item);
        }
      });
      setApplicants(merged);
    } catch (error) {
      console.warn("Applicants Fallback read active:");
      const localData = JSON.parse(localStorage.getItem("amdox_applicants") || "[]");
      setApplicants(localData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/jobs/applicant/${id}`, { status }).catch(() => {
        const localData = JSON.parse(localStorage.getItem("amdox_applicants") || "[]");
        const updatedLocal = localData.map((item) =>
          item._id === id ? { ...item, status } : item
        );
        localStorage.setItem("amdox_applicants", JSON.stringify(updatedLocal));
      });

      setApplicants((prev) =>
        prev.map((item) => (item._id === id ? { ...item, status } : item))
      );

      const applicantObj = applicants.find(item => item._id === id);

      // 🧠 એક્સેપ્ટ થતાની સાથે જ કેન્ડિડેટને "Approved Candidates List" માં મોકલો (Scheduler માટે)
      if (status === "ACCEPTED" && applicantObj) {
        const approvedCandidate = {
          _id: applicantObj._id,
          name: applicantObj.name,
          email: applicantObj.email,
          position: applicantObj.position || applicantObj.jobId?.title || "Frontend Developer"
        };
        const existingApproved = JSON.parse(localStorage.getItem("amdox_approved_candidates") || "[]");
        if (!existingApproved.some(c => c._id === approvedCandidate._id)) {
          localStorage.setItem("amdox_approved_candidates", JSON.stringify([approvedCandidate, ...existingApproved]));
        }
      }

      if (applicantObj) {
        window.triggerAmdoxNotification?.(
          "Applicant Resolved",
          `Application for ${applicantObj.name} has been ${status.toLowerCase()}.`,
          "HR"
        );
      }
    } catch (error) {
      console.error("Status Update Error:", error);
      alert("Failed to update application status");
    }
  };

  const filteredApplicants = useMemo(() => {
    return applicants.filter((item) => {
      const candidateName = item?.name?.toLowerCase() || "";
      const candidateEmail = item?.email?.toLowerCase() || "";
      const jobTitle = item?.jobId?.title?.toLowerCase() || item?.position?.toLowerCase() || "";
      const searchText = search.toLowerCase();

      const matchesSearch = candidateName.includes(searchText) || candidateEmail.includes(searchText) || jobTitle.includes(searchText);
      const currentStatus = item.status || "PENDING";
      const matchesStatus = statusFilter === "ALL" ? true : currentStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [applicants, search, statusFilter]);

  const stats = useMemo(() => {
    const total = applicants.length;
    const accepted = applicants.filter((i) => i.status === "ACCEPTED").length;
    const rejected = applicants.filter((i) => i.status === "REJECTED").length;
    const pending = applicants.filter((i) => !i.status || i.status === "PENDING").length;

    return { total, accepted, rejected, pending };
  }, [applicants]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "ACCEPTED": return "bg-emerald-100 text-emerald-700 border border-emerald-200";
      case "REJECTED": return "bg-red-100 text-red-700 border border-red-200";
      default: return "bg-amber-100 text-amber-700 border border-amber-200";
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 p-8 rounded-[32px] text-white shadow-md">
        <h1 className="text-3xl font-extrabold">Applicants Dashboard</h1>
        <p className="mt-2 text-indigo-100 text-sm">Review candidate applications and manage recruitment pipeline.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 border rounded-3xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase">Total Applicants</span>
            <h2 className="text-3xl font-black text-slate-800 mt-2">{stats.total}</h2>
          </div>
          <div className="h-12 w-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center"><User2 /></div>
        </div>

        <div className="bg-white p-6 border rounded-3xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase">Accepted</span>
            <h2 className="text-3xl font-black text-emerald-600 mt-2">{stats.accepted}</h2>
          </div>
          <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><CheckCircle2 /></div>
        </div>

        <div className="bg-white p-6 border rounded-3xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase">Rejected</span>
            <h2 className="text-3xl font-black text-rose-600 mt-2">{stats.rejected}</h2>
          </div>
          <div className="h-12 w-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center"><XCircle /></div>
        </div>

        <div className="bg-white p-6 border rounded-3xl shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase">Pending</span>
            <h2 className="text-3xl font-black text-amber-500 mt-2">{stats.pending}</h2>
          </div>
          <div className="h-12 w-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center"><Clock3 /></div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white p-5 rounded-3xl border shadow-sm grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        <div className="relative md:col-span-8">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search candidate name, email, or job title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 pl-11 pr-4 rounded-xl border bg-slate-50/50 outline-none focus:border-indigo-500 text-sm"
          />
        </div>
        <div className="md:col-span-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full h-11 rounded-xl border px-3 bg-slate-50/50 outline-none text-sm font-semibold text-slate-600"
          >
            <option value="ALL">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Applicants List Grid */}
      <div className="bg-white rounded-[32px] border shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-20 text-center">
            <Loader2 className="animate-spin h-10 w-10 text-indigo-600 mx-auto" />
            <p className="mt-4 text-slate-400 font-semibold text-sm">Synchronizing database...</p>
          </div>
        ) : filteredApplicants.length === 0 ? (
          <div className="p-20 text-center text-slate-400 space-y-4">
            <Clock3 size={48} className="mx-auto text-slate-300" />
            <h3 className="text-xl font-bold text-slate-700">No Applicants Found</h3>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-slate-600">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="p-4 text-left font-semibold">Candidate</th>
                  <th className="p-4 text-left font-semibold">Applied Position</th>
                  <th className="p-4 text-left font-semibold">Date Applied</th>
                  <th className="p-4 text-left font-semibold">Status</th>
                  <th className="p-4 text-left font-semibold">Resume</th>
                  <th className="p-4 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplicants.map((applicant) => (
                  <tr key={applicant._id} className="border-b hover:bg-slate-50/50 transition">
                    <td className="p-4 font-bold text-slate-800">
                      <div>
                        <h4>{applicant.name}</h4>
                        <span className="text-xs text-slate-400 font-medium">{applicant.email}</span>
                      </div>
                    </td>
                    <td className="p-4 font-semibold text-slate-700">{applicant.jobId?.title || applicant.position || "Job Position"}</td>
                    <td className="p-4">{new Date(applicant.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${getStatusStyle(applicant.status)}`}>
                        {applicant.status || "PENDING"}
                      </span>
                    </td>
                    <td className="p-4">
                      {applicant.resume ? (
                        <a
                          href={applicant.resume.startsWith("http") ? applicant.resume : `http://localhost:5000/${applicant.resume}`}
                          target="_blank"
                          rel="noreferrer"
                          className="h-9 px-3 rounded-lg bg-indigo-50 border text-indigo-600 text-xs font-bold flex items-center gap-1.5 w-fit"
                        >
                          <Eye size={14} /> View
                        </a>
                      ) : (
                        <span className="text-slate-400 text-xs italic">No Resume Uploaded</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button onClick={() => updateStatus(applicant._id, "ACCEPTED")} className="h-9 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer">Accept</button>
                        <button onClick={() => updateStatus(applicant._id, "REJECTED")} className="h-9 px-3 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs cursor-pointer">Reject</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}