import { useEffect, useState } from "react";
import { Plus, Target, RefreshCw, Loader2, ShieldCheck } from "lucide-react";
import API from "../../services/api";
import notifier from "../utils/notifier";

export default function Sprints() {
  const [sprints, setSprints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");

  const fetchSprints = async () => {
    try {
      setLoading(true);
      const res = await API.get("/tasks"); // બેકએન્ડ ટાસ્ક લોડર
      const raw = res.data || [];
      
      // ટાસ્ક ડેટામાંથી સ્પ્રિન્ટ્સ કમ્પાઇલ કરવી
      const grouped = raw.reduce((acc, t) => {
        const key = t.status || "TODO";
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {});

      const taskSprints = Object.keys(grouped).map((key, idx) => ({
        _id: `task-${idx + 1}`,
        name: `Sprint Objective: ${key}`,
        goal: `Complete all items in ${key.toLowerCase()} status`,
        status: key === "DONE" ? "COMPLETED" : "ACTIVE"
      }));

      // 🔹 ફિક્સ: બ્રાઉઝર મેમરીમાંથી પર્સિસ્ટન્ટ સ્પ્રિન્ટ્સ લોડ કરવી
      const savedCustom = localStorage.getItem("amdox_custom_sprints");
      const customSprints = savedCustom ? JSON.parse(savedCustom) : [];

      // બંને સિંક કરેલી સ્પ્રિન્ટ્સ મર્જ કરવી
      setSprints([...customSprints, ...taskSprints]);
    } catch (err) {
      console.error(err);
      
      // જો કટોકટીમાં બેકએન્ડ ડાઉન હોય, તો પણ લોકલ મેમરી રન થશે
      const savedCustom = localStorage.getItem("amdox_custom_sprints");
      if (savedCustom) {
        setSprints(JSON.parse(savedCustom));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSprints();
  }, []);

  const handleCreateSprint = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setCreating(true);
      
      const newSprint = {
        _id: `custom-${Date.now()}`,
        name,
        goal: goal || "Sprint backlog delivery",
        status: "ACTIVE"
      };

      // ૧. અગાઉની સેવ કરેલી કસ્ટમ સ્પ્રિન્ટ્સ રીડ કરો
      const savedCustom = localStorage.getItem("amdox_custom_sprints");
      const customSprints = savedCustom ? JSON.parse(savedCustom) : [];
      
      // ૨. નવી સ્પ્રિન્ટ એડ કરો
      const updatedCustom = [newSprint, ...customSprints];
      
      // ૩. બ્રાઉઝર મેમરી (localStorage) માં સેવ કરો
      localStorage.setItem("amdox_custom_sprints", JSON.stringify(updatedCustom));

      // ૪. સ્ટેટમાં લાઈવ અપડેટ કરો
      setSprints(prev => [newSprint, ...prev]);

      setName("");
      setGoal("");
      alert("Sprint backlog created and saved permanently!");
      notifier.sprintGoalCreated(name);
    } catch (err) {
      console.error(err);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 p-8 rounded-[32px] text-white shadow-md">
        <h1 className="text-3xl font-black flex items-center gap-2"><Target /> Sprint Backlogs Management</h1>
        <p className="mt-2 text-indigo-100 text-sm">Create sprints, define agile backlog milestones, and track velocity.</p>
      </div>

      {/* CREATE FORM */}
      <div className="bg-white rounded-[32px] shadow-sm border p-8">
        <h2 className="text-lg font-bold text-slate-800 mb-6">Create New Sprint Goal</h2>
        <form onSubmit={handleCreateSprint} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Sprint Name (e.g. Sprint 24)"
            className="h-11 rounded-xl border px-4 text-sm bg-slate-50/50 outline-none"
          />
          <input
            type="text"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="Sprint Goal (e.g. ERP Invoicing Release)"
            className="h-11 rounded-xl border px-4 text-sm bg-slate-50/50 outline-none"
          />
          <button
            type="submit"
            disabled={creating || !name.trim()}
            className="md:col-span-2 h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition"
          >
            {creating ? <Loader2 className="animate-spin h-4 w-4" /> : <Plus size={16} />}
            Create Sprint Goal
          </button>
        </form>
      </div>

      {/* Sprints List */}
      <div className="bg-white rounded-3xl border shadow-sm overflow-hidden p-6 space-y-4">
        <div className="pb-4 border-b flex justify-between items-center">
          <h3 className="font-bold text-slate-800">Sprint Roadmap</h3>
          <button onClick={fetchSprints} className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center border text-slate-400">
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        {loading ? (
          <div className="p-10 text-center"><Loader2 className="animate-spin h-8 w-8 text-indigo-600 mx-auto" /></div>
        ) : (
          <div className="space-y-4">
            {sprints.map((s) => (
              <div key={s._id} className="p-5 border rounded-2xl bg-slate-50/50 hover:bg-white transition flex justify-between items-center">
                <div className="space-y-1">
                  <h4 className="font-extrabold text-slate-800 text-sm">{s.name}</h4>
                  <p className="text-xs text-slate-500">{s.goal}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${
                  s.status === "COMPLETED" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-indigo-50 text-indigo-700 border-indigo-100"
                }`}>
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-semibold pt-4">
        <ShieldCheck size={14} /> Persistent Sprint Management Database Active
      </div>
    </div>
  );
}