import { useEffect, useState } from "react";
import { Users, UserPlus, Mail, Phone, Loader2, Send } from "lucide-react";
import axios from "axios";
import notifier from "../../utils/notifier";


export default function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = () => {
    setLoading(true);
    axios.get("http://localhost:5000/api/vendor")
      .then((res) => {
        setVendors(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
    notifier.vendorsRegistryViewed();
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setCreating(true);
      await axios.post("http://localhost:5000/api/vendor", form);
      alert("Vendor Registered Successfully!");
      setForm({ name: "", email: "", phone: "" });
      fetchVendors(); // લિસ્ટ લાઈવ અપડેટ કરવા
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to register vendor");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 rounded-[32px] p-8 text-white shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">👥 Vendors Registry</h1>
          <p className="mt-2 text-indigo-100 text-sm">Register corporate logistics and procurement suppliers.</p>
        </div>
        <div className="hidden sm:flex h-16 w-16 rounded-2xl bg-white/10 backdrop-blur-md items-center justify-center">
          <Users size={28} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* 🔹 LEFT SIDE: REGISTER NEW VENDOR FORM */}
        <div className="lg:col-span-5 bg-white rounded-[28px] border p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <UserPlus size={18} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">Register Vendor</h3>
              <p className="text-xs text-slate-400 font-medium">Add a new active procurement supplier</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Vendor Name</label>
              <input
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. AWS Logistics"
                className="w-full h-11 border rounded-xl px-4 text-sm bg-slate-50/50 outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address</label>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="vendor@company.com"
                className="w-full h-11 border rounded-xl px-4 text-sm bg-slate-50/50 outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+91 99999 99999"
                className="w-full h-11 border rounded-xl px-4 text-sm bg-slate-50/50 outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={creating}
              className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              {creating ? <Loader2 className="animate-spin h-4 w-4" /> : <Send size={14} />}
              {creating ? "Registering..." : "Register Vendor"}
            </button>
          </form>
        </div>

        {/* 🔹 RIGHT SIDE: ACTIVE VENDORS LIST */}
        <div className="lg:col-span-7 bg-white rounded-[28px] border p-6 shadow-sm space-y-6">
          <div>
            <h3 className="font-bold text-slate-800 text-base">Active Supply Vendors</h3>
            <p className="text-xs text-slate-400 font-medium">Currently active partners in procurement cycles</p>
          </div>

          {loading ? (
            <div className="py-20 text-center">
              <Loader2 className="animate-spin h-10 w-10 text-indigo-600 mx-auto" />
              <p className="mt-4 text-slate-500 font-semibold text-sm">Loading active suppliers...</p>
            </div>
          ) : vendors.length === 0 ? (
            <div className="p-12 text-center text-slate-400 border border-dashed rounded-2xl">
              <Users size={32} className="mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-semibold">No vendors found. Add your first supplier on the left.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vendors.map((v) => (
                <div key={v._id} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                  <h4 className="font-bold text-slate-800 text-sm">{v.name}</h4>
                  <div className="space-y-1 text-xs text-slate-500 font-medium">
                    <p className="flex items-center gap-1.5"><Mail size={12} /> {v.email}</p>
                    {v.phone && <p className="flex items-center gap-1.5"><Phone size={12} /> {v.phone}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}