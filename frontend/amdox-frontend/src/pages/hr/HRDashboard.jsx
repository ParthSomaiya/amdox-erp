import { useEffect, useState, useMemo } from "react";
import { Users, FileText, Briefcase, CalendarDays, RefreshCw, Loader2, ArrowUpRight, ShieldCheck, UserPlus, Coins, Layers } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import API from "../../services/api";

export default function HRDashboard() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const [empRes, leaveRes, jobRes, appRes] = await Promise.all([
        API.get("/hr/employees").catch(() => ({ data: [] })),
        API.get("/leave").catch(() => ({ data: [] })),
        API.get("/jobs").catch(() => ({ data: [] })),
        API.get("/jobs/applicants").catch(() => ({ data: [] }))
      ]);

      setEmployees(empRes.data || []);
      setLeaves(leaveRes.data || []);
      setJobs(jobRes.data || []);
      setApplicants(appRes.data || []);
    } catch (err) {
      console.error("Dashboard Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const stats = useMemo(() => {
    const totalEmployees = employees.length;
    const pendingLeaves = leaves.filter((l) => l.status === "PENDING" || !l.status).length;
    const activeJobs = jobs.length;
    const totalApplicants = applicants.length;

    return { totalEmployees, pendingLeaves, activeJobs, totalApplicants };
  }, [employees, leaves, jobs, applicants]);

  const chartData = useMemo(() => {
    return [
      { name: "Employees", count: stats.totalEmployees || 5 },
      { name: "Vacancies", count: stats.activeJobs || 3 },
      { name: "Applications", count: stats.totalApplicants || 8 }
    ];
  }, [stats]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-10 w-10 text-indigo-600 mx-auto" />
          <p className="mt-4 text-slate-500 text-sm font-semibold">Aggregating HR Dashboard Metrics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-full overflow-x-hidden px-1">
      {/* 🔹 રિસ્પોન્સિવ હેડર */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 p-5 sm:p-8 rounded-2xl sm:rounded-[32px] text-white shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative overflow-hidden">
        <div className="space-y-1">
          <span className="text-[10px] uppercase tracking-widest text-indigo-100 font-bold">HR Core Operations</span>
          <h1 className="text-xl sm:text-2xl font-black">HR Control Center</h1>
          <p className="text-indigo-100 text-xs leading-relaxed max-w-xl">
            Monitor personnel metrics, evaluate leave structures, and manage recruitment pipeline.
          </p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="h-10 px-4 rounded-xl bg-white hover:bg-slate-50 text-indigo-600 text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-lg shrink-0 w-full sm:w-auto cursor-pointer"
        >
          <RefreshCw size={13} className="shrink-0" /> Refresh Metrics
        </button>
      </div>

      {/* 🔹 રિસ્પોન્સિવ KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Employees */}
        <div className="bg-white border rounded-2xl p-4 sm:p-5 shadow-sm flex items-center justify-between hover:shadow-md transition">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Total Employees</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-800">{stats.totalEmployees}</h2>
          </div>
          <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0"><Users size={18} /></div>
        </div>

        {/* Pending Leaves */}
        <div className="bg-white border rounded-2xl p-4 sm:p-5 shadow-sm flex items-center justify-between hover:shadow-md transition">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Pending Leaves</span>
            <h2 className="text-xl sm:text-2xl font-black text-amber-500">{stats.pendingLeaves}</h2>
          </div>
          <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0"><CalendarDays size={18} /></div>
        </div>

        {/* Active Jobs */}
        <div className="bg-white border rounded-2xl p-4 sm:p-5 shadow-sm flex items-center justify-between hover:shadow-md transition">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Active Jobs</span>
            <h2 className="text-xl sm:text-2xl font-black text-indigo-600">{stats.activeJobs}</h2>
          </div>
          <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0"><Briefcase size={18} /></div>
        </div>

        {/* Total Applicants */}
        <div className="bg-white border rounded-2xl p-4 sm:p-5 shadow-sm flex items-center justify-between hover:shadow-md transition">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase">Total Candidates</span>
            <h2 className="text-xl sm:text-2xl font-black text-emerald-600">{stats.totalApplicants}</h2>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0"><FileText size={18} /></div>
        </div>
      </div>

      {/* 🔹 Split Layout: રિસ્પોન્સિવ ઓવરફ્લો સેટિંગ્સ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start w-full max-w-full overflow-hidden">
        
        {/* Left Side Chart Section */}
        <div className="lg:col-span-7 bg-white rounded-2xl sm:rounded-3xl border p-4 sm:p-6 shadow-sm space-y-4 sm:space-y-6 w-full max-w-full overflow-hidden">
          <div className="pb-3 border-b">
            <h2 className="text-sm sm:text-base font-bold text-slate-800">Workforce Statistics</h2>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">Comparing active employees, recruitment openings, and candidate pool size</p>
          </div>
          
          <div className="h-48 sm:h-64 w-full relative min-w-0 overflow-hidden">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Side Quick Actions Section */}
        <div className="lg:col-span-5 bg-white border rounded-2xl sm:rounded-[32px] p-4 sm:p-6 shadow-sm space-y-4 sm:space-y-6 w-full max-w-full overflow-hidden">
          <h2 className="text-sm sm:text-base font-bold text-slate-800 pb-3 border-b">HR Actions Console</h2>
          
          <div className="space-y-3">
            <button
              onClick={() => navigate("/add-employee")}
              className="w-full h-12 sm:h-14 border rounded-xl sm:rounded-2xl p-3 sm:p-4 flex items-center justify-between hover:bg-slate-50 transition text-left group cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <UserPlus size={16} className="text-indigo-600 shrink-0" />
                <span className="text-xs font-bold text-slate-700 truncate">Onboard New Employee</span>
              </div>
              <ArrowUpRight size={15} className="text-slate-400 group-hover:text-indigo-600 shrink-0" />
            </button>

            <button
              onClick={() => navigate("/generate-payroll")}
              className="w-full h-12 sm:h-14 border rounded-xl sm:rounded-2xl p-3 sm:p-4 flex items-center justify-between hover:bg-slate-50 transition text-left group cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Coins size={16} className="text-indigo-600 shrink-0" />
                <span className="text-xs font-bold text-slate-700 truncate">Generate & Credit Salaries</span>
              </div>
              <ArrowUpRight size={15} className="text-slate-400 group-hover:text-indigo-600 shrink-0" />
            </button>

            <button
              onClick={() => navigate("/hr/documents")}
              className="w-full h-12 sm:h-14 border rounded-xl sm:rounded-2xl p-3 sm:p-4 flex items-center justify-between hover:bg-slate-50 transition text-left group cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Layers size={16} className="text-indigo-600 shrink-0" />
                <span className="text-xs font-bold text-slate-700 truncate">Verify Employee Documents</span>
              </div>
              <ArrowUpRight size={15} className="text-slate-400 group-hover:text-indigo-600 shrink-0" />
            </button>
          </div>
        </div>

      </div>

      <div className="flex items-center justify-center gap-2 text-[10px] sm:text-xs text-slate-400 font-semibold pt-2">
        <ShieldCheck size={13} /> SaaS Multi-Tenant HR Administration Dashboard Active
      </div>
    </div>
  );
}