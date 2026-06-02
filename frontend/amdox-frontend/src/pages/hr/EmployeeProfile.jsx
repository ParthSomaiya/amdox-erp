import { useEffect, useState, useMemo } from "react";
import { User, Mail, Briefcase, Calendar, ShieldCheck, Search, Loader2 } from "lucide-react";
import API from "../../services/api";

export default function EmployeeProfile() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

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
              <div key={emp._id} className="bg-white border rounded-[28px] p-6 shadow-sm hover:shadow-md transition space-y-4">
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
                  <div className="flex items-center gap-2"><Mail size={14} className="text-slate-400 shrink-0" /><span className="truncate">{email}</span></div>
                  <div className="flex items-center gap-2"><Briefcase size={14} className="text-slate-400 shrink-0" /><span>Salary: ₹{emp.salary?.toLocaleString() || "0"}/mo</span></div>
                  <div className="flex items-center gap-2"><Calendar size={14} className="text-slate-400 shrink-0" /><span>Joined: {emp.joiningDate ? new Date(emp.joiningDate).toLocaleDateString() : "-"}</span></div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}