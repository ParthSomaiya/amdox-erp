import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function MainLayout() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const isJobSeeker = user?.role === "JOB_SEEKER";

  return (
    <div className="flex bg-slate-50 min-h-screen">
      {/* Sidebar Navigation - Hidden completely for Job Seekers */}
      {!isJobSeeker && (
        <div className="hidden lg:block w-[280px] shrink-0">
          <Sidebar />
        </div>
      )}

      {/* Main Content Area - Expands to full-width for Job Seekers */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 p-6 md:p-8 bg-slate-50 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}