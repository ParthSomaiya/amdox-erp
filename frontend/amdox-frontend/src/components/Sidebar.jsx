import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";

export default function Sidebar() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const { role } = jwtDecode(token);

  const canViewAnalytics = ["ADMIN", "HR", "FINANCE"].includes(role);

  return (
    <div className="w-64 bg-gray-900 text-white p-5">
      <h2 className="text-2xl font-bold mb-6">Amdox ERP</h2>

      <nav className="space-y-3">

        <Link to="/dashboard" className="block hover:text-gray-300">
          Dashboard
        </Link>

        {/* ADMIN */}
        {role === "ADMIN" && (
          <>
            <Link to="/users" className="block">Users</Link>
            <Link to="/reports" className="block">Reports</Link>
          </>
        )}

        {/* HR + ADMIN */}
        {(role === "HR" || role === "ADMIN") && (
          <>
            <Link to="/employees" className="block">Employees</Link>
            <Link to="/leave" className="block">Leave</Link>
            <Link to="/manage-leave" className="block">Manage Leaves</Link>
            <Link to="/attendance-report" className="block">Attendance Report</Link>
            <Link to="/generate-payroll" className="block">Generate Payroll</Link>
            <Link to="/payroll" className="block">Payroll List</Link>
          </>
        )}

        {/* FINANCE */}
        {role === "FINANCE" && (
          <>
            <Link to="/invoices" className="block">Invoices</Link>
            <Link to="/payments" className="block">Payments</Link>
            <Link to="/finance-analytics">Finance Analytics</Link>
          </>
        )}

        {/* EMPLOYEE */}
        {role === "EMPLOYEE" && (
          <>
            <Link to="/profile" className="block">My Profile</Link>
            <Link to="/attendance" className="block">Attendance</Link>
            <Link to="/apply-leave" className="block">Apply Leave</Link>
            <Link to="/my-payslip" className="block">My Payslip</Link>
          </>
        )}

        {/* ANALYTICS (COMMON FOR ADMIN, HR, FINANCE) */}
        {canViewAnalytics && (
          <Link to="/analytics" className="block text-blue-400">
            Analytics 📊
          </Link>
        )}

      </nav>
    </div>
  );
}