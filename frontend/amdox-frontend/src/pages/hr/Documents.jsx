import { useEffect, useState } from "react";
import { FolderKanban, FileText, Eye, Loader2, ShieldAlert } from "lucide-react";
import API from "../../services/api";

export default function Documents() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/hr/employees")
      .then((res) => setDocs(res.data || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-800 p-8 rounded-[32px] text-white shadow-md relative overflow-hidden">
        <h1 className="text-3xl font-black flex items-center gap-2">📂 Employee Documents</h1>
        <p className="mt-2 text-indigo-100 text-sm">Secure terminal for employee resumes, identity PANs, and verification certificates.</p>
      </div>

      {loading ? (
        <div className="p-20 text-center">
          <Loader2 className="animate-spin h-10 w-10 text-indigo-600 mx-auto" />
        </div>
      ) : docs.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border space-y-4">
          <ShieldAlert size={48} className="mx-auto text-slate-300" />
          <h3 className="text-lg font-bold text-slate-700">No Documents Found</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {docs.map((d) => (
            <div key={d._id} className="bg-white border rounded-3xl p-6 shadow-sm space-y-5 hover:shadow-md transition">
              <div>
                <h3 className="font-extrabold text-slate-800 text-base">{d.userId?.name || "Employee"}</h3>
                <p className="text-xs text-slate-400 mt-1">{d.position || "Staff Member"}</p>
              </div>

              <div className="space-y-2.5 pt-4 border-t">
                {/* Resume download / view */}
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border">
                  <span className="text-xs font-bold text-slate-600 flex items-center gap-2">
                    <FileText size={16} className="text-indigo-600" /> Resume / CV
                  </span>
                  {d.resume ? (
                    <a
                      href={`http://localhost:5000/${d.resume}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-black text-indigo-600 flex items-center gap-1 hover:underline"
                    >
                      <Eye size={12} /> View
                    </a>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Pending</span>
                  )}
                </div>

                {/* Aadhaar card */}
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border">
                  <span className="text-xs font-bold text-slate-600 flex items-center gap-2">
                    <FileText size={16} className="text-indigo-600" /> Aadhaar Identification
                  </span>
                  {d.aadhaar ? (
                    <a
                      href={`http://localhost:5000/${d.aadhaar}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-black text-indigo-600 flex items-center gap-1 hover:underline"
                    >
                      <Eye size={12} /> View
                    </a>
                  ) : (
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Pending</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}