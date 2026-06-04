import { useEffect, useState } from "react";
import { Briefcase, MapPin, IndianRupee, ArrowRight, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function CareerPage() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/jobs")
      .then((res) => setJobs(res.data || []))
      .catch(() => {
        // જો સર્વર ઓફલાઇન હોય તો લાઈવ મોક જોબ્સ
        setJobs([
          { _id: "j1", title: "Frontend Developer (React)", description: "Experience in building high-fidelity dynamic single page applications.", salary: 45000, location: "Ahmedabad" },
          { _id: "j2", title: "Full Stack Engineer (Node.js)", description: "Experience with Express, MongoDB, and workflow automations.", salary: 65000, location: "Remote" }
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8 max-w-6xl mx-auto font-sans p-1">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-[32px] text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        <h1 className="text-3xl font-black flex items-center gap-2">💼 AMDOX Careers Portal</h1>
        <p className="text-slate-400 text-sm mt-1">Explore job opportunities and join our high-performance team.</p>
      </div>

      {loading ? (
        <div className="p-20 text-center"><Loader2 className="animate-spin text-indigo-600 mx-auto" /></div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6 w-full">
          {jobs.map((job) => (
            <div key={job._id} className="bg-white border p-6 rounded-[28px] shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h2 className="text-lg font-extrabold text-slate-800">{job.title}</h2>
                <p className="text-xs text-slate-500 leading-relaxed">{job.description}</p>
                <div className="flex gap-4 text-[10px] text-slate-400 font-bold uppercase pt-1">
                  <span className="flex items-center gap-1"><MapPin size={11} /> {job.location || "Ahmedabad"}</span>
                  <span className="flex items-center gap-1 text-emerald-600"><IndianRupee size={11} /> {job.salary?.toLocaleString()} /mo</span>
                </div>
              </div>

              <button
                onClick={() => navigate(`/apply-job/${job._id}`)}
                className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition"
              >
                Apply Now <ArrowRight size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}