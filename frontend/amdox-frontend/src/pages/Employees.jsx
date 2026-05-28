import { useEffect, useState } from "react";
import { Search, Users, Mail, Briefcase, Plus, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import API from "../services/api";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await API.get("/hr");
      setEmployees(res.data || []);
      setFilteredEmployees(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = employees.filter((emp) => {
      const name = emp?.userId?.name?.toLowerCase() || "";
      const email = emp?.userId?.email?.toLowerCase() || "";
      const position = emp?.position?.toLowerCase() || "";
      const searchText = search.toLowerCase();

      return name.includes(searchText) || email.includes(searchText) || position.includes(searchText);
    });
    setFilteredEmployees(filtered);
  }, [search, employees]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Employees</h1>
          <p className="mt-2 text-indigo-100 text-sm">Manage company-wide personnel registry and permissions.</p>
        </div>
        <Link
          to="/add-employee"
          className="h-11 px-5 rounded-xl bg-white hover:bg-slate-50 text-indigo-600 text-sm font-bold flex items-center justify-center gap-2 transition shadow-sm"
        >
          <Plus size={16} /> Add Employee
        </Link>
      </div>

      {/* Filter and search bar */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by name, email, or position..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 rounded-xl border border-slate-300 pl-11 pr-4 outline-none focus:border-indigo-500 text-sm bg-slate-50/50 focus:bg-white transition"
          />
        </div>
      </div>

      {/* Grid Table Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-20 text-center">
            <Loader2 className="animate-spin h-10 w-10 text-indigo-600 mx-auto" />
            <p className="mt-4 text-slate-500 font-semibold text-sm">Loading employees...</p>
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="p-20 text-center text-slate-400 space-y-4">
            <Users size={64} className="mx-auto text-slate-300" />
            <h3 className="text-xl font-bold text-slate-700">No Employees Found</h3>
            <p className="text-sm">Verify your database record or register new staff members.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 border-b">
                <tr>
                  <th className="p-4 text-left font-semibold">Employee</th>
                  <th className="p-4 text-left font-semibold">Email</th>
                  <th className="p-4 text-left font-semibold">Position</th>
                  <th className="p-4 text-left font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((emp) => (
                  <tr key={emp._id} className="border-b hover:bg-slate-50/50 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center uppercase">
                          {emp?.userId?.name?.charAt(0) || "E"}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm">{emp?.userId?.name}</h4>
                          <span className="text-xs text-slate-400 font-medium">ID: {emp._id.slice(-6)}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-slate-500 text-sm">
                        <Mail size={14} />
                        {emp?.userId?.email}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-slate-600 font-semibold text-sm">
                        <Briefcase size={14} className="text-slate-400" />
                        {emp?.position}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-bold bg-green-50 text-green-700 border border-green-100">
                        Active
                      </span>
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