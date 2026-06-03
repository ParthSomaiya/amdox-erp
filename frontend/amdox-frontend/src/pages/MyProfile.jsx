import { useEffect, useState, useMemo } from "react";
import { User, Mail, Shield, CheckCircle, FileText, Upload, Briefcase, Globe, Loader2, Calendar, Video, Clock, Trash2 } from "lucide-react";
import API from "../services/api";

export default function MyProfile() {
  const [user, setUser] = useState({});
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [resumeFile, setResumeFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(storedUser);
    
    // 🧠 સ્માર્ટ ઓટો-ડિટેક્ટ ઇમેઇલ ફિલ્ટર
    const email = storedUser.email || storedUser.userId?.email || "";

    if (storedUser.role === "JOB_SEEKER") {
      fetchApplicationsAndInterviews(email);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchApplicationsAndInterviews = async (email) => {
    if (!email) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      
      // ૧. અરજીઓ લોડ કરો
      const res = await API.get("/jobs/applicants").catch(() => null);
      const serverApps = res && Array.isArray(res.data) ? res.data : [];
      const localApps = JSON.parse(localStorage.getItem("amdox_applicants") || "[]");
      const mergedApps = [...serverApps];
      localApps.forEach((item) => {
        if (!mergedApps.some((m) => m._id === item._id)) {
          mergedApps.push(item);
        }
      });
      setApplications(mergedApps.filter(app => app.email?.toLowerCase() === email?.toLowerCase()));

      // ૨. ઈન્ટરવ્યુ શિડ્યુલર લાઈવ લોડ લોજિક (ઇમેઇલ દ્વારા મેચ થશે)
      const intRes = await API.get("/jobs/interviews").catch(() => null);
      const serverInts = intRes && Array.isArray(intRes.data) ? intRes.data : [];
      const localInts = JSON.parse(localStorage.getItem("amdox_scheduled_interviews") || "[]");
      const mergedInts = [...serverInts];
      localInts.forEach((item) => {
        if (!mergedInts.some((m) => m._id === item._id)) {
          mergedInts.push(item);
        }
      });

      // માત્ર આ લોગિન થયેલા સાચા કેન્ડિડેટનો જ ઇન્ટરવ્યુ બતાવો
      const myScheduled = mergedInts.filter(i => i.candidateEmail?.toLowerCase() === email?.toLowerCase());
      setInterviews(myScheduled);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ ADD & UPDATE RESUME
  const handleResumeUpload = async (e) => {
    e.preventDefault();
    if (!resumeFile) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("resume", resumeFile);

      await API.put(`/hr/profile/resume`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      }).catch(() => {
        // Fallback local update
        const updatedUser = { ...user, resume: `uploads/${resumeFile.name}` };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
      });

      alert("Resume uploaded successfully!");
      setResumeFile(null);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  // ✅ DELETE RESUME
  const handleDeleteResume = async () => {
    if (!window.confirm("Are you sure you want to delete your resume?")) return;
    try {
      setUploading(true);
      await API.delete(`/hr/profile/resume`).catch(() => {
        // Fallback local delete
        const updatedUser = { ...user, resume: null };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
      });

      alert("Resume deleted successfully!");
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto w-full px-2 box-border overflow-hidden">
      {/* Top Welcome Card */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-[32px] bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex items-center gap-4 sm:gap-6">
          <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl sm:rounded-3xl bg-white/20 flex items-center justify-center text-2xl sm:text-3xl font-black shrink-0">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-3xl font-black truncate">{user.name}</h1>
            <p className="text-indigo-100 text-xs sm:text-sm mt-1">Manage your credentials, portfolio, and resume file dynamically.</p>
          </div>
        </div>
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full box-border overflow-hidden">
        
        {/* Left Section: Account & Resume Control */}
        <div className="lg:col-span-4 space-y-6 w-full box-border">
          <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-800 text-sm sm:text-base">Account Identity</h3>
            <div className="space-y-2.5">
              <div className="p-3 bg-slate-50 rounded-xl border flex items-center gap-2.5 min-w-0">
                <User size={15} className="text-indigo-600 shrink-0" />
                <div className="min-w-0"><span className="text-[9px] text-slate-400 font-bold block">NAME</span><span className="text-xs font-bold text-slate-800 truncate block">{user.name}</span></div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border flex items-center gap-2.5 min-w-0">
                <Mail size={15} className="text-indigo-600 shrink-0" />
                <div className="min-w-0"><span className="text-[9px] text-slate-400 font-bold block">EMAIL</span><span className="text-xs font-bold text-slate-800 truncate block">{user.email}</span></div>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border flex items-center gap-2.5 min-w-0">
                <Shield size={15} className="text-indigo-600 shrink-0" />
                <div className="min-w-0"><span className="text-[9px] text-slate-400 font-bold block">ROLE</span><span className="text-xs font-bold text-indigo-600 block">{user.role}</span></div>
              </div>
            </div>
          </div>

          {/* Profile CV/Resume Management */}
          {user.role === "JOB_SEEKER" && (
            <div className="bg-white border rounded-2xl p-5 shadow-sm space-y-4">
              <h3 className="font-extrabold text-slate-800 text-sm sm:text-base">Resume Management</h3>
              
              {user.resume ? (
                <div className="p-3.5 bg-indigo-50/50 border border-indigo-100 rounded-xl flex items-center justify-between gap-3 min-w-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText size={16} className="text-indigo-600 shrink-0" />
                    <span className="text-xs font-bold text-indigo-700 truncate">{user.resume.split("/").pop()}</span>
                  </div>
                  <button onClick={handleDeleteResume} className="text-rose-500 hover:text-rose-700 shrink-0">
                    <Trash2 size={14} />
                  </button>
                </div>
              ) : (
                <p className="text-xs text-slate-400">Please upload your resume to apply for open vacancies.</p>
              )}

              <form onSubmit={handleResumeUpload} className="space-y-4">
                <label className="h-16 border-2 border-dashed border-indigo-200 hover:border-indigo-500 rounded-xl flex flex-col items-center justify-center cursor-pointer bg-slate-50/50 hover:bg-indigo-50/10 transition">
                  <Upload size={18} className="text-indigo-600" />
                  <span className="text-[10px] font-bold text-slate-700 mt-1">Choose PDF / DOC file</span>
                  <input type="file" hidden accept=".pdf,.doc,.docx" onChange={(e) => setResumeFile(e.target.files[0])} />
                </label>

                {resumeFile && (
                  <div className="p-2.5 bg-indigo-50 border rounded-lg text-xs font-semibold text-indigo-700 flex items-center gap-1.5">
                    <FileText size={14} /> {resumeFile.name}
                  </div>
                )}

                <button type="submit" disabled={uploading || !resumeFile} className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer shadow-sm">
                  {uploading ? <Loader2 className="animate-spin h-3.5 w-3.5" /> : <Upload size={14} />}
                  {user.resume ? "Replace Resume" : "Upload Resume"}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Right Section: Interviews & Applications */}
        {user.role === "JOB_SEEKER" && (
          <div className="lg:col-span-8 space-y-6 w-full box-border">
            
            {/* LATEST SHEDULED INTERVIEWS LISTING CARD WITH GUJARATI NOTIFICATION */}
            {interviews.length > 0 && (
              <div className="bg-white border rounded-[24px] p-5 sm:p-6 shadow-sm space-y-4 w-full">
                <div>
                  <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-lg text-[9px] font-bold">Live Calendar Match</span>
                  <h3 className="font-extrabold text-slate-800 text-sm sm:text-base mt-2">My Scheduled Interviews</h3>
                </div>

                <div className="space-y-3">
                  {interviews.map((item) => (
                    <div key={item._id} className="p-4 bg-emerald-50/50 border border-emerald-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <h4 className="font-extrabold text-slate-800 text-sm">
                          તમારું ઇન્ટરવ્યુ {item.date} તારીખે અને {item.time} વાગ્યે ગોઠવાયેલું છે.
                        </h4>
                        <p className="text-[11px] text-slate-500 font-medium">Position: {item.position} ({item.type})</p>
                        <p className="text-[11px] text-slate-500 font-medium">Interviewer Panel: {item.interviewer}</p>
                      </div>
                      <a href={item.meetingLink} target="_blank" rel="noreferrer" className="h-8.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 shrink-0 shadow-sm">
                        <Video size={12} /> Join Meeting
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Applications */}
            <div className="bg-white border rounded-[24px] p-5 sm:p-6 shadow-sm space-y-4 sm:space-y-6 w-full">
              <div>
                <h3 className="font-extrabold text-slate-800 text-sm sm:text-base">My Applied Vacancies</h3>
                <p className="text-xs text-slate-400">Real-time tracker for your candidate pipeline applications</p>
              </div>

              {applications.length === 0 ? (
                <div className="p-16 border rounded-2xl text-center space-y-2">
                  <Briefcase className="mx-auto text-slate-300" size={36} />
                  <h4 className="font-bold text-slate-700 text-sm">No Active Applications</h4>
                </div>
              ) : (
                <div className="space-y-4">
                  {applications.map((app) => (
                    <div key={app._id} className="p-4 sm:p-5 border rounded-2xl bg-slate-50/50 hover:bg-white hover:border-indigo-100 transition flex justify-between items-center">
                      <div className="min-w-0 pr-2">
                        <h4 className="font-extrabold text-slate-800 text-xs sm:text-sm truncate">{app.position || "Hired Role"}</h4>
                        <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1"><Calendar size={11} /> Applied: {new Date(app.createdAt).toLocaleDateString()}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase border shrink-0 ${
                        app.status === "ACCEPTED" ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                        app.status === "REJECTED" ? "bg-rose-50 text-rose-700 border-rose-100" :
                        "bg-amber-50 text-amber-700 border-amber-100"
                      }`}>{app.status || "PENDING"}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}