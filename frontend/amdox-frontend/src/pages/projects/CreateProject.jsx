import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FolderPlus, IndianRupee, Send, Loader2 } from "lucide-react";
import API from "../../services/api";

export default function CreateProject() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    budget: "", // 🔹 ઉમેરેલ: ડાયનેમિક બજેટ ઇનપુટ
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      // 🔹 POST /api/projects with dynamic planned budget!
      await API.post("/projects", {
        ...form,
        budget: Number(form.budget || 0),
      });

      alert("Project Created Successfully");
      navigate("/projects");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* HERO */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-700 rounded-[32px] p-10 text-white shadow-xl">
        <div className="flex items-center gap-5">
          <div className="h-16 w-16 rounded-2xl bg-white/20 flex items-center justify-center">
            <FolderPlus size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black">Create Project</h1>
            <p className="mt-2 text-indigo-100 text-sm">Add a new workspace sprint with planned budget metrics.</p>
          </div>
        </div>
      </div>

      {/* FORM */}
      <div className="bg-white rounded-[32px] shadow-lg p-8 border border-slate-200/80">
        <form onSubmit={submit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Project Name</label>
            <input
              type="text"
              name="name"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. ERP Cloud Suite"
              className="w-full h-12 rounded-xl border border-slate-300 px-4 outline-none focus:border-indigo-500 text-sm"
            />
          </div>

          {/* Budget (Dynamic) */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Planned Budget (INR)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <IndianRupee className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="number"
                name="budget"
                required
                value={form.budget}
                onChange={handleChange}
                placeholder="e.g. 150000"
                className="block w-full h-12 pl-11 pr-4 rounded-xl border border-slate-300 outline-none focus:border-indigo-500 text-sm"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
            <textarea
              name="description"
              required
              rows={5}
              value={form.description}
              onChange={handleChange}
              placeholder="Write project description..."
              className="w-full rounded-2xl border border-slate-300 p-4 outline-none focus:border-indigo-500 text-sm resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin h-4 w-4" /> : <Send size={16} />}
            {loading ? "Creating..." : "Create Project"}
          </button>
        </form>
      </div>
    </div>
  );
}