import { useEffect, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { 
  User, Mail, Briefcase, Calendar, ShieldCheck, Search, Loader2, 
  X, FileText, Download, Eye, Landmark, GraduationCap, ShieldAlert
} from "lucide-react";
import API from "../../services/api";

export default function EmployeeProfile() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // Modal states
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchEmployeesData = async () => {
    try {
      setLoading(true);
      const res = await API.get("/hr/employees").catch(() => null);
      const serverList = res && Array.isArray(res.data) ? res.data : [];

      const localList = JSON.parse(localStorage.getItem("amdox_employees") || "[]");
      const merged = [...serverList];

      localList.forEach((item) => {
        if (!merged.some((m) => m._id === item._id)) {
          merged.push(item);
        }
      });

      setEmployees(merged);
    } catch (err) {
      console.error(err);
      const localList = JSON.parse(localStorage.getItem("amdox_employees") || "[]");
      setEmployees(localList);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployeesData();
  }, []);

  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const name = (emp.userId?.name || emp.name || "").toLowerCase();
      const position = (emp.position || "").toLowerCase();
      return name.includes(search.toLowerCase()) || position.includes(search.toLowerCase());
    });
  }, [employees, search]);

  // સચોટ ફાઇલ પાથ જનરેટર (જેમ Documents.jsx માં છે તે રીતે જ)
  const getFileUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    const cleanPath = path.replace(/^\//, "");
    return `http://localhost:5000/${cleanPath}`;
  };

  const handleCardClick = (emp) => {
    setSelectedEmp(emp);
    setShowModal(true);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 p-8 rounded-[32px] text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <span className="text-xs uppercase tracking-widest text-indigo-100 font-bold block mb-2">Staff Directory</span>
        <h1 className="text-3xl font-black">👥 Employee Profiles</h1>
        <p className="text-indigo-100 text-sm mt-1">Manage and view employee personal and role portfolios.</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-3xl border p-5 shadow-sm">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search profiles by name or position..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 rounded-xl border pl-11 pr-4 outline-none text-sm bg-slate-50/50 focus:bg-white"
          />
        </div>
      </div>

      {loading ? (
        <div className="p-20 text-center"><Loader2 className="animate-spin h-10 w-10 text-indigo-600 mx-auto" /></div>
      ) : filteredEmployees.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 border text-center text-slate-400 font-bold">No Employee Profiles Found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEmployees.map((emp) => {
            const name = emp.userId?.name || emp.name || "Staff Member";
            const email = emp.userId?.email || emp.email || "N/A";
            return (
              <div 
                key={emp._id} 
                onClick={() => handleCardClick(emp)}
                className="bg-white border rounded-[28px] p-6 shadow-sm hover:shadow-lg transition-all duration-300 space-y-4 cursor-pointer hover:-translate-y-1"
              >
                <div className="flex items-center gap-4 border-b pb-3.5">
                  <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 font-black flex items-center justify-center text-lg uppercase shrink-0">
                    {name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-extrabold text-slate-800 text-sm truncate">{name}</h3>
                    <span className="text-[10px] text-indigo-600 font-bold uppercase">{emp.position || "Developer"}</span>
                  </div>
                </div>

                <div className="space-y-2.5 text-xs font-semibold text-slate-500">
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-slate-400 shrink-0" />
                    <span className="truncate">{email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase size={14} className="text-slate-400 shrink-0" />
                    <span>Salary: ₹{emp.salary?.toLocaleString() || "0"}/mo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-slate-400 shrink-0" />
                    <span>Joined: {emp.joiningDate ? new Date(emp.joiningDate).toLocaleDateString() : "-"}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 🚀 DETAILED VIEW PORTAL MODAL */}
      {showModal && selectedEmp && createPortal(
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row max-h-[90vh]">
            
            {/* Left side: Credentials & Badges */}
            <div className="p-6 md:p-8 flex-1 overflow-y-auto space-y-6">
              <div className="flex justify-between items-start border-b pb-4 gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-black flex items-center justify-center text-2xl uppercase shrink-0">
                    {(selectedEmp.userId?.name || selectedEmp.name || "E").charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-extrabold text-slate-800 text-lg md:text-xl truncate">
                      {selectedEmp.userId?.name || selectedEmp.name}
                    </h3>
                    <span className="text-xs text-indigo-600 font-bold uppercase block mt-1">
                      {selectedEmp.position || "Developer"}
                    </span>
                  </div>
                </div>
                
                {/* Close Button on Mobile view */}
                <button 
                  onClick={() => setShowModal(false)} 
                  className="md:hidden text-slate-400 hover:text-slate-600 bg-slate-50 p-2 rounded-xl border"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Data Specifications Grid */}
              <div className="space-y-4">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Official Information</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50/50 border rounded-xl flex items-center gap-3">
                    <Mail size={16} className="text-indigo-600" />
                    <div className="min-w-0">
                      <span className="text-[9px] text-slate-400 font-bold block uppercase">Email</span>
                      <span className="text-xs font-bold text-slate-700 block truncate">
                        {selectedEmp.userId?.email || selectedEmp.email || "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50/50 border rounded-xl flex items-center gap-3">
                    <Landmark size={16} className="text-indigo-600" />
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold block uppercase">Salary /mo</span>
                      <span className="text-xs font-bold text-slate-700 block">
                        ₹{selectedEmp.salary?.toLocaleString() || "0"}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50/50 border rounded-xl flex items-center gap-3">
                    <Calendar size={16} className="text-indigo-600" />
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold block uppercase">Joining Date</span>
                      <span className="text-xs font-bold text-slate-700 block">
                        {selectedEmp.joiningDate ? new Date(selectedEmp.joiningDate).toLocaleDateString() : "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50/50 border rounded-xl flex items-center gap-3">
                    <GraduationCap size={16} className="text-indigo-600" />
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold block uppercase">Employee ID</span>
                      <span className="text-xs font-bold text-slate-700 block truncate">
                        {selectedEmp._id?.slice(-8) || "N/A"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Compliance checklist */}
              <div className="space-y-3.5">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Verification Files Checklist</span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50/30 border border-slate-100 rounded-xl flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-semibold">Aadhaar Identity</span>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                      selectedEmp.aadhaar ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                    }`}>
                      {selectedEmp.aadhaar ? "Verified" : "Pending"}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50/30 border border-slate-100 rounded-xl flex justify-between items-center text-xs">
                    <span className="text-slate-500 font-semibold">PAN Verification</span>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                      selectedEmp.pan ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                    }`}>
                      {selectedEmp.pan ? "Verified" : "Pending"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: Resume Vault Card (પોર્ટેબલ અને ભૂલ-રહિત ડિઝાઇન) */}
            <div className="w-full md:w-[380px] bg-slate-50 border-t md:border-t-0 md:border-l border-slate-200/80 p-6 flex flex-col justify-between max-h-[50vh] md:max-h-full">
              <div className="flex justify-between items-center pb-4 border-b">
                <h4 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
                  <FileText className="text-indigo-600" size={16} /> Resume Portfolio
                </h4>
                
                {/* Close Button on Desktop view */}
                <button 
                  onClick={() => setShowModal(false)} 
                  className="hidden md:flex text-slate-400 hover:text-slate-600 bg-white p-1.5 rounded-xl border"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Document Display Interface */}
              <div className="flex-1 flex flex-col items-center justify-center py-6 min-h-0">
                {selectedEmp.resume ? (
                  <div className="w-full h-full flex flex-col justify-between space-y-6">
                    
                    {/* Interactive Resume Card Placeholder */}
                    <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-4 shadow-sm min-h-[160px]">
                      <div className="h-16 w-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <FileText size={32} />
                      </div>
                      <div>
                        <h5 className="font-bold text-slate-800 text-sm truncate max-w-[200px]">
                          {selectedEmp.resume.split("/").pop()}
                        </h5>
                        <p className="text-[10px] text-slate-400 font-semibold mt-1">Verified PDF Resume</p>
                      </div>
                    </div>

                    <div className="flex gap-2.5">
                      <a
                        href={getFileUrl(selectedEmp.resume)}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-grow h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-sm"
                      >
                        <Eye size={13} /> View Fullscreen
                      </a>
                      <a
                        href={getFileUrl(selectedEmp.resume)}
                        download
                        className="h-10 w-11 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl flex items-center justify-center transition border"
                        title="Download Resume"
                      >
                        <Download size={15} />
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-3 p-6 border-2 border-dashed border-slate-300 rounded-2xl bg-white w-full">
                    <ShieldAlert className="mx-auto text-slate-300" size={36} />
                    <div>
                      <h5 className="font-extrabold text-slate-800 text-xs">No Portfolio Resume found</h5>
                      <p className="text-[10px] text-slate-400 leading-normal mt-1">The employee has not uploaded a CV to their profile yet.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Trust validation signature footer */}
              <div className="flex items-center justify-center gap-1.5 text-[9px] text-slate-400 font-bold border-t pt-4">
                <ShieldCheck size={11} className="text-emerald-500" /> Secure SSL Folder Protection
              </div>
            </div>

          </div>
        </div>,
        document.body
      )}
    </div>
  );
}