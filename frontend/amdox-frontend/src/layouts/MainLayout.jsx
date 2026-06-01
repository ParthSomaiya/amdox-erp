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
    <div className="flex bg-slate-50 min-h-screen relative overflow-x-hidden font-sans max-w-[1440px] mx-auto w-full">
      
      {/* 📱 Mobile Menu Trigger */}
      {!isJobSeeker && (
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="lg:hidden fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-xl transition-all active:scale-95 cursor-pointer"
        >
          {isSidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      )}

      {/* 📂 Drawer Backdrop */}
      {isSidebarOpen && !isJobSeeker && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs transition-opacity duration-300"
        />
      )}

      {/* 📋 Single Sliding Sidebar Container */}
      {!isJobSeeker && (
        <div
          className={`fixed top-0 bottom-0 left-0 h-screen w-[280px] bg-white z-40 border-r border-slate-200/80 transition-transform duration-300 lg:sticky lg:transform-none overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-300 ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
        >
          <div onClick={() => setIsSidebarOpen(false)} className="h-full">
            <Sidebar />
          </div>
        </div>
      )}

      {/* 💬 Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} isJobSeeker={isJobSeeker} />
        <main className="flex-1 p-3 sm:p-6 bg-slate-50 overflow-y-auto">
          <div className="max-w-full mx-auto space-y-6 w-full">
            <Outlet context={{ setIsSidebarOpen }} />
          </div>
        </main>
      </div>
    </div>
  );
}