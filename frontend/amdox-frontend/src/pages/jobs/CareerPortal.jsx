import { useEffect, useState, useMemo } from "react";
import { MapPin, IndianRupee, Search, Building2, Clock, Sparkles, Loader2, ArrowRight, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

export default function CareerPortal() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // ફિલ્ટર સ્ટેટ્સ
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
      const res = await API.get("/jobs").catch(() => null);
      const serverJobs = res && Array.isArray(res.data) ? res.data : [];

      const localJobs = JSON.parse(localStorage.getItem("amdox_jobs") || "[]");
      const merged = [...serverJobs];
      localJobs.forEach((item) => {
        if (!merged.some((m) => m._id === item._id)) {
          merged.push(item);
        }
      });

      setJobs(merged);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
      const localJobs = JSON.parse(localStorage.getItem("amdox_jobs") || "[]");
      setJobs(localJobs);
    } finally {
      setLoading(false);
    }
  };

  const handleClearAll = () => {
    setSearch("");
    setDateFilter("Anytime");
    setJobTypes({ FULL_TIME: false, PART_TIME: false, INTERNSHIP: false, REMOTE: false });
    setSalaryFilter("ALL");
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const title = job.title?.toLowerCase() || "";
      const desc = job.description?.toLowerCase() || "";
      const matchesSearch = title.includes(search.toLowerCase()) || desc.includes(search.toLowerCase());

      const activeTypes = Object.keys(jobTypes).filter(k => jobTypes[k]);
      const matchesType = activeTypes.length === 0 ? true : activeTypes.includes(job.type || "FULL_TIME");

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

  return (
    <div className="space-y-6 w-full max-w-full overflow-x-hidden px-2 sm:px-4 box-border">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-[32px] bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 text-white p-5 sm:p-10 md:p-14 shadow-xl border border-slate-800 flex justify-between items-center w-full box-border">
        <div className="absolute top-0 right-0 w-[450px] h-[450px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />

        {/* Left Side Info */}
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3.5 py-1 text-[10px] font-bold text-indigo-300">
            <Sparkles size={12} /> Discover Careers at AMDOX
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
            Find your dream job
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-lg">
            Looking for jobs? Browse our latest job openings to view & apply to the best jobs today!
          </p>
        </div>

        {/* Right Side Geometric Shapes */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 hidden lg:flex items-center justify-end overflow-hidden pointer-events-none">
          <div className="w-[180px] h-[300px] bg-gradient-to-br from-indigo-500 to-purple-600 rotate-[35deg] rounded-3xl translate-x-12 -translate-y-8 shadow-2xl" />
          <div className="w-[140px] h-[250px] bg-slate-800 rotate-[35deg] rounded-3xl translate-x-2 translate-y-12 border border-slate-700" />
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white border border-slate-200 rounded-xl sm:rounded-[24px] p-3 sm:p-4 shadow-sm flex flex-col md:flex-row items-center gap-3 w-full box-border">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search job title or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 sm:h-12 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50/50 outline-none focus:bg-white text-xs sm:text-sm font-semibold text-slate-700"
          />
        </div>
        <button
          onClick={fetchJobs}
          className="h-10 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition cursor-pointer w-full md:w-auto text-center justify-center animate-pulse"
        >
          Search Jobs
        </button>
      </div>

      {/* 🚀 Main Split Layout (Ultimate Flexbox fix for mobile devices) */}
      <div className="flex flex-col lg:flex-row gap-6 items-start w-full box-border">

        {/* 🔍 LEFT SIDE FILTERS PANEL */}
        <aside className="w-full lg:w-[300px] bg-white border border-slate-200 rounded-2xl sm:rounded-[28px] p-4 sm:p-6 shadow-sm space-y-5 shrink-0 box-border">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-800 text-sm sm:text-base">Filter</h3>
            <button onClick={handleClearAll} className="text-[11px] font-bold text-rose-500 hover:underline cursor-pointer">
              Clear all
            </button>
          </div>

          {/* Date Post */}
          <div className="space-y-1.5">
            <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider block">Date Post</label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full h-10 rounded-xl border border-slate-200 px-3 bg-slate-50/50 outline-none text-xs font-bold text-slate-600 cursor-pointer"
            >
              <option value="Anytime">Anytime</option>
              <option value="Last 24 Hours">Last 24 Hours</option>
              <option value="Last Week">Last Week</option>
            </select>
          </div>

          {/* Job Type Checkboxes */}
          <div className="space-y-2.5">
            <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider block">Job Type</label>
            <div className="space-y-2 text-xs font-bold text-slate-600">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" checked={jobTypes.FULL_TIME} onChange={() => handleCheckboxChange("FULL_TIME")} className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4 accent-indigo-600 cursor-pointer" />
                Full-time
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" checked={jobTypes.PART_TIME} onChange={() => handleCheckboxChange("PART_TIME")} className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4 accent-indigo-600 cursor-pointer" />
                Part-time
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" checked={jobTypes.INTERNSHIP} onChange={() => handleCheckboxChange("INTERNSHIP")} className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4 accent-indigo-600 cursor-pointer" />
                Internship
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" checked={jobTypes.REMOTE} onChange={() => handleCheckboxChange("REMOTE")} className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4 accent-indigo-600 cursor-pointer" />
                Remote
              </label>
            </div>
          </div>

          {/* Range Salary Checkboxes */}
          <div className="space-y-2.5">
            <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider block">Range Salary</label>
            <div className="space-y-2 text-xs font-bold text-slate-600">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="radio" name="salary" checked={salaryFilter === "ALL"} onChange={() => setSalaryFilter("ALL")} className="text-indigo-600 focus:ring-indigo-500 h-4 w-4 accent-indigo-600 cursor-pointer" />
                All Ranges
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="radio" name="salary" checked={salaryFilter === "UNDER_30K"} onChange={() => setSalaryFilter("UNDER_30K")} className="text-indigo-600 focus:ring-indigo-500 h-4 w-4 accent-indigo-600 cursor-pointer" />
                Under ₹30,000
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="radio" name="salary" checked={salaryFilter === "30K_TO_60K"} onChange={() => setSalaryFilter("30K_TO_60K")} className="text-indigo-600 focus:ring-indigo-500 h-4 w-4 accent-indigo-600 cursor-pointer" />
                ₹30,000 - ₹60,000
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="radio" name="salary" checked={salaryFilter === "OVER_60K"} onChange={() => setSalaryFilter("OVER_60K")} className="text-indigo-600 focus:ring-indigo-500 h-4 w-4 accent-indigo-600 cursor-pointer" />
                Over ₹60,000
              </label>
            </div>
          </div>
        </aside>

        {/* 💼 RIGHT SIDE JOBS LISTING (Takes remaining space and has min-width safeguard) */}
        <main className="flex-1 w-full min-w-0 space-y-4 box-border">
          <div className="flex justify-between items-center">
            <span className="text-xs sm:text-sm font-extrabold text-slate-500">{filteredJobs.length} Jobs results</span>
          </div>

          {loading ? (
            <div className="p-20 text-center">
              <Loader2 className="animate-spin h-8 w-8 text-indigo-600 mx-auto" />
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="bg-white rounded-2xl p-16 border border-slate-200 text-center space-y-3.5 shadow-sm w-full box-border">
              <Building2 className="mx-auto text-slate-300" size={40} />
              <h3 className="text-base font-bold text-slate-700">No Openings Found</h3>
            </div>
          ) : (
            <div className="space-y-4 w-full box-border">
              {filteredJobs.map((job) => (
                <div key={job._id} className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300 hover:-translate-y-1 flex flex-col md:flex-row justify-between gap-4 w-full box-border overflow-hidden">

                  {/* Left Metadata Info */}
                  <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold flex items-center justify-center text-base sm:text-lg uppercase shrink-0">
                      {job.title?.charAt(0) || "J"}
                    </div>

                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base sm:text-lg font-black text-slate-800 group-hover:text-indigo-600 transition truncate">{job.title}</h3>
                        <span className="px-2 py-0.5 rounded-full text-[8px] sm:text-[9px] font-black bg-rose-50 text-rose-700 border border-rose-100 shrink-0">
                          Urgently hiring
                        </span>
                      </div>

                      <p className="text-[10px] sm:text-xs font-bold text-slate-400">AMDOX Corporate Suite</p>
                      <p className="text-slate-500 text-xs leading-relaxed pt-1.5 line-clamp-2">{job.description}</p>

                      <div className="flex items-center gap-4 pt-2.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider flex-wrap">
                        <span className="flex items-center gap-1 shrink-0"><MapPin size={11} /> {job.location || "Ahmedabad"}</span>
                        <span className="flex items-center gap-1 shrink-0"><Clock size={11} /> {job.type || "Full Time"}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Side Action Panel */}
                  <div className="flex flex-row md:flex-col justify-between items-center md:items-end shrink-0 md:border-l pl-0 md:pl-6 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 w-full md:w-auto gap-4">
                    <div className="text-left md:text-right min-w-0">
                      <span className="text-[10px] text-slate-400 font-bold uppercase block tracking-wider">Monthly Budget</span>
                      <span className="font-black text-slate-800 text-sm sm:text-base flex items-center md:justify-end gap-1 mt-0.5 truncate">
                        <IndianRupee size={12} className="text-indigo-600 shrink-0" />
                        {job.salary ? Number(job.salary).toLocaleString("en-IN") : "Negotiable"}
                      </span>
                    </div>

                    <button
                      onClick={() => navigate(`/apply-job/${job._id}`)}
                      className="h-9 px-4.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition shadow-sm cursor-pointer shrink-0 w-full sm:w-auto text-center justify-center"
                    >
                      Apply Now <ArrowRight size={11} />
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-center gap-1 text-[9px] sm:text-xs text-slate-400 font-semibold pt-2 text-center px-4">
        <ShieldCheck size={12} className="text-indigo-600 shrink-0" />
        <span className="truncate">Secure AMDOX Careers Portal Verification Active</span>
      </div>
    </div>
  );
}