import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
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
import FinanceAnalytics from "./pages/FinanceAnalytics";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
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
        <Route path="/payroll" element={<Payroll />} />
        <Route path="/register" element={<RegisterChoice />} />
        <Route path="/jobs" element={<Jobs />} />
        <Route path="/register/employee" element={<EmployeeRegister />} />
        <Route path="/register/job" element={<JobRegister />} />
        <Route path="/register/employee/:token" element={<EmployeeRegister />} />
        <Route path="/finance-analytics" element={<FinanceAnalytics />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;