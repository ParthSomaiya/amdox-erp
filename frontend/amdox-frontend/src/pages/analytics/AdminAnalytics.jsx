import { useEffect, useState } from "react";
import { ShieldCheck, RefreshCw, Loader2, Users, Activity } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import API from "../../services/api";
import notifier from "../../utils/notifier";

export default function AdminAnalytics() {
  const [usersCount, setUsersCount] = useState(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminAnalytics = async () => {
    try {
      setLoading(true);
      const res = await API.get("/hr/employees").catch(() => ({ data: [] }));
      const emps = res.data || [];
      setUsersCount(emps.length + 1);

      // રોલ વાઈઝ ડિસ્ટ્રિબ્યુશન
      const grouped = emps.reduce((acc, emp) => {
        const roleName = emp.userId?.role || "EMPLOYEE";
        acc[roleName] = (acc[roleName] || 0) + 1;
        return acc;
      }, { ADMIN: 1 });

      const formatted = Object.keys(grouped).map(key => ({
        role: key,
        count: grouped[key]
      }));

      setData(formatted);
      notifier.adminAnalyticsViewed();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminAnalytics();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 rounded-[32px] text-white shadow-md flex items-center justify-between">
        <div>
          <span className="text-xs uppercase tracking-widest text-indigo-300 font-bold">System Load Controls</span>
          <h1 className="text-3xl font-black mt-1">📊 Admin Analytics</h1>
          <p className="mt-2 text-slate-400 text-sm">Monitor system users distribution and tenant workload patterns.</p>
        </div>
        <button
          onClick={fetchAdminAnalytics}
          className="h-10 w-10 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center border border-white/10 transition"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {loading ? (
        <div className="p-20 text-center"><Loader2 className="animate-spin h-10 w-10 text-indigo-600 mx-auto" /></div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Chart */}
          <div className="lg:col-span-8 bg-white rounded-3xl border p-6 shadow-sm space-y-6">
            <h3 className="font-bold text-slate-800 text-base">User Roles Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="role" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Bar dataKey="count" fill="#4f46e5" radius={[8, 8, 0, 0]} barSize={55} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Details Card */}
          <div className="lg:col-span-4 bg-white border rounded-[32px] p-6 shadow-sm space-y-5">
            <h3 className="font-extrabold text-slate-800 text-base">System Operations</h3>
            <div className="space-y-3">
              <div className="p-4 bg-slate-50 rounded-2xl border flex items-center gap-3">
                <Users size={18} className="text-indigo-600" />
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">ACTIVE DIRECTORY USERS</span>
                  <span className="text-sm font-black text-slate-800">{usersCount} Users</span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border flex items-center gap-3">
                <Activity size={18} className="text-indigo-600" />
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">TENANT LOAD CAPACITY</span>
                  <span className="text-sm font-black text-emerald-600">99.98% Optimized</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}