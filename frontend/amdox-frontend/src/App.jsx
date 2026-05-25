import {
  Routes,
  Route,
} from "react-router-dom";

// ================= CORE =================

import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

// ================= EMPLOYEE =================

import Employees from "./pages/Employees";
import AddEmployee from "./pages/AddEmployee";

// ================= AUTH =================

import InviteRegister from "./pages/InviteRegister";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import LoginSuccess from "./pages/LoginSuccess";
import RegisterChoice from "./pages/RegisterChoice";

// ================= HR =================

import ApplyLeave from "./pages/ApplyLeave";
import LeaveManagement from "./pages/LeaveManagement";
import Attendance from "./pages/Attendance";
import AttendanceReport from "./pages/AttendanceReport";

// ================= PAYROLL =================

import GeneratePayroll from "./pages/GeneratePayroll";
import PayrollList from "./pages/PayrollList";
import MyPayslip from "./pages/MyPayslip";
import Payroll from "./pages/Payroll";

// ================= ANALYTICS =================

import Analytics from "./pages/Analytics";

import AnalyticsDashboard from "./pages/analytics/AnalyticsDashboard";

import FinanceAnalytics from "./pages/finance/FinanceAnalytics";

import ProjectAnalytics from "./pages/analytics/ProjectAnalytics";

// ================= FINANCE =================

import GL from "./pages/GL";
import Bills from "./pages/Bills";
import Receivables from "./pages/Receivables";
import Reconciliation from "./pages/Reconciliation";
import TrialBalance from "./pages/TrialBalance";
import BalanceSheet from "./pages/BalanceSheet";
import CreateInvoice from "./pages/CreateInvoice";

// ================= INVENTORY =================

import InventoryDashboard from "./pages/InventoryDashboard";
import Products from "./pages/Products";
import PurchaseOrders from "./pages/PurchaseOrders";
import StockHistory from "./pages/StockHistory";

// ================= PROJECTS =================

import ProjectDashboard from "./pages/ProjectDashboard";
import ProjectsDashboard from "./pages/projects/ProjectsDashboard";

import TaskBoard from "./pages/TaskBoard";

import Timeline from "./pages/Timeline";

import KanbanBoard from "./pages/projects/KanbanBoard";

import CreateProject from "./pages/projects/CreateProject";

import GanttBoard from "./pages/projects/GanttBoard";

import BurndownChart from "./pages/projects/BurndownChart";

// ================= JOBS =================

import Jobs from "./pages/Jobs";

import JobRegister from "./pages/JobRegister";

import CareerPage from "./pages/CareerPage";

import CareerPortal from "./pages/jobs/CareerPortal";

import ApplyJob from "./pages/jobs/ApplyJob";

import Applicants from "./pages/jobs/Applicants";

// ================= ADMIN =================

import AdminSettings from "./pages/admin/AdminSettings";

import SecuritySettings from "./pages/admin/SecuritySettings";

import TenantManagement from "./pages/admin/TenantManagement";

import AuditLogs from "./pages/admin/AuditLogs";

// ================= OTHER =================

import CalendarPage from "./pages/CalendarPage";

import TeamChat from "./pages/TeamChat";

import Notifications from "./pages/notifications/Notifications";

import PushSetup from "./components/PushSetup";

import AIAssistant from "./pages/ai/AIAssistant";

import EmployeeRegister from "./pages/employee/Register";

import EmployeeDashboard from "./pages/EmployeeDashboard";

// ================= APP =================

