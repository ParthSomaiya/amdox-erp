import { Link, useLocation } from "react-router-dom";

import { jwtDecode } from "jwt-decode";

import { hasPermission } from "../utils/permissions";

export default function Sidebar() {

  const location = useLocation();

  const token =
    localStorage.getItem("token");

  if (!token) return null;

  const permissions = JSON.parse(
    localStorage.getItem("permissions") || "[]"
  );

  let role = null;

  try {

    const decoded =
      jwtDecode(token);

    role = decoded.role;

  } catch (err) {

    console.log("Invalid token");

  }

  const canViewAnalytics =
    ["ADMIN", "HR", "FINANCE"]
      .includes(role);

  // =========================
  // MENU STYLE
  // =========================

  const menuClass = (path) => `
  
    group
    flex
    items-center
    gap-4
    px-4
    py-3
    rounded-2xl
    transition-all
    duration-300
    mb-2

    ${
      location.pathname === path

        ? `
          bg-gradient-to-r
          from-cyan-500
          to-blue-500
          text-white
          shadow-lg
          shadow-cyan-500/20
        `

        : `
          text-slate-400
          hover:bg-white/5
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
        text-[11px]
        uppercase
        tracking-[0.2em]
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
        w-[300px]
        min-h-screen
        bg-[#020617]
        border-r
        border-white/5
        flex
        flex-col
      "
    >

      {/* LOGO */}

      <div
        className="
          h-24
          border-b
          border-white/5
          flex
          items-center
          px-7
        "
      >

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
            shadow-xl
            shadow-cyan-500/20
          "
        >
          ⚡
        </div>

        <div className="ml-4">

          <h2 className="text-2xl font-black text-white tracking-tight">
            AMDOX
          </h2>

          <p className="text-xs text-slate-500 mt-1">
            Enterprise ERP
          </p>

        </div>

      </div>

      {/* MENU */}

      <div
        className="
          flex-1
          overflow-y-auto
          px-5
          py-6
        "
      >

        {/* OVERVIEW */}

        <Section title="Overview" />

        <Link
          to="/dashboard"
          className={menuClass("/dashboard")}
        >

          <span className="text-xl">
            📊
          </span>

          <span className="font-medium">
            Dashboard
          </span>

        </Link>

        {/* ADMIN */}

        {role === "ADMIN" && (
          <>

            <Section title="Administration" />

            <Link
              to="/users"
              className={menuClass("/users")}
            >
              <span className="text-xl">👑</span>
              <span>Users</span>
            </Link>

            <Link
              to="/reports"
              className={menuClass("/reports")}
            >
              <span className="text-xl">📄</span>
              <span>Reports</span>
            </Link>

            <Link
              to="/admin/adminsettings"
              className={menuClass("/admin/adminsettings")}
            >
              <span className="text-xl">⚙️</span>
              <span>Admin Settings</span>
            </Link>

            <Link
              to="/admin/securitysettings"
              className={menuClass("/admin/securitysettings")}
            >
              <span className="text-xl">🔐</span>
              <span>Security</span>
            </Link>

            <Link
              to="/admin/tenantmanagement"
              className={menuClass("/admin/tenantmanagement")}
            >
              <span className="text-xl">🏢</span>
              <span>Tenants</span>
            </Link>

            <Link
              to="/admin/auditlogs"
              className={menuClass("/admin/auditlogs")}
            >
              <span className="text-xl">📜</span>
              <span>Audit Logs</span>
            </Link>

          </>
        )}

        {/* HR */}

        {(role === "HR" ||
          role === "ADMIN") && (
          <>

            <Section title="Human Resources" />

            <Link
              to="/employees"
              className={menuClass("/employees")}
            >
              <span className="text-xl">👥</span>
              <span>Employees</span>
            </Link>

            <Link
              to="/leave"
              className={menuClass("/leave")}
            >
              <span className="text-xl">📝</span>
              <span>Leave</span>
            </Link>

            <Link
              to="/manage-leave"
              className={menuClass("/manage-leave")}
            >
              <span className="text-xl">✅</span>
              <span>Manage Leaves</span>
            </Link>

            <Link
              to="/attendance-report"
              className={menuClass("/attendance-report")}
            >
              <span className="text-xl">📅</span>
              <span>Attendance</span>
            </Link>

            <Link
              to="/generate-payroll"
              className={menuClass("/generate-payroll")}
            >
              <span className="text-xl">💵</span>
              <span>Generate Payroll</span>
            </Link>

          </>
        )}

        {/* FINANCE */}

        {(role === "FINANCE" ||
          role === "ADMIN") && (
          <>

            <Section title="Finance" />

            <Link
              to="/invoices"
              className={menuClass("/invoices")}
            >
              <span className="text-xl">🧾</span>
              <span>Invoices</span>
            </Link>

            <Link
              to="/payments"
              className={menuClass("/payments")}
            >
              <span className="text-xl">💳</span>
              <span>Payments</span>
            </Link>

            <Link
              to="/finance-analytics"
              className={menuClass("/finance-analytics")}
            >
              <span className="text-xl">📈</span>
              <span>Analytics</span>
            </Link>

            <Link
              to="/gl"
              className={menuClass("/gl")}
            >
              <span className="text-xl">📘</span>
              <span>General Ledger</span>
            </Link>

          </>
        )}

        {/* SUPPLY */}

        {(role === "ADMIN" ||
          role === "FINANCE") && (
          <>

            <Section title="Inventory" />

            <Link
              to="/inventory"
              className={menuClass("/inventory")}
            >
              <span className="text-xl">📦</span>
              <span>Inventory</span>
            </Link>

            <Link
              to="/products"
              className={menuClass("/products")}
            >
              <span className="text-xl">🏷️</span>
              <span>Products</span>
            </Link>

            <Link
              to="/purchase-orders"
              className={menuClass("/purchase-orders")}
            >
              <span className="text-xl">🧾</span>
              <span>Purchase Orders</span>
            </Link>

          </>
        )}

        {/* PROJECT */}

        {(role === "ADMIN" ||
          role === "HR") && (
          <>

            <Section title="Projects" />

            <Link
              to="/projects"
              className={menuClass("/projects")}
            >
              <span className="text-xl">📊</span>
              <span>Projects</span>
            </Link>

            <Link
              to="/tasks-board"
              className={menuClass("/tasks-board")}
            >
              <span className="text-xl">🧩</span>
              <span>Task Board</span>
            </Link>

            <Link
              to="/calendar"
              className={menuClass("/calendar")}
            >
              <span className="text-xl">📆</span>
              <span>Calendar</span>
            </Link>

            <Link
              to="/team-chat"
              className={menuClass("/team-chat")}
            >
              <span className="text-xl">💬</span>
              <span>Team Chat</span>
            </Link>

          </>
        )}

        {/* EMPLOYEE */}

        {role === "EMPLOYEE" && (
          <>

            <Section title="Employee Portal" />

            <Link
              to="/profile"
              className={menuClass("/profile")}
            >
              <span className="text-xl">👤</span>
              <span>My Profile</span>
            </Link>

            <Link
              to="/attendance"
              className={menuClass("/attendance")}
            >
              <span className="text-xl">⏱️</span>
              <span>Attendance</span>
            </Link>

            <Link
              to="/apply-leave"
              className={menuClass("/apply-leave")}
            >
              <span className="text-xl">📩</span>
              <span>Apply Leave</span>
            </Link>

          </>
        )}

        {/* ANALYTICS */}

        {canViewAnalytics && (
          <>

            <Section title="Business Intelligence" />

            <Link
              to="/analytics"
              className={menuClass("/analytics")}
            >
              <span className="text-xl">🚀</span>
              <span>Analytics</span>
            </Link>

          </>
        )}

      </div>

      {/* FOOTER */}

      <div
        className="
          border-t
          border-white/5
          p-5
        "
      >

        <div
          className="
            rounded-3xl
            bg-gradient-to-r
            from-cyan-500/10
            to-blue-500/10
            border
            border-cyan-500/10
            p-5
          "
        >

          <p className="text-sm text-slate-300">
            Enterprise ERP v2.0
          </p>

          <p className="text-xs text-slate-500 mt-2">
            Powered by AMDOX Intelligence
          </p>

        </div>

      </div>

    </aside>

  );

}