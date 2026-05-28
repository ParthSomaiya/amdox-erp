import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Register() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (type) => {
    if (loading) return;

    try {
      setLoading(true);
      setError("");

      // ================= ROUTE SELECTION =================
      if (type === "employee") {
        navigate("/register/employee");
        return;
      }

      if (type === "job") {
        navigate("/register/job");
        return;
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-slate-950 relative overflow-hidden">

      {/* BACKGROUND EFFECTS */}
      <div className="absolute w-[500px] h-[500px] bg-blue-500/20 blur-[120px] rounded-full -top-32 -left-32" />
      <div className="absolute w-[500px] h-[500px] bg-purple-500/20 blur-[120px] rounded-full bottom-0 right-0" />

      {/* CARD */}
      <div className="glass p-10 rounded-[32px] w-full max-w-xl shadow-2xl z-10">

        {/* HEADER */}
        <h1 className="text-5xl font-black gradient-text mb-3">
          Join AMDOX
        </h1>

        <p className="text-slate-400 mb-8">
          Choose your platform access
        </p>

        {/* ERROR */}
        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-5 text-sm">
            {error}
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="text-center text-slate-300 mb-4">
            Loading...
          </div>
        )}

        {/* OPTIONS */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* EMPLOYEE */}
          <button
            disabled={loading}
            onClick={() => handleRegister("employee")}
            className="premium-card p-8 text-left hover:scale-105 transition disabled:opacity-50"
          >
            <div className="text-5xl mb-5">👨‍💼</div>

            <h2 className="text-2xl font-bold mb-2">
              Employee Portal
            </h2>

            <p className="text-slate-400">
              HR, payroll, attendance, dashboard and company tools.
            </p>
          </button>

          {/* JOB SEEKER */}
          <button
            disabled={loading}
            onClick={() => handleRegister("job")}
            className="premium-card p-8 text-left hover:scale-105 transition disabled:opacity-50"
          >
            <div className="text-5xl mb-5">💼</div>

            <h2 className="text-2xl font-bold mb-2">
              Career Portal
            </h2>

            <p className="text-slate-400">
              Apply jobs, track applications and career opportunities.
            </p>
          </button>

        </div>

        {/* FOOTER */}
        <div className="text-center mt-8 text-sm text-slate-400">
          Select your access type to continue registration
        </div>

      </div>
    </div>
  );
}