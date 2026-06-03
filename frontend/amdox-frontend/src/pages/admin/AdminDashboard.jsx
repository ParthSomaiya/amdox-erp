import { useEffect, useState, useMemo } from "react";
import { Loader2, Users, Building, ShieldCheck, TrendingUp, Award } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import API from "../../services/api";
import notifier from "../../utils/notifier";

export default function AdminDashboard() {
  const [employeesCount, setEmployeesCount] = useState(0);
  const [tenantsCount, setTenantsCount] = useState(0);
  const [projectsCount, setProjectsCount] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  
  const [financeData, setFinanceData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDynamicAdminStats = async () => {
      try {
        setLoading(true);

        // 🚀 ડાયનેમિક ડેટા લોડર્સ: તમામ સક્રિય ટેબલ્સ એકસાથે લોડ કરો
        const [empRes, tenantRes, invoiceRes, projectRes] = await Promise.all([
          API.get("/hr/employees").catch(() => ({ data: [] })),
          API.get("/admin/tenant-analytics").catch(() => ({ data: { totalTenants: 1 } })),
          API.get("/finance/invoice").catch(() => ({ data: [] })),
          API.get("/projects").catch(() => ({ data: [] }))
        ]);

        // ૧. યુઝર્સની લાઈવ સંખ્યા ગણો
        const emps = empRes.data || [];
        setEmployeesCount(emps.length + 1); // એડમિન પ્લસ સાથે

        // ૨. ટેનન્ટ્સની સંખ્યા સિંક કરો
        setTenantsCount(tenantRes.data?.totalTenants || 1);

        // ૩. પ્રોજેક્ટ્સની સંખ્યા ગણો
        const projs = projectRes.data || [];
        setProjectsCount(projs.length);

        // ૪. રિયલ-ટાઇમ પેઇડ ઇન્વોઇસીસની કિંમતનો સરવાળો કરો (SaaS Revenue)
        const invoices = invoiceRes.data || [];
        const paidInvoices = invoices.filter(inv => inv.status === "PAID");
        const calculatedRevenue = paidInvoices.reduce((sum, inv) => sum + (inv.amount || 0), 0);
        setTotalRevenue(calculatedRevenue);

        // ૫. આલેખ માટે લાઈવ મંથલી ઇન્વોઇસ રેવન્યુ કમ્પાઈલ કરો
        const monthlyRevenueMap = {};
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const currentMonthIndex = new Date().getMonth();
        const last6Months = months.slice(Math.max(0, currentMonthIndex - 5), currentMonthIndex + 1);
        
        last6Months.forEach(m => { monthlyRevenueMap[m] = 0; });

        paidInvoices.forEach(inv => {
          if (inv.createdAt) {
            const monthName = new Date(inv.createdAt).toLocaleString("default", { month: "short" });
            if (monthlyRevenueMap[monthName] !== undefined) {
              monthlyRevenueMap[monthName] += (inv.amount || 0);
            }
          }
        });

        const formattedChart = Object.keys(monthlyRevenueMap).map(key => ({
          month: key,
          revenue: monthlyRevenueMap[key]
        }));


        setFinanceData(formattedChart.some(d => d.revenue > 0) ? formattedChart : defaultChart);

        notifier.adminDashboardViewed();

      } catch (err) {
        console.error("Failed to load admin stats dynamically:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDynamicAdminStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-8 rounded-[32px] text-white shadow-md">
        <span className="text-xs uppercase tracking-widest text-indigo-300 font-bold">Workspace Master Controls</span>
        <h1 className="text-3xl font-black mt-1">👑 Admin Dashboard</h1>
        <p className="mt-2 text-slate-400 text-sm">Monitor multi-tenant database operations, collected SaaS revenues, and system assets.</p>
      </div>

      {loading ? (
        <div className="p-20 text-center">
          <Loader2 className="animate-spin h-10 w-10 text-indigo-600 mx-auto" />
        </div>
      ) : (
        <>
          {/* KPI Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white border rounded-3xl p-6 shadow-sm flex items-center justify-between hover:shadow-md transition">
              <div>
                <span className="text-xs text-slate-400 font-bold uppercase block">Total Users</span>
                <h2 className="text-3xl font-black text-slate-800 mt-2">{employeesCount}</h2>
              </div>
              <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center"><Users /></div>
            </div>

            <div className="bg-white border rounded-3xl p-6 shadow-sm flex items-center justify-between hover:shadow-md transition">
              <div>
                <span className="text-xs text-slate-400 font-bold uppercase block">Tenants</span>
                <h2 className="text-3xl font-black text-slate-800 mt-2">{tenantsCount}</h2>
              </div>
              <div className="h-12 w-12 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center"><Building /></div>
            </div>

            <div className="bg-white border rounded-3xl p-6 shadow-sm flex items-center justify-between hover:shadow-md transition">
              <div>
                <span className="text-xs text-slate-400 font-bold uppercase block">SaaS Revenue</span>
                <h2 className="text-3xl font-black text-emerald-600 mt-2">₹{totalRevenue?.toLocaleString("en-IN")}</h2>
              </div>
              <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center"><TrendingUp /></div>
            </div>

            <div className="bg-white border rounded-3xl p-6 shadow-sm flex items-center justify-between hover:shadow-md transition">
              <div>
                <span className="text-xs text-slate-400 font-bold uppercase block">Active Projects</span>
                <h2 className="text-3xl font-black text-slate-800 mt-2">{projectsCount}</h2>
              </div>
              <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center"><ShieldCheck /></div>
            </div>
          </div>

          {/* Revenue Chart */}
          <div className="bg-white rounded-3xl border p-6 shadow-sm space-y-6">
            <div className="pb-4 border-b">
              <h2 className="text-lg font-bold text-slate-800">SaaS Live Revenue Analytics</h2>
              <p className="text-xs text-slate-400">Monthly subscription income compiled across all integrated database tenants</p>
            </div>
            <ResponsiveContainer width="100%" height={380}>
              <LineChart data={financeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={3.5} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}