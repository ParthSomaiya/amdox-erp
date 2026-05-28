import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";

import Navbar from "../components/Navbar";

export default function MainLayout() {

  return (

    <div
      className="
        flex
        min-h-screen
        bg-[#020617]
      "
    >

      {/* SIDEBAR */}

      <Sidebar />

      {/* MAIN CONTENT */}

      <div
        className="
          flex-1
          flex
          flex-col
          overflow-hidden
        "
      >

        {/* NAVBAR */}

        <Navbar />

        {/* PAGE CONTENT */}

        <main
          className="
            flex-1
            overflow-y-auto
            bg-slate-100
            p-6
          "
        >

          <Outlet />

        </main>

      </div>

    </div>

  );

}