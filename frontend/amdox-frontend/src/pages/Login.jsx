import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Login() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // ================= CHANGE HANDLER =================
  const handleChange = (e) => {
    setError("");

    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ================= SUBMIT =================
  const submit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const res = await API.post("/auth/login", {
        email: form.email.toLowerCase(),
        password: form.password,
      });

      const { accessToken, user } = res.data;

      localStorage.setItem("token", accessToken);
      localStorage.setItem("user", JSON.stringify(user));

      switch (user.role) {
        case "ADMIN":
          navigate("/dashboard");
          break;
        case "EMPLOYEE":
          navigate("/employee-dashboard");
          break;
        case "JOB_SEEKER":
          navigate("/job-dashboard");
          break;
        default:
          navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= UI =================
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-6 bg-slate-950">

      {/* BACKGROUND EFFECTS */}
      <div className="absolute w-[500px] h-[500px] bg-blue-500/20 blur-[120px] rounded-full -top-32 -left-32" />
      <div className="absolute w-[500px] h-[500px] bg-purple-500/20 blur-[120px] rounded-full bottom-0 right-0" />

      {/* CARD */}
      <form
        onSubmit={submit}
        className="glass w-full max-w-md rounded-[32px] p-10 relative z-10 shadow-2xl"
      >
        {/* HEADER */}
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-black gradient-text">
            AMDOX
          </h1>

          <p className="text-slate-400 mt-3">
            Enterprise ERP Platform
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {/* FORM */}
        <div className="space-y-5">
          <input
            type="email"
            name="email"
            placeholder="Enter Email"
            className="premium-input"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />

          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            className="premium-input"
            value={form.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
          />

          <button
            type="submit"
            disabled={loading}
            className="primary-btn w-full py-4 text-white font-bold text-lg disabled:opacity-60"
          >
            {loading ? "Authenticating..." : "Login To Dashboard"}
          </button>
        </div>

        {/* FOOTER */}
        <div className="text-center mt-6 text-sm text-slate-400">
          Secure ERP Authentication System
        </div>
      </form>
    </div>
  );
}