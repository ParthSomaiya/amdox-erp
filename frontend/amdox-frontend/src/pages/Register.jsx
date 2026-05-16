import { useState } from "react";
import API from "../services/api";

export default function Register() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState(1);

  const sendOtp = async () => {
    await API.post("/auth/send-otp", { email });
    setStep(2);
  };

  const verifyOtp = async () => {
    await API.post("/auth/verify-otp", {
      email,
      otp,
      password,
      role: "EMPLOYEE",
    });

    alert("Registered");
  };

  return (
    <div>
      <h2>Register</h2>

      {step === 1 && (
        <>
          <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
          <button onClick={sendOtp}>Send OTP</button>
        </>
      )}

      {step === 2 && (
        <>
          <input placeholder="OTP" onChange={(e) => setOtp(e.target.value)} />
          <input placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
          <button onClick={verifyOtp}>Verify & Register</button>
        </>
      )}
    </div>
  );
}