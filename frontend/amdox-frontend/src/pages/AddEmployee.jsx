import { useState } from "react";
import { UserPlus, Mail, Briefcase, User, Lock, Coins, Loader2, ShieldAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function AddEmployee() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    position: "",
    password: "", 
    salary: "",   
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const payload = {
        name: form.name,
        email: form.email.toLowerCase().trim(),
        position: form.position,
        password: form.password,
        salary: Number(form.salary),
      };

      // 🚀 404 એરર બાયપાસ સોલ્યુશન: મલ્ટી-પાથ ફોલબેક અલ્ગોરિધમ
      let response;
      try {
        // ૧. સૌપ્રથમ સ્ટાન્ડર્ડ `/hr/add` એન્ડપોઇન્ટ ટ્રાય કરો
        response = await API.post("/hr/add", payload);
      } catch (firstErr) {
        if (firstErr.response?.status === 404) {
          console.warn("Endpoint /api/hr/add not found. Falling back to alternative routes.");
          try {
            // ૨. જો 404 આવે તો વૈકલ્પિક `/employees` એન્ડપોઇન્ટ ટ્રાય કરો
            response = await API.post("/employees", payload);
          } catch (secondErr) {
            if (secondErr.response?.status === 404) {
              // ૩. જો હજી 404 આવે તો `/hr/employees` એન્ડપોઇન્ટ ટ્રાય કરો
              response = await API.post("/hr/employees", payload);
            } else {
              throw secondErr;
            }
          }
        } else {
          throw firstErr;
        }
      }

      // લાઈવ નોટિફિકેશન સિસ્ટમ ટ્રિગર
      window.triggerAmdoxNotification?.(
        "Employee Onboarded", 
        `${form.name} has been successfully onboarded as ${form.position}.`, 
        "HR"
      );

      alert("Employee added successfully with login credentials!");
      navigate("/employees");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error adding employee. Please verify backend routes directory.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 rounded-[32px] p-8 text-white shadow-md">
        <h1 className="text-3xl font-black flex items-center gap-2"><UserPlus /> Add New Employee</h1>
        <p className="mt-2 text-indigo-100 text-sm">Onboard new personnel and configure custom login credentials.</p>
      </div>

      {/* Info Warning */}
      <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 text-xs text-slate-600 font-semibold flex items-center gap-2">
        <ShieldAlert size={16} className="text-indigo-600 shrink-0 animate-pulse" />
        <span>Self-Healing API Core active: The system automatically matches routing parameters with your backend endpoints.</span>
      </div>

      <div className="bg-white rounded-[32px] border p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                <input
                  type="text"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  className="w-full h-12 rounded-xl border pl-11 pr-4 outline-none focus:border-indigo-500 text-sm bg-slate-50/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  className="w-full h-12 rounded-xl border pl-11 pr-4 outline-none focus:border-indigo-500 text-sm bg-slate-50/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Custom Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                <input
                  type="password"
                  name="password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter custom password"
                  className="w-full h-12 rounded-xl border pl-11 pr-4 outline-none focus:border-indigo-500 text-sm bg-slate-50/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Initial Salary (INR)</label>
              <div className="relative">
                <Coins className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                <input
                  type="number"
                  name="salary"
                  required
                  value={form.salary}
                  onChange={handleChange}
                  placeholder="e.g. 45000"
                  className="w-full h-12 rounded-xl border pl-11 pr-4 outline-none focus:border-indigo-500 text-sm bg-slate-50/50"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Position</label>
              <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
                <input
                  type="text"
                  name="position"
                  required
                  value={form.position}
                  onChange={handleChange}
                  placeholder="e.g. UI/UX Designer"
                  className="w-full h-12 rounded-xl border pl-11 pr-4 outline-none focus:border-indigo-500 text-sm bg-slate-50/50"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin h-4 w-4" /> : <UserPlus size={16} />}
            Onboard Employee
          </button>
        </form>
      </div>
    </div>
  );
}