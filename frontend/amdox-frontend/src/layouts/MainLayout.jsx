import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";

import Navbar from "../components/Navbar";

export default function MainLayout() {

  return (

    <div
      className="
        min-h-screen
        bg-[#020617]
        text-white
        flex
        overflow-hidden
        relative
      "
    >

      {/* ================= BACKGROUND GLOW ================= */}

      <div
        className="
          absolute
          top-[-200px]
          left-[-200px]
          w-[500px]
          h-[500px]
          bg-blue-500/10
          blur-[140px]
          rounded-full
          pointer-events-none
        "
      />

      <div
        className="
          absolute
          bottom-[-250px]
          right-[-250px]
          w-[600px]
          h-[600px]
          bg-purple-500/10
          blur-[160px]
          rounded-full
          pointer-events-none
        "
      />

      {/* ================= SIDEBAR ================= */}

      <Sidebar />

      {/* ================= CONTENT ================= */}

      <div
        className="
          flex-1
          flex
          flex-col
          relative
          z-10
          overflow-hidden
        "
      >

        {/* ================= TOPBAR ================= */}

        <Navbar />

        {/* ================= PAGE CONTENT ================= */}

        <main
          className="
            flex-1
            overflow-y-auto
            px-8
            py-8
          "
        >

          <div
            className="
              max-w-[1800px]
              mx-auto
            "
          >

            <Outlet />

          </div>

        </main>

      </div>

    </div>

  );

}