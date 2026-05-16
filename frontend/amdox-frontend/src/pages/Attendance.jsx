import { useState } from "react";
import API from "../services/api";

export default function Attendance() {
  const [message, setMessage] = useState("");

  const checkIn = async () => {
    try {
      await API.post("/attendance/check-in");
      setMessage("Checked In ✅");
    } catch (err) {
      setMessage("Already checked in");
    }
  };

  const checkOut = async () => {
    try {
      await API.post("/attendance/check-out");
      setMessage("Checked Out ✅");
    } catch (err) {
      setMessage("Checkout error");
    }
  };

  return (
    <div>
      <h2>Attendance</h2>

      <button onClick={checkIn}>Check In</button>
      <button onClick={checkOut}>Check Out</button>

      <p>{message}</p>
    </div>
  );
}