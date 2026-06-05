import { useEffect, useState, useMemo } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { Users, Loader2, RefreshCw, CheckCircle2, XCircle, Clock, FileText, ArrowUpRight } from "lucide-react";
import API from "../services/api";

// High-end, accessible semantic color system
const STATUS_CONFIG = {
  HIRED: { color: "#10b981", label: "Hired & Offered", bg: "bg-emerald-50/60", border: "border-emerald-100", text: "text-emerald-700", icon: CheckCircle2 },
  REJECTED: { color: "#f43f5e", label: "Archived / Rejected", bg: "bg-rose-50/60", border: "border-rose-100", text: "text-rose-700", icon: XCircle },
  PENDING: { color: "#f59e0b", label: "Pending Review", bg: "bg-amber-50/60", border: "border-amber-100", text: "text-amber-700", icon: Clock },
  SHORTLISTED: { color: "#3b82f6", label: "Shortlisted", bg: "bg-blue-50/60", border: "border-blue-100", text: "text-blue-700", icon: FileText },
  DEFAULT: { color: "#64748b", label: "Other", bg: "bg-slate-50/60", border: "border-slate-100", text: "text-slate-700", icon: FileText }
};

export default function CandidateAnalytics() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchCandidateStats = async () => {
    try {
      if (data.length > 0) setIsRefreshing(true);
      else setLoading(true);

      const res = await API.get("/jobs/applicants").catch(() => ({ data: [] }));
      const serverApplicants = Array.isArray(res.data) ? res.data : [];

      const localApplicants = JSON.parse(localStorage.getItem("amdox_applicants") || "[]");
      const merged = [...serverApplicants];
      localApplicants.forEach(la => {
        if (!merged.some(sa => sa._id === la._id)) merged.push(la);
      });

      // Statuses Grouping
      const grouped = {};
      merged.forEach((a) => {
        const status = (a.status || "PENDING").toUpperCase();
        grouped[status] = (grouped[status] || 0) + 1;
      });

      const formatted = Object.keys(grouped).map((k) => ({
        name: k,
        value: grouped[k]
      }));

      setData(formatted);
    } catch (err) {
      console.error("Failed to compile candidate analytics:", err);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchCandidateStats();
  }, []);

  // Compute stats safely
  const totalApplicants = useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.value, 0);
  }, [data]);

  const statsBreakdown = useMemo(() => {
    return data.map(item => {
      const config = STATUS_CONFIG[item.name] || STATUS_CONFIG.DEFAULT;
      const percentage = totalApplicants > 0 ? ((item.value / totalApplicants) * 100).toFixed(1) : 0;
      return {
        ...item,
        percentage,
        config
      };
    });
  }, [data, totalApplicants]);

  // Custom tooltips with backdrop blur styling
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      const config = STATUS_CONFIG[dataPoint.name] || STATUS_CONFIG.DEFAULT;
      return (
        <div className="bg-white/90 backdrop-blur-md border border-slate-200/80 p-3 rounded-xl shadow-lg animate-in fade-in zoom-in-95 duration-100">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{config.label}</p>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-sm font-extrabold text-slate-950">{dataPoint.value}</span>
            <span className="text-xs font-semibold text-slate-500">Candidates</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-1 font-sans antialiased">
      {/* Premium Dashboard Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 px-6 py-7 sm:px-8 sm:py-8 rounded-3xl text-white shadow-md border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md border border-white/10">
                <Users size={18} className="text-indigo-200" />
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                Candidate Analytics
              </h1>
            </div>
            <p className="text-indigo-200/70 text-xs mt-2 font-medium max-w-md">
              Real-time application funnel tracking, status breakdowns, and pipeline distribution.
            </p>
          </div>
          <button 
            onClick={fetchCandidateStats} 
            disabled={loading || isRefreshing}
            className="self-end sm:self-auto h-10 px-4 bg-white/10 hover:bg-white/15 active:scale-95 text-white border border-white/15 rounded-xl flex items-center gap-2 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw size={13} className={isRefreshing || loading ? "animate-spin" : ""} />
            <span>Sync Stats</span>
          </button>
        </div>
      </div>

      {/* Analytics Visualization and Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Side: Donut Chart Frame */}
        <div className="md:col-span-5 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs flex flex-col justify-between relative overflow-hidden min-h-[360px]">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="font-bold text-slate-900 text-sm tracking-tight">Status Distribution</h3>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">Visual allocation of candidate statuses</p>
          </div>

          {loading ? (
            <div className="flex-grow flex flex-col items-center justify-center gap-3">
              <Loader2 className="animate-spin text-indigo-600" size={24} />
              <span className="text-xs font-semibold text-slate-400">Loading visualizations...</span>
            </div>
          ) : data.length === 0 ? (
            <div className="flex-grow flex flex-col items-center justify-center text-center p-8">
              <div className="p-3 bg-slate-50 text-slate-400 rounded-2xl mb-2 border border-slate-100">
                <Users size={20} />
              </div>
              <p className="text-xs text-slate-400 italic">No active application logs found.</p>
            </div>
          ) : (
            <div className="relative flex-grow flex items-center justify-center py-4">
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie 
                      data={data} 
                      dataKey="value" 
                      nameKey="name" 
                      cx="50%" 
                      cy="50%" 
                      innerRadius={72} 
                      outerRadius={92} 
                      paddingAngle={4}
                      cornerRadius={4}
                    >
                      {data.map((entry, index) => {
                        const config = STATUS_CONFIG[entry.name] || STATUS_CONFIG.DEFAULT;
                        return (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={config.color} 
                            stroke="rgba(255,255,255,0.8)"
                            strokeWidth={2}
                          />
                        );
                      })}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Central Text Panel */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none mt-2">
                <span className="block text-3xl font-extrabold text-slate-900 tracking-tight leading-none">
                  {totalApplicants}
                </span>
                <span className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  Total Leads
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Metrics Inventory Cards */}
        <div className="md:col-span-7 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-xs flex flex-col justify-between min-h-[360px]">
          <div>
            <div className="border-b border-slate-100 pb-4 mb-4">
              <h3 className="font-bold text-slate-900 text-sm tracking-tight">Funnel Breakdown</h3>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">Categorized details & candidate representation percentages</p>
            </div>

            {loading ? (
              <div className="space-y-3 py-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-14 bg-slate-50 border border-slate-100 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : data.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-400 italic">No metrics to compile.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {statsBreakdown.map((item, index) => {
                  const Icon = item.config.icon;
                  return (
                    <div 
                      key={index}
                      className={`p-3.5 border rounded-2xl flex items-center justify-between transition-all duration-150 hover:shadow-xs group hover:bg-slate-50/50 ${item.config.bg} ${item.config.border}`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`p-2 bg-white rounded-xl shadow-xs shrink-0 ${item.config.text}`}>
                          <Icon size={14} className="stroke-[2.5]" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                            {item.config.label}
                          </span>
                          <span className="text-sm font-extrabold text-slate-900 tracking-tight mt-0.5 block">
                            {item.value} <span className="text-[11px] font-medium text-slate-500">Profiles</span>
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-right shrink-0">
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-white shadow-xs border border-slate-100 ${item.config.text} flex items-center gap-0.5`}>
                          <span>{item.percentage}%</span>
                          <ArrowUpRight size={10} className="stroke-[2.5]" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] sm:text-xs text-slate-400 font-medium">
            <span>Dynamic updates from client and server repositories</span>
            <span className="font-bold text-slate-500">Verified System Audit</span>
          </div>
        </div>

      </div>
    </div>
  );
}