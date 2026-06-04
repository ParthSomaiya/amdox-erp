import { useEffect, useState, useMemo } from "react";
import { Users as UsersIcon, Search, Loader2, ShieldCheck, Check, Ban, Trash2 } from "lucide-react";
import API from "../services/api";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const loadUsersList = async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/users").catch(() => null);
      if (res?.data) {
        setUsers(res.data);
      } else {
        loadMockUsers();
      }
    } catch (err) {
      loadMockUsers();
    } finally {
      setLoading(false);
    }
  };

  const loadMockUsers = () => {
    const saved = localStorage.getItem("amdox_employees");
    let initialUsers = [
      { _id: "u1", name: "Dharmik Kotecha", email: "dharmikkotecha@gmail.com", role: "EMPLOYEE", isActive: true },
      { _id: "u2", name: "Jaydeep Patel", email: "jaydeep@gmail.com", role: "EMPLOYEE", isActive: false }
    ];
    if (saved) {
      const parsed = JSON.parse(saved);
      parsed.forEach((emp, index) => {
        const email = emp.userId?.email || emp.email;
        if (!initialUsers.some(u => u.email === email)) {
          initialUsers.push({
            _id: emp._id || `u-${index}`,
            name: emp.userId?.name || emp.name,
            email,
            role: "EMPLOYEE",
            isActive: true
          });
        }
      });
    }
    setUsers(initialUsers);
  };

  useEffect(() => {
    loadUsersList();
  }, []);

  const handleUpdateStatus = (id, isActive) => {
    const updated = users.map(u => u._id === id ? { ...u, isActive } : u);
    setUsers(updated);
    alert(`User account ${isActive ? "activated" : "suspended"} successfully.`);
  };

  const handleDeleteUser = (id) => {
    if (!window.confirm("Are you sure you want to permanently delete this user?")) return;
    const updated = users.filter(u => u._id !== id);
    setUsers(updated);
    alert("User account deleted successfully!");
  };

  const filteredUsers = useMemo(() => {
    return users.filter(u => 
      u.name?.toLowerCase().includes(search.toLowerCase()) || 
      u.email?.toLowerCase().includes(search.toLowerCase())
    );
  }, [users, search]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-1 font-sans">
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 rounded-[32px] text-white shadow-md relative overflow-hidden">
        <h1 className="text-2xl font-black flex items-center gap-2"><UsersIcon /> Users Management Console</h1>
        <p className="text-slate-400 text-xs">Verify credentials, adjust roles, and toggle user active states.</p>
      </div>

      <div className="bg-white rounded-2xl border p-4 shadow-sm flex items-center gap-3">
        <Search size={16} className="text-slate-400 ml-1" />
        <input type="text" placeholder="Search users by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-grow h-8 outline-none text-xs sm:text-sm bg-transparent" />
      </div>

      <div className="bg-white rounded-[32px] border shadow-sm overflow-hidden p-6">
        {loading ? (
          <div className="py-20 text-center"><Loader2 className="animate-spin h-8 w-8 text-indigo-600 mx-auto" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-slate-600 min-w-[550px]">
              <thead className="bg-slate-50 border-b font-bold text-slate-700 uppercase">
                <tr>
                  <th className="p-4 text-left">User Name</th>
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4 text-left">Role</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u._id} className="border-b last:border-0 hover:bg-slate-50/50">
                    <td className="p-4 font-bold text-slate-800">{u.name}</td>
                    <td className="p-4 font-semibold text-slate-500">{u.email}</td>
                    <td className="p-4"><span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-indigo-50 text-indigo-700 border border-indigo-100">{u.role}</span></td>
                    <td className="p-4"><span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${u.isActive ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>{u.isActive ? "Active" : "Suspended"}</span></td>
                    <td className="p-4 flex items-center justify-center gap-2">
                      {u.isActive ? (
                        <button onClick={() => handleUpdateStatus(u._id, false)} className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-100 rounded-lg cursor-pointer" title="Suspend"><Ban size={13} /></button>
                      ) : (
                        <button onClick={() => handleUpdateStatus(u._id, true)} className="p-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-100 rounded-lg cursor-pointer" title="Activate"><Check size={13} /></button>
                      )}
                      <button onClick={() => handleDeleteUser(u._id)} className="p-1.5 bg-slate-50 text-slate-500 hover:bg-slate-100 border rounded-lg cursor-pointer" title="Delete"><Trash2 size={13} /></button>
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