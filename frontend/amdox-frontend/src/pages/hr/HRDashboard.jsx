import { useEffect, useState, useMemo } from "react";
import { Users, FileText, Briefcase, CalendarDays, RefreshCw, Loader2, ArrowUpRight, ShieldCheck, UserPlus, Coins, Layers } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
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
      
      // પ્રોએક્ટિવ ફોલબેક સેટઅપ: સમાંતર રીતે તમામ ડેટા લાઈવ ખેંચવો
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

  // ડાયનેમિક કેલ્ક્યુલેટેડ KPIs
  const stats = useMemo(() => {
    const totalEmployees = employees.length;
    const pendingLeaves = leaves.filter((l) => l.status === "PENDING" || !l.status).length;
    const activeJobs = jobs.length;
    const totalApplicants = applicants.length;

    return { totalEmployees, pendingLeaves, activeJobs, totalApplicants };
  }, [employees, leaves, jobs, applicants]);

  // ચાર્ટ ડેટા કમ્પાઈલેશન
  const chartData = useMemo(() => {
    return [
      { name: "Active Employees", count: stats.totalEmployees || 5 },
      { name: "Hiring Vacancies", count: stats.activeJobs || 3 },
      { name: "Applications Recd", count: stats.totalApplicants || 8 }
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
    <div className="space-y-8">
      {/* 🚀 Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 p-8 rounded-[32px] text-white shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <span className="text-xs uppercase tracking-widest text-indigo-100 font-bold">HR Core Operations</span>
          <h1 className="text-3xl font-black mt-1">HR Control Center</h1>
          <p className="mt-2 text-indigo-100 text-sm">Monitor personnel metrics, evaluate leave structures, and manage recruitment pipeline.</p>
        </div>
        <button
          onClick={fetchDashboardData}
          className="h-12 px-6 rounded-2xl bg-white hover:bg-slate-50 text-indigo-600 text-sm font-bold flex items-center justify-center gap-2 transition shadow-lg shadow-indigo-600/10 hover:scale-[1.02] shrink-0"
        >
          <RefreshCw size={16} /> Refresh Metrics
        </button>
      </div>

      {/* 🚀 KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Employees */}
        <div className="bg-white border rounded-3xl p-6 shadow-sm flex items-center justify-between hover:shadow-md transition">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-bold uppercase">Total Employees</span>
            <h2 className="text-3xl font-black text-slate-800">{stats.totalEmployees}</h2>
          </div>
          <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center"><Users /></div>
        </div>

        {/* Pending Leaves */}
        <div className="bg-white border rounded-3xl p-6 shadow-sm flex items-center justify-between hover:shadow-md transition">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-bold uppercase">Pending Leaves</span>
            <h2 className="text-3xl font-black text-amber-500">{stats.pendingLeaves}</h2>
          </div>
          <div className="h-12 w-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center"><CalendarDays /></div>
        </div>

        {/* Active Jobs */}
        <div className="bg-white border rounded-3xl p-6 shadow-sm flex items-center justify-between hover:shadow-md transition">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-bold uppercase">Active Jobs</span>
            <h2 className="text-3xl font-black text-indigo-600">{stats.activeJobs}</h2>
          </div>
          <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center"><Briefcase /></div>
        </div>

        {/* Total Applicants */}
        <div className="bg-white border rounded-3xl p-6 shadow-sm flex items-center justify-between hover:shadow-md transition">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 font-bold uppercase">Total Candidates</span>
            <h2 className="text-3xl font-black text-emerald-600">{stats.totalApplicants}</h2>
          </div>
          <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><FileText /></div>
        </div>
      </div>

      {/* 🚀 Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side Chart */}
        <div className="lg:col-span-7 bg-white rounded-3xl border p-6 shadow-sm space-y-6">
          <div className="pb-4 border-b">
            <h2 className="text-lg font-bold text-slate-800">Workforce Statistics</h2>
            <p className="text-xs text-slate-400">Comparing active employees, recruitment openings, and candidate pool size</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
              <YAxis stroke="#94a3b8" fontSize={11} />
              <Tooltip />
              <Bar dataKey="count" fill="#4f46e5" radius={[8, 8, 0, 0]} barSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Right Side Quick Actions Terminal */}
        <div className="lg:col-span-5 bg-white border rounded-[32px] p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-slate-800 pb-4 border-b">HR Actions Console</h2>
          
          <div className="space-y-3">
            <button
              onClick={() => navigate("/add-employee")}
              className="w-full h-14 border rounded-2xl p-4 flex items-center justify-between hover:bg-slate-50 transition text-left group"
            >
              <div className="flex items-center gap-3">
                <UserPlus size={18} className="text-indigo-600" />
                <span className="text-xs font-bold text-slate-700">Onboard New Employee</span>
              </div>
              <ArrowUpRight size={16} className="text-slate-400 group-hover:text-indigo-600" />
            </button>

            <button
              onClick={() => navigate("/generate-payroll")}
              className="w-full h-14 border rounded-2xl p-4 flex items-center justify-between hover:bg-slate-50 transition text-left group"
            >
              <div className="flex items-center gap-3">
                <Coins size={18} className="text-indigo-600" />
                <span className="text-xs font-bold text-slate-700">Generate & Credit Salaries</span>
              </div>
              <ArrowUpRight size={16} className="text-slate-400 group-hover:text-indigo-600" />
            </button>

            <button
              onClick={() => navigate("/hr/documents")}
              className="w-full h-14 border rounded-2xl p-4 flex items-center justify-between hover:bg-slate-50 transition text-left group"
            >
              <div className="flex items-center gap-3">
                <Layers size={18} className="text-indigo-600" />
                <span className="text-xs font-bold text-slate-700">Verify Employee Documents</span>
              </div>
              <ArrowUpRight size={16} className="text-slate-400 group-hover:text-indigo-600" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-semibold pt-4">
        <ShieldCheck size={14} /> SaaS Multi-Tenant HR Administration Dashboard Active
      </div>
    </div>
  );
}