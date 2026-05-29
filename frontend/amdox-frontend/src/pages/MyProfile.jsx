import { useEffect, useState } from "react";
import { User, Mail, Shield, Building, CheckCircle, Clock } from "lucide-react";

export default function MyProfile() {
  const [user, setUser] = useState({});

  useEffect(() => {
    // લોકલ સ્ટોરેજમાંથી લોગિન યુઝરની વિગતો લોડ કરો
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    setUser(storedUser);
  }, []);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
        <div className="relative z-10 flex items-center gap-6">
          <div className="h-20 w-20 rounded-3xl bg-white/20 flex items-center justify-center text-3xl font-black">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div>
            <h1 className="text-3xl font-black">My Profile</h1>
            <p className="text-indigo-100 text-sm mt-1">Manage your corporate identity and account metadata.</p>
          </div>
        </div>
      </div>

      {/* Profile Details Card */}
      <div className="bg-white rounded-[32px] shadow-lg border border-slate-200/80 p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Full Name */}
        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <User size={20} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Full Name</span>
            <h3 className="text-base font-bold text-slate-800 mt-0.5">{user?.name || "N/A"}</h3>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Mail size={20} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Email Address</span>
            <h3 className="text-base font-bold text-slate-800 mt-0.5">{user?.email || "N/A"}</h3>
          </div>
        </div>

        {/* Role */}
        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Shield size={20} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Workspace Role</span>
            <h3 className="text-base font-bold text-indigo-600 mt-0.5">{user?.role || "N/A"}</h3>
          </div>
        </div>

        {/* Account Status */}
        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
          <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle size={20} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Account Status</span>
            <h3 className="text-base font-bold text-emerald-600 mt-0.5">Active</h3>
          </div>
        </div>
      </div>
    </div>
  );
}