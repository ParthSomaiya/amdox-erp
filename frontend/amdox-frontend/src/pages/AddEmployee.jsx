import { useState } from "react";
import API from "../services/api";

export default function AddEmployee() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [position, setPosition] = useState("");

  const handleSubmit = async () => {
    try {
      await API.post("/hr/add", { name, email, position });
      alert("Employee Added");
    } catch (err) {
      alert("Error adding employee");
    }
  };

  return (
    <div>
      <h2>Add Employee</h2>

      <input placeholder="Name" onChange={(e) => setName(e.target.value)} />
      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="Position" onChange={(e) => setPosition(e.target.value)} />

      <button onClick={handleSubmit}>Add</button>
    </div>
  );
}