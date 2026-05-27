import {
  Link,
  useLocation,
} from "react-router-dom";

export default function Sidebar() {

  const location =
    useLocation();

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const role =
    user?.role;

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

    ${
      location.pathname === path

        ? `
          bg-blue-600
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
          "
        >
          ⚡
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

        <Section title="Overview" />

        <Link
          to="/dashboard"
          className={menuClass("/dashboard")}
        >
          📊 Dashboard
        </Link>

        {(role === "ADMIN" ||
          role === "HR") && (
          <>

            <Section title="HR" />

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

            <Link
              to="/generate-payroll"
              className={menuClass("/generate-payroll")}
            >
              💵 Payroll
            </Link>

          </>
        )}

        {(role === "ADMIN" ||
          role === "FINANCE") && (
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
        )}

        {(role === "ADMIN" ||
          role === "HR") && (
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
        )}

        {role === "ADMIN" && (
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
        )}

        {role === "EMPLOYEE" && (
          <>

            <Section title="Employee Portal" />

            <Link
              to="/employee-dashboard"
              className={menuClass("/employee-dashboard")}
            >
              👤 My Dashboard
            </Link>

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

            <Link
              to="/my-payslip"
              className={menuClass("/my-payslip")}
            >
              💵 Payslip
            </Link>

          </>
        )}

      </div>

    </aside>

  );

}