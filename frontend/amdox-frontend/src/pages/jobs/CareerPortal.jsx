import { useEffect, useState, useMemo } from "react";
import { MapPin, Briefcase, IndianRupee, Search, Building2, Clock, Sparkles, Loader2, ArrowRight, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

export default function CareerPortal() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // ફિલ્ટર સ્ટેટ્સ (AMDOX Premium થીમ મુજબ)
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("Anytime");
  const [jobTypes, setJobTypes] = useState({
    FULL_TIME: false,
    PART_TIME: false,
    INTERNSHIP: false,
    REMOTE: false
  });
  const [salaryFilter, setSalaryFilter] = useState("ALL");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await API.get("/jobs");
      setJobs(res.data || []);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  // ફિલ્ટર ક્લીયર કરવાનું ફંક્શન
  const handleClearAll = () => {
    setSearch("");
    setDateFilter("Anytime");
    setJobTypes({ FULL_TIME: false, PART_TIME: false, INTERNSHIP: false, REMOTE: false });
    setSalaryFilter("ALL");
  };

  // મલ્ટી-લેવલ ડાયનેમિક ફિલ્ટરિંગ
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // ૧. કીવર્ડ સર્ચ
      const title = job.title?.toLowerCase() || "";
      const desc = job.description?.toLowerCase() || "";
      const matchesSearch = title.includes(search.toLowerCase()) || desc.includes(search.toLowerCase());

      // ૨. જોબ ટાઇપ ફિલ્ટર (Checkboxes)
      const activeTypes = Object.keys(jobTypes).filter(k => jobTypes[k]);
      const matchesType = activeTypes.length === 0 ? true : activeTypes.includes(job.type || "FULL_TIME");

      // ૩. સેલરી રેન્જ ફિલ્ટર
      const salary = Number(job.salary || 0);
      let matchesSalary = true;
      if (salaryFilter === "UNDER_30K") matchesSalary = salary < 30000;
      else if (salaryFilter === "30K_TO_60K") matchesSalary = salary >= 30000 && salary <= 60000;
      else if (salaryFilter === "OVER_60K") matchesSalary = salary > 60000;

      return matchesSearch && matchesType && matchesSalary;
    });
  }, [jobs, search, jobTypes, salaryFilter]);

  const handleCheckboxChange = (type) => {
    setJobTypes(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const getJobTypeStyle = (type) => {
    switch (type) {
      case "FULL_TIME": return "bg-indigo-50 text-indigo-700 border-indigo-100";
      case "PART_TIME": return "bg-purple-50 text-purple-700 border-purple-100";
      case "INTERNSHIP": return "bg-blue-50 text-blue-700 border-blue-100";
      case "REMOTE": return "bg-slate-100 text-slate-700 border-slate-200";
      default: return "bg-slate-50 text-slate-700 border-slate-100";
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* 🚀 Brand Aligned Hero Banner with Indigo/Purple Geometric Graphics */}
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 text-white p-10 md:p-14 shadow-xl border border-slate-800 flex justify-between items-center">
        <div className="absolute top-0 right-0 w-[450px] h-[450px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />
        
        {/* Left Side Info */}
        <div className="relative z-10 max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-1.5 text-xs font-bold text-indigo-300">
            <Sparkles size={14} /> Discover Careers at AMDOX
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
            Find your dream job
          </h1>
          <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-lg">
            Looking for jobs? Browse our latest job openings to view & apply to the best jobs today!
          </p>
        </div>

        {/* Right Side Geometric Shapes - Aligned with Indigo/Purple (Brand Matching) */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 hidden lg:flex items-center justify-end overflow-hidden pointer-events-none">
          <div className="w-[180px] h-[300px] bg-gradient-to-br from-indigo-500 to-purple-600 rotate-[35deg] rounded-3xl translate-x-12 -translate-y-8 shadow-2xl" />
          <div className="w-[140px] h-[250px] bg-slate-800 rotate-[35deg] rounded-3xl translate-x-2 translate-y-12 border border-slate-700" />
        </div>
      </div>

      {/* 🚀 Search & Filter Toolbar */}
      <div className="bg-white border rounded-[24px] p-4 shadow-sm flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search job title or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-12 pl-12 pr-4 rounded-xl border bg-slate-50/50 outline-none focus:bg-white text-sm font-semibold text-slate-700"
          />
        </div>
        <button
          onClick={fetchJobs}
          className="h-12 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold flex items-center justify-center gap-2 transition"
        >
          Search Jobs
        </button>
      </div>

      {/* 🚀 Main Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* 🔍 LEFT SIDE FILTERS PANEL */}
        <aside className="lg:col-span-3 bg-white border rounded-[28px] p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b pb-4">
            <h3 className="font-extrabold text-slate-800 text-base">Filter</h3>
            <button onClick={handleClearAll} className="text-xs font-bold text-rose-500 hover:underline">
              Clear all
            </button>
          </div>

          {/* Date Post */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Date Post</label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full h-11 rounded-xl border px-3 bg-slate-50/50 outline-none text-xs font-bold text-slate-600 cursor-pointer"
            >
              <option value="Anytime">Anytime</option>
              <option value="Last 24 Hours">Last 24 Hours</option>
              <option value="Last Week">Last Week</option>
            </select>
          </div>

          {/* Job Type Checkboxes (Brand color: Indigo) */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Job Type</label>
            <div className="space-y-2 text-xs font-bold text-slate-600">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" checked={jobTypes.FULL_TIME} onChange={() => handleCheckboxChange("FULL_TIME")} className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4 accent-indigo-600" />
                Full-time
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" checked={jobTypes.PART_TIME} onChange={() => handleCheckboxChange("PART_TIME")} className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4 accent-indigo-600" />
                Part-time
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" checked={jobTypes.INTERNSHIP} onChange={() => handleCheckboxChange("INTERNSHIP")} className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4 accent-indigo-600" />
                Internship
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" checked={jobTypes.REMOTE} onChange={() => handleCheckboxChange("REMOTE")} className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4 accent-indigo-600" />
                Remote
              </label>
            </div>
          </div>

          {/* Range Salary Checkboxes */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Range Salary</label>
            <div className="space-y-2 text-xs font-bold text-slate-600">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="radio" name="salary" checked={salaryFilter === "ALL"} onChange={() => setSalaryFilter("ALL")} className="text-indigo-600 focus:ring-indigo-500 h-4 w-4 accent-indigo-600" />
                All Ranges
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="radio" name="salary" checked={salaryFilter === "UNDER_30K"} onChange={() => setSalaryFilter("UNDER_30K")} className="text-indigo-600 focus:ring-indigo-500 h-4 w-4 accent-indigo-600" />
                Under ₹30,000
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="radio" name="salary" checked={salaryFilter === "30K_TO_60K"} onChange={() => setSalaryFilter("30K_TO_60K")} className="text-indigo-600 focus:ring-indigo-500 h-4 w-4 accent-indigo-600" />
                ₹30,000 - ₹60,000
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="radio" name="salary" checked={salaryFilter === "OVER_60K"} onChange={() => setSalaryFilter("OVER_60K")} className="text-indigo-600 focus:ring-indigo-500 h-4 w-4 accent-indigo-600" />
                Over ₹60,000
              </label>
            </div>
          </div>
        </aside>

        {/* 💼 RIGHT SIDE JOBS LISTING */}
        <main className="lg:col-span-9 space-y-6">
          <div className="flex justify-between items-center">
            <span className="text-sm font-extrabold text-slate-500">{filteredJobs.length} Jobs results</span>
          </div>

          {loading ? (
            <div className="p-20 text-center">
              <Loader2 className="animate-spin h-10 w-10 text-indigo-600 mx-auto" />
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="bg-white rounded-[32px] border p-20 text-center space-y-4 shadow-sm">
              <Building2 className="mx-auto text-slate-300" size={48} />
              <h3 className="text-xl font-bold">No Openings Found</h3>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <div key={job._id} className="bg-white rounded-3xl border p-6 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300 hover:-translate-y-1.5 flex flex-col md:flex-row justify-between gap-6 group">
                  
                  {/* Left Metadata Info */}
                  <div className="flex items-start gap-4 flex-1">
                    {/* Circle Brand Icon (Brand Color: Indigo to Purple gradient) */}
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold flex items-center justify-center text-lg uppercase shrink-0">
                      {job.title?.charAt(0) || "J"}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-black text-slate-800 group-hover:text-indigo-600 transition">{job.title}</h3>
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black bg-rose-50 text-rose-700 border border-rose-100">
                          Urgently hiring
                        </span>
                      </div>
                      
                      <p className="text-xs font-bold text-slate-400">AMDOX Corporate Suite</p>
                      
                      {/* Short Description */}
                      <p className="text-slate-500 text-xs leading-relaxed pt-2 line-clamp-2">{job.description}</p>

                      {/* Bottom row badges */}
                      <div className="flex items-center gap-4 pt-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        <span className="flex items-center gap-1"><MapPin size={12} /> {job.location || "Ahmedabad"}</span>
                        <span className="flex items-center gap-1"><Clock size={12} /> {job.type || "Full Time"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Action & Salary Panel */}
                  <div className="flex flex-col justify-between items-end shrink-0 md:border-l pl-0 md:pl-6 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block">Monthly Budget</span>
                      <span className="font-extrabold text-slate-800 text-base flex items-center justify-end gap-1 mt-1">
                        <IndianRupee size={14} className="text-indigo-600" />
                        {job.salary ? Number(job.salary).toLocaleString("en-IN") : "Negotiable"}
                      </span>
                    </div>

                    <button
                      onClick={() => navigate(`/apply-job/${job._id}`)}
                      className="h-10 px-5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs flex items-center gap-1.5 mt-4 transition shadow-sm"
                    >
                      Apply Now <ArrowRight size={12} />
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}