function App() {

  return (

    <>

      <PushSetup />

      <Routes>

        {/* ================= HOME ================= */}

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />

        {/* ================= AUTH ================= */}

        <Route
          path="/register"
          element={<RegisterChoice />}
        />

        <Route
          path="/invite/:token"
          element={<InviteRegister />}
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
          path="/login-success"
          element={<LoginSuccess />}
        />

        {/* ================= EMPLOYEE ================= */}

        <Route
          path="/employees"
          element={<Employees />}
        />

        <Route
          path="/add-employee"
          element={<AddEmployee />}
        />

        <Route
          path="/register/employee"
          element={<EmployeeRegister />}
        />

        <Route
          path="/register/employee/:token"
          element={<EmployeeRegister />}
        />

        <Route
          path="/employee-dashboard"
          element={<EmployeeDashboard />}
        />

        {/* ================= HR ================= */}

        <Route
          path="/apply-leave"
          element={<ApplyLeave />}
        />

        <Route
          path="/manage-leave"
          element={<LeaveManagement />}
        />

        <Route
          path="/attendance"
          element={<Attendance />}
        />

        <Route
          path="/attendance-report"
          element={<AttendanceReport />}
        />

        {/* ================= PAYROLL ================= */}

        <Route
          path="/generate-payroll"
          element={<GeneratePayroll />}
        />

        <Route
          path="/payroll"
          element={<PayrollList />}
        />

        <Route
          path="/my-payslip"
          element={<MyPayslip />}
        />

        <Route
          path="/payroll-dashboard"
          element={<Payroll />}
        />

        {/* ================= ANALYTICS ================= */}

        <Route
          path="/analytics"
          element={<Analytics />}
        />

        <Route
          path="/analytics/dashboard"
          element={<AnalyticsDashboard />}
        />

        <Route
          path="/analytics/finance"
          element={<FinanceAnalytics />}
        />

        <Route
          path="/analytics/projects"
          element={<ProjectAnalytics />}
        />

        {/* ================= FINANCE ================= */}

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

        <Route
          path="/reconciliation"
          element={<Reconciliation />}
        />

        <Route
          path="/trial-balance"
          element={<TrialBalance />}
        />

        <Route
          path="/balance-sheet"
          element={<BalanceSheet />}
        />

        <Route
          path="/create-invoice"
          element={<CreateInvoice />}
        />

        {/* ================= INVENTORY ================= */}

        <Route
          path="/inventory"
          element={<InventoryDashboard />}
        />

        <Route
          path="/products"
          element={<Products />}
        />

        <Route
          path="/purchase-orders"
          element={<PurchaseOrders />}
        />

        <Route
          path="/stock-history"
          element={<StockHistory />}
        />

        {/* ================= PROJECTS ================= */}

        <Route
          path="/projects"
          element={<ProjectDashboard />}
        />

        <Route
          path="/projects/dashboard"
          element={<ProjectsDashboard />}
        />

        <Route
          path="/projects/board"
          element={<KanbanBoard />}
        />

        <Route
          path="/projects/create"
          element={<CreateProject />}
        />

        <Route
          path="/projects/gantt"
          element={<GanttBoard />}
        />

        <Route
          path="/projects/burndown"
          element={<BurndownChart />}
        />

        <Route
          path="/tasks-board"
          element={<TaskBoard />}
        />

        <Route
          path="/timeline"
          element={<Timeline />}
        />

        {/* ================= JOBS ================= */}

        <Route
          path="/jobs"
          element={<Jobs />}
        />

        <Route
          path="/register/job"
          element={<JobRegister />}
        />

        <Route
          path="/careers/:companyId"
          element={<CareerPage />}
        />

        <Route
          path="/careers"
          element={<CareerPortal />}
        />

        <Route
          path="/apply-job/:id"
          element={<ApplyJob />}
        />

        <Route
          path="/admin/applicants"
          element={<Applicants />}
        />

        {/* ================= ADMIN ================= */}

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

        {/* ================= OTHER ================= */}

        <Route
          path="/calendar"
          element={<CalendarPage />}
        />

        <Route
          path="/team-chat"
          element={<TeamChat />}
        />

        <Route
          path="/notifications"
          element={<Notifications />}
        />

        <Route
          path="/ai"
          element={<AIAssistant />}
        />

      </Routes>

    </>

  );

}

export default App;