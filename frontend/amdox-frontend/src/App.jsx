import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import InviteRegister from "./pages/InviteRegister";
import ApplyLeave from "./pages/ApplyLeave";
import LeaveManagement from "./pages/LeaveManagement";
import Attendance from "./pages/Attendance";
import AttendanceReport from "./pages/AttendanceReport";
import GeneratePayroll from "./pages/GeneratePayroll";
import PayrollList from "./pages/PayrollList";
import MyPayslip from "./pages/MyPayslip";
import Analytics from "./pages/Analytics";
import Payroll from "./pages/Payroll";
import EmployeeRegister from "./pages/EmployeeRegister";
import Jobs from "./pages/Jobs";
import JobRegister from "./pages/JobRegister";
import GL from "./pages/GL";
import Bills from "./pages/Bills";
import Receivables from "./pages/Receivables";
import Reconciliation from "./pages/Reconciliation";
import LoginSuccess from "./pages/LoginSuccess";
import CareerPage from "./pages/CareerPage";
import TrialBalance from "./pages/TrialBalance";
import BalanceSheet from "./pages/BalanceSheet";
import CreateInvoice from "./pages/CreateInvoice";
import InventoryDashboard from "./pages/InventoryDashboard";
import Products from "./pages/Products";
import PurchaseOrders from "./pages/PurchaseOrders";
import StockHistory from "./pages/StockHistory";
import ProjectDashboard from "./pages/ProjectDashboard";
import TaskBoard from "./pages/TaskBoard";
import Timeline from "./pages/Timeline";
import AdminSettings from "./pages/admin/AdminSettings";
import SecuritySettings from "./pages/admin/SecuritySettings";
import TenantManagement from "./pages/admin/TenantManagement";
import AuditLogs from "./pages/admin/AuditLogs";
import AnalyticsDashboard from "./pages/analytics/AnalyticsDashboard";
import FinanceAnalytics from "./pages/finance/FinanceAnalytics";
import ProjectAnalytics from "./pages/analytics/ProjectAnalytics";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import CalendarPage from "./pages/CalendarPage";
import TeamChat from "./pages/TeamChat";
import AddEmployee from "./pages/AddEmployee";
import RegisterChoice from "./pages/RegisterChoice";
import ProjectsDashboard from "./pages/projects/ProjectsDashboard";
import KanbanBoard from "./pages/projects/KanbanBoard";
import CreateProject from "./pages/projects/CreateProject";
import Careers from "./pages/jobs/Careers";
import ApplyJob from "./pages/jobs/ApplyJob";
import Applicants from "./pages/jobs/Applicants";
import Notifications from "./pages/notifications/Notifications";


function App() {
  return (

    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/employees" element={<Employees />} />
      <Route path="/add-employee" element={<AddEmployee />} />
      <Route path="/invite/:token" element={<InviteRegister />} />
      <Route path="/apply-leave" element={<ApplyLeave />} />
      <Route path="/manage-leave" element={<LeaveManagement />} />
      <Route path="/attendance" element={<Attendance />} />
      <Route path="/attendance-report" element={<AttendanceReport />} />
      <Route path="/generate-payroll" element={<GeneratePayroll />} />
      <Route path="/payroll" element={<PayrollList />} />
      <Route path="/my-payslip" element={<MyPayslip />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/register" element={<RegisterChoice />} />
      <Route path="/jobs" element={<Jobs />} />
      <Route path="/register/employee" element={<EmployeeRegister />} />
      <Route path="/register/job" element={<JobRegister />} />
      <Route path="/register/employee/:token" element={<EmployeeRegister />} />
      <Route path="/gl" element={<GL />} />
      <Route path="/bills" element={<Bills />} />
      <Route path="/receivables" element={<Receivables />} />
      <Route path="/reconciliation" element={<Reconciliation />} />
      <Route path="/login-success" element={<LoginSuccess />} />
      <Route path="/careers/:companyId" element={<CareerPage />} />
      <Route path="/trial-balance" element={<TrialBalance />} />
      <Route path="/balance-sheet" element={<BalanceSheet />} />
      <Route path="/create-invoice" element={<CreateInvoice />} />
      <Route path="/inventory" element={<InventoryDashboard />} />
      <Route path="/products" element={<Products />} />
      <Route path="/purchase-orders" element={<PurchaseOrders />} />
      <Route path="/stock-history" element={<StockHistory />} />
      <Route path="/projects" element={<ProjectDashboard />} />
      <Route path="/tasks-board" element={<TaskBoard />} />
      <Route path="/timeline" element={<Timeline />} />
      <Route path="/admin/settings" element={<AdminSettings />} />
      <Route path="/admin/security" element={<SecuritySettings />} />
      <Route path="/admin/tenants" element={<TenantManagement />} />
      <Route path="/admin/audit" element={<AuditLogs />} />
      <Route path="/analytics/dashboard" element={<AnalyticsDashboard />} />
      <Route path="/analytics/finance" element={<FinanceAnalytics />} />
      <Route path="/analytics/projects" element={<ProjectAnalytics />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/calendar" element={<CalendarPage />} />
      <Route path="/team-chat" element={<TeamChat />} />
      <Route path="/projects/dashboard" element={<ProjectsDashboard />} />
      <Route path="/projects/board" element={<KanbanBoard />} />
      <Route path="/projects/create" element={<CreateProject />} />
      <Route path="/careers" element={<Careers />} />
      <Route path="/jobs/apply/:id" element={<ApplyJob />} />
      <Route path="/admin/applicants" element={<Applicants />} />
      <Route path="/notifications" element={<Notifications />} />
    </Routes>
  );
}

export default App;