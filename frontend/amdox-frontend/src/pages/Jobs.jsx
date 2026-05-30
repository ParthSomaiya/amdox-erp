import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import API from "../services/api";
import { Plus, Briefcase, MapPin, IndianRupee, Trash2, Search, Building2, Users, Loader2, Edit3, X, Check, FileText } from "lucide-react";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState("");

  // Edit modal states
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
      await API.put(`/jobs/${selectedJob._id}`, editForm); // 🔹 PUT /api/jobs/:id
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
      await API.delete(`/jobs/${id}`); // 🔹 DELETE /api/jobs/:id
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
    <div className="space-y-8">
      {/* 🚀 Hero Banner */}
      <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 rounded-[32px] p-10 text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <span className="text-xs uppercase tracking-widest text-indigo-100 font-bold">Workspace Recruitment</span>
        <h1 className="text-3xl md:text-4xl font-black mt-1">Recruitment Portal</h1>
        <p className="mt-2 text-indigo-100 text-sm">Create, edit, and publish professional company-wide job openings.</p>
      </div>

      {/* 🚀 CREATE FORM CARD */}
      <div className="bg-white rounded-[32px] shadow-sm border p-8 space-y-6">
        <div className="flex items-center gap-3 pb-4 border-b">
          <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Plus size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">Publish New Job Opening</h2>
            <p className="text-xs text-slate-400">Onboard new hiring campaigns with salary metrics</p>
          </div>
        </div>

        <form onSubmit={createJob} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Job Title</label>
              <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                <input
                  type="text"
                  name="title"
                  required
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g. Lead Software Engineer"
                  className="w-full h-12 rounded-xl border pl-11 pr-4 outline-none focus:border-indigo-500 text-sm bg-slate-50/50"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Location</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                <input
                  type="text"
                  name="location"
                  required
                  value={form.location}
                  onChange={handleChange}
                  placeholder="e.g. Remote / Ahmedabad"
                  className="w-full h-12 rounded-xl border pl-11 pr-4 outline-none focus:border-indigo-500 text-sm bg-slate-50/50"
                />
              </div>
            </div>

            {/* Salary */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Monthly Budget (INR)</label>
              <div className="relative">
                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                <input
                  type="number"
                  name="salary"
                  required
                  value={form.salary}
                  onChange={handleChange}
                  placeholder="e.g. 55000"
                  className="w-full h-12 rounded-xl border pl-11 pr-4 outline-none focus:border-indigo-500 text-sm bg-slate-50/50"
                />
              </div>
            </div>

            {/* Type */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Job Type</label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full h-12 rounded-xl border px-3 outline-none focus:border-indigo-500 text-sm bg-slate-50/50 cursor-pointer font-semibold text-slate-600"
              >
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="INTERNSHIP">Internship</option>
                <option value="REMOTE">Remote</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Job Description</label>
            <div className="relative">
              <FileText className="absolute left-4 top-4 text-slate-400 h-5 w-5" />
              <textarea
                name="description"
                required
                rows={3}
                value={form.description}
                onChange={handleChange}
                placeholder="Write detailed responsibilities and qualifications..."
                className="w-full rounded-2xl border p-4 pl-11 text-sm bg-slate-50/50 outline-none resize-none focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={creating}
            className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-1.5 transition disabled:opacity-50"
          >
            {creating ? <Loader2 className="animate-spin h-4 w-4" /> : <Plus size={16} />}
            Publish Vacancy
          </button>
        </form>
      </div>

      {/* 🚀 SEARCH BAR */}
      <div className="bg-white rounded-3xl border p-5 shadow-sm">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search company vacancies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-11 rounded-xl border pl-11 pr-4 outline-none focus:border-indigo-500 text-sm bg-slate-50/50"
          />
        </div>
      </div>

      {/* 🚀 JOB CARDS GRID */}
      {loading ? (
        <div className="p-20 text-center">
          <Loader2 className="animate-spin h-10 w-10 text-indigo-600 mx-auto" />
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="bg-white rounded-[32px] border p-20 text-center text-slate-400">
          <Briefcase size={48} className="mx-auto text-slate-300" />
          <h3 className="text-xl font-bold mt-4">No Vacancies Published</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredJobs.map((job) => (
            <div key={job._id} className="bg-white rounded-3xl border p-6 shadow-sm flex flex-col justify-between hover:shadow-xl hover:border-indigo-100 transition duration-300 group">
              <div>
                <div className="flex items-center justify-between">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getJobTypeStyle(job.type || "FULL_TIME")}`}>
                    {(job.type || "FULL_TIME").replace("_", " ")}
                  </span>
                </div>
                <h3 className="font-extrabold text-slate-800 text-base mt-4 group-hover:text-indigo-600 transition">{job.title}</h3>
                <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">{job.description}</p>
              </div>

              <div className="mt-6 pt-4 border-t space-y-4">
                <div className="grid grid-cols-2 gap-3 text-xs text-slate-400 font-bold">
                  <span className="flex items-center gap-1.5"><MapPin size={13} /> {job.location}</span>
                  <span className="flex items-center gap-1.5 text-emerald-600"><IndianRupee size={13} />{job.salary?.toLocaleString("en-IN")}</span>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(job)}
                    className="flex-1 h-9 bg-indigo-50 border border-indigo-100 text-indigo-600 font-bold text-xs rounded-lg flex items-center justify-center gap-1"
                  >
                    <Edit3 size={12} /> Edit
                  </button>
                  <button
                    onClick={() => deleteJob(job._id)}
                    className="h-9 w-9 bg-rose-50 border border-rose-200 text-rose-600 rounded-lg flex items-center justify-center transition hover:bg-rose-500 hover:text-white"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🚀 EDIT MODAL USING PORTAL */}
      {showEditModal && createPortal(
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-6">
            <div className="flex justify-between items-center pb-3 border-b">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Edit3 size={20} className="text-indigo-600" /> Edit Vacancy Details
              </h2>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400"><X size={18} /></button>
            </div>

            <form onSubmit={handleUpdateSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Job Title</label>
                <input
                  type="text"
                  required
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full h-11 border rounded-xl px-4 text-sm bg-slate-50/50 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Location</label>
                <input
                  type="text"
                  required
                  value={editForm.location}
                  onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                  className="w-full h-11 border rounded-xl px-4 text-sm bg-slate-50/50 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Monthly Salary (INR)</label>
                <input
                  type="number"
                  required
                  value={editForm.salary}
                  onChange={(e) => setEditForm({ ...editForm, salary: e.target.value })}
                  className="w-full h-11 border rounded-xl px-4 text-sm bg-slate-50/50 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Description</label>
                <textarea
                  required
                  rows={3}
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full rounded-2xl border p-4 text-sm bg-slate-50/50 outline-none resize-none focus:border-indigo-500"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 h-11 border rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2"
                >
                  {updating ? <Loader2 className="animate-spin h-4 w-4" /> : <Check size={16} />}
                  Save Changes
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