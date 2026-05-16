import { useState } from "react";
import API from "../services/api";

export default function ApplyLeave() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");

  const apply = async () => {
    await API.post("/leave/apply", { fromDate, toDate, reason });
    alert("Leave Applied");
  };

  return (
    <div>
      <h2>Apply Leave</h2>

      <input type="date" onChange={(e) => setFromDate(e.target.value)} />
      <input type="date" onChange={(e) => setToDate(e.target.value)} />
      <input placeholder="Reason" onChange={(e) => setReason(e.target.value)} />

      <button onClick={apply}>Apply</button>
    </div>
  );
}