// 🚀 AMDOX ERP UNIFIED GLOBAL NOTIFICATION CORE (100% COMPLETE GATEWAY)
const trigger = (title, message, type) => {
  if (typeof window !== "undefined" && window.triggerAmdoxNotification) {
    window.triggerAmdoxNotification(title, message, type);
  } else {
    console.warn(`[Amdox Notifier] Delayed Dispatch: ${title} - ${message}`);
  }
};

const notifier = {
  // 👥 HR & Personnel Module
  employeeOnboarded: (name, position) => trigger("Employee Onboarded", `${name} has been successfully onboarded as ${position}.`, "HR"),
  employeeUpdated: (name, position) => trigger("Employee Profile Updated", `Details updated successfully for ${name} (${position}).`, "HR"),
  employeePurged: (name) => trigger("Employee Account Purged", `Account of ${name} has been permanently purged from the secure database.`, "HR"),
  leaveApplied: (type, reason) => trigger("Leave Application Filed", `New ${type.toLowerCase()} request submitted for review: "${reason}"`, "HR"),
  leaveResolved: (status) => trigger("Leave Status Resolved", `Employee leave request has been ${status.toLowerCase()} by HR.`, "HR"),
  attendanceLogged: (name, action) => trigger("Attendance Logged", `${name} successfully clocked ${action.toLowerCase()} at workspace.`, "HR"),
  documentVerified: (name, docType) => trigger("Document Verified", `Verification documents (${docType}) audited for employee ${name}.`, "HR"),

  // 💰 Payroll & Salary
  payrollGenerated: (name, netSalary, month) => trigger("Salary Dispatched", `Monthly payroll of ₹${Number(netSalary).toLocaleString("en-IN")} credited to ${name}'s bank account for ${month}.`, "PAYROLL"),
  payslipDownloaded: (month) => trigger("Payslip Downloaded", `Salary slip for the month of ${month} downloaded successfully as PDF.`, "PAYROLL"),

  // 📦 Supply Chain & Warehouse SCM
  productRegistered: (name, stock) => trigger("Product Registered", `New item "${name}" registered with initial stock of ${stock} units.`, "SCM"),
  productPurged: (name) => trigger("Product Removed", `Item "${name}" permanently deleted from warehouse registry.`, "SCM"),
  poCreated: (quantity, product) => trigger("Purchase Order Raised", `New PO raised for ${quantity} units of ${product}.`, "SCM"),
  poReceived: (vendor, product) => trigger("Inventory Stock Received", `Successfully received shipment from ${vendor} (${product}). Warehouse stock incremented.`, "SCM"),
  barcodeScanned: (value, product) => trigger("Barcode Scanned", `Barcode "${value}" scanned successfully. Resolved to: ${product || "Unknown SKU"}.`, "SCM"),
  heatmapViewed: () => trigger("Warehouse Heatmap Analyzed", "Interactive stock density mapping reviewed successfully.", "SCM"),
  demandForecastGenerated: (product) => trigger("SCM Demand Forecast", `AI time-series demand predictions compiled successfully for ${product}.`, "SCM"),

  // 💳 Financial Control & Ledgers
  invoiceCreated: (client, totalAmount) => trigger("Sales Invoice Issued", `Invoice of ₹${Number(totalAmount).toLocaleString("en-IN")} issued to ${client} under GST protocol.`, "FINANCE"),
  billPaid: (vendor, amount) => trigger("Vendor Bill Paid", `Disbursed payment of ₹${Number(amount).toLocaleString("en-IN")} to ${vendor || "Supplier"}.`, "FINANCE"),
  receivablesViewed: () => trigger("Receivables Audited", "Outstanding accounts receivable ledgers reviewed.", "FINANCE"),
  reconciliationMatched: (desc, amount) => trigger("Bank Reconciliation Complete", `Bank transaction matched with ledger: ${desc} (₹${amount}).`, "FINANCE"),
  ledgerEntryLogged: (desc) => trigger("General Ledger Adjusted", `New double-entry ledger entry logged: ${desc}.`, "FINANCE"),
  statementDownloaded: (name) => trigger("Statement Generated", `${name} report statement compiled and downloaded as PDF.`, "FINANCE"),

  // 🚀 Projects, Kanban & Agile Sprints
  projectCreated: (name, budget) => trigger("Project Workspace Created", `New project "${name}" has been established with a budget of ₹${Number(budget).toLocaleString("en-IN")}.`, "PROJECT"),
  sprintGoalCreated: (name) => trigger("Sprint Goal Established", `New sprint milestone developed: ${name}.`, "PROJECT"),
  taskCreated: (title) => trigger("Kanban Task Created", `New objective "${title}" added to the team board.`, "TASK"),
  taskUpdated: (title, status) => trigger("Kanban Board Update", `Task "${title}" moved to ${status}.`, "TASK"),

  // 🇪🇺 Admin & GDPR Security Suite
  gdprRequestFulfled: (name, type) => trigger("GDPR DSR Fulfilled", `Subject request of ${name} for ${type.replace("_", " ")} completed within SLA limits.`, "SECURITY"),
  webhookTested: (name) => trigger("Webhook Tested", `Test payload successfully dispatched with HMAC signature to ${name}.`, "SECURITY"),
  matrixSaved: () => trigger("Event Matrix Updated", "Configurable business notification matrix rules saved successfully.", "SECURITY"),
  settingsConfigured: (section) => trigger("System Settings Modified", `System parameter configurations updated inside ${section} modules.`, "SECURITY"),

  // 🤖 Neural Intelligence AI
  aiModeChanged: (mode, isActive) => trigger("AI Assistant Mode Change", `AI Assistant ${mode} has been turned ${isActive ? "ON" : "OFF"}.`, "AI"),

  // 📅 Workspace & Chat
  calendarEventLogged: (title) => trigger("Calendar Event Logged", `New corporate calendar schedule developed: "${title}".`, "WORKSPACE"),
  chatMessageSent: (room) => trigger("Workspace Message Dispatched", `Collaboration thread activity detected inside ${room} room.`, "WORKSPACE")
};

export default notifier;