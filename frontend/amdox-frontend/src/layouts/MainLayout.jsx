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
    // 🔹 1440px ડેસ્કટોપ મોનિટર બ્રેકપોઇન્ટ સપોર્ટ માટે 'max-w-[1440px] mx-auto w-full' કન્સ્ટ્રેઇન્ટ સેટ કર્યો
    <div className="flex bg-slate-50 min-h-screen relative overflow-x-hidden font-sans max-w-[1440px] mx-auto w-full">
      
      {/* 📱 Mobile Menu Trigger - floating action button */}
      {!isJobSeeker && (
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="lg:hidden fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-xl transition-all active:scale-95"
        >
          {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      )}

      {/* 📂 Drawer Backdrop (closes sidebar on click) */}
      {isSidebarOpen && !isJobSeeker && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
        />
      )}

      {/* 📋 Sliding Sidebar Drawer */}
      {!isJobSeeker && (
        <div
          className={`fixed top-0 bottom-0 left-0 h-screen w-[280px] bg-white shrink-0 z-40 border-r border-slate-200/80 transition-transform duration-300 lg:sticky lg:transform-none ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div onClick={() => setIsSidebarOpen(false)}>
            <Sidebar />
          </div>
        </div>
      )}

      {/* 💬 Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* 🔹 મોબાઇલ હેમબર્ગર મેનૂ ક્લિકને સિંક કરવા માટે 'onMenuClick' પ્રોપ નેવબારને પાસ કરી */}
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} isJobSeeker={isJobSeeker} />
        {/* 🔹 375px અને 768px માટે રિસ્પોન્સિવ પેડિંગ એડજસ્ટમેન્ટ */}
        <main className="flex-1 p-3 sm:p-6 lg:p-8 bg-slate-50 overflow-y-auto">
          {/* 🔹 1440px કન્ટેન્ટ સપોર્ટ */}
          <div className="max-w-[1440px] mx-auto space-y-6 w-full">
            <Outlet context={{ setIsSidebarOpen }} />
          </div>
        </main>
      </div>
    </div>
  );
}