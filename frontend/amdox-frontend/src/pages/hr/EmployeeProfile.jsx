import { useEffect, useState } from "react";
import { User, Mail, Shield, Award, Calendar, ShieldCheck } from "lucide-react";

export default function EmployeeProfile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const userObj = JSON.parse(localStorage.getItem("user") || "{}");
    setProfile(userObj);
  }, []);

  if (!profile) return null;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 p-8 rounded-[32px] text-white shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex items-center gap-6">
          <div className="h-20 w-20 rounded-3xl bg-white/20 flex items-center justify-center text-3xl font-black">
            {profile.name?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-black">{profile.name}</h1>
            <p className="text-indigo-100 text-sm mt-1">Enterprise Work Profile details & status.</p>
          </div>
        </div>
      </div>

      {/* Profile Specs Cards */}
      <div className="bg-white rounded-[32px] shadow-sm border p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border">
          <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <User size={20} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Full Name</span>
            <h3 className="text-sm font-bold text-slate-800 mt-0.5">{profile.name}</h3>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border">
          <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Mail size={20} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Email Address</span>
            <h3 className="text-sm font-bold text-slate-800 mt-0.5">{profile.email}</h3>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border">
          <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Shield size={20} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase">System Role</span>
            <h3 className="text-sm font-bold text-indigo-600 mt-0.5">{profile.role || "EMPLOYEE"}</h3>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border">
          <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <ShieldCheck size={20} />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase">Account Status</span>
            <h3 className="text-sm font-bold text-emerald-600 mt-0.5">Verified Active</h3>
          </div>
        </div>
      </div>
    </div>
  );
}