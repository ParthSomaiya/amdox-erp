import { Navigate } from "react-router-dom";

export default function ProtectedRoute({

  children,
  allowedRoles = [],

}) {

  const user =
    JSON.parse(
      localStorage.getItem("user")
    );

  const token =
    localStorage.getItem("token");

  // ================= NO LOGIN =================

  if (!user || !token) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );

  }

  // ================= ROLE CHECK =================

  if (

    allowedRoles.length > 0 &&

    !allowedRoles.includes(
      user.role
    )

  ) {

    // JOB SEEKER
    if (user.role === "JOB_SEEKER") {

      return (
        <Navigate
          to="/careers"
          replace
        />
      );

    }

    // EMPLOYEE
    if (user.role === "EMPLOYEE") {

      return (
        <Navigate
          to="/employee-dashboard"
          replace
        />
      );

    }

    // ADMIN
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );

  }

  return children;

}