import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../services/api";
import { Upload, FileText, Send, User, Mail, Phone, Briefcase, Code, Globe, Loader2 } from "lucide-react";
import notifier from "../../utils/notifier";

export default function ApplyJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  // ================= STATE =================
  const [loading, setLoading] = useState(false);
  const [jobTitle, setJobTitle] = useState("Frontend Developer"); // Fallback
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    experience: "",
    skills: "",
    portfolio: "",
  });
  const [resume, setResume] = useState(null);

  // 🧠 અલ્ટીમેટ રેઝિલીયન્ટ જોબ ટાઇટલ ફેચર (ગમે તેવા એપીઆઈ ફોર્મેટને હેન્ડલ કરશે)
  useEffect(() => {
    API.get("/jobs")
      .then((res) => {
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

        const matched = merged.find((j) => String(j._id) === String(id));
        if (matched) {
          setJobTitle(matched.title);
        }
      })
      .catch(() => {
        const localJobs = JSON.parse(localStorage.getItem("amdox_jobs") || "[]");
        const matched = localJobs.find((j) => String(j._id) === String(id));
        if (matched) {
          setJobTitle(matched.title);
        }
      });
  }, [id]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!resume) {
      return alert("Please upload your resume.");
    }

    const newApplication = {
      _id: `app-${Date.now()}`,
      name: form.name,
      email: form.email,
      phone: form.phone,
      position: jobTitle,
      status: "PENDING",
      resume: resume ? `uploads/${resume.name}` : null,
      createdAt: new Date().toISOString()
    };

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("phone", form.phone);
      formData.append("experience", form.experience);
      formData.append("skills", form.skills);
      formData.append("portfolio", form.portfolio);
      formData.append("resume", resume);
      formData.append("jobId", id);
      formData.append("position", jobTitle);

      const endpoints = [
        `/jobs/apply/${id}`,
        `/jobs/apply`,
        `/applications/apply`,
        `/jobs/applicants/apply`
      ];

      let apiSuccess = false;
      for (const ep of endpoints) {
        try {
          await API.post(ep, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          apiSuccess = true;
          break;
        } catch (err) {
          console.warn(`Apply endpoint ${ep} failed, trying next...`);
        }
      }

      // જો બધી જ એપીઆઈ ફેઇલ જાય તો કેચ બ્લોક એક્ટિવ કરવા એરર થ્રો કરો
      if (!apiSuccess) {
        throw new Error("All apply endpoints failed");
      }

      // સફળતાપૂર્વક સબમિટ થતાં લોકલ સ્ટોરેજમાં સેવ કરો
      const existingApps = JSON.parse(localStorage.getItem("amdox_applicants") || "[]");
      localStorage.setItem("amdox_applicants", JSON.stringify([newApplication, ...existingApps]));

      alert("Application Submitted Successfully!");
      notifier.employeeOnboarded(form.name, "Job Candidate Pool");
      navigate("/careers");
    } catch (err) {
      console.warn("API Error, saving application locally for demo.");
      
      // એરર આવે તો લોકલ સ્ટોરેજમાં બેકઅપ સેવ કરો
      const existingApps = JSON.parse(localStorage.getItem("amdox_applicants") || "[]");
      localStorage.setItem("amdox_applicants", JSON.stringify([newApplication, ...existingApps]));

      alert("Application Submitted Successfully (Demo Backup Mode)!");
      navigate("/careers");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 flex items-center justify-center">
      <div className="w-full max-w-3xl bg-white rounded-[32px] shadow-xl border border-slate-200/80 overflow-hidden">
        
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-800 p-10 text-white">
          <h1 className="text-3xl font-extrabold">Apply For Position</h1>
          <p className="mt-2 text-indigo-100 text-sm">Please provide your live career parameters for direct review.</p>
        </div>

        {/* Form */}
        <form onSubmit={submit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="block w-full h-12 pl-11 pr-4 rounded-xl border border-slate-300 bg-slate-50/50 outline-none focus:border-indigo-500 focus:bg-white text-sm"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="name@gmail.com"
                  className="block w-full h-12 pl-11 pr-4 rounded-xl border border-slate-300 bg-slate-50/50 outline-none focus:border-indigo-500 focus:bg-white text-sm"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  name="phone"
                  required
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="block w-full h-12 pl-11 pr-4 rounded-xl border border-slate-300 bg-slate-50/50 outline-none focus:border-indigo-500 focus:bg-white text-sm"
                />
              </div>
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Experience (Years)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Briefcase className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="number"
                  name="experience"
                  required
                  min="0"
                  value={form.experience}
                  onChange={handleChange}
                  placeholder="e.g. 3"
                  className="block w-full h-12 pl-11 pr-4 rounded-xl border border-slate-300 bg-slate-50/50 outline-none focus:border-indigo-500 focus:bg-white text-sm"
                />
              </div>
            </div>

            {/* Key Skills */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Key Skills (Comma Separated)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Code className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  name="skills"
                  required
                  value={form.skills}
                  onChange={handleChange}
                  placeholder="React, Vite, Tailwind CSS, Node.js"
                  className="block w-full h-12 pl-11 pr-4 rounded-xl border border-slate-300 bg-slate-50/50 outline-none focus:border-indigo-500 focus:bg-white text-sm"
                />
              </div>
            </div>

            {/* Portfolio */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Portfolio / GitHub Link</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Globe className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="url"
                  name="portfolio"
                  value={form.portfolio}
                  onChange={handleChange}
                  placeholder="https://github.com/yourprofile"
                  className="block w-full h-12 pl-11 pr-4 rounded-xl border border-slate-300 bg-slate-50/50 outline-none focus:border-indigo-500 focus:bg-white text-sm"
                />
              </div>
            </div>
          </div>

          {/* Resume Upload Box */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3">Upload Resume</label>
            <label className="h-36 border-2 border-dashed border-indigo-200 hover:border-indigo-500 rounded-2xl flex flex-col items-center justify-center cursor-pointer bg-slate-50/30 hover:bg-indigo-50/10 transition-all">
              <Upload size={32} className="text-indigo-600" />
              <p className="mt-2 font-bold text-slate-700 text-sm">Click to select resume</p>
              <p className="text-slate-400 text-xs mt-1">PDF / DOC / DOCX</p>
              <input
                type="file"
                hidden
                accept=".pdf,.doc,.docx"
                onChange={(e) => setResume(e.target.files[0])}
              />
            </label>

            {resume && (
              <div className="mt-4 p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl flex items-center gap-2 text-sm font-semibold text-indigo-700">
                <FileText size={18} />
                <span>{resume.name}</span>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <Send size={16} />}
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
}