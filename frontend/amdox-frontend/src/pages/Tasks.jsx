import { useEffect, useState, useMemo } from "react";
import { ListTodo, RefreshCw, Loader2, ClipboardList, CheckCircle2, User } from "lucide-react";
import API from "../services/api";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [projRes, taskRes] = await Promise.all([
        API.get("/projects").catch(() => ({ data: [] })),
        API.get("/tasks").catch(() => ({ data: [] }))
      ]);

      const projs = projRes.data || [];
      setProjects(projs);
      if (projs.length > 0) setSelectedProjectId(projs[0]._id);

      setTasks(taskRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  // પ્રોજેક્ટ વાઈઝ લાઈવ ફિલ્ટર ટાસ્ક્સ
  const filteredTasks = useMemo(() => {
    if (!selectedProjectId) return tasks;
    return tasks.filter(t => String(t.projectId || t.project) === String(selectedProjectId));
  }, [tasks, selectedProjectId]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-1 font-sans">
      <div className="bg-slate-900 p-8 rounded-[32px] text-white flex justify-between items-center shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl" />
        <div className="relative z-10 space-y-1">
          <h1 className="text-2xl font-black flex items-center gap-2"><ListTodo /> Project Task Audit</h1>
          <p className="text-slate-400 text-xs">Verify granular milestones and tasks assigned under specific project sprint scopes.</p>
        </div>
        <button onClick={fetchInitialData} className="h-9 w-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center border border-white/10 transition z-10 cursor-pointer">
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="bg-white rounded-3xl border p-6 shadow-sm space-y-6">
        <div className="max-w-xs space-y-1.5">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Select Project Target</label>
          <select value={selectedProjectId} onChange={(e) => setSelectedProjectId(e.target.value)} className="w-full h-11 border rounded-xl px-3 outline-none text-xs font-bold bg-slate-50/50 cursor-pointer">
            {projects.map(p => (
              <option key={p._id} value={p._id}>{p.name}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="py-20 text-center"><Loader2 className="animate-spin text-indigo-600 mx-auto" /></div>
        ) : filteredTasks.length === 0 ? (
          <div className="p-20 text-center border-2 border-dashed rounded-3xl text-slate-400 font-bold text-xs space-y-2">
            <ClipboardList size={36} className="mx-auto text-slate-300" />
            <p>No active tasks logged under this project scope.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTasks.map(t => (
              <div key={t._id} className="p-4 bg-slate-50 border rounded-2xl flex justify-between items-center gap-4">
                <div className="min-w-0">
                  <h4 className="font-extrabold text-slate-800 text-sm truncate">{t.title}</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 flex items-center gap-1"><User size={11} /> {t.assignedTo || "Unassigned"}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase border shrink-0 ${
                  t.status === "DONE" ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-indigo-50 text-indigo-700 border-indigo-100"
                }`}>{t.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}