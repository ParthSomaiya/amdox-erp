import {
  Bell,
  Search,
  Sparkles,
  LogOut,
} from "lucide-react";

import {
  useNavigate,
} from "react-router-dom";

export default function Navbar() {

  const navigate =
    useNavigate();

  // ================= USER =================

  const user =
    JSON.parse(
      localStorage.getItem("user") || "{}"
    );

  // ================= LOGOUT =================

  const logout = () => {

    localStorage.clear();

    navigate("/login");

  };

  return (

    <nav
      className="
        sticky
        top-0
        z-50
        h-24
        px-8
        flex
        items-center
        justify-between
        border-b
        border-white/10
        bg-[#020617]/90
        backdrop-blur-2xl
      "
    >

      {/* LEFT */}

      <div className="flex items-center gap-6">

        {/* SEARCH */}

        <div
          className="
            hidden
            md:flex
            w-[420px]
            h-14
            rounded-2xl
            border
            border-white/10
            bg-white/[0.03]
            items-center
            px-5
            transition-all
            duration-300
            hover:border-cyan-400/40
            hover:bg-white/[0.05]
          "
        >

          <Search
            size={20}
            className="text-slate-400"
          />

          <input
            type="text"
            placeholder="Search..."
            className="
              flex-1
              bg-transparent
              outline-none
              text-white
              px-4
              text-sm
              placeholder:text-slate-500
            "
          />

        </div>

      </div>

      {/* RIGHT */}

      <div className="flex items-center gap-5">

        {/* AI BUTTON */}

        <button
          className="
            hidden
            md:flex
            h-14
            px-6
            rounded-2xl
            bg-gradient-to-r
            from-cyan-500
            via-blue-500
            to-indigo-600
            text-white
            font-semibold
            items-center
            gap-3
            shadow-2xl
            shadow-cyan-500/20
            hover:scale-105
            transition-all
            duration-300
          "
        >

          <Sparkles size={20} />

          AI Assistant

        </button>

        {/* NOTIFICATION */}

        <button
          className="
            relative
            h-14
            w-14
            rounded-2xl
            border
            border-white/10
            bg-white/[0.04]
            flex
            items-center
            justify-center
            hover:bg-white/[0.08]
            transition-all
          "
        >

          <Bell
            size={20}
            className="text-white"
          />

          <div
            className="
              absolute
              top-3
              right-3
              h-2.5
              w-2.5
              rounded-full
              bg-red-500
            "
          />

        </button>

        {/* PROFILE */}

        <div
          className="
            flex
            items-center
            gap-4
            px-4
            py-2
            rounded-2xl
            border
            border-white/10
            bg-white/[0.04]
          "
        >

          {/* AVATAR */}

          <div
            className="
              h-12
              w-12
              rounded-2xl
              bg-gradient-to-r
              from-cyan-400
              to-blue-600
              flex
              items-center
              justify-center
              text-white
              font-black
              text-lg
            "
          >

            {
              user?.name
                ?.charAt(0)
                ?.toUpperCase()
            }

          </div>

          {/* USER INFO */}

          <div>

            <h3 className="text-white font-semibold">

              {user?.name || "User"}

            </h3>

            <p className="text-slate-400 text-sm">

              {user?.role || "EMPLOYEE"}

            </p>

          </div>

        </div>

        {/* LOGOUT */}

        <button
          onClick={logout}
          className="
            h-14
            w-14
            rounded-2xl
            border
            border-red-500/30
            bg-red-500/10
            flex
            items-center
            justify-center
            hover:bg-red-500
            transition-all
            duration-300
            group
          "
        >

          <LogOut
            size={20}
            className="
              text-red-400
              group-hover:text-white
            "
          />

        </button>

      </div>

    </nav>

  );

}