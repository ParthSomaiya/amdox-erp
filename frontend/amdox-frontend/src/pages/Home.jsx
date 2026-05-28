import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  Building2,
  CheckCircle2,
  Globe2,
  ShieldCheck,
  Users,
} from "lucide-react";

import Navbar from "../components/Navbar";

export default function Home() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Users size={34} />,
      title: "HR & Workforce",
      description:
        "Employee lifecycle management, payroll, recruitment, attendance, and performance tracking.",
    },
    {
      icon: <Building2 size={34} />,
      title: "Finance Suite",
      description:
        "Smart accounting, invoicing, GST support, expense management, and financial analytics.",
    },
    {
      icon: <BarChart3 size={34} />,
      title: "Business Analytics",
      description:
        "Real-time dashboards, predictive reporting, and intelligent operational insights.",
    },
    {
      icon: <BrainCircuit size={34} />,
      title: "AI Automation",
      description:
        "AI-powered recommendations, workflow automation, and enterprise intelligence.",
    },
    {
      icon: <Globe2 size={34} />,
      title: "Global Operations",
      description:
        "Built for multi-location organizations with scalable and secure infrastructure.",
    },
    {
      icon: <ShieldCheck size={34} />,
      title: "Enterprise Security",
      description:
        "Advanced authentication, role management, audit tracking, and secure access control.",
    },
  ];

  const stats = [
    {
      value: "50K+",
      label: "Active Users",
    },
    {
      value: "120+",
      label: "Countries",
    },
    {
      value: "99.9%",
      label: "Platform Uptime",
    },
    {
      value: "24/7",
      label: "Support",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020617] text-white">
      {/* BACKGROUND EFFECTS */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="
            absolute
            -left-40
            -top-40
            h-[500px]
            w-[500px]
            rounded-full
            bg-cyan-500/20
            blur-[140px]
          "
        />

        <div
          className="
            absolute
            right-[-120px]
            top-[100px]
            h-[450px]
            w-[450px]
            rounded-full
            bg-blue-500/20
            blur-[140px]
          "
        />

        <div
          className="
            absolute
            bottom-[-150px]
            left-[35%]
            h-[400px]
            w-[400px]
            rounded-full
            bg-indigo-500/20
            blur-[140px]
          "
        />
      </div>

      {/* NAVBAR */}

      <Navbar />

      {/* HERO SECTION */}

      <section className="relative px-6 pb-24 pt-36">
        <div
          className="
            mx-auto
            grid
            max-w-7xl
            items-center
            gap-20
            lg:grid-cols-2
          "
        >
          {/* LEFT CONTENT */}

          <div>
            {/* BADGE */}

            <div
              className="
                mb-8
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-cyan-400/20
                bg-cyan-400/10
                px-5
                py-2
                text-sm
                font-medium
                text-cyan-300
              "
            >
              <CheckCircle2 size={16} />
              AI-Powered Enterprise ERP Platform
            </div>

            {/* HEADING */}

            <h1
              className="
                text-5xl
                font-black
                leading-tight
                tracking-tight
                md:text-6xl
                xl:text-7xl
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
                For Smart Enterprises
              </span>
            </h1>

            {/* DESCRIPTION */}

            <p
              className="
                mt-8
                max-w-2xl
                text-lg
                leading-relaxed
                text-slate-400
                md:text-xl
              "
            >
              Manage HR, payroll, finance, projects, analytics,
              inventory, and AI automation from one intelligent
              enterprise ecosystem built for modern businesses.
            </p>

            {/* BUTTONS */}

            <div className="mt-12 flex flex-wrap gap-5">
              <button
                onClick={() => navigate("/login")}
                className="
                  flex
                  items-center
                  gap-3
                  rounded-2xl
                  bg-gradient-to-r
                  from-cyan-500
                  to-blue-600
                  px-8
                  py-4
                  text-lg
                  font-bold
                  shadow-2xl
                  shadow-cyan-500/20
                  transition-all
                  duration-300
                  hover:scale-105
                "
              >
                Launch Platform
                <ArrowRight size={20} />
              </button>

              <button
                onClick={() => navigate("/register")}
                className="
                  rounded-2xl
                  border
                  border-white/10
                  bg-white/5
                  px-8
                  py-4
                  text-lg
                  font-semibold
                  backdrop-blur-xl
                  transition-all
                  duration-300
                  hover:bg-white/10
                "
              >
                Create Workspace
              </button>
            </div>

            {/* STATS */}

            <div
              className="
                mt-16
                grid
                grid-cols-2
                gap-8
                md:grid-cols-4
              "
            >
              {stats.map((item, index) => (
                <div key={index}>
                  <h3 className="text-4xl font-black">
                    {item.value}
                  </h3>

                  <p className="mt-2 text-slate-400">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE */}

          <div className="relative">
            {/* MAIN CARD */}

            <div
              className="
                relative
                overflow-hidden
                rounded-[40px]
                border
                border-white/10
                bg-white/5
                p-8
                shadow-2xl
                backdrop-blur-2xl
              "
            >
              {/* HEADER */}

              <div className="mb-10 flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-black">
                    Enterprise Overview
                  </h2>

                  <p className="mt-2 text-slate-400">
                    Real-time business insights
                  </p>
                </div>

                <div
                  className="
                    flex
                    h-16
                    w-16
                    items-center
                    justify-center
                    rounded-3xl
                    bg-gradient-to-r
                    from-cyan-500
                    to-blue-600
                    text-3xl
                  "
                >
                  📊
                </div>
              </div>

              {/* ANALYTICS GRID */}

              <div className="grid grid-cols-2 gap-5">
                {/* CARD */}

                <div
                  className="
                    rounded-3xl
                    border
                    border-white/5
                    bg-[#0F172A]
                    p-6
                  "
                >
                  <p className="text-sm text-slate-400">
                    Revenue
                  </p>

                  <h3 className="mt-4 text-3xl font-black">
                    $2.4M
                  </h3>

                  <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-700">
                    <div className="h-full w-[78%] rounded-full bg-cyan-500" />
                  </div>
                </div>

                <div
                  className="
                    rounded-3xl
                    border
                    border-white/5
                    bg-[#0F172A]
                    p-6
                  "
                >
                  <p className="text-sm text-slate-400">
                    Employees
                  </p>

                  <h3 className="mt-4 text-3xl font-black">
                    1,284
                  </h3>

                  <div className="mt-5 flex -space-x-3">
                    <div className="h-10 w-10 rounded-full border-2 border-[#0F172A] bg-cyan-500" />

                    <div className="h-10 w-10 rounded-full border-2 border-[#0F172A] bg-blue-500" />

                    <div className="h-10 w-10 rounded-full border-2 border-[#0F172A] bg-indigo-500" />
                  </div>
                </div>

                <div
                  className="
                    rounded-3xl
                    border
                    border-white/5
                    bg-[#0F172A]
                    p-6
                  "
                >
                  <p className="text-sm text-slate-400">
                    AI Efficiency
                  </p>

                  <h3 className="mt-4 text-3xl font-black">
                    94%
                  </h3>

                  <p className="mt-4 text-sm font-semibold text-emerald-400">
                    ↑ Workflow Optimization
                  </p>
                </div>

                <div
                  className="
                    rounded-3xl
                    border
                    border-white/5
                    bg-[#0F172A]
                    p-6
                  "
                >
                  <p className="text-sm text-slate-400">
                    Active Projects
                  </p>

                  <h3 className="mt-4 text-3xl font-black">
                    48
                  </h3>

                  <p className="mt-4 text-sm font-semibold text-cyan-400">
                    Live Collaboration Enabled
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}

      <section className="relative px-6 py-28">
        <div className="mx-auto max-w-7xl">
          {/* SECTION HEADER */}

          <div className="mb-20 text-center">
            <h2 className="text-4xl font-black md:text-5xl">
              Everything Your Business Needs
            </h2>

            <p className="mt-6 text-lg text-slate-400">
              Powerful modules designed for enterprise productivity
            </p>
          </div>

          {/* FEATURE GRID */}

          <div
            className="
              grid
              gap-8
              md:grid-cols-2
              xl:grid-cols-3
            "
          >
            {features.map((feature, index) => (
              <div
                key={index}
                className="
                  rounded-[32px]
                  border
                  border-white/10
                  bg-white/5
                  p-8
                  backdrop-blur-xl
                  transition-all
                  duration-300
                  hover:-translate-y-2
                  hover:border-cyan-400/20
                  hover:bg-white/[0.07]
                "
              >
                <div
                  className="
                    mb-6
                    flex
                    h-16
                    w-16
                    items-center
                    justify-center
                    rounded-3xl
                    bg-gradient-to-r
                    from-cyan-500
                    to-blue-600
                    text-white
                  "
                >
                  {feature.icon}
                </div>

                <h3 className="text-2xl font-black">
                  {feature.title}
                </h3>

                <p className="mt-5 leading-relaxed text-slate-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}

      <section className="relative px-6 pb-28">
        <div
          className="
            mx-auto
            max-w-7xl
            rounded-[40px]
            border
            border-white/10
            bg-gradient-to-r
            from-cyan-600/20
            via-blue-600/20
            to-indigo-600/20
            p-14
            text-center
            backdrop-blur-2xl
          "
        >
          <h2
            className="
              text-4xl
              font-black
              md:text-5xl
            "
          >
            Ready To Transform Your Enterprise?
          </h2>

          <p
            className="
              mx-auto
              mt-6
              max-w-3xl
              text-lg
              leading-relaxed
              text-slate-300
            "
          >
            Streamline operations, automate workflows, and
            empower your teams with a next-generation ERP platform.
          </p>

          <div className="mt-10 flex justify-center gap-5">
            <button
              onClick={() => navigate("/register")}
              className="
                rounded-2xl
                bg-gradient-to-r
                from-cyan-500
                to-blue-600
                px-8
                py-4
                text-lg
                font-bold
                transition-all
                duration-300
                hover:scale-105
              "
            >
              Get Started
            </button>

            <button
              onClick={() => navigate("/login")}
              className="
                rounded-2xl
                border
                border-white/10
                bg-white/5
                px-8
                py-4
                text-lg
                font-semibold
                transition-all
                duration-300
                hover:bg-white/10
              "
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}

      <footer
        className="
          border-t
          border-white/5
          px-6
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