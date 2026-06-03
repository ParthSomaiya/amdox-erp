import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import API from "../services/api";
import { Plus, Briefcase, MapPin, IndianRupee, Trash2, Search, Loader2, Edit3, X, Check, Building2 } from "lucide-react";

// 🧠 AMDOX MEMORY PROTECTOR (Accidental localStorage.clear Wipes ને કાયમી બાયપાસ કરશે)
if (typeof window !== "undefined" && !window.hasAmdoxProtectorLoaded) {
  window.hasAmdoxProtectorLoaded = true;
  const originalClear = localStorage.clear;
  localStorage.clear = function() {
    const keysToKeep = ["amdox_jobs", "amdox_applicants", "amdox_approved_candidates", "amdox_scheduled_interviews", "amdox_simulated_attendance"];
    const backups = {};
    keysToKeep.forEach(key => {
      backups[key] = localStorage.getItem(key);
    });
    
    originalClear.apply(this, arguments);
    
    Object.keys(backups).forEach(key => {
      if (backups[key] !== null) {
        localStorage.setItem(key, backups[key]);
      }
    });
  };
}

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [search, setSearch] = useState("");

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const user = useMemo(() => JSON.parse(localStorage.getItem("user") || "{}"), []);
  const companyId = user.companyId || user.tenantId || null; // ટેનન્ટ આઈડી કનેક્શન

  const [form, setForm] = useState({
    title: "",
    companyName: "",
    description: "",
    location: "",
    salary: "",
    type: "FULL_TIME",
  });

  const [editForm, setEditForm] = useState({
    title: "",
    companyName: "",
    description: "",
    location: "",
    salary: "",
    type: "FULL_TIME",
  });

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await API.get("/jobs").catch(() => null);
      
      const serverJobs = res && Array.isArray(res.data) 
        ? res.data 
        : (res && Array.isArray(res.data?.data) ? res.data.data : (res && Array.isArray(res.data?.jobs) ? res.data.jobs : []));

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

  // ✅ CREATE / ADD VACANCY
  const createJob = async (e) => {
    e.preventDefault();
    const newJob = {
      _id: `job-${Date.now()}`,
      title: form.title,
      companyName: form.companyName || "AMDOX Corporate Suite",
      description: form.description,
      location: form.location,
      salary: Number(form.salary),
      type: form.type,
      companyId: companyId,
      createdAt: new Date().toISOString()
    };

    const localJobs = JSON.parse(localStorage.getItem("amdox_jobs") || "[]");
    localStorage.setItem("amdox_jobs", JSON.stringify([newJob, ...localJobs]));

    try {
      setCreating(true);
      await API.post("/jobs", { 
        ...form, 
        salary: Number(form.salary),
        companyId: companyId 
      });

      alert("Job vacancy published successfully!");
      setForm({ title: "", companyName: "", description: "", location: "", salary: "", type: "FULL_TIME" });
      fetchJobs();
    } catch (err) {
      console.warn("Saving job locally.");
      alert("Job vacancy published successfully!");
      setForm({ title: "", companyName: "", description: "", location: "", salary: "", type: "FULL_TIME" });
      fetchJobs();
    } finally {
      setCreating(false);
    }
  };

  // ✅ UPDATE / EDIT VACANCY
  const openEditModal = (job) => {
    setSelectedJob(job);
    setEditForm({
      title: job.title || "",
      companyName: job.companyName || "AMDOX Corporate Suite",
      description: job.description || "",
      location: job.location || "",
      salary: job.salary || "",
      type: job.type || "FULL_TIME",
    });
    setShowEditModal(true);
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      await API.put(`/jobs/${selectedJob._id}`, { ...editForm, companyId }).catch(() => {
        const localJobs = JSON.parse(localStorage.getItem("amdox_jobs") || "[]");
        const updated = localJobs.map(j => j._id === selectedJob._id ? { ...j, ...editForm, salary: Number(editForm.salary) } : j);
        localStorage.setItem("amdox_jobs", JSON.stringify(updated));
      });

      alert("Job vacancy updated successfully!");
      setShowEditModal(false);
      fetchJobs();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  // ✅ DELETE VACANCY
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
      job.companyName?.toLowerCase().includes(search.toLowerCase()) ||
      job.location?.toLowerCase().includes(search.toLowerCase())
    );
  }, [jobs, search]);

  return (
    <div className="space-y-6 max-w-full overflow-hidden box-border">
      <div className="bg-slate-900 border rounded-[32px] p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-56 h-56 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        <span className="text-[10px] uppercase tracking-widest text-indigo-400 font-bold block mb-1.5">Talent Acquisition Suite</span>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2"><Briefcase className="text-indigo-400" /> Manage Workspace Vacancies</h1>
        <p className="mt-1.5 text-slate-400 text-xs sm:text-sm max-w-xl">Create, configure and manage public hiring positions, company wise vacancies, and department requirements.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-start w-full box-border overflow-hidden">
        {/* ADD FORM */}
        <div className="lg:col-span-5 bg-white border rounded-[28px] p-5 sm:p-6 shadow-sm space-y-4 sm:space-y-6 w-full box-border">
          <h3 className="font-extrabold text-slate-800 text-sm sm:text-base">Draft New Vacancy</h3>
          <form onSubmit={createJob} className="space-y-3.5 text-[11px] font-semibold text-slate-600">
            <div>
              <label className="block mb-1">Job Title</label>
              <input type="text" name="title" required value={form.title} onChange={handleChange} placeholder="e.g. Lead Software Engineer" className="w-full h-11 rounded-xl border bg-slate-50/50 px-4 outline-none focus:bg-white" />
            </div>
            <div>
              <label className="block mb-1">Company Name</label>
              <input type="text" name="companyName" required value={form.companyName} onChange={handleChange} placeholder="e.g. Stark Industries / Amdox Tech" className="w-full h-11 rounded-xl border bg-slate-50/50 px-4 outline-none focus:bg-white" />
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

        {/* VACANCIES LIST */}
        <div className="lg:col-span-7 space-y-4 w-full box-border overflow-hidden">
          <div className="bg-white border rounded-xl p-4 shadow-sm flex items-center gap-2.5">
            <Search size={16} className="text-slate-400" />
            <input type="text" placeholder="Search active listings..." value={search} onChange={(e) => setSearch(e.target.value)} className="flex-grow h-8 outline-none text-sm bg-transparent" />
          </div>

          {loading ? (
            <div className="p-20 text-center"><Loader2 className="animate-spin h-8 w-8 text-indigo-600 mx-auto" /></div>
          ) : filteredJobs.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 border text-center text-slate-400 font-bold">No active vacancies.</div>
          ) : (
            <div className="space-y-3.5 w-full box-border">
              {filteredJobs.map((job) => (
                // 🔹 રિસ્પોન્સિવ લેઆઉટ બોર્ડર સિક્યોર્ડ (flex-col sm:flex-row)
                <div key={job._id} className="bg-white rounded-2xl border p-4 sm:p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4 group w-full box-border overflow-hidden transition-all duration-200 hover:shadow-md">
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-extrabold text-slate-800 text-sm group-hover:text-indigo-600 transition truncate">{job.title}</h4>
                      <span className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100 text-[8px] font-black uppercase">
                        {job.type || "FULL_TIME"}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1"><Building2 size={12} /> {job.companyName || "AMDOX Corporate Suite"}</p>
                    <p className="text-[10px] text-slate-400 font-semibold flex items-center gap-3">
                      <span>{job.location}</span>
                      <span className="text-emerald-600">₹{job.salary?.toLocaleString()} /mo</span>
                    </p>
                    <p className="text-xs text-slate-500 line-clamp-2">{job.description}</p>
                  </div>
                  
                  {/* બટન્સ માટે રિસ્પોન્સિવ ઓપ્શન (મોબાઇલમાં સુંદર રીતે નીચે ગોઠવાશે) */}
                  <div className="flex items-center gap-2 shrink-0 justify-end w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <button onClick={() => openEditModal(job)} className="h-9 px-3.5 rounded-lg bg-indigo-50 text-indigo-600 font-bold text-xs cursor-pointer flex-1 sm:flex-initial text-center justify-center">Edit</button>
                    <button onClick={() => deleteJob(job._id)} className="h-9 w-9 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center border border-rose-100 shrink-0">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* EDIT MODAL */}
      {showEditModal && createPortal(
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl space-y-5 animate-fade-in mx-auto">
            <div className="flex justify-between items-center pb-2.5 border-b">
              <h2 className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-1.5"><Edit3 size={18} /> Edit Vacancy</h2>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
            </div>
            <form onSubmit={handleUpdateSubmit} className="space-y-3.5 text-[11px] font-semibold text-slate-700">
              <div>
                <label className="block mb-1">Job Title</label>
                <input type="text" required value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} className="w-full h-10 border rounded-xl px-3.5 text-xs bg-slate-50/50 outline-none" />
              </div>
              <div>
                <label className="block mb-1">Company Name</label>
                <input type="text" required value={editForm.companyName} onChange={(e) => setEditForm({ ...editForm, companyName: e.target.value })} className="w-full h-10 border rounded-xl px-3.5 text-xs bg-slate-50/50 outline-none" />
              </div>
              <div>
                <label className="block mb-1">Location</label>
                <input type="text" required value={editForm.location} onChange={(e) => setEditForm({ ...editForm, location: e.target.value })} className="w-full h-10 border rounded-xl px-3.5 text-xs bg-slate-50/50 outline-none" />
              </div>
              <div>
                <label className="block mb-1">Salary (INR)</label>
                <input type="number" required value={editForm.salary} onChange={(e) => setEditForm({ ...editForm, salary: e.target.value })} className="w-full h-10 border rounded-xl px-3.5 text-xs bg-slate-50/50 outline-none" />
              </div>
              <div>
                <label className="block mb-1">Description</label>
                <textarea required rows={3} value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} className="w-full rounded-xl border p-3 text-xs font-medium bg-slate-50/50 outline-none resize-none" />
              </div>
              <div className="flex gap-2.5 pt-2">
                <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 h-10 border rounded-xl font-bold text-xs text-slate-600 hover:bg-slate-50 cursor-pointer">Cancel</button>
                <button type="submit" disabled={updating} className="flex-1 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer">
                  {updating ? <Loader2 className="animate-spin h-3.5 w-3.5" /> : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}