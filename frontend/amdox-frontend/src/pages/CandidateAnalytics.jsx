import { useEffect, useState, useMemo } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import { Users, Loader2, RefreshCw, ShieldCheck } from "lucide-react";
import API from "../services/api";

const COLORS = ["#10b981", "#ef4444", "#f59e0b", "#3b82f6"];

export default function CandidateAnalytics() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCandidateStats = async () => {
    try {
      setLoading(true);
      const res = await API.get("/jobs/applicants").catch(() => ({ data: [] }));
      const serverApplicants = Array.isArray(res.data) ? res.data : [];

      const localApplicants = JSON.parse(localStorage.getItem("amdox_applicants") || "[]");
      const merged = [...serverApplicants];
      localApplicants.forEach(la => {
        if (!merged.some(sa => sa._id === la._id)) merged.push(la);
      });

      // Statuses Grouping
      const grouped = {};
      merged.forEach((a) => {
        const status = a.status || "PENDING";
        grouped[status] = (grouped[status] || 0) + 1;
      });

      const formatted = Object.keys(grouped).map((k) => ({
        name: k,
        value: grouped[k]
      }));

      setData(formatted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidateStats();
  }, []);

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-1">
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 p-8 rounded-3xl text-white shadow-sm flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
            <Users /> Candidate Analytics Overview
          </h1>
          <p className="text-indigo-100 text-xs">Visualize status distributions of active job applications.</p>
        </div>
        <button onClick={fetchCandidateStats} className="h-10 w-10 bg-white/10 hover:bg-white/20 text-white border rounded-xl flex items-center justify-center transition">
          <RefreshCw size={15} />
        </button>
      </div>

      <div className="bg-white border rounded-3xl p-6 shadow-sm min-h-[350px] flex flex-col justify-between">
        {loading ? (
          <div className="flex-grow flex items-center justify-center"><Loader2 className="animate-spin text-indigo-600" /></div>
        ) : data.length === 0 ? (
          <div className="flex-grow flex items-center justify-center text-slate-400 italic text-xs">No active applications compiled.</div>
        ) : (
          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}