import { useParams } from "react-router-dom";
import { useState } from "react";
import API from "../services/api";

export default function EmployeeRegister() {
  const { token } = useParams();

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await API.post("/auth/register-invite", {
        token,
        name,
        password,
      });

      alert("Account created! Login now");
    } catch (err) {
      alert("Error");
    }
  };

  return (
    <div>
      <h2>Complete Registration</h2>

      <input
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleRegister}>
        Register
      </button>
    </div>
  );
}