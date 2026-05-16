import { useEffect, useState } from "react";
import API from "../services/api";

export default function PayrollList() {
  const [data, setData] = useState([]);

  useEffect(() => {
    API.get("/payroll").then((res) => setData(res.data));
  }, []);

  const markPaid = async (id) => {
    await API.put("/payroll/pay", { payrollId: id });
    window.location.reload();
  };

  return (
    <div>
      <h2>Payroll</h2>

      {data.map((p) => (
        <div key={p._id}>
          {p.employeeId?.email} | ₹{p.netSalary} | {p.status}

          {p.status === "PENDING" && (
            <button onClick={() => markPaid(p._id)}>Mark Paid</button>
          )}
        </div>
      ))}
    </div>
  );
}