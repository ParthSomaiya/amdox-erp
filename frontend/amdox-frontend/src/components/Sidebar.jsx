import { Link, useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function Sidebar() {

  const location = useLocation();
  const navigate = useNavigate();

  // =========================
  // GET USER DATA
  // =========================

  const token = localStorage.getItem("token");

  const user =
    JSON.parse(localStorage.getItem("user") || "{}");

  if (!token || !user) return null;

  let role = user?.role || null;

  // =========================
  // TOKEN CHECK
  // =========================

  try {

    const decoded = jwtDecode(token);

    role = decoded?.role || role;

  } catch (err) {

    console.log("Invalid token");

    localStorage.clear();

    navigate("/login");

  }

  // =========================
  // MENU ACTIVE STYLE
  // =========================

  const isActive = (path) => {

    return location.pathname === path ||
      location.pathname.startsWith(path + "/");

  };

  const menuClass = (path) => `
  
    flex
    items-center
    gap-3
    px-4
    py-3
    rounded-xl
    transition-all
    duration-300
    mb-2
    font-medium

    ${
      isActive(path)

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

  // =========================
  // SECTION TITLE
  // =========================

  const Section = ({ title }) => (

    <div
      className="
        text-xs
        uppercase
        tracking-widest
        text-slate-500
        mt-7
        mb-3
        px-2
        font-bold
      "
    >
      {title}
    </div>

  );

  // =========================
  // LOGOUT
  // =========================

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
        flex
        flex-col
      "
    >

      {/* ================= LOGO ================= */}

      <div
        className="
          h-20
          border-b
          border-slate-800
          flex
          items-center
          px-6
        "
      >

        <div
          className="
            h-12
            w-12
            rounded-xl
            bg-gradient-to-r
            from-cyan-500
            to-blue-600
            flex
            items-center
            justify-center
            text-xl
          "
        >
          ⚡
        </div>

        <div className="ml-3">

          <h1 className="text-white font-black text-xl">
            AMDOX ERP
          </h1>

          <p className="text-slate-500 text-xs">
            Enterprise System
          </p>

        </div>

      </div>

      {/* ================= MENU ================= */}

      <div
        className="
          flex-1
          overflow-y-auto
          px-4
          py-5
        "
      >

        {/* ================= COMMON ================= */}

        <Section title="Main" />

        <Link
          to="/dashboard"
          className={menuClass("/dashboard")}
        >
          <span>📊</span>
          <span>Dashboard</span>
        </Link>

        <Link
          to="/notifications"
          className={menuClass("/notifications")}
        >
          <span>🔔</span>
          <span>Notifications</span>
        </Link>

        <Link
          to="/calendar"
          className={menuClass("/calendar")}
        >
          <span>📅</span>
          <span>Calendar</span>
        </Link>

        {/* ================= ADMIN ================= */}

        {role === "ADMIN" && (

          <>

            <Section title="Administration" />

            <Link
              to="/employees"
              className={menuClass("/employees")}
            >
              <span>👥</span>
              <span>Employees</span>
            </Link>

            <Link
              to="/analytics"
              className={menuClass("/analytics")}
            >
              <span>📈</span>
              <span>Analytics</span>
            </Link>

            <Link
              to="/inventory"
              className={menuClass("/inventory")}
            >
              <span>📦</span>
              <span>Inventory</span>
            </Link>

            <Link
              to="/projects"
              className={menuClass("/projects")}
            >
              <span>🧩</span>
              <span>Projects</span>
            </Link>

            <Link
              to="/payroll-dashboard"
              className={menuClass("/payroll-dashboard")}
            >
              <span>💵</span>
              <span>Payroll</span>
            </Link>

            <Link
              to="/gl"
              className={menuClass("/gl")}
            >
              <span>📘</span>
              <span>Finance</span>
            </Link>

            <Link
              to="/admin/settings"
              className={menuClass("/admin/settings")}
            >
              <span>⚙️</span>
              <span>Admin Settings</span>
            </Link>

            <Link
              to="/admin/security"
              className={menuClass("/admin/security")}
            >
              <span>🔐</span>
              <span>Security</span>
            </Link>

            <Link
              to="/admin/tenants"
              className={menuClass("/admin/tenants")}
            >
              <span>🏢</span>
              <span>Tenants</span>
            </Link>

            <Link
              to="/admin/audit"
              className={menuClass("/admin/audit")}
            >
              <span>📜</span>
              <span>Audit Logs</span>
            </Link>

          </>

        )}

        {/* ================= HR ================= */}

        {(role === "HR" || role === "ADMIN") && (

          <>

            <Section title="Human Resources" />

            <Link
              to="/employees"
              className={menuClass("/employees")}
            >
              <span>👨‍💼</span>
              <span>Employees</span>
            </Link>

            <Link
              to="/apply-leave"
              className={menuClass("/apply-leave")}
            >
              <span>📝</span>
              <span>Apply Leave</span>
            </Link>

            <Link
              to="/manage-leave"
              className={menuClass("/manage-leave")}
            >
              <span>✅</span>
              <span>Manage Leave</span>
            </Link>

            <Link
              to="/attendance-report"
              className={menuClass("/attendance-report")}
            >
              <span>📋</span>
              <span>Attendance Report</span>
            </Link>

          </>

        )}

        {/* ================= FINANCE ================= */}

        {(role === "FINANCE" || role === "ADMIN") && (

          <>

            <Section title="Finance" />

            <Link
              to="/create-invoice"
              className={menuClass("/create-invoice")}
            >
              <span>🧾</span>
              <span>Create Invoice</span>
            </Link>

            <Link
              to="/bills"
              className={menuClass("/bills")}
            >
              <span>💳</span>
              <span>Bills</span>
            </Link>

            <Link
              to="/receivables"
              className={menuClass("/receivables")}
            >
              <span>💰</span>
              <span>Receivables</span>
            </Link>

            <Link
              to="/balance-sheet"
              className={menuClass("/balance-sheet")}
            >
              <span>📊</span>
              <span>Balance Sheet</span>
            </Link>

          </>

        )}

        {/* ================= EMPLOYEE ================= */}

        {role === "EMPLOYEE" && (

          <>

            <Section title="Employee" />

            <Link
              to="/dashboard"
              className={menuClass("/dashboard")}
            >
              <span>🏠</span>
              <span>My Dashboard</span>
            </Link>

            <Link
              to="/attendance"
              className={menuClass("/attendance")}
            >
              <span>⏱️</span>
              <span>Attendance</span>
            </Link>

            <Link
              to="/apply-leave"
              className={menuClass("/apply-leave")}
            >
              <span>📩</span>
              <span>Apply Leave</span>
            </Link>

            <Link
              to="/my-payslip"
              className={menuClass("/my-payslip")}
            >
              <span>💵</span>
              <span>My Payslip</span>
            </Link>

          </>

        )}

        {/* ================= JOB SEEKER ================= */}

        {role === "JOB_SEEKER" && (

          <>

            <Section title="Career Portal" />

            <Link
              to="/careers"
              className={menuClass("/careers")}
            >
              <span>💼</span>
              <span>Career Portal</span>
            </Link>

          </>

        )}

      </div>

      {/* ================= FOOTER ================= */}

      <div
        className="
          border-t
          border-slate-800
          p-4
        "
      >

        <button
          onClick={logout}
          className="
            w-full
            bg-red-500
            hover:bg-red-600
            text-white
            py-3
            rounded-xl
            transition-all
            duration-300
            font-semibold
          "
        >
          Logout
        </button>

      </div>

    </aside>

  );

}