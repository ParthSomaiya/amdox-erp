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
    <div className="space-y-6 max-w-full overflow-x-hidden px-1">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 rounded-2xl sm:rounded-[32px] p-5 sm:p-8 text-white shadow-sm flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight flex items-center gap-2">
            <Users className="shrink-0" size={22} /> Vendors Registry
          </h1>
          <p className="text-indigo-100 text-xs sm:text-sm">Register corporate logistics and procurement suppliers.</p>
        </div>
        <div className="hidden sm:flex h-14 w-14 rounded-2xl bg-white/10 backdrop-blur-md items-center justify-center shrink-0">
          <Users size={24} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full max-w-full overflow-hidden">
        
        {/* 🔹 LEFT SIDE: REGISTER NEW VENDOR FORM */}
        <div className="lg:col-span-5 bg-white rounded-2xl sm:rounded-[28px] border p-4 sm:p-6 shadow-sm space-y-4 sm:space-y-6 w-full max-w-full">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <UserPlus size={16} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm sm:text-base">Register Vendor</h3>
              <p className="text-[11px] text-slate-400 font-medium">Add a new active procurement supplier</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs font-semibold text-slate-700">
            <div>
              <label className="block mb-1 text-slate-500 uppercase tracking-wider">Vendor Name</label>
              <input
                type="text"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. AWS Logistics"
                className="w-full h-10 border border-slate-200 rounded-xl px-3.5 text-xs sm:text-sm bg-slate-50/50 outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block mb-1 text-slate-500 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="vendor@company.com"
                className="w-full h-10 border border-slate-200 rounded-xl px-3.5 text-xs sm:text-sm bg-slate-50/50 outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block mb-1 text-slate-500 uppercase tracking-wider">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+91 99999 99999"
                className="w-full h-10 border border-slate-200 rounded-xl px-3.5 text-xs sm:text-sm bg-slate-50/50 outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={creating}
              className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition disabled:opacity-50 cursor-pointer shadow-sm"
            >
              {creating ? <Loader2 className="animate-spin h-3.5 w-3.5" /> : <Send size={13} />}
              {creating ? "Registering..." : "Register Vendor"}
            </button>
          </form>
        </div>

        {/* 🔹 RIGHT SIDE: ACTIVE VENDORS LIST */}
        <div className="lg:col-span-7 bg-white rounded-2xl sm:rounded-[28px] border p-4 sm:p-6 shadow-sm space-y-4 sm:space-y-6 w-full max-w-full overflow-hidden">
          <div>
            <h3 className="font-bold text-slate-800 text-sm sm:text-base">Active Supply Vendors</h3>
            <p className="text-[11px] text-slate-400 font-medium">Currently active partners in procurement cycles</p>
          </div>

          {loading ? (
            <div className="py-20 text-center">
              <Loader2 className="animate-spin h-8 w-8 text-indigo-600 mx-auto" />
              <p className="mt-4 text-slate-500 font-semibold text-xs">Loading active suppliers...</p>
            </div>
          ) : vendors.length === 0 ? (
            <div className="p-12 text-center text-slate-400 border border-dashed border-slate-200 rounded-xl">
              <Users size={28} className="mx-auto text-slate-300 mb-2" />
              <p className="text-xs font-semibold">No vendors found. Add your first supplier on the left.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {vendors.map((v) => (
                <div key={v._id} className="p-4 bg-slate-50 rounded-xl sm:rounded-2xl border border-slate-100 space-y-2.5 min-w-0 overflow-hidden">
                  <h4 className="font-bold text-slate-800 text-xs sm:text-sm truncate">{v.name}</h4>
                  <div className="space-y-1 text-[11px] text-slate-500 font-medium min-w-0">
                    <p className="flex items-center gap-1.5 truncate">
                      <Mail size={11} className="shrink-0 text-slate-400" />
                      <span className="truncate">{v.email}</span>
                    </p>
                    {v.phone && (
                      <p className="flex items-center gap-1.5 truncate">
                        <Phone size={11} className="shrink-0 text-slate-400" />
                        <span className="truncate">{v.phone}</span>
                      </p>
                    )}
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