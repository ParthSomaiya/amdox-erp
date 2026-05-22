import { useState } from "react";
import API from "../services/api";

export default function JobRegister() {
  const [data, setData] = useState({});

  const handleSubmit = async () => {
    await API.post("/auth/register-job", data);
    alert("Registered!");
  };

  return (
    <div>
      <h2>Job Seeker Register</h2>
      <input placeholder="Name" onChange={(e)=>setData({...data, name:e.target.value})}/>
      <input placeholder="Email" onChange={(e)=>setData({...data, email:e.target.value})}/>
      <input type="password" placeholder="Password" onChange={(e)=>setData({...data, password:e.target.value})}/>
      <button onClick={handleSubmit}>Register</button>
    </div>
  );
}