import { useEffect, useState, useMemo } from "react";
import { User, Mail, Shield, CheckCircle, FileText, Upload, Briefcase, Globe, Loader2, Calendar } from "lucide-react";
import API from "../services/api";

export default function MyProfile() {
  const [user, setUser] = useState({});
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resumeFile, setResumeFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(storedUser);
    
    if (storedUser.role === "JOB_SEEKER") {
      fetchApplications();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await API.get("/jobs/applicants"); // 🔹 સિંક્ડ એન્ડપોઇન્ટ
      // ફિલ્ટર ફક્ત લોગિન થયેલા જોબ સીકરની એપ્લિકેશન
      const myApps = (res.data || []).filter(app => app.email === user.email);
      setApplications(myApps);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResumeUpload = async (e) => {
    e.preventDefault();
    if (!resumeFile) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("resume", resumeFile);

      // 🔹 ફિક્સ: અપલોડ પાથ બદલીને બેકએન્ડના સાચા રૂટ પર કનેક્ટ કર્યો
      await API.put(`/hr/profile/resume`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Resume uploaded successfully to your profile!");
      setResumeFile(null);
    } catch (err) {
      console.error(err);
      alert("Failed to upload resume to profile");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
        <div className="relative z-10 flex items-center gap-6">
          <div className="h-20 w-20 rounded-3xl bg-white/20 flex items-center justify-center text-3xl font-black">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div>
            <h1 className="text-3xl font-black">My Profile & Dashboard</h1>
            <p className="text-indigo-100 text-sm mt-1">Manage your corporate credentials, portfolio link, and track job applications.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Profile details & Resume uploader (Left Side) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border rounded-3xl p-6 shadow-sm space-y-5">
            <h3 className="font-extrabold text-slate-800 text-base">Account Identity</h3>
            
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-xl border flex items-center gap-3">
                <User size={16} className="text-indigo-600" />
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">NAME</span>
                  <span className="text-xs font-bold text-slate-800">{user.name}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border flex items-center gap-3">
                <Mail size={16} className="text-indigo-600" />
                <div className="truncate">
                  <span className="text-[10px] text-slate-400 font-bold block">EMAIL</span>
                  <span className="text-xs font-bold text-slate-800 truncate block max-w-[180px]">{user.email}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border flex items-center gap-3">
                <Shield size={16} className="text-indigo-600" />
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block">WORKSPACE ROLE</span>
                  <span className="text-xs font-bold text-indigo-600">{user.role}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Resume Uploader */}
          {user.role === "JOB_SEEKER" && (
            <div className="bg-white border rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="font-extrabold text-slate-800 text-base">Profile Management</h3>
              <p className="text-xs text-slate-400">Keep your latest Resume/CV updated for employer reviews.</p>
              
              <form onSubmit={handleResumeUpload} className="space-y-4">
                <label className="h-20 border-2 border-dashed border-indigo-200 hover:border-indigo-500 rounded-xl flex flex-col items-center justify-center cursor-pointer bg-slate-50/50 hover:bg-indigo-50/10 transition">
                  <Upload size={20} className="text-indigo-600" />
                  <span className="text-xs font-bold text-slate-700 mt-1">Select Resume</span>
                  <input type="file" hidden accept=".pdf,.doc,.docx" onChange={(e) => setResumeFile(e.target.files[0])} />
                </label>

                {resumeFile && (
                  <div className="p-2.5 bg-indigo-50 border rounded-lg text-xs font-semibold text-indigo-700 flex items-center gap-1.5">
                    <FileText size={14} /> {resumeFile.name}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={uploading || !resumeFile}
                  className="w-full h-10 bg-indigo-600 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {uploading ? <Loader2 className="animate-spin h-3.5 w-3.5" /> : <Upload size={14} />}
                  Update Resume
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Applied Jobs Track Area (Right Side) */}
        {user.role === "JOB_SEEKER" && (
          <div className="lg:col-span-2 bg-white border rounded-3xl p-6 shadow-sm space-y-6">
            <div>
              <h3 className="font-extrabold text-slate-800 text-base">My Applied Vacancies</h3>
              <p className="text-xs text-slate-400">Real-time tracker for your candidate pipeline applications</p>
            </div>

            {loading ? (
              <div className="p-10 text-center">
                <Loader2 className="animate-spin h-8 w-8 text-indigo-600 mx-auto" />
              </div>
            ) : applications.length === 0 ? (
              <div className="p-16 border rounded-2xl text-center space-y-2">
                <Briefcase className="mx-auto text-slate-300" size={36} />
                <h4 className="font-bold text-slate-700 text-sm">No Active Applications</h4>
                <p className="text-slate-400 text-xs">Browse job openings in Career portal and apply now.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {applications.map((app) => (
                  <div key={app._id} className="p-5 border rounded-2xl bg-slate-50/50 hover:bg-white hover:border-indigo-100 transition flex justify-between items-center">
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-sm">{app.jobId?.title || "Hired Role"}</h4>
                      <p className="text-xs text-slate-400 mt-1 flex items-center gap-1"><Calendar size={12} /> Applied: {new Date(app.createdAt).toLocaleDateString()}</p>
                    </div>

                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${
                      app.status === "ACCEPTED" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                      app.status === "REJECTED" ? "bg-rose-50 text-rose-700 border-rose-100" :
                      "bg-amber-50 text-amber-700 border-amber-100"
                    }`}>
                      {app.status || "PENDING"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}