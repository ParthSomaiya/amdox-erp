import { useState } from "react";
import API from "../services/api";

export default function GeneratePayroll() {
  const [employeeId, setEmployeeId] = useState("");
  const [basicSalary, setBasicSalary] = useState(0);
  const [bonus, setBonus] = useState(0);
  const [deductions, setDeductions] = useState(0);
  const [month, setMonth] = useState("");

  const generate = async () => {
    await API.post("/payroll/generate", {
      employeeId,
      basicSalary,
      bonus,
      deductions,
      month,
    });

    alert("Payroll generated");
  };

  return (
    <div>
      <h2>Generate Payroll</h2>

      <input placeholder="Employee ID" onChange={(e) => setEmployeeId(e.target.value)} />
      <input placeholder="Basic Salary" onChange={(e) => setBasicSalary(e.target.value)} />
      <input placeholder="Bonus" onChange={(e) => setBonus(e.target.value)} />
      <input placeholder="Deductions" onChange={(e) => setDeductions(e.target.value)} />
      <input placeholder="Month (2026-04)" onChange={(e) => setMonth(e.target.value)} />

      <button onClick={generate}>Generate</button>
    </div>
  );
}