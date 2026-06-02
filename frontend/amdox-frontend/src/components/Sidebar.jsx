import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const role = user?.role;

  const menuClass = (path) => `
    flex
    items-center
    gap-3
    px-4
    py-2.5
    rounded-xl
    transition-all
    duration-200
    mb-1.5
    text-sm
    font-semibold

    ${location.pathname === path
      ? "bg-indigo-50 text-indigo-600 shadow-inner"
      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
    }
  `;

  const SectionHeader = ({ title }) => (
    <div className="text-[10px] uppercase tracking-wider text-slate-400 mt-6 mb-2.5 px-4 font-bold">
      {title}
    </div>
  );

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <aside
      className="
        fixed
        top-0
        bottom-0
        left-0
        w-[280px]
        h-screen
        bg-white
        border-r
        border-slate-200/80
        z-40
        flex
        flex-col
        justify-between
        py-6
        overflow-y-auto
        [&::-webkit-scrollbar]:w-1.5
        [&::-webkit-scrollbar-track]:bg-transparent
        [&::-webkit-scrollbar-thumb]:bg-slate-200
        [&::-webkit-scrollbar-thumb]:rounded-full
        hover:[&::-webkit-scrollbar-thumb]:bg-slate-300
      "
    >
      <div>
        {/* Brand Header */}
        <div className="px-6 pb-6 border-b border-slate-100 flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-xl text-white font-black">
            A
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-800 leading-none">AMDOX</h1>
            <p className="text-slate-400 text-[10px] mt-1 font-bold uppercase tracking-wider">Enterprise ERP</p>
          </div>
        </div>

        {/* Menu Items */}
        <div className="px-4 py-4">

          {/* ======================================================
             💼 JOB SEEKER / CANDIDATE MENU
          ====================================================== */}
          {role === "JOB_SEEKER" ? (
            <>
              <SectionHeader title="Candidate Portal" />
              <Link to="/careers" className={menuClass("/careers")}>
                💼 Job Openings
              </Link>
              <Link to="/notifications" className={menuClass("/notifications")}>
                🔔 Notifications
              </Link>
            </>
          ) : (
            /* ======================================================
               🏢 STANDARD ERP WORKSPACE MENU (ADMIN, HR, FINANCE, EMPLOYEE)
            ====================================================== */
            <>
              <SectionHeader title="Overview" />
              {role === "EMPLOYEE" ? (
                <Link to="/employee-dashboard" className={menuClass("/employee-dashboard")}>
                  👤 Portal Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/dashboard" className={menuClass("/dashboard")}>
                    📊 Admin Dashboard
                  </Link>
                  <Link to="/analytics/bi" className={menuClass("/analytics/bi")}>
                    📊 Business Intelligence (BI)
                  </Link>
                </>
              )}

              {/* HR SECTION */}
              {(role === "ADMIN" || role === "HR") && (
                <>
                  <Link to="/hr/dashboard" className={menuClass("/hr/dashboard")}>
                    📊 HR Dashboard
                  </Link>
                  <SectionHeader title="HR Administration" />
                  <Link to="/employees" className={menuClass("/employees")}>
                    👥 Employees List
                  </Link>
                  <Link to="/hr/employee-profile" className={menuClass("/hr/employee-profile")}>
                    👥 Employee Profiles
                  </Link>
                  <Link to="/admin/applicants" className={menuClass("/admin/applicants")}>
                    👥 Job Applicants
                  </Link>
                  <Link to="/jobs" className={menuClass("/jobs")}>
                    📌 Manage Vacancies
                  </Link>
                  <Link to="/hr/documents" className={menuClass("/hr/documents")}>
                    📂 Employee Documents
                  </Link>
                  <Link to="/attendance" className={menuClass("/attendance")}>
                    📅 Attendance Log
                  </Link>
                  <Link to="/attendance-report" className={menuClass("/attendance-report")}>
                    📊 Attendance Reports
                  </Link>
                  <Link to="/hr/attendance-calendar" className={menuClass("/hr/attendance-calendar")}>
                    📅 Attendance Calendar
                  </Link>
                  <Link to="/hr/attendance-heatmap" className={menuClass("/hr/attendance-heatmap")}>
                    🔥 Attendance Heatmap
                  </Link>
                  <Link to="/hr/interview-scheduler" className={menuClass("/hr/interview-scheduler")}>
                    ➕ Schedule Interview
                  </Link>
                  <Link to="/hr/interviews" className={menuClass("/hr/interviews")}>
                    📅 Interview Calendar
                  </Link>
                  <Link to="/hr/employee-timeline" className={menuClass("/hr/employee-timeline")}>
                    🕒 Employee Timeline
                  </Link>
                  <Link to="/generate-payroll" className={menuClass("/generate-payroll")}>
                    💰 Generate Payroll
                  </Link>
                  <Link to="/payroll" className={menuClass("/payroll")}>
                    📋 Payroll Records
                  </Link>
                  <Link to="/hr/payroll-slip" className={menuClass("/hr/payroll-slip")}>
                    🧾 Payroll Slips
                  </Link>
                  <Link to="/manage-leave" className={menuClass("/manage-leave")}>
                    ✅ Leave Approval
                  </Link>
                </>
              )}

              {/* EMPLOYEE PORTAL */}
              {role === "EMPLOYEE" && (
                <>
                  <SectionHeader title="Employee Portal" />
                  <Link to="/attendance" className={menuClass("/attendance")}>
                    📅 Log Attendance
                  </Link>
                  <Link to="/apply-leave" className={menuClass("/apply-leave")}>
                    📩 Apply for Leave
                  </Link>
                  <Link to="/my-payslip" className={menuClass("/my-payslip")}>
                    🧾 My Salary Slips
                  </Link>
                </>
              )}

              {/* FINANCE SECTION */}
              {(role === "ADMIN" || role === "FINANCE") && (
                <>
                  <SectionHeader title="Financial Control" />
                  <Link to="/finance/dashboard" className={menuClass("/finance/dashboard")}>
                    📊 Financial Dashboard
                  </Link>
                  <Link to="/finance/accounting" className={menuClass("/finance/accounting")}>
                    📘 Accounting Dashboard
                  </Link>
                  <Link to="/finance/analytics-dashboard" className={menuClass("/finance/analytics-dashboard")}>
                    📈 Finance Analytics
                  </Link>
                  <Link to="/gl" className={menuClass("/gl")}>
                    📘 General Ledger
                  </Link>
                  <Link to="/bills" className={menuClass("/bills")}>
                    🧾 Vendor Bills
                  </Link>
                  <Link to="/receivables" className={menuClass("/receivables")}>
                    💳 Receivables
                  </Link>
                  <Link to="/finance/reconciliation-ledger" className={menuClass("/finance/reconciliation-ledger")}>
                    🔄 Bank Reconciliation
                  </Link>
                  <Link to="/create-invoice" className={menuClass("/create-invoice")}>
                    ➕ Create Invoice
                  </Link>
                  <Link to="/finance/invoice-builder" className={menuClass("/finance/invoice-builder")}>
                    🧩 Invoice Drag-Builder
                  </Link>
                  <Link to="/finance/invoice-page" className={menuClass("/finance/invoice-page")}>
                    🧾 Invoice History
                  </Link>
                  <Link to="/profit-loss" className={menuClass("/profit-loss")}>
                    📈 Profit & Loss
                  </Link>
                  <Link to="/finance/cash-forecast" className={menuClass("/finance/cash-forecast")}>
                    🔮 Cash Forecast
                  </Link>
                  <Link to="/trial-balance" className={menuClass("/trial-balance")}>
                    📊 Trial Balance
                  </Link>
                  <Link to="/balance-sheet" className={menuClass("/balance-sheet")}>
                    📁 Balance Sheet
                  </Link>
                </>
              )}

              {/* SUPPLY CHAIN & INVENTORY SECTION */}
              {(role === "ADMIN" || role === "HR" || role === "FINANCE") && (
                <>
                  <SectionHeader title="Inventory Control" />
                  <Link to="/inventory" className={menuClass("/inventory")}>
                    📦 Inventory Dashboard
                  </Link>
                  <Link to="/products" className={menuClass("/products")}>
                    📦 Products Registry
                  </Link>
                  <Link to="/purchase-orders" className={menuClass("/purchase-orders")}>
                    🧾 Purchase Orders
                  </Link>
                  <Link to="/inventory/create-po" className={menuClass("/inventory/create-po")}>
                    ➕ Create Purchase Order
                  </Link>
                  <Link to="/stock-history" className={menuClass("/stock-history")}>
                    🕒 Stock History
                  </Link>
                  <Link to="/inventory/low-stock" className={menuClass("/inventory/low-stock")}>
                    ⚠️ Low Stock Alerts
                  </Link>
                  <Link to="/inventory/scanner" className={menuClass("/inventory/scanner")}>
                    📷 Barcode Scanner
                  </Link>
                  <Link to="/inventory/heatmap" className={menuClass("/inventory/heatmap")}>
                    🔥 Warehouse Heatmap
                  </Link>
                  <Link to="/inventory/forecast" className={menuClass("/inventory/forecast")}>
                    🤖 AI Demand Forecasting
                  </Link>
                  <Link to="/inventory/forecast-analysis" className={menuClass("/inventory/forecast-analysis")}>
                    🔮 Reorder Forecasting
                  </Link>
                  <Link to="/inventory/charts" className={menuClass("/inventory/charts")}>
                    📊 Stock Charts
                  </Link>
                  <Link to="/inventory/analytics" className={menuClass("/inventory/analytics")}>
                    📈 Inventory Analytics
                  </Link>
                  <Link to="/inventory/vendors" className={menuClass("/inventory/vendors")}>
                    🏢 Vendors Registry
                  </Link>
                </>
              )}

              {/* PROJECTS SECTION */}
              {(role === "ADMIN" || role === "HR") && (
                <>
                  <SectionHeader title="Sprints & Tasks" />
                  <Link to="/projects/dashboard" className={menuClass("/projects/dashboard")}>
                    📊 Projects Dashboard
                  </Link>
                  <Link to="/analytics/projects" className={menuClass("/analytics/projects")}>
                    📈 Project Analytics
                  </Link>
                  <Link to="/projects" className={menuClass("/projects")}>
                    🚀 Workspace Projects
                  </Link>
                  <Link to="/projects/budget" className={menuClass("/projects/budget")}>
                    💰 Project Budgets
                  </Link>
                  <Link to="/projects/sprints" className={menuClass("/projects/sprints")}>
                    🏃 Sprint Backlogs
                  </Link>
                  <Link to="/tasks-board" className={menuClass("/tasks-board")}>
                    🧩 Kanban Board
                  </Link>
                  <Link to="/projects/gantt" className={menuClass("/projects/gantt")}>
                    📅 Gantt Timeline
                  </Link>
                  <Link to="/projects/burndown" className={menuClass("/projects/burndown")}>
                    🔥 Burndown Chart
                  </Link>
                </>
              )}

              {/* SYSTEM SETTINGS */}
              {role === "ADMIN" && (
                <>
                  <SectionHeader title="Administration" />
                  <Link to="/admin/dashboard" className={menuClass("/admin/dashboard")}>
                    📊 Admin Metrics Dashboard
                  </Link>
                  <Link to="/admin/analytics" className={menuClass("/admin/analytics")}>
                    📊 Admin Analytics
                  </Link>
                  <Link to="/analytics/chart-builder" className={menuClass("/analytics/chart-builder")}>
                    📊 Custom Chart Builder
                  </Link>
                  <Link to="/admin/settings" className={menuClass("/admin/settings")}>
                    ⚙️ Settings Configuration
                  </Link>
                  <Link to="/admin/security" className={menuClass("/admin/security")}>
                    🔐 Security Access
                  </Link>
                  <Link to="/admin/permissions" className={menuClass("/admin/permissions")}>
                    🧩 Permission Matrix
                  </Link>
                  <Link to="/admin/roles" className={menuClass("/admin/roles")}>
                    👥 Role Management
                  </Link>
                  <Link to="/admin/tenants" className={menuClass("/admin/tenants")}>
                    🏢 Tenant Manager
                  </Link>
                  <Link to="/admin/audit" className={menuClass("/admin/audit")}>
                    📜 Audit Activity
                  </Link>
                  <Link to="/admin/gdpr" className={menuClass("/admin/gdpr")}>
                    🇪🇺 GDPR & DSR Compliance
                  </Link>
                  <Link to="/admin/notifications-config" className={menuClass("/admin/notifications-config")}>
                    🔔 Notification & Webhook Engine
                  </Link>
                </>
              )}

              <SectionHeader title="Workspace" />
              <Link to="/calendar" className={menuClass("/calendar")}>
                📅 Calendar Events
              </Link>
              <Link to="/expense" className={menuClass("/expense")}>
                💳 Expense Claims
              </Link>
              <Link to="/timeline" className={menuClass("/timeline")}>
                🕒 Employee Timeline
              </Link>
              <Link to="/notifications" className={menuClass("/notifications")}>
                🔔 Activity Stream
              </Link>
            </>
          )}

        </div>
      </div>

      {/* Logout Trigger */}
      <div className="px-4">
        <button
          onClick={logout}
          className="
            w-full
            border
            border-rose-200
            bg-rose-50/50
            hover:bg-rose-500
            text-rose-600
            hover:text-white
            py-3
            rounded-xl
            font-bold
            text-sm
            transition-all
            duration-200
          "
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}