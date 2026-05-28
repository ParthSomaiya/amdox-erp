import {
  Navigate,
} from "react-router-dom";

export default function ProtectedRoute({
  children,
}) {

  // ================= TOKEN =================

  const token =
    localStorage.getItem("token");

  // ================= USER =================

  const user =
    JSON.parse(
      localStorage.getItem("user") || "null"
    );

  // ================= NOT LOGGED IN =================

  if (!token || !user) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );

  }

  // ================= ROLE BASED REDIRECT =================

  if (
    user.role === "EMPLOYEE" &&
    window.location.pathname === "/dashboard"
  ) {

    return (
      <Navigate
        to="/employee-dashboard"
        replace
      />
    );

  }

  // ================= ALLOW =================

  return children;

}