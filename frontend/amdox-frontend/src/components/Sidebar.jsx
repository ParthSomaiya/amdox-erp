import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { hasPermission } from "../utils/permissions";

export default function Sidebar() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  // ✅ Permissions
  const permissions = JSON.parse(
    localStorage.getItem("permissions") || "[]"
  );

  let role = null;

  try {
    const decoded = jwtDecode(token);
    role = decoded.role;
  } catch (err) {
    console.log("Invalid token");
  }

  const canViewAnalytics = ["ADMIN", "HR", "FINANCE"].includes(role);

  const linkStyle =
    "block p-2 rounded hover:bg-gray-800 transition duration-200";

  return (
    <div className="sidebar w-64 bg-gray-900 text-white flex flex-col min-h-screen">

      {/* Logo */}
      <h2 className="sidebar-logo text-2xl font-bold p-5 border-b border-gray-700">
        Amdox ERP
      </h2>

      <div className="sidebar-menu">
        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 text-sm overflow-y-auto">

          {/* Dashboard */}
          <Link to="/dashboard" className="sidebar-menu">
            📊 Dashboard
          </Link>

          {/* 🔥 ADMIN */}
          {role === "ADMIN" && (
            <>
              <div className="border-t border-gray-700 my-2"></div>

              <Link to="/users" className="sidebar-menu">
                👑 Users
              </Link>

              <Link to="/reports" className="sidebar-menu">
                📄 Reports
              </Link>

              {/* ✅ ADMIN SETTINGS */}
              <Link
                to="/admin/adminsettings"
                className="sidebar-menu"
              >
                ⚙️ Admin Settings
              </Link>

              <Link
                to="/admin/securitysettings"
                className="sidebar-menu"
              >
                🔐 Security
              </Link>

              <Link
                to="/admin/tenantmanagement"
                className="sidebar-menu"
              >
                🏢 Tenants
              </Link>

              <Link
                to="/admin/auditlogs"
                className="sidebar-menu"
              >
                📜 Audit Logs
              </Link>
            </>
          )}

          {/* HR */}
          {(role === "HR" || role === "ADMIN") && (
            <>
              <div className="border-t border-gray-700 my-2"></div>

              <Link to="/employees" className="sidebar-menu">
                👥 Employees
              </Link>

              <Link to="/leave" className="sidebar-menu">
                📝 Leave
              </Link>

              <Link to="/manage-leave" className="sidebar-menu">
                ✅ Manage Leaves
              </Link>

              <Link
                to="/attendance-report"
                className="sidebar-menu"
              >
                📅 Attendance Report
              </Link>

              <Link
                to="/generate-payroll"
                className="sidebar-menu"
              >
                💵 Generate Payroll
              </Link>

              <Link to="/payroll" className="sidebar-menu">
                📊 Payroll List
              </Link>
            </>
          )}

          {/* FINANCE */}
          {(role === "FINANCE" || role === "ADMIN") && (
            <>
              <div className="border-t border-gray-700 my-2"></div>

              <Link to="/invoices" className="sidebar-menu">
                🧾 Invoices
              </Link>

              <Link to="/payments" className="sidebar-menu">
                💳 Payments
              </Link>

              <Link
                to="/finance-analytics"
                className="sidebar-menu"
              >
                📈 Finance Analytics
              </Link>

              {/* Core Finance */}
              <div className="border-t border-gray-700 my-2"></div>

              <Link to="/gl" className="sidebar-menu">
                📘 General Ledger
              </Link>

              <Link to="/bills" className="sidebar-menu">
                🧾 Bills (AP)
              </Link>

              <Link to="/receivables" className="sidebar-menu">
                💰 Receivables (AR)
              </Link>

              <Link
                to="/reconciliation"
                className="sidebar-menu"
              >
                🏦 Bank Reconciliation
              </Link>

              {/* Advanced Finance */}
              <div className="border-t border-gray-700 my-2"></div>

              <Link
                to="/trial-balance"
                className="sidebar-menu"
              >
                📊 Trial Balance
              </Link>

              <Link
                to="/balance-sheet"
                className="sidebar-menu"
              >
                📑 Balance Sheet
              </Link>

              {
                hasPermission(
                  permissions,
                  "CREATE_INVOICE"
                ) && (
                  <Link
                    to="/create-invoice"
                    className="sidebar-menu"
                  >
                    🧾 Create Invoice
                  </Link>
                )}
            </>
          )}

          {/* 📦 SUPPLY CHAIN */}
          {(role === "ADMIN" || role === "FINANCE") && (
            <>
              <div className="border-t border-gray-700 my-2"></div>

              <Link to="/inventory" className="sidebar-menu">
                📦 Inventory
              </Link>

              <Link to="/products" className="sidebar-menu">
                🏷 Products
              </Link>

              <Link
                to="/purchase-orders"
                className="sidebar-menu"
              >
                🧾 Purchase Orders
              </Link>

              <Link
                to="/stock-history"
                className="sidebar-menu"
              >
                📊 Stock Movement
              </Link>
            </>
          )}

          {/* 📊 PROJECT MANAGEMENT */}
          {(role === "ADMIN" || role === "HR") && (
            <>
              <div className="border-t border-gray-700 my-2"></div>

              <Link to="/projects" className="sidebar-menu">
                📊 Projects
              </Link>

              <Link
                to="/tasks-board"
                className="sidebar-menu"
              >
                🧩 Task Board
              </Link>

              <Link
                to="/timeline"
                className="sidebar-menu"
              >
                📅 Timeline
              </Link>

              <Link
                to="/calendar"
                className="sidebar-menu"
              >
                📆 Calendar
              </Link>

              {/* ✅ NEW TEAM CHAT */}
              <Link
                to="/team-chat"
                className="sidebar-menu"
              >
                💬 Team Chat
              </Link>
            </>
          )}

          {/* 💼 JOB PORTAL */}
          {(role === "HR" || role === "ADMIN") && (
            <>
              <div className="border-t border-gray-700 my-2"></div>

              <Link to="/jobs" className="sidebar-menu">
                💼 Jobs
              </Link>

              <Link to="/applicants" className="sidebar-menu">
                🧑‍💻 Applicants
              </Link>
            </>
          )}

          {/* EMPLOYEE */}
          {role === "EMPLOYEE" && (
            <>
              <div className="border-t border-gray-700 my-2"></div>

              <Link to="/profile" className="sidebar-menu">
                👤 My Profile
              </Link>

              <Link to="/attendance" className="sidebar-menu">
                ⏱ Attendance
              </Link>

              <Link to="/apply-leave" className="sidebar-menu">
                📩 Apply Leave
              </Link>

              <Link to="/my-payslip" className="sidebar-menu">
                📄 My Payslip
              </Link>
            </>
          )}

          {/* COMMON ANALYTICS */}
          {canViewAnalytics && (
            <>
              <div className="border-t border-gray-700 my-2"></div>

              <Link
                to="/analytics"
                className="block p-2 rounded bg-blue-600 hover:bg-blue-500 transition"
              >
                📊 Analytics
              </Link>
            </>
          )}
        </nav>
      </div>
    </div>

  );
}