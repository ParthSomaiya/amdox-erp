import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Menu, X } from "lucide-react";

export default function MainLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isJobSeeker = user?.role === "JOB_SEEKER";

  return (
    // 🔹 મોનિટર ગેપ્સ દૂર કરવા માટે 'max-w-[1440px] mx-auto' હટાવીને ફુલ-સ્ક્રીન ફ્લુઇડ લેઆઉટ સેટ કર્યો છે
    <div className="flex bg-slate-50 min-h-screen relative font-sans w-full">
      
      {/* 📱 Mobile Menu Floating Trigger Button */}
      {!isJobSeeker && (
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="lg:hidden fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-xl transition-all active:scale-95 cursor-pointer"
        >
          {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      )}

      {/* 📂 Mobile Drawer Backdrop Overlay */}
      {isSidebarOpen && !isJobSeeker && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300"
        />
      )}

      {/* 📋 ૧. મોબાઇલ સાઇડબાર ડ્રોઅર (મોબાઇલ પર જ એક્ટિવ થશે) */}
      {!isJobSeeker && (
        <div
          className={`
            fixed inset-y-0 left-0 h-screen w-[280px] bg-white z-40 border-r border-slate-200/80 transition-transform duration-300 overflow-y-auto lg:hidden
            [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-300
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <div onClick={() => setIsSidebarOpen(false)} className="h-full">
            <Sidebar />
          </div>
        </div>
      )}

      {/* 💻 ૨. ડેસ્કટોપ સ્ટીકી સાઇડબાર (મોટા મોનિટર પર કન્ફ્લિક્ટ અને લેફ્ટ ગેપ અટકાવે છે) */}
      {!isJobSeeker && (
        <div className="hidden lg:block sticky top-0 h-screen w-[280px] bg-white border-r border-slate-200/80 shrink-0 z-30 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-300">
          <Sidebar />
        </div>
      )}

      {/* 💬 Main Content Workspace (નેવબાર અને બોડી સેક્શન વચ્ચે ઝીરો ગેપ સુનિશ્ચિત કરે છે) */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} isJobSeeker={isJobSeeker} />
        
        {/* 🔹 કન્ટેન્ટ બોડી પેડિંગ */}
        <main className="flex-1 p-4 sm:p-6 bg-slate-50 overflow-y-auto">
          <div className="max-w-full mx-auto space-y-6 w-full">
            <Outlet context={{ setIsSidebarOpen }} />
          </div>
        </main>
      </div>
    </div>
  );
}