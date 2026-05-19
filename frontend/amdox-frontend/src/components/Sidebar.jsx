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
    <div className="w-64 bg-gray-900 text-white flex flex-col min-h-screen">

      {/* Logo */}
      <h2 className="text-2xl font-bold p-5 border-b border-gray-700">
        Amdox ERP
      </h2>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 text-sm overflow-y-auto">

        {/* Dashboard */}
        <Link to="/dashboard" className={linkStyle}>
          📊 Dashboard
        </Link>

        {/* 🔥 ADMIN */}
        {role === "ADMIN" && (
          <>
            <div className="border-t border-gray-700 my-2"></div>

            <Link to="/users" className={linkStyle}>
              👑 Users
            </Link>

            <Link to="/reports" className={linkStyle}>
              📄 Reports
            </Link>

            {/* ✅ ADMIN SETTINGS */}
            <Link
              to="/admin/adminsettings"
              className={linkStyle}
            >
              ⚙️ Admin Settings
            </Link>

            <Link
              to="/admin/securitysettings"
              className={linkStyle}
            >
              🔐 Security
            </Link>

            <Link
              to="/admin/tenantmanagement"
              className={linkStyle}
            >
              🏢 Tenants
            </Link>

            <Link
              to="/admin/auditlogs"
              className={linkStyle}
            >
              📜 Audit Logs
            </Link>
          </>
        )}

        {/* HR */}
        {(role === "HR" || role === "ADMIN") && (
          <>
            <div className="border-t border-gray-700 my-2"></div>

            <Link to="/employees" className={linkStyle}>
              👥 Employees
            </Link>

            <Link to="/leave" className={linkStyle}>
              📝 Leave
            </Link>

            <Link to="/manage-leave" className={linkStyle}>
              ✅ Manage Leaves
            </Link>

            <Link
              to="/attendance-report"
              className={linkStyle}
            >
              📅 Attendance Report
            </Link>

            <Link
              to="/generate-payroll"
              className={linkStyle}
            >
              💵 Generate Payroll
            </Link>

            <Link to="/payroll" className={linkStyle}>
              📊 Payroll List
            </Link>
          </>
        )}

        {/* FINANCE */}
        {(role === "FINANCE" || role === "ADMIN") && (
          <>
            <div className="border-t border-gray-700 my-2"></div>

            <Link to="/invoices" className={linkStyle}>
              🧾 Invoices
            </Link>

            <Link to="/payments" className={linkStyle}>
              💳 Payments
            </Link>

            <Link
              to="/finance-analytics"
              className={linkStyle}
            >
              📈 Finance Analytics
            </Link>

            {/* Core Finance */}
            <div className="border-t border-gray-700 my-2"></div>

            <Link to="/gl" className={linkStyle}>
              📘 General Ledger
            </Link>

            <Link to="/bills" className={linkStyle}>
              🧾 Bills (AP)
            </Link>

            <Link to="/receivables" className={linkStyle}>
              💰 Receivables (AR)
            </Link>

            <Link
              to="/reconciliation"
              className={linkStyle}
            >
              🏦 Bank Reconciliation
            </Link>

            {/* Advanced Finance */}
            <div className="border-t border-gray-700 my-2"></div>

            <Link
              to="/trial-balance"
              className={linkStyle}
            >
              📊 Trial Balance
            </Link>

            <Link
              to="/balance-sheet"
              className={linkStyle}
            >
              📑 Balance Sheet
            </Link>

            {/* ✅ PERMISSION BASED LINK */}
            {hasPermission(
              permissions,
              "CREATE_INVOICE"
            ) && (
                <Link
                  to="/create-invoice"
                  className={linkStyle}
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

            <Link to="/inventory" className={linkStyle}>
              📦 Inventory
            </Link>

            <Link to="/products" className={linkStyle}>
              🏷 Products
            </Link>

            <Link
              to="/purchase-orders"
              className={linkStyle}
            >
              🧾 Purchase Orders
            </Link>

            <Link
              to="/stock-history"
              className={linkStyle}
            >
              📊 Stock Movement
            </Link>
          </>
        )}

        {/* 📊 PROJECT MANAGEMENT */}
        {(role === "ADMIN" || role === "HR") && (
          <>
            <div className="border-t border-gray-700 my-2"></div>

            <Link to="/projects" className={linkStyle}>
              📊 Projects
            </Link>

            <Link
              to="/tasks-board"
              className={linkStyle}
            >
              🧩 Task Board
            </Link>

            <Link to="/timeline" className={linkStyle}>
              📅 Timeline
            </Link>
          </>
        )}

        {/* 💼 JOB PORTAL */}
        {(role === "HR" || role === "ADMIN") && (
          <>
            <div className="border-t border-gray-700 my-2"></div>

            <Link to="/jobs" className={linkStyle}>
              💼 Jobs
            </Link>

            <Link to="/applicants" className={linkStyle}>
              🧑‍💻 Applicants
            </Link>
          </>
        )}

        {/* EMPLOYEE */}
        {role === "EMPLOYEE" && (
          <>
            <div className="border-t border-gray-700 my-2"></div>

            <Link to="/profile" className={linkStyle}>
              👤 My Profile
            </Link>

            <Link to="/attendance" className={linkStyle}>
              ⏱ Attendance
            </Link>

            <Link to="/apply-leave" className={linkStyle}>
              📩 Apply Leave
            </Link>

            <Link to="/my-payslip" className={linkStyle}>
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
  );
}