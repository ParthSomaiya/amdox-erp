import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, User, Mail, Briefcase, Link as LinkIcon, Loader2, Send, Users } from "lucide-react";
import API from "../../services/api";

export default function InterviewScheduler() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [approvedCandidates, setApprovedCandidates] = useState([]); 

  const [form, setForm] = useState({
    candidateName: "",
    candidateEmail: "",
    position: "Software Engineer",
    date: "",
    time: "",
    interviewer: "",
    meetingLink: "",
    type: "TECHNICAL"
  });

  useEffect(() => {
    const savedApproved = JSON.parse(localStorage.getItem("amdox_approved_candidates") || "[]");
    setApprovedCandidates(savedApproved);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectApprovedCandidate = (e) => {
    const candidateId = e.target.value;
    if (!candidateId) return;

    const matched = approvedCandidates.find(c => c._id === candidateId);
    if (matched) {
      setForm(prev => ({
        ...prev,
        candidateName: matched.name,
        candidateEmail: matched.email,
        position: matched.position
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      _id: `int-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    // 🧠 સબમિટ કરતા પહેલા જ લોકલ સ્ટોરેજ સુરક્ષિત કરો (કનેક્ટિવિટી સ્યોરિટી!)
    const existing = JSON.parse(localStorage.getItem("amdox_scheduled_interviews") || "[]");
    localStorage.setItem("amdox_scheduled_interviews", JSON.stringify([payload, ...existing]));

    try {
      setLoading(true);
      await API.post("/jobs/interview", payload);

      window.triggerAmdoxNotification?.(
        "Interview Scheduled", 
        `Technical interview booked for ${form.candidateName}.`, 
        "HR"
      );

      alert("Interview successfully scheduled & synced!");
      navigate("/calendar");
    } catch (err) {
      console.warn("API Error: Saved locally.");
      alert("Interview successfully scheduled!");
      navigate("/calendar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 p-8 rounded-[32px] text-white shadow-md">
        <h1 className="text-3xl font-black flex items-center gap-2"><Clock /> Interview Scheduler</h1>
        <p className="text-indigo-100 text-sm mt-1">Configure candidate screening times, target positions, and meeting links.</p>
      </div>

      <div className="bg-white rounded-[32px] border p-8 shadow-sm space-y-6">
        {approvedCandidates.length > 0 && (
          <div className="p-4 bg-indigo-50/40 border border-indigo-100 rounded-2xl space-y-2">
            <label className="block text-xs font-bold text-indigo-700 uppercase flex items-center gap-1"><Users size={14} /> Quick Select Approved Candidate</label>
            <select 
              onChange={handleSelectApprovedCandidate}
              className="w-full h-11 border border-indigo-200 bg-white rounded-xl px-3 text-xs font-bold text-indigo-800 outline-none cursor-pointer"
            >
              <option value="">-- Choose Candidate to Auto-Fill form --</option>
              {approvedCandidates.map(c => (
                <option key={c._id} value={c._id}>{c.name} ({c.position})</option>
              ))}
            </select>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Candidate Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                <input type="text" name="candidateName" required value={form.candidateName} onChange={handleChange} placeholder="e.g. Jaydeep Patel" className="w-full h-12 rounded-xl border pl-11 pr-4 outline-none text-sm bg-slate-50/50 focus:bg-white" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Candidate Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                <input type="email" name="candidateEmail" required value={form.candidateEmail} onChange={handleChange} placeholder="candidate@email.com" className="w-full h-12 rounded-xl border pl-11 pr-4 outline-none text-sm bg-slate-50/50 focus:bg-white" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Target Position</label>
              <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                <input type="text" name="position" required value={form.position} onChange={handleChange} placeholder="React Developer" className="w-full h-12 rounded-xl border pl-11 pr-4 outline-none text-sm bg-slate-50/50 focus:bg-white" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Interview Type</label>
              <select name="type" value={form.type} onChange={handleChange} className="w-full h-12 rounded-xl border px-3 outline-none text-sm bg-slate-50/50 cursor-pointer font-semibold text-slate-600">
                <option value="TECHNICAL">TECHNICAL ROUND</option>
                <option value="HR">HR ROUND</option>
                <option value="MANAGERIAL">MANAGERIAL ROUND</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Date</label>
              <input type="date" name="date" required value={form.date} onChange={handleChange} className="w-full h-12 rounded-xl border px-4 outline-none text-sm bg-slate-50/50" />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Time</label>
              <input type="time" name="time" required value={form.time} onChange={handleChange} className="w-full h-12 rounded-xl border px-4 outline-none text-sm bg-slate-50/50" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Assigned Interviewer Panel</label>
              <input type="text" name="interviewer" required value={form.interviewer} onChange={handleChange} placeholder="e.g. Parth Somaiya (Senior Developer)" className="w-full h-12 rounded-xl border px-4 outline-none text-sm bg-slate-50/50" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Meeting Link</label>
              <div className="relative">
                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                <input type="url" name="meetingLink" required value={form.meetingLink} onChange={handleChange} placeholder="https://meet.google.com/abc-xyz" className="w-full h-12 rounded-xl border pl-11 pr-4 outline-none text-sm bg-slate-50/50" />
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition shadow-md cursor-pointer">
            {loading ? <Loader2 className="animate-spin h-4 w-4" /> : <Send size={16} />}
            Schedule Interview
          </button>
        </form>
      </div>
    </div>
  );
}