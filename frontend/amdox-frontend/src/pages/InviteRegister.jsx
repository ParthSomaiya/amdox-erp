import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

export default function InviteRegister() {
  const { token } = useParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    API.get(`/hr/invite/${token}`).then((res) => {
      setEmail(res.data.email);
    });
  }, []);

  const register = async () => {
    await API.post("/auth/register-invite", { token, password });
    alert("Account created");
  };

  return (
    <div>
      <h2>Complete Registration</h2>
      <p>{email}</p>

      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={register}>Register</button>
    </div>
  );
}