import { useState } from "react";
import { UserPlus, Mail, Briefcase, User, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function AddEmployee() {
  const navigate = useNavigate();

  // ================= STATE =================
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    position: "",
  });

  // ================= CHANGE =================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // ફેરફાર: સાચો બેકએન્ડ પાથ "/employees" સેટ કર્યો
      await API.post("/hr/add", form); 

      alert("Employee Added Successfully");
      navigate("/employees");
    } catch (err) {
      console.error("Error Response:", err.response);
      alert(err.response?.data?.message || "Error adding employee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* HERO */}
      <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 rounded-[32px] p-10 text-white shadow-xl">
        <div className="flex items-center gap-5">
          <div className="h-20 w-20 rounded-3xl bg-white/20 flex items-center justify-center">
            <UserPlus size={40} />
          </div>
          <div>
            <h1 className="text-5xl font-black">Add Employee</h1>
            <p className="mt-3 text-cyan-100 text-lg">Create employee account professionally</p>
          </div>
        </div>
      </div>

      {/* FORM */}
      <div className="bg-white rounded-[32px] shadow-lg p-10 max-w-4xl">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* NAME */}
          <div>
            <label className="font-bold text-lg mb-3 block">Full Name</label>
            <div className="h-16 border border-gray-300 rounded-2xl flex items-center px-5 focus-within:border-cyan-500">
              <User className="text-gray-400" />
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Enter employee name"
                className="flex-1 h-full px-4 outline-none"
              />
            </div>
          </div>

          {/* EMAIL */}
          <div>
            <label className="font-bold text-lg mb-3 block">Email Address</label>
            <div className="h-16 border border-gray-300 rounded-2xl flex items-center px-5 focus-within:border-cyan-500">
              <Mail className="text-gray-400" />
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="Enter email"
                className="flex-1 h-full px-4 outline-none"
              />
            </div>
          </div>

          {/* POSITION */}
          <div className="md:col-span-2">
            <label className="font-bold text-lg mb-3 block">Position</label>
            <div className="h-16 border border-gray-300 rounded-2xl flex items-center px-5 focus-within:border-cyan-500">
              <Briefcase className="text-gray-400" />
              <input
                type="text"
                name="position"
                value={form.position}
                onChange={handleChange}
                required
                placeholder="Frontend Developer"
                className="flex-1 h-full px-4 outline-none"
              />
            </div>
          </div>

          {/* BUTTON */}
          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="h-16 px-10 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-lg hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="animate-spin h-5 w-5" />}
              {loading ? "Adding Employee..." : "Add Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}