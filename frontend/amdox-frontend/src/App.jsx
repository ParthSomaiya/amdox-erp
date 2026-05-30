import { Routes, Route } from "react-router-dom";
import React, { Suspense } from "react";

import MainLayout from "./layouts/MainLayout";
import ProtectedRoute from "./components/ProtectedRoute";

// ================= CORE =================
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import EmployeeDashboard from "./pages/EmployeeDashboard";

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
import AttendanceCalendar from "./pages/hr/AttendanceCalendar";
import AttendanceHeatmap from "./pages/hr/AttendanceHeatmap";
import Documents from "./pages/hr/Documents";
import EmployeeProfile from "./pages/hr/EmployeeProfile";
import EmployeeTimeline from "./pages/hr/EmployeeTimeline";
import PayrollSlip from "./pages/hr/PayrollSlip";
import HRDashboard from "./pages/hr/HRDashboard";

// ================= PAYROLL =================
import GeneratePayroll from "./pages/GeneratePayroll";
import PayrollList from "./pages/PayrollList";
import MyPayslip from "./pages/MyPayslip";
import Payroll from "./pages/Payroll";

// ================= ANALYTICS =================
import Analytics from "./pages/analytics/Analytics";
import AnalyticsDashboard from "./pages/analytics/AnalyticsDashboard";
import ProjectAnalytics from "./pages/analytics/ProjectAnalytics";
import BusinessIntelligence from "./pages/analytics/BusinessIntelligence";
import AdminAnalytics from "./pages/analytics/AdminAnalytics";
import ChartBuilder from "./pages/analytics/ChartBuilder";

// ================= FINANCE =================
import GL from "./pages/GL";
import Bills from "./pages/Bills";
import Receivables from "./pages/Receivables";
import TrialBalance from "./pages/TrialBalance";
import BalanceSheet from "./pages/BalanceSheet";
import CreateInvoice from "./pages/CreateInvoice";
import Invoices from "./pages/Invoices";
import ProfitLoss from "./pages/ProfitLoss";
import FinanceDashboard from "./pages/finance/FinanceDashboard";
import Forecasting from "./pages/finance/Forecasting";
import InvoiceBuilder from "./pages/finance/InvoiceBuilder";
import AccountingDashboard from "./pages/finance/AccountingDashboard";
import FinanceAnalytics from "./pages/finance/FinanceAnalytics";
import Forecast from "./pages/finance/Forecast";
import InvoicePage from "./pages/finance/InvoicePage";
import Reconciliation from "./pages/finance/Reconciliation";

// ================= 📦 INVENTORY SUB-PAGES IMPORTS =================
import InventoryDashboard from "./pages/InventoryDashboard";
import Products from "./pages/Products";
import PurchaseOrders from "./pages/PurchaseOrders";
import StockHistory from "./pages/StockHistory";
import BarcodeScanner from "./pages/inventory/BarcodeScanner";
import CreatePO from "./pages/inventory/CreatePO";
import InventoryAnalytics from "./pages/inventory/InventoryAnalytics";
import InventoryForecast from "./pages/inventory/InventoryForecast";
import LowStock from "./pages/inventory/LowStock";
import ProductDetail from "./pages/inventory/ProductDetail";
import StockCharts from "./pages/inventory/StockCharts";
import Vendors from "./pages/inventory/Vendors";
import WarehouseHeatmap from "./pages/inventory/WarehouseHeatmap";
import DemandForecasting from "./pages/inventory/DemandForecasting";

// ================= PROJECTS =================
import ProjectDashboard from "./pages/ProjectDashboard";
import ProjectsDashboard from "./pages/projects/ProjectsDashboard";
import TaskBoard from "./pages/TaskBoard";
import Timeline from "./pages/Timeline";
import KanbanBoard from "./pages/projects/KanbanBoard";
import CreateProject from "./pages/projects/CreateProject";
import GanttBoard from "./pages/projects/GanttBoard";
import BurndownChart from "./pages/projects/BurndownChart";
import ProjectBudget from "./pages/projects/ProjectBudget";
import Sprints from "./pages/projects/Sprints";

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
import AdminDashboard from "./pages/admin/AdminDashboard";
import PermissionMatrix from "./pages/admin/PermissionMatrix";
import RoleManagement from "./pages/admin/RoleManagement";
import GdprCompliance from "./pages/admin/GdprCompliance";
import NotificationSettings from "./pages/admin/NotificationSettings";

// ================= OTHER =================
import CalendarPage from "./pages/CalendarPage";
import TeamChat from "./pages/TeamChat";
import Notifications from "./pages/notifications/Notifications";
import PushSetup from "./components/PushSetup";
import AIAssistant from "./pages/ai/AIAssistant";
import MyProfile from "./pages/MyProfile";

