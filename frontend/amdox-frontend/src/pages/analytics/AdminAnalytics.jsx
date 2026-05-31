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
    <div className="space-y-6 max-w-full overflow-x-hidden px-1">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 sm:p-8 rounded-2xl sm:rounded-[32px] text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden">
        <div className="space-y-1">
          <span className="text-[10px] uppercase tracking-widest text-indigo-300 font-bold">System Load Controls</span>
          <h1 className="text-xl sm:text-2xl font-black">📊 Admin Analytics</h1>
          <p className="text-slate-400 text-xs mt-1.5">Monitor system users distribution and tenant workload patterns.</p>
        </div>
        <button
          onClick={fetchAdminAnalytics}
          className="h-9 w-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center border border-white/10 transition cursor-pointer self-start sm:self-center shrink-0"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {loading ? (
        <div className="p-20 text-center"><Loader2 className="animate-spin h-10 w-10 text-indigo-600 mx-auto" /></div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full max-w-full overflow-hidden">
          
          {/* Chart Section */}
          <div className="lg:col-span-8 bg-white rounded-2xl sm:rounded-3xl border p-4 sm:p-6 shadow-sm space-y-4 sm:space-y-6 w-full max-w-full overflow-hidden">
            <h3 className="font-bold text-slate-800 text-sm sm:text-base">User Roles Distribution</h3>
            
            <div className="h-48 sm:h-[300px] w-full relative min-w-0 overflow-hidden">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="role" stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={10} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Details Card */}
          <div className="lg:col-span-4 bg-white border rounded-2xl sm:rounded-[32px] p-4 sm:p-5 shadow-sm space-y-4 sm:space-y-5 w-full max-w-full overflow-hidden">
            <h3 className="font-extrabold text-slate-800 text-sm sm:text-base">System Operations</h3>
            <div className="space-y-3">
              <div className="p-3.5 bg-slate-50 rounded-xl sm:rounded-2xl border border-slate-100 flex items-center gap-3">
                <Users size={16} className="text-indigo-600 shrink-0" />
                <div>
                  <span className="text-[9px] text-slate-400 font-bold block uppercase">Active Directory Users</span>
                  <span className="text-xs sm:text-sm font-black text-slate-800">{usersCount} Users</span>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl sm:rounded-2xl border border-slate-100 flex items-center gap-3">
                <Activity size={16} className="text-indigo-600 shrink-0" />
                <div>
                  <span className="text-[9px] text-slate-400 font-bold block uppercase">Tenant Load Capacity</span>
                  <span className="text-xs sm:text-sm font-black text-emerald-600">99.98% Optimized</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      <div className="flex items-center justify-center gap-1.5 text-[10px] sm:text-xs text-slate-400 font-semibold pt-2">
        <ShieldCheck size={13} className="text-indigo-600 shrink-0" /> SaaS Multi-Tenant Cloud Administrator Suite Active
      </div>
    </div>
  );
}