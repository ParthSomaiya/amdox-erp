import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

export default function Sidebar() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const { role } = jwtDecode(token);

  const canViewAnalytics = ["ADMIN", "HR", "FINANCE"].includes(role);

  const linkStyle =
    "block p-2 rounded hover:bg-gray-800 transition duration-200";

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col">
      
      {/* Logo / Title */}
      <h2 className="text-2xl font-bold p-5 border-b border-gray-700">
        Amdox ERP
      </h2>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 text-sm">

        {/* Dashboard */}
        <Link to="/dashboard" className={linkStyle}>
          📊 Dashboard
        </Link>

        {/* ADMIN */}
        {role === "ADMIN" && (
          <>
            <Link to="/users" className={linkStyle}>
              👑 Users
            </Link>
            <Link to="/reports" className={linkStyle}>
              📄 Reports
            </Link>
          </>
        )}

        {/* HR + ADMIN */}
        {(role === "HR" || role === "ADMIN") && (
          <>
            <Link to="/employees" className={linkStyle}>
              👥 Employees
            </Link>
            <Link to="/leave" className={linkStyle}>
              📝 Leave
            </Link>
            <Link to="/manage-leave" className={linkStyle}>
              ✅ Manage Leaves
            </Link>
            <Link to="/attendance-report" className={linkStyle}>
              📅 Attendance Report
            </Link>
            <Link to="/generate-payroll" className={linkStyle}>
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
            <Link to="/invoices" className={linkStyle}>
              🧾 Invoices
            </Link>
            <Link to="/payments" className={linkStyle}>
              💳 Payments
            </Link>
            <Link to="/finance-analytics" className={linkStyle}>
              📈 Finance Analytics
            </Link>
          </>
        )}

        {/* EMPLOYEE */}
        {role === "EMPLOYEE" && (
          <>
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
          <Link
            to="/analytics"
            className="block p-2 rounded bg-blue-600 hover:bg-blue-500 transition"
          >
            📊 Analytics
          </Link>
        )}

      </nav>
    </div>
  );
}