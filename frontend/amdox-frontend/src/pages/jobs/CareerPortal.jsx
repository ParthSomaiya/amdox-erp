import { useEffect, useState, useMemo } from "react";
import { MapPin, Briefcase, IndianRupee, Search, Building2, Clock, Sparkles, Loader2, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

export default function CareerPortal() {
  const navigate = useNavigate();

  // ================= STATE =================
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");

  // ================= FETCH JOBS =================
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

  // ================= EXTRACT UNIQUE FILTERS =================
  const uniqueLocations = useMemo(() => {
    const locations = jobs.map((job) => job.location || "Ahmedabad");
    return ["ALL", ...new Set(locations)];
  }, [jobs]);

  // ================= FILTERED JOBS =================
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const jobTitle = job.title?.toLowerCase() || "";
      const jobDesc = job.description?.toLowerCase() || "";
      const jobLocation = job.location || "Ahmedabad";
      const jobType = job.type || "FULL_TIME";
      const searchText = search.toLowerCase();

      const matchesSearch = jobTitle.includes(searchText) || jobDesc.includes(searchText);
      const matchesLocation = locationFilter === "ALL" ? true : jobLocation === locationFilter;
      const matchesType = typeFilter === "ALL" ? true : jobType === typeFilter;

      return matchesSearch && matchesLocation && matchesType;
    });
  }, [jobs, search, locationFilter, typeFilter]);

  // ================= JOB TYPE BADGE FORMATTER =================
  const getJobTypeStyle = (type) => {
    switch (type) {
      case "FULL_TIME":
        return "bg-emerald-50 text-emerald-700 border-emerald-100";
      case "PART_TIME":
        return "bg-amber-50 text-amber-700 border-amber-100";
      case "INTERNSHIP":
        return "bg-blue-50 text-blue-700 border-blue-100";
      case "REMOTE":
        return "bg-purple-50 text-purple-700 border-purple-100";
      default:
        return "bg-slate-50 text-slate-700 border-slate-100";
    }
  };

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      {/* 🚀 WORLD-CLASS HERO BANNER */}
      <div className="relative overflow-hidden rounded-[32px] bg-slate-900 text-white p-10 md:p-14 shadow-xl border border-slate-800">
        {/* Abstract Architectural Glowing Gradients */}
        <div className="absolute top-0 right-0 w-[450px] h-[450px] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-[20%] w-[350px] h-[350px] rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-1.5 text-xs font-bold text-indigo-300">
            <Sparkles size={14} />
            Discover Careers at AMDOX
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1]">
            Find Your
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Dream Career
            </span>
          </h1>

          <p className="text-slate-400 text-base md:text-lg leading-relaxed max-w-xl">
            Join international teams, work on cutting-edge business solutions, and expand your technical boundaries.
          </p>
        </div>
      </div>

      {/* 🔍 FLOATING SEARCH & FILTER CONTAINER */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Search Field */}
        <div className="relative md:col-span-6">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by keywords, titles, or skills..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white outline-none focus:border-indigo-500 text-sm transition-all"
          />
        </div>

        {/* Location Dropdown */}
        <div className="md:col-span-3">
          <select
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
            className="w-full h-12 rounded-xl border border-slate-200 px-4 bg-slate-50/50 outline-none focus:border-indigo-500 text-sm font-semibold text-slate-600 cursor-pointer"
          >
            <option value="ALL">All Locations</option>
            {uniqueLocations.filter(loc => loc !== "ALL").map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Job Type Dropdown */}
        <div className="md:col-span-3">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-full h-12 rounded-xl border border-slate-200 px-4 bg-slate-50/50 outline-none focus:border-indigo-500 text-sm font-semibold text-slate-600 cursor-pointer"
          >
            <option value="ALL">All Job Types</option>
            <option value="FULL_TIME">Full Time</option>
            <option value="PART_TIME">Part Time</option>
            <option value="INTERNSHIP">Internship</option>
            <option value="REMOTE">Remote</option>
          </select>
        </div>
      </div>

      {/* 💼 OPEN POSITIONS */}
      <div className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-2xl font-black text-slate-800">Open Opportunities</h2>
            <p className="text-sm text-slate-400 font-medium">Explore current available roles below</p>
          </div>
          <span className="text-xs text-slate-500 font-bold bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200/50">
            {filteredJobs.length} Positions Available
          </span>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="p-20 text-center">
            <Loader2 className="animate-spin h-10 w-10 text-indigo-600 mx-auto" />
            <p className="mt-4 text-slate-400 font-semibold text-sm">Searching records database...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          /* World-Class Empty State */
          <div className="bg-white rounded-[32px] border border-slate-200/80 p-20 text-center space-y-4 shadow-sm max-w-xl mx-auto">
            <div className="h-16 w-16 rounded-full bg-slate-50 border flex items-center justify-center mx-auto text-2xl">
              🔍
            </div>
            <h3 className="text-xl font-bold text-slate-800">No Positions Found</h3>
            <p className="text-slate-400 text-sm max-w-xs mx-auto">
              We couldn't find any job opportunities matching your current filters. Try relaxing your search criteria.
            </p>
          </div>
        ) : (
          /* Job Opportunities Grid List */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <div
                key={job._id}
                className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between group"
              >
                <div>
                  {/* Top line with category icon */}
                  <div className="flex items-center justify-between">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold border ${getJobTypeStyle(job.type || "FULL_TIME")}`}>
                      {(job.type || "FULL_TIME").replace("_", " ")}
                    </span>
                    <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                      <Building2 size={18} />
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="mt-6 space-y-2">
                    <h3 className="text-xl font-extrabold text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">
                      {job.title}
                    </h3>
                    <p className="text-xs font-semibold text-slate-400">AMDOX Corporate Suite</p>
                    <p className="text-slate-500 text-sm mt-4 leading-relaxed line-clamp-3">
                      {job.description || "No description provided for this opening. Please click details for further specifications."}
                    </p>
                  </div>
                </div>

                {/* Info List & Bottom Button */}
                <div className="mt-8 space-y-4 pt-5 border-t border-slate-100">
                  <div className="grid grid-cols-2 gap-3 text-xs text-slate-500 font-semibold">
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="text-slate-400" />
                      <span>{job.location || "Ahmedabad"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-slate-400" />
                      <span>{job.type || "Full Time"}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm font-bold text-slate-800">
                    <IndianRupee size={15} className="text-emerald-500" />
                    <span>₹{job.salary ? Number(job.salary).toLocaleString() : "Negotiable"}</span>
                  </div>

                  <button
                    onClick={() => navigate(`/apply-job/${job._id}`)}
                    className="w-full h-11 rounded-xl bg-slate-50 group-hover:bg-indigo-600 group-hover:text-white text-slate-700 text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300 shadow-inner"
                  >
                    Apply Now
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}