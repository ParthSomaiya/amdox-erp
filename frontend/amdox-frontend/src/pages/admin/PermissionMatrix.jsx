import { useEffect, useState } from "react";
import { ShieldCheck, Plus, Check, Loader2, Info } from "lucide-react";

export default function PermissionMatrix() {
  const [saving, setSaving] = useState(false);
  const [matrix, setMatrix] = useState({
    "Invoices Management": { create: true, read: true, update: false, delete: false },
    "Payroll Slips Control": { create: true, read: true, update: false, delete: false },
    "Warehouse Products Inventory": { create: true, read: true, update: true, delete: false },
    "Employee Registry": { create: true, read: true, update: true, delete: true }
  });

  // પેજ લોડ થતી વખતે સેવ કરેલી પરમિશન રીડ કરવી
  useEffect(() => {
    const savedMatrix = localStorage.getItem("amdox_permission_matrix");
    if (savedMatrix) {
      try {
        setMatrix(JSON.parse(savedMatrix));
      } catch (err) {
        console.error("Failed to parse permission matrix:", err);
      }
    }
  }, []);

  // ચેકબોક્સ ટોગલ કરવાનું ફંક્શન
  const handleToggle = (module, action) => {
    setMatrix((prev) => ({
      ...prev,
      [module]: {
        ...prev[module],
        [action]: !prev[module][action],
      },
    }));
  };

  // પરમિશન મેટ્રિક્સ સેવ કરવાનું ફંક્શન
  const handleSave = async () => {
    try {
      setSaving(true);
      
      // એપીઆઈ સિમ્યુલેશન ડિલે
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      localStorage.setItem("amdox_permission_matrix", JSON.stringify(matrix));
      alert("Authorization rules and permission matrix saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save permissions");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-800 via-indigo-700 to-purple-800 p-8 rounded-[32px] text-white shadow-md">
        <h1 className="text-3xl font-black flex items-center gap-2">🧩 Permission Matrix</h1>
        <p className="mt-2 text-indigo-100 text-sm">Configure security access rights (CRUD) across all enterprise workspace modules.</p>
      </div>

      {/* Info Warning */}
      <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-xs text-slate-500 font-semibold flex items-center gap-2">
        <Info size={16} className="text-indigo-600 shrink-0" />
        <span>Changes made below dynamically reconfigure multi-tenant role authorizations for active users.</span>
      </div>

      {/* Grid Table */}
      <div className="bg-white rounded-3xl border shadow-sm overflow-hidden p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-slate-600">
            <thead className="bg-slate-50 border-b text-xs uppercase font-bold text-slate-700">
              <tr>
                <th className="p-4 text-left">Module / Feature</th>
                <th className="p-4 text-center">Create</th>
                <th className="p-4 text-center">Read</th>
                <th className="p-4 text-center">Update</th>
                <th className="p-4 text-center">Delete</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(matrix).map((mod) => (
                <tr key={mod} className="border-b hover:bg-slate-50/50 transition">
                  <td className="p-4 font-bold text-slate-800">{mod}</td>
                  
                  {/* Create */}
                  <td className="p-4 text-center">
                    <input
                      type="checkbox"
                      checked={matrix[mod].create}
                      onChange={() => handleToggle(mod, "create")}
                      className="rounded text-indigo-600 focus:ring-indigo-500 h-4.5 w-4.5 accent-indigo-600 cursor-pointer"
                    />
                  </td>

                  {/* Read */}
                  <td className="p-4 text-center">
                    <input
                      type="checkbox"
                      checked={matrix[mod].read}
                      onChange={() => handleToggle(mod, "read")}
                      className="rounded text-indigo-600 focus:ring-indigo-500 h-4.5 w-4.5 accent-indigo-600 cursor-pointer"
                    />
                  </td>

                  {/* Update */}
                  <td className="p-4 text-center">
                    <input
                      type="checkbox"
                      checked={matrix[mod].update}
                      onChange={() => handleToggle(mod, "update")}
                      className="rounded text-indigo-600 focus:ring-indigo-500 h-4.5 w-4.5 accent-indigo-600 cursor-pointer"
                    />
                  </td>

                  {/* Delete */}
                  <td className="p-4 text-center">
                    <input
                      type="checkbox"
                      checked={matrix[mod].delete}
                      onChange={() => handleToggle(mod, "delete")}
                      className="rounded text-indigo-600 focus:ring-indigo-500 h-4.5 w-4.5 accent-indigo-600 cursor-pointer"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="h-11 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition disabled:opacity-50"
          >
            {saving ? <Loader2 className="animate-spin h-3.5 w-3.5" /> : <Check size={14} />}
            Save Authorization Rules
          </button>
        </div>
      </div>
    </div>
  );
}