import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Home() {

  const navigate = useNavigate();

  return (

    <div className="min-h-screen bg-[#020617] text-white overflow-hidden">

      {/* NAVBAR */}
      <Navbar />

      {/* BACKGROUND EFFECTS */}

      <div className="absolute top-0 left-0 w-full overflow-hidden pointer-events-none">

        <div
          className="
            absolute
            top-[-250px]
            left-[-200px]
            w-[600px]
            h-[600px]
            bg-cyan-500/20
            blur-[140px]
            rounded-full
          "
        />

        <div
          className="
            absolute
            top-[100px]
            right-[-200px]
            w-[500px]
            h-[500px]
            bg-blue-500/20
            blur-[140px]
            rounded-full
          "
        />

      </div>

      {/* HERO */}

      <section
        className="
          relative
          pt-40
          pb-32
          px-6
        "
      >

        <div
          className="
            max-w-7xl
            mx-auto
            grid
            lg:grid-cols-2
            gap-20
            items-center
          "
        >

          {/* LEFT */}

          <div>

            {/* BADGE */}

            <div
              className="
                inline-flex
                items-center
                gap-2
                px-4
                py-2
                rounded-full
                border
                border-cyan-500/20
                bg-cyan-500/10
                text-cyan-300
                text-sm
                mb-8
              "
            >
              ✨ AI Powered Enterprise Platform
            </div>

            {/* TITLE */}

            <h1
              className="
                text-6xl
                lg:text-7xl
                font-black
                leading-tight
                tracking-tight
              "
            >

              Modern ERP
              <br />

              <span
                className="
                  bg-gradient-to-r
                  from-cyan-400
                  via-blue-400
                  to-indigo-400
                  bg-clip-text
                  text-transparent
                "
              >
                For Global Teams
              </span>

            </h1>

            {/* DESC */}

            <p
              className="
                mt-8
                text-xl
                text-slate-400
                leading-relaxed
                max-w-2xl
              "
            >
              Unified HR, Finance, Inventory,
              Payroll, Projects, Analytics,
              Team Collaboration and AI Operations —
              all inside one next-generation ERP ecosystem.
            </p>

            {/* BUTTONS */}

            <div className="mt-12 flex flex-wrap gap-5">

              <button
                onClick={() => navigate("/login")}
                className="
                  px-8
                  py-4
                  rounded-2xl
                  bg-gradient-to-r
                  from-cyan-500
                  to-blue-500
                  text-lg
                  font-semibold
                  shadow-2xl
                  shadow-cyan-500/20
                  hover:scale-105
                  transition-all
                "
              >
                Launch Platform
              </button>

              <button
                onClick={() => navigate("/register")}
                className="
                  px-8
                  py-4
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/5
                  backdrop-blur-xl
                  text-lg
                  font-semibold
                  hover:bg-white/10
                  transition-all
                "
              >
                Create Workspace
              </button>

            </div>

            {/* STATS */}

            <div className="mt-16 grid grid-cols-3 gap-8">

              <div>
                <h2 className="text-4xl font-bold">
                  50K+
                </h2>

                <p className="text-slate-400 mt-2">
                  Users
                </p>
              </div>

              <div>
                <h2 className="text-4xl font-bold">
                  120+
                </h2>

                <p className="text-slate-400 mt-2">
                  Countries
                </p>
              </div>

              <div>
                <h2 className="text-4xl font-bold">
                  99.9%
                </h2>

                <p className="text-slate-400 mt-2">
                  Uptime
                </p>
              </div>

            </div>

          </div>

          {/* RIGHT */}

          <div className="relative">

            {/* MAIN CARD */}

            <div
              className="
                relative
                rounded-[40px]
                border
                border-white/10
                bg-white/5
                backdrop-blur-2xl
                p-8
                shadow-2xl
              "
            >

              {/* TOP */}

              <div className="flex items-center justify-between mb-8">

                <div>
                  <h3 className="text-2xl font-bold">
                    Enterprise Overview
                  </h3>

                  <p className="text-slate-400 mt-1">
                    Real-time business analytics
                  </p>
                </div>

                <div
                  className="
                    h-14
                    w-14
                    rounded-2xl
                    bg-gradient-to-r
                    from-cyan-500
                    to-blue-500
                    flex
                    items-center
                    justify-center
                    text-2xl
                  "
                >
                  📊
                </div>

              </div>

              {/* GRID */}

              <div className="grid grid-cols-2 gap-5">

                <div
                  className="
                    rounded-3xl
                    bg-[#0F172A]
                    p-6
                    border
                    border-white/5
                  "
                >

                  <p className="text-slate-400 text-sm">
                    Revenue
                  </p>

                  <h2 className="text-3xl font-bold mt-3">
                    $2.4M
                  </h2>

                  <div className="mt-5 h-2 rounded-full bg-slate-700 overflow-hidden">

                    <div className="w-[78%] h-full bg-cyan-500 rounded-full" />

                  </div>

                </div>

                <div
                  className="
                    rounded-3xl
                    bg-[#0F172A]
                    p-6
                    border
                    border-white/5
                  "
                >

                  <p className="text-slate-400 text-sm">
                    Employees
                  </p>

                  <h2 className="text-3xl font-bold mt-3">
                    1,284
                  </h2>

                  <div className="mt-5 flex -space-x-3">

                    <div className="h-10 w-10 rounded-full bg-cyan-500 border-2 border-[#0F172A]" />

                    <div className="h-10 w-10 rounded-full bg-blue-500 border-2 border-[#0F172A]" />

                    <div className="h-10 w-10 rounded-full bg-indigo-500 border-2 border-[#0F172A]" />

                  </div>

                </div>

                <div
                  className="
                    rounded-3xl
                    bg-[#0F172A]
                    p-6
                    border
                    border-white/5
                  "
                >

                  <p className="text-slate-400 text-sm">
                    AI Insights
                  </p>

                  <h2 className="text-3xl font-bold mt-3">
                    94%
                  </h2>

                  <p className="text-emerald-400 mt-4 text-sm">
                    ↑ Operational efficiency
                  </p>

                </div>

                <div
                  className="
                    rounded-3xl
                    bg-[#0F172A]
                    p-6
                    border
                    border-white/5
                  "
                >

                  <p className="text-slate-400 text-sm">
                    Active Projects
                  </p>

                  <h2 className="text-3xl font-bold mt-3">
                    48
                  </h2>

                  <p className="text-cyan-400 mt-4 text-sm">
                    Real-time tracking enabled
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* MODULES */}

      <section className="relative py-28 px-6">

        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-20">

            <h2 className="text-5xl font-bold">
              Everything Your Enterprise Needs
            </h2>

            <p className="text-slate-400 text-xl mt-6">
              Built for modern organizations and global operations
            </p>

          </div>

          <div className="grid lg:grid-cols-3 gap-8">

            {[
              {
                icon: "👥",
                title: "HR & Workforce",
                desc: "Advanced employee lifecycle management, payroll, attendance, recruitment and AI analytics."
              },
              {
                icon: "💰",
                title: "Finance Suite",
                desc: "Real-time accounting, GST, invoicing, balance sheets and automated reconciliation."
              },
              {
                icon: "📦",
                title: "Inventory Control",
                desc: "Warehouse intelligence, procurement, stock analytics and supply chain automation."
              },
              {
                icon: "📈",
                title: "Business Analytics",
                desc: "AI-powered dashboards, forecasting and real-time enterprise insights."
              },
              {
                icon: "🧩",
                title: "Project Management",
                desc: "Task boards, collaboration, timelines and enterprise workflow orchestration."
              },
              {
                icon: "🤖",
                title: "AI Operations",
                desc: "Intelligent automation, recommendations and predictive operational insights."
              },
            ].map((item, index) => (

              <div
                key={index}
                className="
                  rounded-[32px]
                  border
                  border-white/10
                  bg-white/5
                  backdrop-blur-2xl
                  p-8
                  hover:translate-y-[-8px]
                  transition-all
                  duration-300
                "
              >

                <div className="text-5xl mb-6">
                  {item.icon}
                </div>

                <h3 className="text-2xl font-bold">
                  {item.title}
                </h3>

                <p className="mt-5 text-slate-400 leading-relaxed">
                  {item.desc}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* FOOTER */}

      <footer
        className="
          border-t
          border-white/5
          py-10
          text-center
          text-slate-500
        "
      >

        © 2026 AMDOX ERP — Enterprise Intelligence Platform

      </footer>

    </div>

  );

}