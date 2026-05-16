import { useEffect, useState } from "react";
import API from "../services/api";

export default function MyPayslip() {
  const [data, setData] = useState([]);

  useEffect(() => {
    API.get("/payroll/my").then((res) => setData(res.data));
  }, []);

  return (
    <div>
      <h2>My Payslips</h2>

      {data.map((p) => (
        <div key={p._id}>
          {p.month} | ₹{p.netSalary} | {p.status}
        </div>
      ))}
    </div>
  );
}