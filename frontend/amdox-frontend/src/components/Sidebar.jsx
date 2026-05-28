import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

export default function Sidebar() {

  const location =
    useLocation();

  const navigate =
    useNavigate();

  // ================= USER =================

  const user =
    JSON.parse(
      localStorage.getItem("user") || "{}"
    );

  const role =
    user?.role;

  // ================= ACTIVE CLASS =================

  const menuClass = (path) => `

    flex
    items-center
    gap-3
    px-4
    py-3
    rounded-2xl
    transition-all
    duration-300
    mb-2
    font-medium

    ${
      location.pathname === path

        ? `
          bg-gradient-to-r
          from-cyan-500
          to-blue-600
          text-white
          shadow-lg
        `

        : `
          text-slate-300
          hover:bg-slate-800
          hover:text-white
        `
    }

  `;

  // ================= SECTION =================

  const Section = ({ title }) => (

    <div
      className="
        text-xs
        uppercase
        tracking-widest
        text-slate-500
        mt-8
        mb-3
        px-3
      "
    >
      {title}
    </div>

  );

  // ================= LOGOUT =================

  const logout = () => {

    localStorage.clear();

    navigate("/login");

  };

  return (

    <aside
      className="
        w-[280px]
        min-h-screen
        bg-[#020617]
        border-r
        border-slate-800
        overflow-y-auto
      "
    >

      {/* LOGO */}

      <div
        className="
          h-24
          flex
          items-center
          px-6
          border-b
          border-slate-800
        "
      >

        <div
          className="
            h-14
            w-14
            rounded-2xl
            bg-gradient-to-r
            from-cyan-500
            to-blue-600
            flex
            items-center
            justify-center
            text-2xl
            text-white
            font-black
          "
        >
          A
        </div>

        <div className="ml-4">

          <h1 className="text-2xl font-black text-white">

            AMDOX

          </h1>

          <p className="text-slate-500 text-xs">

            Enterprise ERP

          </p>

        </div>

      </div>

      {/* MENU */}

      <div className="p-5">

        {/* COMMON */}

        <Section title="Overview" />

        {
          role === "EMPLOYEE"

            ? (

              <Link
                to="/employee-dashboard"
                className={menuClass("/employee-dashboard")}
              >
                👤 Employee Dashboard
              </Link>

            )

            : (

              <Link
                to="/dashboard"
                className={menuClass("/dashboard")}
              >
                📊 Dashboard
              </Link>

            )
        }

        {/* HR */}

        {
          (
            role === "ADMIN" ||
            role === "HR"
          ) && (
            <>

              <Section title="HR Management" />

              <Link
                to="/employees"
                className={menuClass("/employees")}
              >
                👥 Employees
              </Link>

              <Link
                to="/attendance"
                className={menuClass("/attendance")}
              >
                📅 Attendance
              </Link>

              <Link
                to="/manage-leave"
                className={menuClass("/manage-leave")}
              >
                ✅ Leave Management
              </Link>

            </>
          )
        }

        {/* EMPLOYEE */}

        {
          role === "EMPLOYEE" && (
            <>

              <Section title="Employee Portal" />

              <Link
                to="/attendance"
                className={menuClass("/attendance")}
              >
                📅 Attendance
              </Link>

              <Link
                to="/apply-leave"
                className={menuClass("/apply-leave")}
              >
                📩 Apply Leave
              </Link>

            </>
          )
        }

        {/* FINANCE */}

        {
          (
            role === "ADMIN" ||
            role === "FINANCE"
          ) && (
            <>

              <Section title="Finance" />

              <Link
                to="/gl"
                className={menuClass("/gl")}
              >
                📘 General Ledger
              </Link>

              <Link
                to="/bills"
                className={menuClass("/bills")}
              >
                🧾 Bills
              </Link>

              <Link
                to="/receivables"
                className={menuClass("/receivables")}
              >
                💳 Receivables
              </Link>

            </>
          )
        }

        {/* PROJECT */}

        {
          (
            role === "ADMIN" ||
            role === "HR"
          ) && (
            <>

              <Section title="Projects" />

              <Link
                to="/projects"
                className={menuClass("/projects")}
              >
                🚀 Projects
              </Link>

              <Link
                to="/tasks-board"
                className={menuClass("/tasks-board")}
              >
                🧩 Task Board
              </Link>

            </>
          )
        }

        {/* ADMIN */}

        {
          role === "ADMIN" && (
            <>

              <Section title="Administration" />

              <Link
                to="/admin/settings"
                className={menuClass("/admin/settings")}
              >
                ⚙️ Settings
              </Link>

              <Link
                to="/admin/security"
                className={menuClass("/admin/security")}
              >
                🔐 Security
              </Link>

              <Link
                to="/admin/tenants"
                className={menuClass("/admin/tenants")}
              >
                🏢 Tenants
              </Link>

              <Link
                to="/admin/audit"
                className={menuClass("/admin/audit")}
              >
                📜 Audit Logs
              </Link>

            </>
          )
        }

        {/* OTHER */}

        <Section title="Workspace" />

        <Link
          to="/calendar"
          className={menuClass("/calendar")}
        >
          📆 Calendar
        </Link>

        <Link
          to="/team-chat"
          className={menuClass("/team-chat")}
        >
          💬 Team Chat
        </Link>

        <Link
          to="/notifications"
          className={menuClass("/notifications")}
        >
          🔔 Notifications
        </Link>

        {/* LOGOUT */}

        <button
          onClick={logout}
          className="
            mt-10
            w-full
            bg-red-500
            hover:bg-red-600
            text-white
            py-3
            rounded-2xl
            font-semibold
            transition-all
          "
        >

          Logout

        </button>

      </div>

    </aside>

  );

}