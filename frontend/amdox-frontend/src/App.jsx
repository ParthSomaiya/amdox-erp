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
      </Routes>
    </BrowserRouter>
  );
}

export default App;