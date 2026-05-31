// 🚀 AMDOX ERP UNIFIED GLOBAL NOTIFICATION CORE (A to Z - 100% COMPLETE GATEWAY)
const trigger = (title, message, type) => {
  if (typeof window !== "undefined" && window.triggerAmdoxNotification) {
    window.triggerAmdoxNotification(title, message, type);
  } else {
    console.warn(`[Amdox Notifier] Delayed Dispatch: ${title} - ${message}`);
  }
};

const baseNotifier = {
  // 👥 HR & Leave
  employeeOnboarded: (name, position) => trigger("Employee Onboarded", `${name} has been successfully onboarded as ${position}.`, "HR"),
  employeeUpdated: (name, position) => trigger("Employee Profile Updated", `Details updated successfully for ${name} (${position}).`, "HR"),
  employeePurged: (name) => trigger("Employee Account Purged", `Account of ${name} has been permanently purged from the secure database.`, "HR"),
  leaveApplied: (type, reason) => trigger("Leave Application Filed", `New ${type.toLowerCase()} request submitted for review: "${reason}"`, "HR"),
  leaveResolved: (status) => trigger("Leave Status Resolved", `Employee leave request has been ${status.toLowerCase()} by HR.`, "HR"),
  attendanceLogged: (name, action) => trigger("Attendance Logged", `${name} successfully clocked ${action.toLowerCase()} at workspace.`, "HR"),
  documentVerified: (name, docType) => trigger("Document Verified", `Verification documents (${docType}) audited for employee ${name}.`, "HR"),
  employeeDirectoryAudited: () => trigger("Employee Directory Audited", "Company personnel records reviewed.", "HR"),
  applicantStatusUpdated: (name, status) => trigger("Applicant Decision Logged", `Job application for ${name} has been ${status.toLowerCase()}.`, "HR"),
  jobVacancyPublished: (title) => trigger("Vacancy Published", `New vacancy opened for ${title}.`, "HR"),
  jobVacancyPurged: (title) => trigger("Vacancy Closed", `Hiring campaign for ${title} has been closed.`, "HR"),
  employeeProfileViewed: (name) => trigger("Employee Profile Reviewed", `Profile dossier opened for ${name}.`, "HR"),
  employeeTimelineReviewed: () => trigger("Timeline Logs Reviewed", "Company personnel historical timeline audited.", "HR"),

  // 💰 Payroll
  payrollGenerated: (name, netSalary, month) => trigger("Salary Dispatched", `Monthly payroll of ₹${Number(netSalary).toLocaleString("en-IN")} credited to ${name}'s bank account for ${month}.`, "PAYROLL"),
  payslipDownloaded: (month) => trigger("Payslip Downloaded", `Salary slip for the month of ${month} downloaded successfully as PDF.`, "PAYROLL"),
  payrollHistoryAudited: () => trigger("Payroll History Audited", "Consolidated salary logs audited.", "PAYROLL"),

  // 📦 Supply Chain & Inventory SCM
  productRegistered: (name, stock) => trigger("Product Registered", `New item "${name}" registered with initial stock of ${stock} units.`, "SCM"),
  productPurged: (name) => trigger("Product Removed", `Item "${name}" permanently deleted from warehouse registry.`, "SCM"),
  poCreated: (quantity, product) => trigger("Purchase Order Raised", `New PO raised for ${quantity} units of ${product}.`, "SCM"),
  poReceived: (vendor, product) => trigger("Inventory Stock Received", `Successfully received shipment from ${vendor} (${product}). Warehouse stock incremented.`, "SCM"),
  barcodeScanned: (value, product) => trigger("Barcode Scanned", `Barcode "${value}" scanned successfully. Resolved to: ${product || "Unknown SKU"}.`, "SCM"),
  heatmapViewed: () => trigger("Warehouse Heatmap Analyzed", "Interactive stock density mapping reviewed successfully.", "SCM"),
  demandForecastGenerated: (product) => trigger("SCM Demand Forecast", `AI time-series demand predictions compiled successfully for ${product}.`, "SCM"),
  inventoryDashboardViewed: () => trigger("Inventory Dashboard Audited", "Warehouse total products and asset values reviewed.", "SCM"),
  stockHistoryViewed: () => trigger("Stock Movement History Audited", "Complete inbound and outbound warehouse logs audited.", "SCM"),
  lowStockAlertViewed: () => trigger("Low Stock Alerts Audited", "Critical items below safety threshold reviewed.", "SCM"),
  inventoryForecastViewed: () => trigger("Reorder Forecast Audited", "AI stock replenishment curves reviewed.", "SCM"),
  stockChartsViewed: () => trigger("Stock Charts Audited", "Visual product level mapping charts generated.", "SCM"),
  vendorsRegistryViewed: () => trigger("Vendors Registry Audited", "Third-party supply partners registry audited.", "SCM"),

  // 💳 Financial Control & Accounting
  invoiceCreated: (client, totalAmount) => trigger("Sales Invoice Issued", `Invoice of ₹${Number(totalAmount).toLocaleString("en-IN")} issued to ${client} under GST protocol.`, "FINANCE"),
  billPaid: (vendor, amount) => trigger("Vendor Bill Paid", `Disbursed payment of ₹${Number(amount).toLocaleString("en-IN")} to ${vendor || "Supplier"}.`, "FINANCE"),
  receivablesViewed: () => trigger("Receivables Audited", "Outstanding accounts receivable ledgers reviewed.", "FINANCE"),
  reconciliationMatched: (desc, amount) => trigger("Bank Reconciliation Complete", `Bank transaction matched with ledger: ${desc} (₹${amount}).`, "FINANCE"),
  ledgerEntryLogged: (desc) => trigger("General Ledger Adjusted", `New double-entry ledger entry logged: ${desc}.`, "FINANCE"),
  statementDownloaded: (name) => trigger("Statement Generated", `${name} report statement compiled and downloaded as PDF.`, "FINANCE"),
  financeDashboardViewed: () => trigger("Financial Dashboard Audited", "Real-time assets and revenue logs reviewed.", "FINANCE"),
  accountingDashboardViewed: () => trigger("Accounting Dashboard Audited", "Double-entry accounting and general ledgers reviewed.", "FINANCE"),
  financeAnalyticsViewed: () => trigger("Financial Analytics Compiled", "Revenue vs expense margin charts analyzed.", "FINANCE"),
  invoiceBuilderOpened: () => trigger("Invoice Drag-Builder Opened", "Custom taxation and charge priority layout updated.", "FINANCE"),
  invoiceHistoryAudited: () => trigger("Invoice History Audited", "Consolidated transaction billing records reviewed.", "FINANCE"),

  // 🚀 Projects, Kanban & Agile Sprints
  projectCreated: (name, budget) => trigger("Project Workspace Created", `New project "${name}" has been established with a budget of ₹${Number(budget).toLocaleString("en-IN")}.`, "PROJECT"),
  sprintGoalCreated: (name) => trigger("Sprint Goal Established", `New sprint milestone developed: ${name}.`, "PROJECT"),
  taskCreated: (title) => trigger("Kanban Task Created", `New objective "${title}" added to the team board.`, "TASK"),
  taskUpdated: (title, status) => trigger("Kanban Board Update", `Task "${title}" moved to ${status}.`, "TASK"),
  projectsDashboardViewed: () => trigger("Projects Dashboard Audited", "Sprint milestones and roadmap progress reviewed.", "PROJECT"),
  projectAnalyticsViewed: () => trigger("Project Analytics Compiled", "Budget allocation and spent burn rates analyzed.", "PROJECT"),
  projectBudgetViewed: () => trigger("Project Budgets Reviewed", "Agile workspace budget limits and cost overruns reviewed.", "PROJECT"),
  ganttViewed: () => trigger("Gantt Timeline Reviewed", "Interactive project sprint schedules audited.", "PROJECT"),
  burndownViewed: () => trigger("Burndown Chart Reviewed", "Agile team sprint velocity burndown reviewed.", "PROJECT"),

  // 🇪🇺 Admin & GDPR Security Suite
  gdprRequestFulfled: (name, type) => trigger("GDPR DSR Fulfilled", `Subject request of ${name} for ${type.replace("_", " ")} completed within SLA limits.`, "SECURITY"),
  webhookTested: (name) => trigger("Webhook Tested", `Test payload successfully dispatched with HMAC signature to ${name}.`, "SECURITY"),
  matrixSaved: () => trigger("Event Matrix Updated", "Configurable business notification matrix rules saved successfully.", "SECURITY"),
  settingsConfigured: (section) => trigger("System Settings Modified", `System parameter configurations updated inside ${section} modules.`, "SECURITY"),
  adminDashboardViewed: () => trigger("Admin Control Panel Reviewed", "Multi-tenant tenant load and srv capacities reviewed.", "SECURITY"),
  adminAnalyticsViewed: () => trigger("Admin Analytics Audited", "User roles and platform load metrics audited.", "SECURITY"),
  chartBuilderViewed: () => trigger("Custom Chart Builder Opened", "Enterprise custom intelligence report constructor active.", "SECURITY"),
  rolesSettingsViewed: () => trigger("User Roles Audited", "Enterprise authorization roles and security settings reviewed.", "SECURITY"),
  tenantManagementViewed: () => trigger("Tenant Matrix Audited", "SaaS database instances and tenant capacities reviewed.", "SECURITY"),
  auditViewed: () => trigger("Audit Activity Stream Audited", "Immutable security logs audited.", "SECURITY"),

  // 🤖 Neural Intelligence AI
  aiModeChanged: (mode, isActive) => trigger("AI Assistant Mode Change", `AI Assistant ${mode} has been turned ${isActive ? "ON" : "OFF"}.`, "AI"),

  // 📅 Workspace & Chat
  calendarEventLogged: (title) => trigger("Calendar Event Logged", `New corporate calendar schedule developed: "${title}".`, "WORKSPACE"),
  chatMessageSent: (room) => trigger("Workspace Message Dispatched", `Collaboration thread activity detected inside ${room} room.`, "WORKSPACE"),
  notificationsPageLoaded: () => trigger("Notification Feed Reviewed", "Activity notification stream reviewed.", "WORKSPACE")
};

const notifier = new Proxy(baseNotifier, {
  get(target, prop) {
    if (prop in target) {
      return target[prop];
    }
    // 🔹 ફોલબેક: જો કોઈ નવું ફંક્શન મિસિંગ હશે તો એપ ક્રેશ થવાને બદલે નોર્મલ રન થશે
    return (...args) => {
      console.warn(`Notifier method "${String(prop)}" called but not implemented yet. Args:`, args);
    };
  }
});

export default notifier;