import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function MainLayout() {

  return (

    <div className="flex min-h-screen bg-[#0f172a]">

      <Sidebar />

      <div className="flex-1 flex flex-col">

        <Navbar />

        <main className="flex-1 p-6 overflow-auto">

          <Outlet />

        </main>

      </div>

    </div>

  );

}