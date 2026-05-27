import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function MainLayout() {

  return (

    <div className="flex bg-[#020617]">

      <Sidebar />

      <div className="flex-1 min-h-screen">

        <Navbar />

        <main className="p-6 bg-slate-100 min-h-[calc(100vh-96px)]">

          <Outlet />

        </main>

      </div>

    </div>

  );

}