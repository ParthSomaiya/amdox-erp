import { useEffect, useState, useMemo } from "react";
import { MapPin, IndianRupee, Search, Building2, Clock, Sparkles, Loader2, ArrowRight, ShieldCheck, Bookmark, BookmarkCheck } from "lucide-react";
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
  
  // મિનિમમ અને મેક્સિમમ સેલરી કસ્ટમ સ્ટેટ્સ
  const [minSalary, setMinSalary] = useState("");
  const [maxSalary, setMaxSalary] = useState("");
  const [savedJobs, setSavedJobs] = useState([]);

  useEffect(() => {
    fetchJobs();
    const saved = JSON.parse(localStorage.getItem("amdox_saved_jobs") || "[]");
    setSavedJobs(saved);
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
    setMinSalary("");
    setMaxSalary("");
  };

  // ✅ TOGGLE SAVE JOB FEATURE
  const handleToggleSaveJob = (job) => {
    let updated = [...savedJobs];
    const isAlreadySaved = updated.some(j => j._id === job._id);

    if (isAlreadySaved) {
      updated = updated.filter(j => j._id !== job._id);
    } else {
      updated.push(job);
    }

    setSavedJobs(updated);
    localStorage.setItem("amdox_saved_jobs", JSON.stringify(updated));

    window.triggerAmdoxNotification?.(
      isAlreadySaved ? "Job Unsaved" : "Job Saved", 
      isAlreadySaved ? `You removed ${job.title} from saved list.` : `You saved ${job.title} vacancy!`, 
      "GENERAL"
    );
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const title = job.title?.toLowerCase() || "";
      const desc = job.description?.toLowerCase() || "";
      const company = job.companyName?.toLowerCase() || "";
      const matchesSearch = title.includes(search.toLowerCase()) || desc.includes(search.toLowerCase()) || company.includes(search.toLowerCase());

      const activeTypes = Object.keys(jobTypes).filter(k => jobTypes[k]);
      const matchesType = activeTypes.length === 0 ? true : activeTypes.includes(job.type || "FULL_TIME");

      // 🧠 ડાયનેમિક મિનિમમ અને મેક્સિમમ સેલરી ફિલ્ટર કૅલ્ક્યુલેશન
      const salary = Number(job.salary || 0);
      let matchesSalary = true;
      if (minSalary && salary < Number(minSalary)) {
        matchesSalary = false;
      }
      if (maxSalary && salary > Number(maxSalary)) {
        matchesSalary = false;
      }

      // ડેટ પોસ્ટ (Date Post) ફિલ્ટર
      let matchesDate = true;
      if (dateFilter !== "Anytime" && job.createdAt) {
        const createdDate = new Date(job.createdAt);
        const now = new Date();
        const diffTime = Math.abs(now - createdDate);
        
        if (dateFilter === "Last 24 Hours") {
          const diffHrs = Math.ceil(diffTime / (1000 * 60 * 60));
          matchesDate = diffHrs <= 24;
        } else if (dateFilter === "Last Week") {
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          matchesDate = diffDays <= 7;
        }
      }

      return matchesSearch && matchesType && matchesSalary && matchesDate;
    });
  }, [jobs, search, jobTypes, minSalary, maxSalary, dateFilter]);

  const handleCheckboxChange = (type) => {
    setJobTypes(prev => ({ ...prev, [type]: !prev[type] }));
  };

  return (
    <div className="space-y-6 w-full max-w-full overflow-x-hidden px-2 sm:px-4 box-border">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-[32px] bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 text-white p-5 sm:p-10 md:p-14 shadow-xl border border-slate-800 flex justify-between items-center w-full box-border">
        <div className="absolute top-0 right-0 w-[450px] h-[450px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />
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

      {/* Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl sm:rounded-[24px] p-3 sm:p-4 shadow-sm flex flex-col md:flex-row items-center gap-3 w-full box-border">
        <div className="relative flex-1 w-full">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search job title, company or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 sm:h-12 pl-10 pr-4 rounded-xl border border-slate-200 bg-slate-50/50 outline-none focus:bg-white text-xs sm:text-sm font-semibold text-slate-700"
          />
        </div>
        <button
          onClick={fetchJobs}
          className="h-10 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition cursor-pointer w-full md:w-auto text-center justify-center"
        >
          Search Jobs
        </button>
      </div>

      {/* Main Split Layout */}
      <div className="flex flex-col lg:flex-row gap-6 items-start w-full box-border">
        {/* FILTERS PANEL */}
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
                <input type="checkbox" checked={jobTypes.PART_TIME} onChange={() => handleCheckboxChange("PART_TIME")} className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4" />
                Part-time
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" checked={jobTypes.INTERNSHIP} onChange={() => handleCheckboxChange("INTERNSHIP")} className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4" />
                Internship
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input type="checkbox" checked={jobTypes.REMOTE} onChange={() => handleCheckboxChange("REMOTE")} className="rounded text-indigo-600 focus:ring-indigo-500 h-4 w-4" />
                Remote
              </label>
            </div>
          </div>

          {/* 🧠 DYNAMIC MIN & MAX SALARY INPUT SECTIONS */}
          <div className="space-y-2.5 border-t pt-4">
            <label className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider block">Salary Range (INR)</label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[9px] text-slate-400 font-bold block mb-1">MIN SALARY</span>
                <input
                  type="number"
                  placeholder="Min"
                  value={minSalary}
                  onChange={(e) => setMinSalary(e.target.value)}
                  className="w-full h-9 border border-slate-200 bg-slate-50 rounded-lg px-2 text-xs outline-none focus:bg-white"
                />
              </div>
              <div>
                <span className="text-[9px] text-slate-400 font-bold block mb-1">MAX SALARY</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxSalary}
                  onChange={(e) => setMaxSalary(e.target.value)}
                  className="w-full h-9 border border-slate-200 bg-slate-50 rounded-lg px-2 text-xs outline-none focus:bg-white"
                />
              </div>
            </div>
          </div>
        </aside>

        {/* 💼 RIGHT SIDE JOBS LISTING (૬-૬ ગ્રીડ ફ્રેક્શન લેઆઉટ) */}
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
            // 🔹 પર્ફેક્ટ ડેસ્કટોપ ડબલ કૉલમ ગ્રીડ લેઆઉટ (૬-૬ કૉલમ રેશિયો)
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full box-border">
              {filteredJobs.map((job) => {
                const isSaved = savedJobs.some(j => j._id === job._id);
                return (
                  <div key={job._id} className="bg-white rounded-[24px] border border-slate-200 p-5 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300 hover:-translate-y-1 flex flex-col justify-between h-[230px] w-full box-border overflow-hidden relative">
                    
                    {/* Floating Save Button */}
                    <button 
                      onClick={() => handleToggleSaveJob(job)}
                      className="absolute top-5 right-5 text-slate-400 hover:text-indigo-600 transition cursor-pointer shrink-0 z-10"
                    >
                      {isSaved ? <BookmarkCheck className="text-indigo-600" size={20} /> : <Bookmark size={20} />}
                    </button>

                    <div className="space-y-2 min-w-0 pr-6">
                      <div className="flex items-center gap-2">
                        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold flex items-center justify-center text-sm uppercase shrink-0">
                          {job.title?.charAt(0) || "J"}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-extrabold text-slate-800 text-sm truncate">{job.title}</h3>
                          <p className="text-[10px] text-slate-400 font-bold uppercase truncate">{job.companyName || "AMDOX Corporate Suite"}</p>
                        </div>
                      </div>
                      <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 pt-1">{job.description}</p>
                    </div>

                    <div className="flex items-center justify-between border-t pt-3 mt-2 text-[10px] text-slate-400 font-bold uppercase gap-2">
                      <div className="min-w-0">
                        <span className="text-slate-400 block tracking-wider">Salary</span>
                        <span className="font-black text-slate-800 text-xs sm:text-sm">₹{job.salary?.toLocaleString()}</span>
                      </div>
                      
                      <button onClick={() => navigate(`/apply-job/${job._id}`)} className="h-8.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs cursor-pointer shrink-0">
                        Apply Now
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}