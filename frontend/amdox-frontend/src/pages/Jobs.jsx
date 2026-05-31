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

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [editForm, setEditForm] = useState({ title: "", description: "", location: "", salary: "", type: "FULL_TIME" });
  const [updating, setUpdating] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    location: "",
    salary: "",
    type: "FULL_TIME",
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await API.get("/jobs");
      setJobs(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createJob = async (e) => {
    e.preventDefault();
    try {
      setCreating(true);
      await API.post("/jobs", { ...form, salary: Number(form.salary) });
      setForm({ title: "", description: "", location: "", salary: "", type: "FULL_TIME" });
      fetchJobs();
      alert("Job vacancy published successfully!");
      notifier.employeeOnboarded(form.title, "Hiring Candidate Campaign");
    } catch (err) {
      console.error(err);
      alert("Failed to create job vacancy");
    } finally {
      setCreating(false);
    }
  };

  const openEditModal = (job) => {
    setSelectedJob(job);
    setEditForm({
      title: job.title || "",
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
      await API.put(`/jobs/${selectedJob._id}`, editForm);
      alert("Job vacancy updated successfully!");
      setShowEditModal(false);
      fetchJobs();
    } catch (err) {
      console.error(err);
      alert("Failed to update job details");
    } finally {
      setUpdating(false);
    }
  };

  const deleteJob = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await API.delete(`/jobs/${id}`);
      alert("Job vacancy deleted successfully!");
      fetchJobs();
    } catch (err) {
      console.error(err);
      alert("Failed to delete job");
    }
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) =>
      job.title?.toLowerCase().includes(search.toLowerCase()) ||
      job.location?.toLowerCase().includes(search.toLowerCase())
    );
  }, [jobs, search]);

  return (
    <div className="space-y-6 font-sans max-w-full overflow-x-hidden px-1">
      {/* Dynamic Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-[32px] p-5 sm:p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-56 h-56 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        <span className="text-[10px] uppercase tracking-widest text-indigo-400 font-bold block mb-1.5">Talent Acquisition Suite</span>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight flex items-center gap-2">
          <Briefcase className="text-indigo-400 shrink-0" size={22} /> Manage Workspace Vacancies
        </h1>
        <p className="mt-1.5 text-slate-400 text-xs sm:text-sm max-w-xl">Create, configure and manage public hiring positions, salary structures, and department requirements.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start w-full max-w-full overflow-hidden">
        
        {/* LEFT SIDE: Clean Structured Form Panel */}
        <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl sm:rounded-[28px] p-4 sm:p-6 shadow-sm space-y-4 sm:space-y-6 w-full max-w-full">
          <div className="pb-3 border-b">
            <h3 className="font-extrabold text-slate-800 text-sm sm:text-base">Draft New Vacancy</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Specify role details, location type, and budget ranges.</p>
          </div>

          <form onSubmit={createJob} className="space-y-3.5 text-[11px] font-semibold text-slate-600">
            <div>
              <label className="block text-slate-500 mb-1 uppercase tracking-wider">Job Title</label>
              <input
                type="text"
                name="title"
                required
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Lead Software Engineer"
                className="w-full h-10 sm:h-11 rounded-xl border border-slate-200 bg-slate-50/50 px-3 sm:px-4 outline-none focus:border-indigo-500 focus:bg-white text-xs sm:text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-slate-500 mb-1 uppercase tracking-wider">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    name="location"
                    required
                    value={form.location}
                    onChange={handleChange}
                    placeholder="Ahmedabad / Remote"
                    className="w-full h-10 sm:h-11 rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-3 outline-none focus:border-indigo-500 focus:bg-white text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 mb-1 uppercase tracking-wider">Job Type</label>
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="w-full h-10 sm:h-11 rounded-xl border border-slate-200 bg-slate-50/50 px-3 outline-none focus:border-indigo-500 text-xs cursor-pointer font-bold text-slate-700"
                >
                  <option value="FULL_TIME">Full Time</option>
                  <option value="PART_TIME">Part Time</option>
                  <option value="INTERNSHIP">Internship</option>
                  <option value="REMOTE">Remote</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-500 mb-1 uppercase tracking-wider">Monthly Budget (INR)</label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="number"
                  name="salary"
                  required
                  value={form.salary}
                  onChange={handleChange}
                  placeholder="e.g. 65000"
                  className="w-full h-10 sm:h-11 rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-4 outline-none focus:border-indigo-500 focus:bg-white text-xs sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-500 mb-1 uppercase tracking-wider">Role Description</label>
              <textarea
                name="description"
                required
                rows={3}
                value={form.description}
                onChange={handleChange}
                placeholder="List skills, qualifications, and core goals..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 sm:p-4 outline-none resize-none focus:border-indigo-500 focus:bg-white text-xs font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={creating}
              className="w-full h-10 sm:h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition disabled:opacity-50 shadow-md cursor-pointer"
            >
              {creating ? <Loader2 className="animate-spin h-3.5 w-3.5" /> : <Plus size={13} />}
              Publish Role Vacancy
            </button>
          </form>
        </div>

        {/* 💼 RIGHT SIDE: LIVE ACTIVE VACANCIES FEED */}
        <div className="lg:col-span-7 space-y-4 w-full max-w-full">
          {/* Search bar card */}
          <div className="bg-white border rounded-xl p-3 sm:p-4 shadow-sm flex items-center gap-2.5">
            <Search size={16} className="text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search active listings..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-grow h-8 outline-none text-xs sm:text-sm bg-transparent text-slate-700 placeholder:text-slate-400"
            />
          </div>

          {loading ? (
            <div className="p-20 text-center"><Loader2 className="animate-spin h-8 w-8 text-indigo-600 mx-auto" /></div>
          ) : filteredJobs.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 border text-center text-slate-400 font-bold space-y-2.5">
              <Briefcase size={32} className="mx-auto text-slate-300" />
              <p className="text-xs">No vacancies match your filters.</p>
            </div>
          ) : (
            <div className="space-y-3.5">
              {filteredJobs.map((job) => (
                <div key={job._id} className="bg-white rounded-xl sm:rounded-2xl border p-4 sm:p-5 shadow-sm hover:shadow-md hover:border-indigo-200/50 transition duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group w-full max-w-full overflow-hidden">
                  <div className="space-y-1.5 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-extrabold text-slate-800 text-xs sm:text-sm group-hover:text-indigo-600 transition truncate">{job.title}</h4>
                      <span className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-100 text-[8px] font-black uppercase">
                        {job.type || "FULL_TIME"}
                      </span>
                    </div>

                    <p className="text-[10px] sm:text-xs text-slate-400 font-semibold flex items-center gap-3 flex-wrap">
                      <span className="flex items-center gap-1"><MapPin size={11} /> {job.location}</span>
                      <span className="flex items-center gap-1 text-emerald-600"><IndianRupee size={11} /> {job.salary?.toLocaleString()} /mo</span>
                    </p>
                    
                    <p className="text-[11px] text-slate-500 leading-relaxed max-w-full line-clamp-2">{job.description}</p>
                  </div>

                  {/* 🔹 બટન્સને મોબાઇલ લેઆઉટ પ્રમાણે ગોઠવ્યા */}
                  <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0 border-t sm:border-t-0 pt-3 sm:pt-0 w-full sm:w-auto justify-end">
                    <button
                      onClick={() => openEditModal(job)}
                      className="h-8 px-3 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-bold text-xs cursor-pointer w-full sm:w-auto text-center"
                    >
                      Configure
                    </button>
                    <button
                      onClick={() => deleteJob(job._id)}
                      className="h-8 w-8 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 flex items-center justify-center border border-rose-100 shrink-0 cursor-pointer"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* EDIT MODAL PORTAL */}
      {showEditModal && createPortal(
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-5 sm:p-6 shadow-2xl space-y-5 animate-fade-in mx-auto">
            <div className="flex justify-between items-center pb-2.5 border-b">
              <h2 className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-1.5">
                <Edit3 size={18} className="text-indigo-600" /> Edit Vacancy Parameters
              </h2>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="space-y-3.5 text-[11px] font-semibold text-slate-700">
              <div>
                <label className="block mb-1 text-slate-500 uppercase tracking-wider">Job Title</label>
                <input
                  type="text"
                  required
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full h-10 border rounded-xl px-3.5 text-xs sm:text-sm bg-slate-50/50 outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-500 uppercase tracking-wider">Location</label>
                <input
                  type="text"
                  required
                  value={editForm.location}
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  className="w-full h-10 border rounded-xl px-3.5 text-xs sm:text-sm bg-slate-50/50 outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-500 uppercase tracking-wider">Salary (INR)</label>
                <input
                  type="number"
                  required
                  value={editForm.salary}
                  onChange={(e) => setEditForm({ ...editForm, salary: e.target.value })}
                  className="w-full h-10 border rounded-xl px-3.5 text-xs sm:text-sm bg-slate-50/50 outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block mb-1 text-slate-500 uppercase tracking-wider">Description</label>
                <textarea
                  required
                  rows={3}
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full rounded-xl border p-3 text-xs font-medium bg-slate-50/50 outline-none resize-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 h-10 border rounded-xl font-bold text-xs text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {updating ? <Loader2 className="animate-spin h-3.5 w-3.5" /> : <Check size={14} />}
                  Save Parameters
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