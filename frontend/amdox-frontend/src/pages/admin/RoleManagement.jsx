import { useEffect, useState } from "react";
import { ShieldCheck, Plus, Check, Award } from "lucide-react";

export default function RoleManagement() {
  const [roles, setRoles] = useState([
    { _id: "1", name: "ADMIN", permissions: ["ALL_ACCESS", "TENANT_CONTROLS", "SECURITY_SETTINGS"] },
    { _id: "2", name: "HR", permissions: ["EMPLOYEE_CRUD", "LEAVE_APPROVALS", "PAYROLL_GENERATION"] },
    { _id: "3", name: "FINANCE", permissions: ["LEDGER_WRITE", "BILL_PAYMENTS", "INVOICE_CREATE"] },
    { _id: "4", name: "EMPLOYEE", permissions: ["ATTENDANCE_CLOCKIN", "LEAVE_APPLICATIONS", "VIEW_PAYSLIPS"] }
  ]);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 p-8 rounded-[32px] text-white shadow-md">
        <h1 className="text-3xl font-black flex items-center gap-2">👥 Role Management</h1>
        <p className="mt-2 text-slate-400 text-sm">Define and monitor system user roles and dynamic security clearances.</p>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {roles.map((role) => (
          <div key={role._id} className="bg-white border rounded-3xl p-6 shadow-sm space-y-4 hover:shadow-md transition">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-1.5">
                <Award size={18} className="text-indigo-600" /> {role.name}
              </h3>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-indigo-50 text-indigo-700 border border-indigo-100">
                Active Role
              </span>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Assigned Clearance Badges</span>
              <div className="flex flex-wrap gap-2 pt-1">
                {role.permissions.map((p, idx) => (
                  <span key={idx} className="px-3 py-1 bg-slate-50 border rounded-xl text-xs font-bold text-slate-600">
                    ✓ {p.replace("_", " ")}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}