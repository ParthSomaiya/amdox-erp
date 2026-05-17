import { Link } from "react-router-dom";

export default function HRDashboard() {
  return (
    <div>
      <h2>HR Dashboard</h2>
      <Link to="/applicants">View Applicants</Link>
    </div>
  );
}