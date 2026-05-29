import { useEffect, useState, useMemo } from "react";
import { Users, Briefcase, CalendarDays, IndianRupee, ArrowUpRight, Clock, Plus, CheckCircle2, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // ================= STATE =================
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    totalEmployees: 120,
    activeProjects: 18,
    attendanceRate: "95%",
    monthlyBudget: "₹8.4L",
    activities: [
      {
        id: 1,
        title: "New Employee Onboarding",
        description: "John Doe joined the Engineering department",
        time: "2 min ago",
        type: "plus"
      },
      {
        id: 2,
        title: "Payroll Cycles Processed",
        description: "April payroll cycle finalized and validated",
        time: "1 hour ago",
        type: "check"
      }
    ]
  });

  // ================= DYNAMIC DATA FETCHING =================
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Try fetching from the master dashboard endpoint
        const res = await API.get("/dashboard");
        if (res.data && res.data.success) {
          setDashboardData(res.data);
        } else {
          throw new Error("Master dashboard endpoint bypassed");
        }
      } catch (err) {
        console.warn("Using fallback analytics endpoints to populate metrics:", err.message);
        
        // Parallel fallback queries to individual module endpoints
        try {
          const [hrRes, projectRes] = await Promise.all([
            API.get("/hr/analytics"),
            API.get("/projects")
          ]);

          setDashboardData((prev) => ({
            ...prev,
            totalEmployees: hrRes.data?.totalEmployees ?? prev.totalEmployees,
            activeProjects: Array.isArray(projectRes.data) ? projectRes.data.length : prev.activeProjects,
          }));
        } catch (subErr) {
          console.warn("Fallback sub-endpoints not fully reachable:", subErr.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // ================= MEMOIZED STATS GRID =================
  const stats = useMemo(() => [
    {
      title: "Total Employees",
      value: dashboardData.totalEmployees,
      change: "+4.75%",
      isPositive: true,
      icon: <Users size={22} className="text-indigo-600" />,
      bg: "bg-indigo-50",
    },
    {
      title: "Active Projects",
      value: dashboardData.activeProjects,
      change: "+12.5%",
      isPositive: true,
      icon: <Briefcase size={22} className="text-sky-600" />,
      bg: "bg-sky-50",
    },
    {
      title: "Attendance Rate",
      value: dashboardData.attendanceRate,
      change: "-0.2%",
      isPositive: false,
      icon: <CalendarDays size={22} className="text-emerald-600" />,
      bg: "bg-emerald-50",
    },
    {
      title: "Monthly Budget",
      value: dashboardData.monthlyBudget,
      change: "+8.2%",
      isPositive: true,
      icon: <IndianRupee size={22} className="text-amber-600" />,
      bg: "bg-amber-50",
    },
  ], [dashboardData]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 border-t-transparent animate-spin text-indigo-600 mx-auto" />
          <p className="mt-4 text-slate-500 font-semibold text-sm">Aggregating live analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 p-8 md:p-10 text-white shadow-sm border border-indigo-700/10">
        <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <span className="text-xs uppercase tracking-widest text-indigo-200 font-bold">Workspace Overview</span>
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">Welcome back, {user?.name || "Administrator"}</h1>
          <p className="text-indigo-100 text-sm max-w-xl">
            Here is what's happening across your AMDOX workspace modules today.
          </p>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div className="space-y-2">
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{item.title}</span>
              <h3 className="text-2xl font-bold text-slate-800">{item.value}</h3>
              <div className="flex items-center gap-1.5 text-xs">
                <span className={item.isPositive ? "text-emerald-600 font-bold" : "text-rose-500 font-bold"}>
                  {item.change}
                </span>
                <span className="text-slate-400 font-medium">vs last month</span>
              </div>
            </div>
            <div className={`h-12 w-12 rounded-xl ${item.bg} flex items-center justify-center shadow-inner`}>
              {item.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Recent Activity Logs */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Workspace Activities</h2>
              <p className="text-xs text-slate-400 font-medium">Updates occurring across all modules</p>
            </div>
            <button className="h-10 w-10 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 flex items-center justify-center border border-slate-200 transition">
              <ArrowUpRight size={18} />
            </button>
          </div>

          <div className="space-y-4">
            {dashboardData.activities?.map((activity) => (
              <div key={activity.id} className="flex items-start justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                <div className="flex items-start gap-3">
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                    activity.type === "plus" ? "bg-indigo-50 text-indigo-600" : "bg-emerald-50 text-emerald-600"
                  }`}>
                    {activity.type === "plus" ? <Plus size={18} /> : <CheckCircle2 size={18} />}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">{activity.title}</h4>
                    <p className="text-xs text-slate-500 mt-1">{activity.description}</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                  <Clock size={12} /> {activity.time}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm text-center space-y-6">
          <div className="mx-auto h-20 w-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-md shadow-indigo-100">
            {user?.name?.charAt(0)?.toUpperCase() || "A"}
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-800">{user?.name || "Workspace Admin"}</h3>
            <p className="text-xs text-slate-400 font-medium">{user?.email || "admin@amdox.com"}</p>
          </div>

          <span className="inline-flex px-3.5 py-1.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
            {user?.role || "ADMIN"}
          </span>
        </div>

      </div>
    </div>
  );
}