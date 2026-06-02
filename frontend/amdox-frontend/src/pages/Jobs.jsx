import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import API from "../services/api";
import { Plus, Briefcase, MapPin, IndianRupee, Trash2, Search, Loader2, Edit3, X, Check } from "lucide-react";
import notifier from "../utils/notifier";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    salary: "",
    type: "FULL_TIME",
  });

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
      const localJobs = JSON.parse(localStorage.getItem("amdox_jobs") || "[]");
      setJobs(localJobs);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createJob = async (e) => {
    e.preventDefault();
    const newJob = {
      _id: `job-${Date.now()}`,
      title: form.title,
      description: form.description,
      location: form.location,
      salary: Number(form.salary),
      type: form.type,
      createdAt: new Date().toISOString()
    };

    try {
      setCreating(true);

      // બેકએન્ડ પોસ્ટ રિકવેસ્ટ
      await API.post("/jobs", { ...form, salary: Number(form.salary) });

      const localJobs = JSON.parse(localStorage.getItem("amdox_jobs") || "[]");
      localStorage.setItem("amdox_jobs", JSON.stringify([newJob, ...localJobs]));

      alert("Job vacancy published successfully!");
      setForm({ title: "", description: "", location: "", salary: "", type: "FULL_TIME" });
      fetchJobs();
    } catch (err) {
      console.warn("API Error, saving job locally.");
      
      const localJobs = JSON.parse(localStorage.getItem("amdox_jobs") || "[]");
      localStorage.setItem("amdox_jobs", JSON.stringify([newJob, ...localJobs]));

      alert("Job vacancy published successfully (Demo Mode)!");
      setForm({ title: "", description: "", location: "", salary: "", type: "FULL_TIME" });
      fetchJobs();
    } finally {
      setCreating(false);
    }
  };

  const deleteJob = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await API.delete(`/jobs/${id}`).catch(() => {
        const localJobs = JSON.parse(localStorage.getItem("amdox_jobs") || "[]");
        const updated = localJobs.filter(j => j._id !== id);
        localStorage.setItem("amdox_jobs", JSON.stringify(updated));
      });
      alert("Job vacancy deleted successfully!");
      fetchJobs();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) =>
      job.title?.toLowerCase().includes(search.toLowerCase()) ||
      job.location?.toLowerCase().includes(search.toLowerCase())
    );
  }, [jobs, search]);

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border rounded-[32px] p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-56 h-56 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        <span className="text-[10px] uppercase tracking-widest text-indigo-400 font-bold block mb-1.5">Talent Acquisition Suite</span>
        <h1 className="text-3xl font-black tracking-tight flex items-center gap-2"><Briefcase className="text-indigo-400" /> Manage Workspace Vacancies</h1>
        <p className="mt-1.5 text-slate-400 text-xs sm:text-sm max-w-xl">Create, configure and manage public hiring positions, salary structures, and department requirements.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
        <div className="lg:col-span-5 bg-white border rounded-[28px] p-6 shadow-sm space-y-4 sm:space-y-6">
          <h3 className="font-extrabold text-slate-800 text-base">Draft New Vacancy</h3>
          <form onSubmit={createJob} className="space-y-3.5 text-[11px] font-semibold text-slate-600">
            <div>
              <label className="block mb-1">Job Title</label>
              <input type="text" name="title" required value={form.title} onChange={handleChange} placeholder="e.g. Lead Software Engineer" className="w-full h-11 rounded-xl border bg-slate-50/50 px-4 outline-none focus:bg-white" />
            </div>
            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="block mb-1">Location</label>
                <input type="text" name="location" required value={form.location} onChange={handleChange} placeholder="Remote" className="w-full h-11 rounded-xl border bg-slate-50/50 px-4 outline-none focus:bg-white" />
              </div>
              <div>
                <label className="block mb-1">Job Type</label>
                <select name="type" value={form.type} onChange={handleChange} className="w-full h-11 rounded-xl border bg-slate-50/50 px-3 outline-none text-xs cursor-pointer font-bold text-slate-700">
                  <option value="FULL_TIME">Full Time</option>
                  <option value="PART_TIME">Part Time</option>
                  <option value="INTERNSHIP">Internship</option>
                  <option value="REMOTE">Remote</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block mb-1">Monthly Budget (INR)</label>
              <input type="number" name="salary" required value={form.salary} onChange={handleChange} placeholder="e.g. 65000" className="w-full h-11 rounded-xl border bg-slate-50/50 px-4 outline-none focus:bg-white" />
            </div>
            <div>
              <label className="block mb-1">Role Description</label>
              <textarea name="description" required rows={3} value={form.description} onChange={handleChange} placeholder="Specify requirements..." className="w-full rounded-xl border bg-slate-50/50 p-4 outline-none resize-none focus:bg-white" />
            </div>
            <button type="submit" disabled={creating} className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition">
              {creating ? <Loader2 className="animate-spin h-3.5 w-3.5" /> : "+ Publish Role Vacancy"}
            </button>
          </form>
        </div>

        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border rounded-xl p-4 shadow-sm flex items-center gap-2.5">
            <Search size={16} className="text-slate-400" />
            <input type="text" placeholder="Search active listings..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-grow h-8 outline-none text-sm bg-transparent" />
          </div>

          {loading ? (
            <div className="p-20 text-center"><Loader2 className="animate-spin h-8 w-8 text-indigo-600 mx-auto" /></div>
          ) : filteredJobs.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 border text-center text-slate-400 font-bold">No active vacancies.</div>
          ) : (
            <div className="space-y-3.5">
              {filteredJobs.map((job) => (
                <div key={job._id} className="bg-white rounded-2xl border p-5 flex justify-between items-center group">
                  <div className="space-y-1.5">
                    <h4 className="font-extrabold text-slate-800 text-sm group-hover:text-indigo-600 transition">{job.title}</h4>
                    <p className="text-[10px] text-slate-400 font-semibold flex items-center gap-3">
                      <span>{job.location}</span>
                      <span className="text-emerald-600">₹{job.salary?.toLocaleString()} /mo</span>
                    </p>
                    <p className="text-xs text-slate-500 line-clamp-2">{job.description}</p>
                  </div>
                  <button onClick={() => deleteJob(job._id)} className="h-9 w-9 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center border border-rose-100 shrink-0">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}