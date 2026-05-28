import { useEffect, useState } from "react";
import { Loader2, ShieldCheck, Building2, Users, Radio } from "lucide-react";
import API from "../../services/api";

export default function TenantManagement() {
  const [analytics, setAnalytics] = useState({
    totalTenants: 0,
    totalUsers: 0,
    activeUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await API.get("/admin/tenant-analytics");
      const data = res.data || {};
      setAnalytics({
        totalTenants: data.totalTenants ?? 0,
        totalUsers: data.totalUsers ?? 0,
        activeUsers: data.activeUsers ?? 0,
      });
    } catch (err) {
      console.error("Tenant analytics error:", err);
      setError("Failed to load tenant analytics. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto" />
          <h2 className="text-xl font-bold mt-6 text-slate-700">Loading SaaS Metrics...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 p-5 rounded-2xl">
          <p className="font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 rounded-3xl p-8 text-white shadow-md">
        <h1 className="text-3xl font-extrabold tracking-tight">Tenant Control Center</h1>
        <p className="mt-2 text-indigo-100">Monitor SaaS instances, database tenants, and active system operations.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Tenants</span>
            <h2 className="text-4xl font-black text-indigo-600 mt-2">{analytics.totalTenants}</h2>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Building2 size={22} />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Provisioned Users</span>
            <h2 className="text-4xl font-black text-slate-800 mt-2">{analytics.totalUsers}</h2>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center">
            <Users size={22} />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Active Sessions</span>
            <h2 className="text-4xl font-black text-emerald-600 mt-2">{analytics.activeUsers}</h2>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Radio size={22} className="animate-pulse" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 pt-6 border-t border-slate-100 text-xs text-slate-400 font-medium">
        <ShieldCheck size={14} />
        <span>SaaS Multi-Tenant Management Center Active</span>
      </div>
    </div>
  );
}