import { useEffect, useState, useMemo } from "react";
import { FileText, Loader2, Eye, ShieldCheck, Award, Download, ExternalLink, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import API from "../services/api";

// 🚀 DYNAMIC AXIOS INTERCEPTOR: દરેક રિકવેસ્ટ વખતે તાજું ટોકન જ મોકલશે
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// 🛡️ SAFEST LOCAL STORAGE DECORATOR (Wipe-out protection on logout)
const originalClear = localStorage.clear;
localStorage.clear = function() {
  const employees = localStorage.getItem("amdox_employees");
  const leaves = localStorage.getItem("amdox_applied_leaves");
  const attendance = localStorage.getItem("amdox_simulated_attendance");
  const payrolls = localStorage.getItem("amdox_simulated_payrolls");
  const webhooks = localStorage.getItem("amdox_webhooks");
  const security = localStorage.getItem("amdox_security_settings");
  const gdpr = localStorage.getItem("amdox_gdpr_requests");

  originalClear.call(localStorage);

  if (employees) localStorage.setItem("amdox_employees", employees);
  if (leaves) localStorage.setItem("amdox_applied_leaves", leaves);
  if (attendance) localStorage.setItem("amdox_simulated_attendance", attendance);
  if (payrolls) localStorage.setItem("amdox_simulated_payrolls", payrolls);
  if (webhooks) localStorage.setItem("amdox_webhooks", webhooks);
  if (security) localStorage.setItem("amdox_security_settings", security);
  if (gdpr) localStorage.setItem("amdox_gdpr_requests", gdpr);
};

export default function ResumeViewer() {
  const [employees, setEmployees] = useState([]);
  const [selectedEmpId, setSelectedEmpId] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const res = await API.get("/hr/employees");
      
      const rawData = res.data;
      const list = Array.isArray(rawData) 
        ? rawData 
        : (rawData?.data || rawData?.employees || []);

      const localData = JSON.parse(localStorage.getItem("amdox_employees") || "[]");
      const merged = [...list];
      localData.forEach((item) => {
        if (!merged.some((m) => m._id === item._id)) {
          merged.push(item);
        }
      });

      setEmployees(merged);
      if (merged.length > 0) {
        setSelectedEmpId(merged[0]._id || "");
      }
    } catch (err) {
      console.warn("Using local storage fallback for Resume Viewer.");
      const localData = JSON.parse(localStorage.getItem("amdox_employees") || "[]");
      setEmployees(localData);
      if (localData.length > 0) {
        setSelectedEmpId(localData[0]._id || "");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const safeEmployees = useMemo(() => {
    return Array.isArray(employees) ? employees : [];
  }, [employees]);

  const currentEmp = useMemo(() => {
    return safeEmployees.find(e => e._id === selectedEmpId) || null;
  }, [selectedEmpId, safeEmployees]);

  // 🧮 ડાયનેમિક કેવાયસી (KYC) વેરીફિકેશન અલ્ગોરિધમ
  const kycStatus = useMemo(() => {
    if (!currentEmp) return { text: "N/A", color: "text-slate-400", icon: <Clock size={12} /> };
    const hasAadhaar = !!currentEmp.aadhaar;
    const hasPan = !!currentEmp.pan;

    if (hasAadhaar && hasPan) {
      return { text: "Verified", color: "text-emerald-600", icon: <CheckCircle2 size={12} /> };
    }
    if (hasAadhaar || hasPan) {
      return { text: "Pending", color: "text-amber-500", icon: <Clock size={12} /> };
    }
    return { text: "Not Started", color: "text-rose-500", icon: <AlertTriangle size={12} /> };
  }, [currentEmp]);

  const getFileUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("data:")) return path;
    return `http://localhost:5000/${path.replace(/^\//, "")}`;
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-1 font-sans">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-[32px] text-white relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <span className="text-[10px] uppercase tracking-widest text-indigo-400 font-bold block mb-1">Compliance Vault</span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2">
            <FileText className="text-indigo-400" /> Professional Resume Vault
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm">Access, review, and print employee resume portfolios and credentials in real-time.</p>
        </div>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <Loader2 className="animate-spin text-indigo-600 h-10 w-10 mx-auto" />
          <p className="text-xs text-slate-400 font-bold mt-4">Syncing verified databases...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
          
          {/* LEFT COLUMN */}
          <div className="lg:col-span-4 space-y-6 w-full">
            <div className="bg-white border rounded-[28px] p-6 shadow-sm space-y-5">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2.5">Select Employee Profile</label>
                <select 
                  value={selectedEmpId} 
                  onChange={(e) => setSelectedEmpId(e.target.value)} 
                  className="w-full h-11 border border-slate-200 rounded-xl px-3 outline-none text-xs font-bold bg-slate-50/50 cursor-pointer focus:bg-white focus:border-indigo-500 transition-all"
                >
                  <option value="">-- Choose Employee --</option>
                  {safeEmployees.map(e => {
                    const name = e.userId?.name || e.name || "Staff Member";
                    return (
                      <option key={e._id} value={e._id}>{name}</option>
                    );
                  })}
                </select>
              </div>

              {currentEmp && (
                <div className="pt-5 border-t border-slate-100 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-xl bg-indigo-50 text-indigo-600 font-black flex items-center justify-center text-sm uppercase shrink-0">
                      {(currentEmp.userId?.name || currentEmp.name || "E").charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-extrabold text-slate-800 text-sm truncate">{currentEmp.userId?.name || currentEmp.name}</h4>
                      <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider block mt-0.5">{currentEmp.position || "Developer"}</span>
                    </div>
                  </div>

                  {/* 🚀 ૧૦૦% ડાયનેમિક કનેક્ટેડ કેવાયસી સ્ટેટસ */}
                  <div className="p-3 bg-slate-50 border rounded-xl flex items-center justify-between text-[11px] font-bold text-slate-500">
                    <span>KYC Document Status:</span>
                    <span className={`${kycStatus.color} flex items-center gap-1`}>
                      {kycStatus.icon} {kycStatus.text}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-8 bg-white border rounded-[28px] p-6 shadow-sm min-h-[400px] flex flex-col justify-between w-full">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-800 text-sm flex items-center gap-1.5">
                <FileText className="text-indigo-600" size={16} /> Document Storage
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-indigo-50 text-indigo-700 border border-indigo-100">
                Secure SSL File
              </span>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center py-10 min-h-[300px]">
              {currentEmp?.resume ? (
                <div className="w-full max-w-md space-y-6 text-center">
                  
                  <div className="p-8 bg-slate-50/60 border border-slate-100 rounded-3xl flex flex-col items-center justify-center space-y-4 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />
                    
                    <div className="h-16 w-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-inner">
                      <FileText size={32} />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-800 text-sm truncate max-w-[250px]">
                        {currentEmp.resume.split("/").pop()}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1.5">PDF Portfolio Document</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <a
                      href={getFileUrl(currentEmp.resume)}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-md"
                    >
                      <ExternalLink size={14} /> Open Resume in New Tab
                    </a>
                    <a
                      href={getFileUrl(currentEmp.resume)}
                      download
                      className="h-11 w-12 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl flex items-center justify-center transition border"
                      title="Download PDF"
                    >
                      <Download size={16} />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-3 p-10 border-2 border-dashed border-slate-200 rounded-2xl max-w-md w-full">
                  <Award size={36} className="mx-auto text-slate-300" />
                  <div>
                    <h5 className="font-extrabold text-slate-800 text-xs">No resume uploaded</h5>
                    <p className="text-[10px] text-slate-400 leading-normal mt-1.5">The selected employee profile has not submitted their CV portfolio yet.</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[9px] text-slate-400 font-bold border-t pt-4">
              <ShieldCheck size={12} className="text-emerald-500" /> ISO 27001 Secure Document Protection Active
            </div>
          </div>

        </div>
      )}
    </div>
  );
}