function App() {
  return (
    <>
      <PushSetup />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterChoice />} />
          <Route path="/invite/:token" element={<InviteRegister />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/login-success" element={<LoginSuccess />} />

          {/* PROTECTED ROUTES */}
          <Route
            element={
              <ProtectedRoute
                allowedRoles={[
                  "ADMIN",
                  "HR",
                  "FINANCE",
                  "EMPLOYEE",
                  "JOB_SEEKER",
                ]}
              >
                <MainLayout />
              </ProtectedRoute>
            }
          >
            {/* DASHBOARD */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/employee-dashboard" element={<EmployeeDashboard />} />

            {/* EMPLOYEE */}
            <Route path="/employees" element={<Employees />} />
            <Route path="/add-employee" element={<AddEmployee />} />

            {/* HR */}
            <Route path="/apply-leave" element={<ApplyLeave />} />
            <Route path="/manage-leave" element={<LeaveManagement />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/attendance-report" element={<AttendanceReport />} />
            <Route path="/hr/documents" element={<Documents />} />
            <Route path="/hr/attendance-calendar" element={<AttendanceCalendar />} />
            <Route path="/hr/attendance-heatmap" element={<AttendanceHeatmap />} />
            <Route path="/hr/employee-profile" element={<EmployeeProfile />} />
            <Route path="/hr/employee-timeline" element={<EmployeeTimeline />} />
            <Route path="/hr/payroll-slip" element={<PayrollSlip />} />
            <Route path="/hr/dashboard" element={<HRDashboard />} />

            {/* PAYROLL */}
            <Route path="/generate-payroll" element={<GeneratePayroll />} />
            <Route path="/payroll" element={<PayrollList />} />
            <Route path="/my-payslip" element={<MyPayslip />} />
            <Route path="/payroll-dashboard" element={<Payroll />} />

            {/* ANALYTICS */}
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/analytics/dashboard" element={<AnalyticsDashboard />} />
            <Route path="/analytics/finance" element={<FinanceAnalytics />} />
            <Route path="/analytics/projects" element={<ProjectAnalytics />} />
            <Route path="/analytics/bi" element={<BusinessIntelligence />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/analytics/chart-builder" element={<ChartBuilder />} />

            {/* FINANCE */}
            <Route path="/gl" element={<GL />} />
            <Route path="/bills" element={<Bills />} />
            <Route path="/receivables" element={<Receivables />} />
            <Route path="/reconciliation" element={<Reconciliation />} />
            <Route path="/trial-balance" element={<TrialBalance />} />
            <Route path="/balance-sheet" element={<BalanceSheet />} />
            <Route path="/create-invoice" element={<CreateInvoice />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/profit-loss" element={<ProfitLoss />} />
            <Route path="/finance/dashboard" element={<FinanceDashboard />} />
            <Route path="/finance/forecast" element={<Forecasting />} />
            <Route path="/finance/invoice-builder" element={<InvoiceBuilder />} />
            <Route path="/finance/accounting" element={<AccountingDashboard />} />
            <Route path="/finance/analytics-dashboard" element={<FinanceAnalytics />} />
            <Route path="/finance/cash-forecast" element={<Forecast />} />
            <Route path="/finance/invoice-page" element={<InvoicePage />} />
            <Route path="/finance/reconciliation-ledger" element={<Reconciliation />} />

            {/* 📦 INVENTORY SUB-PAGES ROUTES REGISTERED */}
            <Route path="/inventory" element={<InventoryDashboard />} />
            <Route path="/products" element={<Products />} />
            <Route path="/purchase-orders" element={<PurchaseOrders />} />
            <Route path="/stock-history" element={<StockHistory />} />

            <Route path="/inventory/create-po" element={<CreatePO />} />
            <Route path="/inventory/low-stock" element={<LowStock />} />
            <Route path="/inventory/scanner" element={<BarcodeScanner />} />
            <Route path="/inventory/heatmap" element={<WarehouseHeatmap />} />
            <Route path="/inventory/forecast" element={<DemandForecasting />} />
            <Route path="/inventory/forecast-analysis" element={<InventoryForecast />} />
            <Route path="/inventory/charts" element={<StockCharts />} />
            <Route path="/inventory/analytics" element={<InventoryAnalytics />} />
            <Route path="/inventory/vendors" element={<Vendors />} />
            <Route path="/inventory/product/:id" element={<ProductDetail />} />

            {/* PROJECTS */}
            <Route path="/projects" element={<ProjectDashboard />} />
            <Route path="/projects/dashboard" element={<ProjectsDashboard />} />
            <Route path="/projects/board" element={<KanbanBoard />} />
            <Route path="/projects/create" element={<CreateProject />} />
            <Route path="/projects/gantt" element={<GanttBoard />} />
            <Route path="/projects/burndown" element={<BurndownChart />} />
            <Route path="/tasks-board" element={<TaskBoard />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/projects/budget" element={<ProjectBudget />} />
            <Route path="/projects/sprints" element={<Sprints />} />

            {/* JOBS */}
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/register/job" element={<JobRegister />} />
            <Route path="/careers/:companyId" element={<CareerPage />} />
            <Route path="/careers" element={<CareerPortal />} />
            <Route path="/apply-job/:id" element={<ApplyJob />} />
            <Route path="/admin/applicants" element={<Applicants />} />

            {/* ADMIN */}
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/security" element={<SecuritySettings />} />
            <Route path="/admin/tenants" element={<TenantManagement />} />
            <Route path="/admin/audit" element={<AuditLogs />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/permissions" element={<PermissionMatrix />} />
            <Route path="/admin/roles" element={<RoleManagement />} />
            <Route path="/admin/gdpr" element={<GdprCompliance />} /> 
            <Route path="/admin/notifications-config" element={<NotificationSettings />} /> 

            {/* OTHER */}
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/team-chat" element={<TeamChat />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/ai" element={<AIAssistant />} />
            <Route path="/profile" element={<MyProfile />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}

export default App;