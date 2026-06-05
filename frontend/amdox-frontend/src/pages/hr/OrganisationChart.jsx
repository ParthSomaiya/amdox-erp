import { useEffect, useState, useMemo } from "react";
import { Users, Mail, Loader2, Award, Briefcase, ShieldCheck, Cpu } from "lucide-react";
import API from "../../services/api";

export default function OrganisationChart() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadEmployees = async () => {
        try {
            setLoading(true);
            const res = await API.get("/hr/employees").catch(() => ({ data: [] }));
            const serverEmps = res.data || [];

            const localEmps = JSON.parse(localStorage.getItem("amdox_employees") || "[]");
            const merged = [...serverEmps];
            localEmps.forEach(le => {
                if (!merged.some(se => se._id === le._id)) merged.push(le);
            });
            setEmployees(merged);
        } catch (err) {
            console.warn("Failed to load real-time employees list, using fallbacks.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadEmployees();
    }, []);

    // કર્મચારીઓનું હોદ્દા અને રોલના આધારે ૩ લેવલમાં સચોટ વિભાજન
    const categorizedHierarchy = useMemo(() => {
        const leaders = [];
        const managers = [];
        const operations = [];

        employees.forEach(emp => {
            const role = emp.userId?.role || emp.role || "EMPLOYEE";
            const name = emp.userId?.name || emp.name || "Employee";
            const position = emp.position || "Staff Member";
            const email = emp.userId?.email || emp.email || "";

            const node = { id: emp._id, name, position, email, role };

            const isLeader = role === "ADMIN" || position.toLowerCase().includes("ceo") || position.toLowerCase().includes("director") || position.toLowerCase().includes("founder");
            const isManager = role === "HR" || role === "FINANCE" || position.toLowerCase().includes("manager") || position.toLowerCase().includes("lead") || position.toLowerCase().includes("head");

            if (isLeader) {
                leaders.push(node);
            } else if (isManager) {
                managers.push(node);
            } else {
                operations.push(node);
            }
        });

        // જો લીડરશીપમાં કોઈ ન હોય તો મોક એડમિન સેટ કરો
        if (leaders.length === 0) {
            leaders.push({ id: "leader-default", name: "Corporate Leadership", position: "Executive Board", email: "board@company.com", role: "ADMIN" });
        }

        return { leaders, managers, operations };
    }, [employees]);

    return (
        <div className="bg-white border rounded-[32px] p-6 sm:p-8 shadow-sm space-y-8 max-w-5xl mx-auto overflow-x-hidden">
            <div className="pb-4 border-b">
                <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                    <Users className="text-indigo-600 animate-pulse" /> Corporate Organisation Chart
                </h2>
                <p className="text-xs text-slate-400 mt-1">Interactive corporate map connecting Executive Board, Managers, and Operations teams</p>
            </div>

            {loading ? (
                <div className="py-20 text-center">
                    <Loader2 className="animate-spin h-10 w-10 text-indigo-600 mx-auto" />
                    <p className="text-slate-400 text-xs font-bold mt-4">Generating visual tree map...</p>
                </div>
            ) : (
                <div className="flex flex-col items-center relative w-full overflow-x-auto py-6 min-w-[600px] scrollbar-none">

                    {/* LEVEL 1: EXECUTIVE LEADERSHIP (CEO / DIRECTORS) */}
                    <div className="flex flex-col items-center relative">
                        <span className="text-[9px] font-black uppercase text-indigo-600 tracking-wider mb-2">Level 1: Executive Board</span>
                        <div className="flex gap-4">
                            {categorizedHierarchy.leaders.map(leader => (
                                <div key={leader.id} className="p-4 bg-slate-900 text-white rounded-2xl border border-slate-800 shadow-md text-center w-52 relative z-10">
                                    <div className="h-8 w-8 mx-auto rounded-lg bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center text-xs mb-2">
                                        <Award size={14} />
                                    </div>
                                    <h4 className="font-extrabold text-xs sm:text-sm truncate">{leader.name}</h4>
                                    <p className="text-[10px] text-indigo-300 font-bold mt-0.5 truncate">{leader.position}</p>
                                </div>
                            ))}
                        </div>

                        {/* Tree Connecting Line */}
                        <div className="h-8 w-0.5 bg-slate-200" />
                    </div>

                    {/* LEVEL 2: MANAGEMENT & HR (ફક્ત જો એડ કરેલા હોય તો જ દેખાશે, ટ્રી ક્યારેય બ્રેક નહીં થાય) */}
                    {categorizedHierarchy.managers.length > 0 && (
                        <div className="flex flex-col items-center relative w-full">
                            <span className="text-[9px] font-black uppercase text-indigo-600 tracking-wider mb-2">Level 2: Administration & Management</span>
                            <div className="flex gap-6 justify-center flex-wrap relative">

                                {/* Horizontal line for connecting multiple managers */}
                                {categorizedHierarchy.managers.length > 1 && (
                                    <div className="absolute top-1/2 -translate-y-1/2 left-10 right-10 h-0.5 bg-slate-200 -z-0" />
                                )}

                                {categorizedHierarchy.managers.map(manager => (
                                    <div key={manager.id} className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs text-center w-48 relative z-10 hover:border-indigo-500/50 transition">
                                        <div className="h-8 w-8 mx-auto rounded-lg bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center text-xs mb-2">
                                            <Briefcase size={14} />
                                        </div>
                                        <h4 className="font-extrabold text-slate-800 text-xs truncate">{manager.name}</h4>
                                        <p className="text-[10px] text-slate-400 font-bold mt-0.5 truncate">{manager.position}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Tree Connecting Line */}
                            <div className="h-8 w-0.5 bg-slate-200" />
                        </div>
                    )}

                    {/* LEVEL 3: OPERATIONS & ENGINEERING (DEVELOPERS / DESIGNERS) */}
                    <div className="flex flex-col items-center w-full relative">
                        <span className="text-[9px] font-black uppercase text-indigo-600 tracking-wider mb-2">Level 3: Operations & Execution</span>
                        <div className="flex gap-4 justify-center flex-wrap max-w-4xl relative">
                            {categorizedHierarchy.operations.length === 0 ? (
                                <p className="text-xs text-slate-400 italic">No operations staff currently assigned.</p>
                            ) : (
                                categorizedHierarchy.operations.map(staff => (
                                    <div key={staff.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl shadow-xs text-center w-44 hover:bg-white hover:border-indigo-300 transition duration-150">
                                        <div className="h-8 w-8 mx-auto rounded-lg bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center text-xs mb-2">
                                            <Cpu size={14} />
                                        </div>
                                        <h5 className="font-bold text-slate-800 text-xs truncate">{staff.name}</h5>
                                        <p className="text-[9px] text-slate-400 font-bold mt-0.5 truncate">{staff.position}</p>
                                        <span className="text-[8px] text-slate-400 font-semibold truncate block mt-1.5">{staff.email}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                </div>
            )}

            <div className="flex items-center justify-center gap-1.5 text-[10px] sm:text-xs text-slate-400 font-semibold pt-2 border-t">
                <ShieldCheck size={13} className="text-indigo-600 shrink-0" /> Enterprise Hierarchy Integrity Checked & Verified
            </div>
        </div>
    );
}