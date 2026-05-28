import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import React, {
  Suspense,
} from "react";

import MainLayout from "./layouts/MainLayout";

import ProtectedRoute from "./components/ProtectedRoute";

// ================= AUTH =================

import Login from "./pages/Login";

import Home from "./pages/Home";

import ForgotPassword from "./pages/ForgotPassword";

import ResetPassword from "./pages/ResetPassword";

// ================= DASHBOARD =================

import Dashboard from "./pages/Dashboard";

import EmployeeDashboard from "./pages/EmployeeDashboard";

// ================= HR =================

import Employees from "./pages/Employees";

import Attendance from "./pages/Attendance";

import ApplyLeave from "./pages/ApplyLeave";

import LeaveManagement from "./pages/LeaveManagement";

// ================= FINANCE =================

import GL from "./pages/GL";

import Bills from "./pages/Bills";

import Receivables from "./pages/Receivables";

// ================= PROJECT =================

import ProjectDashboard from "./pages/ProjectDashboard";

import TaskBoard from "./pages/TaskBoard";

// ================= JOBS =================

import CareerPortal from "./pages/jobs/CareerPortal";

import ApplyJob from "./pages/jobs/ApplyJob";

// ================= ADMIN =================

import AdminSettings from "./pages/admin/AdminSettings";

import SecuritySettings from "./pages/admin/SecuritySettings";

import TenantManagement from "./pages/admin/TenantManagement";

import AuditLogs from "./pages/admin/AuditLogs";

// ================= OTHER =================

import Notifications from "./pages/notifications/Notifications";

import CalendarPage from "./pages/CalendarPage";

import TeamChat from "./pages/TeamChat";

function App() {

  return (

    <Suspense fallback={<div>Loading...</div>}>

      <Routes>

        {/* ================= PUBLIC ================= */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/reset-password/:token"
          element={<ResetPassword />}
        />

        <Route
          path="/careers"
          element={<CareerPortal />}
        />

        <Route
          path="/apply-job/:id"
          element={<ApplyJob />}
        />

        {/* ================= PROTECTED ================= */}

        <Route

          element={

            <ProtectedRoute>

              <MainLayout />

            </ProtectedRoute>

          }

        >

          {/* DASHBOARD */}

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/employee-dashboard"
            element={<EmployeeDashboard />}
          />

          {/* HR */}

          <Route
            path="/employees"
            element={<Employees />}
          />

          <Route
            path="/attendance"
            element={<Attendance />}
          />

          <Route
            path="/apply-leave"
            element={<ApplyLeave />}
          />

          <Route
            path="/manage-leave"
            element={<LeaveManagement />}
          />

          {/* FINANCE */}

          <Route
            path="/gl"
            element={<GL />}
          />

          <Route
            path="/bills"
            element={<Bills />}
          />

          <Route
            path="/receivables"
            element={<Receivables />}
          />

          {/* PROJECT */}

          <Route
            path="/projects"
            element={<ProjectDashboard />}
          />

          <Route
            path="/tasks-board"
            element={<TaskBoard />}
          />

          {/* ADMIN */}

          <Route
            path="/admin/settings"
            element={<AdminSettings />}
          />

          <Route
            path="/admin/security"
            element={<SecuritySettings />}
          />

          <Route
            path="/admin/tenants"
            element={<TenantManagement />}
          />

          <Route
            path="/admin/audit"
            element={<AuditLogs />}
          />

          {/* OTHER */}

          <Route
            path="/notifications"
            element={<Notifications />}
          />

          <Route
            path="/calendar"
            element={<CalendarPage />}
          />

          <Route
            path="/team-chat"
            element={<TeamChat />}
          />

        </Route>

        {/* FALLBACK */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>

    </Suspense>

  );

}

export default App;