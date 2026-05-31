import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useState, useEffect, useMemo } from "react";
import { Sparkles, Loader2, Save, FileText, ChevronRight, BarChart2, TrendingUp, Info, Package, ShieldCheck } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import API from "../../services/api";

export default function BusinessIntelligence() {
  const [enabled, setEnabled] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeDrillDown, setActiveDrillDown] = useState("revenue");

  const [widgets, setWidgets] = useState([]);
  const [liveInvoices, setLiveInvoices] = useState([]);
  const [liveLowStocks, setLiveLowStocks] = useState([]);
  const [taskStats, setTaskStats] = useState({ completed: 0, total: 0 });

  useEffect(() => {
    const animation = requestAnimationFrame(() => setEnabled(true));
    loadDynamicBIData();
    return () => {
      cancelAnimationFrame(animation);
      setEnabled(false);
    };
  }, []);

  const loadDynamicBIData = async () => {
    try {
      setLoading(true);
      const [invoiceRes, lowStockRes, projectsRes, tasksRes] = await Promise.all([
        API.get("/finance/invoice").catch(() => ({ data: [] })),
        API.get("/inventory/low-stock").catch(() => ({ data: [] })),
        API.get("/projects").catch(() => ({ data: [] })),
        API.get("/tasks").catch(() => ({ data: [] }))
      ]);

      const invoices = invoiceRes.data || [];
      const paidInvoices = invoices.filter(inv => inv.status === "PAID");
      const totalRev = paidInvoices.reduce((sum, inv) => sum + (inv.amount || 0), 0);
      setLiveInvoices(paidInvoices);

      const lowStocks = lowStockRes.data || [];
      setLiveLowStocks(lowStocks);

      const activeProjectsCount = (projectsRes.data || []).length;

      const tasksList = tasksRes.data || [];
      const completed = tasksList.filter(t => t.status === "DONE").length;
      setTaskStats({ completed, total: tasksList.length });

      const initialWidgets = [
        { id: "revenue", name: "Financial Revenue Widget", desc: "Live EBITDA and sales cashflows", val: `₹${totalRev.toLocaleString("en-IN")}` },
        { id: "stock", name: "Warehouse Low Stock Warning", desc: "Monitors warehouse safety limit underages", val: `${lowStocks.length} Warnings` },
        { id: "projects", name: "Sprint Progress Tracker", desc: "Active roadmap task completions", val: `${activeProjectsCount} Projects` }
      ];

      const savedConfig = localStorage.getItem("amdox_bi_widgets_layout");
      if (savedConfig) {
        const parsed = JSON.parse(savedConfig);
        const ordered = parsed.map(p => {
          const matched = initialWidgets.find(w => w.id === p.id);
          return matched ? { ...p, val: matched.val } : p;
        });
        setWidgets(ordered);
      } else {
        setWidgets(initialWidgets);
      }

    } catch (err) {
      console.error("Failed to compile BI analytics:", err);
    } finally {
      setLoading(false);
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = [...widgets];
    const [removed] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, removed);
    setWidgets(reordered);
  };

  const handleSaveLayout = async () => {
    const start = performance.now();
    setSaving(true);
    
    localStorage.setItem("amdox_bi_widgets_layout", JSON.stringify(widgets));
    await new Promise((resolve) => setTimeout(resolve, 100));
    
    const end = performance.now();
    const duration = (end - start).toFixed(1);
    alert(`Dashboard layout configured in ${duration}ms!`);
    setSaving(false);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(79, 70, 229); 
    doc.text("AMDOX TECHNOLOGIES - BI REPORT", 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(148, 163, 184); 
    doc.text("Consolidated Business Intelligence Metrics", 14, 26);
    doc.line(14, 30, 196, 30);

    const columns = ["Widget Name", "Description", "Aggregated Value"];
    const rows = widgets.map(w => [w.name, w.desc, w.val]);

    autoTable(doc, {
      startY: 35,
      head: [columns],
      body: rows,
      headStyles: { fillColor: [79, 70, 229] }
    });

    doc.save(`AMDOX_BI_Report_${Date.now()}.pdf`);
  };

  const chartData = useMemo(() => {
    const monthlyMap = { Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0, Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0 };
    liveInvoices.forEach(inv => {
      if (inv.createdAt) {
        const monthName = new Date(inv.createdAt).toLocaleString("default", { month: "short" });
        if (monthlyMap[monthName] !== undefined) {
          monthlyMap[monthName] += (inv.amount || 0);
        }
      }
    });

    const formatted = Object.keys(monthlyMap).map(k => ({ name: k, value: monthlyMap[k] }));
    const hasValues = formatted.some(d => d.value > 0);

    return hasValues ? formatted : [
      { name: "Jan", value: 30000 },
      { name: "Feb", value: 45000 },
      { name: "Mar", value: 72000 },
      { name: "Apr", value: 125000 }
    ];
  }, [liveInvoices]);

  const completionRate = useMemo(() => {
    return taskStats.total > 0 ? ((taskStats.completed / taskStats.total) * 100).toFixed(1) : 0;
  }, [taskStats]);

  if (!enabled) return null;

  return (
    <div className="space-y-6 max-w-full overflow-x-hidden px-1">
      {/* 🔹 રિસ્પોન્સિવ હેડર */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-950 p-5 sm:p-8 rounded-2xl sm:rounded-[32px] text-white shadow-xl border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl animate-pulse" />
        <div className="relative z-10 space-y-2">
          <span className="text-[10px] sm:text-xs uppercase tracking-widest text-indigo-300 font-bold">Decision Intelligence</span>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight flex items-center gap-2 flex-wrap">
            <Sparkles className="text-indigo-400 shrink-0" size={18} /> Business Intelligence (BI)
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl leading-relaxed">
            Drag-and-drop dashboard builder, instant scheduled reports, and deep drill-down analytics.
          </p>
        </div>
      </div>

      {/* 🔹 રિસ્પોન્સિવ કંટ્રોલ બાર */}
      <div className="bg-white rounded-2xl sm:rounded-3xl border p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-bold text-slate-800 text-xs sm:text-sm">Dashboard Configuration</h3>
          <p className="text-[10px] sm:text-xs text-slate-400">Drag widgets to compile layout, save configuration, or export analytics.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button
            onClick={handleSaveLayout}
            disabled={saving || loading}
            className="h-9 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition disabled:opacity-50 w-full sm:w-auto cursor-pointer"
          >
            {saving ? <Loader2 className="animate-spin h-3.5 w-3.5" /> : <Save size={14} />}
            Save Configuration
          </button>
          <button
            onClick={handleExportPDF}
            disabled={loading}
            className="h-9 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition w-full sm:w-auto cursor-pointer"
          >
            <FileText size={14} /> Export to PDF
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-20 text-center"><Loader2 className="animate-spin h-10 w-10 text-indigo-600 mx-auto" /></div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full max-w-full overflow-hidden">
          
          {/* DRAG-AND-DROP BUILDER (LEFT SECTION) */}
          <div className="lg:col-span-6 bg-white border rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm space-y-4 sm:space-y-6 w-full max-w-full overflow-hidden">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-800">Dynamic Widget Workspace</h2>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">Change widget positions and click them to drill-down into detailed trends</p>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="bi">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className="space-y-3 min-h-[180px] w-full">
                    {widgets.map((widget, index) => (
                      <Draggable key={widget.id} draggableId={widget.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            onClick={() => {
                              setActiveDrillDown(widget.id);
                            }}
                            className={`border p-3 sm:p-4 rounded-xl flex items-center justify-between gap-2.5 transition cursor-pointer w-full ${
                              activeDrillDown === widget.id 
                                ? "bg-indigo-50/50 border-indigo-500/40 shadow-inner" 
                                : "bg-slate-50/50 hover:bg-slate-100/50"
                            }`}
                          >
                            <div className="min-w-0 flex-1">
                              <span className="text-xs font-bold text-slate-800 block truncate">{widget.name}</span>
                              <p className="text-[10px] text-slate-400 mt-0.5 font-medium block truncate">{widget.desc}</p>
                            </div>
                            <span className="text-[11px] sm:text-xs font-black text-indigo-600 shrink-0 bg-white border px-2 py-1 rounded-lg">
                              {widget.val}
                            </span>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>

          {/* DRILL-DOWN ANALYTICS (RIGHT SECTION) */}
          <div className="lg:col-span-6 bg-white border rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-sm space-y-4 sm:space-y-6 min-h-[320px] sm:min-h-[380px] flex flex-col justify-between w-full max-w-full overflow-hidden">
            <div>
              <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black bg-indigo-50 text-indigo-700 border border-indigo-100">
                Drill-down Analytics Active
              </span>
              <h2 className="text-sm sm:text-base font-bold text-slate-800 mt-3 sm:mt-4">
                {activeDrillDown === "revenue" && "EBITDA Revenue Flow Details"}
                {activeDrillDown === "stock" && "Understock Shelf Details"}
                {activeDrillDown === "projects" && "Milestone Completion Details"}
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">Deep analysis of selected corporate parameters</p>
            </div>

            {/* 🔹 ચાર્ટ કન્ટેનર: હાઇટ અને ઓવરફ્લો અટકાવવા માટેના સુધારા */}
            <div className="h-48 sm:h-64 w-full relative min-w-0 overflow-hidden pt-4 sm:pt-6 border-t flex items-center justify-center">
              {activeDrillDown === "revenue" && (
                <div className="w-full h-full relative min-w-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorBi" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={9} tickLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={9} tickLine={false} />
                      <Tooltip />
                      <Area type="monotone" dataKey="value" stroke="#4f46e5" fillOpacity={1} fill="url(#colorBi)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}

              {activeDrillDown === "stock" && (
                <div className="text-center space-y-2 p-3 sm:p-5 bg-slate-50/50 border rounded-2xl w-full">
                  <p className="text-[11px] sm:text-xs font-bold text-slate-700">Currently, {liveLowStocks.length} items are flagged for low stock:</p>
                  <div className="text-[10px] text-rose-600 font-bold space-y-1 max-h-28 overflow-y-auto">
                    {liveLowStocks.length === 0 ? (
                      <div className="text-emerald-600">All items are healthy! No low stock warnings.</div>
                    ) : (
                      liveLowStocks.map(item => (
                        <div key={item._id} className="truncate">• {item.name} ({item.quantity || item.stock || 0} Units remaining)</div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {activeDrillDown === "projects" && (
                <div className="text-center space-y-1.5 p-6 sm:p-8 bg-slate-50/50 border rounded-2xl w-full">
                  <p className="text-[11px] sm:text-xs font-bold text-slate-700">Sprint Roadmap completions rate:</p>
                  <p className="text-lg sm:text-2xl font-black text-emerald-600">{completionRate}% Complete</p>
                  <p className="text-[9px] sm:text-[10px] text-slate-400">{taskStats.completed} tasks delivered out of {taskStats.total} planned scope</p>
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      <div className="flex items-center justify-center gap-1.5 text-[10px] sm:text-xs text-slate-400 font-semibold pt-2">
        <ShieldCheck size={13} /> SaaS Multi-Tenant Business Intelligence Processor Active
      </div>
    </div>
  );
}