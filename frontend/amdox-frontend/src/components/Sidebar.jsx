import { jwtDecode } from "jwt-decode";
import { Link } from "react-router-dom";

export default function Sidebar() {
  const token = localStorage.getItem("token");

  if (!token) return <div>Please login</div>;

  let role = "UNKNOWN";

  try {
    const decoded = jwtDecode(token);
    role = decoded.role;
  } catch (err) {}

  return (
    <div style={{ width: "200px", background: "#eee", padding: "10px" }}>
      <h3>{role} Panel</h3>

      <Link to="/dashboard">Dashboard</Link><br />

      {role === "ADMIN" && (
        <>
          <p>Users</p>
          <p>Reports</p>
        </>
      )}

      {role === "HR" && (
        <>
          <Link to="/employees">Employees</Link><br />
          <Link to="/leave">Leave</Link><br />
        </>
      )}

      {role === "FINANCE" && (
        <>
          <p>Invoices</p>
          <p>Payments</p>
        </>
      )}

      {role === "EMPLOYEE" && (
        <>
          <p>My Profile</p>
          <Link to="/attendance">Attendance</Link>
          <Link to="/apply-leave">Apply Leave</Link>
          <Link to="/my-payslip">My Payslip</Link>
        </>
      )}
    </div>
  );
}