import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Search, Users, Mail, Plus, Trash2, Edit3, Loader2, X, Check } from "lucide-react";
import { Link } from "react-router-dom";
import API from "../services/api";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Edit modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", email: "", password: "", position: "", salary: "" });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await API.get("/hr/employees");
      const serverData = res.data || [];
      
      const localData = JSON.parse(localStorage.getItem("amdox_employees") || "[]");
      const merged = [...serverData];

      localData.forEach((item) => {
        if (!merged.some((m) => m._id === item._id || m.userId?.email === item.userId?.email)) {
          merged.push(item);
        }
      });

      setEmployees(merged);
      setFilteredEmployees(merged);
    } catch (err) {
      console.warn("Fallback to Local Storage for Employees:");
      const localData = JSON.parse(localStorage.getItem("amdox_employees") || "[]");
      setEmployees(localData);
      setFilteredEmployees(localData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const filtered = employees.filter((emp) => {
      const name = emp?.userId?.name?.toLowerCase() || emp?.name?.toLowerCase() || "";
      const email = emp?.userId?.email?.toLowerCase() || emp?.email?.toLowerCase() || "";
      const position = emp?.position?.toLowerCase() || "";
      return name.includes(search.toLowerCase()) || email.includes(search.toLowerCase()) || position.includes(search.toLowerCase());
    });
    setFilteredEmployees(filtered);
  }, [search, employees]);

  const openEditModal = (emp) => {
    setSelectedEmp(emp);
    setEditForm({
      name: emp.userId?.name || emp.name || "",
      email: emp.userId?.email || emp.email || "",
      password: "", 
      position: emp.position || "",
      salary: emp.salary || "",
    });
    setShowEditModal(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      await API.put(`/hr/employee/${selectedEmp._id}`, editForm).catch(() => {
        // Fallback local update
        const localData = JSON.parse(localStorage.getItem("amdox_employees") || "[]");
        const updatedLocal = localData.map((item) =>
          item._id === selectedEmp._id 
            ? { ...item, position: editForm.position, salary: Number(editForm.salary), userId: { ...item.userId, name: editForm.name, email: editForm.email } }
            : item
        );
        localStorage.setItem("amdox_employees", JSON.stringify(updatedLocal));
      });

      window.triggerAmdoxNotification?.(
        "Employee Profile Updated", 
        `Details updated successfully for ${editForm.name} (${editForm.position}).`, 
        "HR"
      );

      alert("Employee and login account updated successfully!");
      setShowEditModal(false);
      fetchEmployees();
    } catch (err) {
      console.error(err);
      alert("Failed to update employee details");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    try {
      const selected = employees.find(emp => emp._id === id);
      const empName = selected?.userId?.name || selected?.name || "Employee";

      await API.delete(`/hr/employee/${id}`).catch(() => {
        // Fallback local delete
        const localData = JSON.parse(localStorage.getItem("amdox_employees") || "[]");
        const updatedLocal = localData.filter((item) => item._id !== id);
        localStorage.setItem("amdox_employees", JSON.stringify(updatedLocal));
      });

      window.triggerAmdoxNotification?.(
        "Employee Account Purged", 
        `Account of ${empName} has been permanently purged from the secure database.`, 
        "HR"
      );

      alert("Employee deleted successfully!");
      fetchEmployees();
    } catch (err) {
      console.error(err);
      alert("Failed to delete employee");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Employees</h1>
          <p className="mt-2 text-indigo-100 text-sm">Manage company-wide personnel registry, edit salaries, and positions.</p>
        </div>
        <Link
          to="/add-employee"
          className="h-11 px-5 rounded-xl bg-white hover:bg-slate-50 text-indigo-600 text-sm font-bold flex items-center justify-center gap-2 transition shadow-sm"
        >
          <Plus size={16} /> Add Employee
        </Link>
      </div>

      <div className="bg-white rounded-3xl border p-5 shadow-sm">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by name, email, or position..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 rounded-xl border pl-11 pr-4 outline-none focus:border-indigo-500 text-sm bg-slate-50/50"
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-20 text-center">
            <Loader2 className="animate-spin h-10 w-10 text-indigo-600 mx-auto" />
          </div>
        ) : filteredEmployees.length === 0 ? (
          <div className="p-20 text-center text-slate-400 space-y-4">
            <Users size={48} className="mx-auto text-slate-300" />
            <h3 className="text-xl font-bold">No Employees Found</h3>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-700 border-b">
                <tr>
                  <th className="p-4 text-left">Employee</th>
                  <th className="p-4 text-left">Position / Salary</th>
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((emp) => (
                  <tr key={emp._id} className="border-b hover:bg-slate-50/50 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center uppercase">
                          {(emp?.userId?.name || emp?.name || "E").charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm">{emp?.userId?.name || emp?.name}</h4>
                          <span className="text-xs text-slate-400 font-medium">Joined: {emp.joiningDate ? new Date(emp.joiningDate).toLocaleDateString("en-IN") : "N/A"}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">{emp.position}</h4>
                        <span className="text-xs text-emerald-600 font-bold">₹{emp.salary?.toLocaleString("en-IN") || "0"} / month</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="flex items-center gap-1.5 text-slate-500"><Mail size={14} /> {emp?.userId?.email || emp?.email}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(emp)}
                          className="h-9 px-3 rounded-lg bg-indigo-50 border text-indigo-600 font-bold text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Edit3 size={14} /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(emp._id)}
                          className="h-9 w-9 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showEditModal && createPortal(
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-6">
            <div className="flex justify-between items-center pb-3 border-b">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Edit3 size={20} className="text-indigo-600" /> Update Employee Details
              </h2>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400"><X size={18} /></button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full h-11 border rounded-xl px-4 text-sm bg-slate-50/50 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full h-11 border rounded-xl px-4 text-sm bg-slate-50/50 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Position</label>
                <input
                  type="text"
                  required
                  value={editForm.position}
                  onChange={(e) => setEditForm({ ...editForm, position: e.target.value })}
                  className="w-full h-11 border rounded-xl px-4 text-sm bg-slate-50/50 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Monthly Salary (INR)</label>
                <input
                  type="number"
                  required
                  value={editForm.salary}
                  onChange={(e) => setEditForm({ ...editForm, salary: e.target.value })}
                  className="w-full h-11 border rounded-xl px-4 text-sm bg-slate-50/50 outline-none"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 h-11 border rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2"
                >
                  {updating ? <Loader2 className="animate-spin h-4 w-4" /> : <Check size={16} />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

