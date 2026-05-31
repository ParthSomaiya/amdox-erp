import { useEffect, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { Loader2, ShieldCheck, Building2, Users, Radio, RefreshCw, Cpu, Server, Activity, Plus, X, Check, Globe, HardDrive, Trash2, Edit3, ShieldAlert } from "lucide-react";
import API from "../../services/api";

export default function TenantManagement() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showProvisionModal, setShowProvisionModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // ટેનન્ટ લિસ્ટ અને એનાલિટિક્સ સ્ટેટ્સ
  const [tenantNodes, setTenantNodes] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalTenants: 0,
    totalUsers: 0,
    activeUsers: 8,
  });

  // ફોર્મ સ્ટેટ્સ
  const [form, setForm] = useState({
    name: "",
    domain: "",
    dbTarget: "PostgreSQL-Replica-01",
    licenses: 50,
    mfaEnforced: true
  });

  const [selectedNode, setSelectedNode] = useState(null);
  const [confirmDomainInput, setConfirmDomainInput] = useState("");

  useEffect(() => {
    fetchTenantRegistry();
  }, []);

  // 🔄 READ: બેકએન્ડ માંથી ટેનન્ટ્સ અને KPIs લાઈવ લોડ કરવાનું ફંક્શન
  const fetchTenantRegistry = async () => {
    try {
      setLoading(true);
      
      const [tenantsRes, analyticsRes] = await Promise.all([
        API.get("/admin/tenants"),
        API.get("/admin/tenant-analytics")
      ]);

      const fetchedNodes = tenantsRes.data || [];
      setTenantNodes(fetchedNodes);

      setAnalytics({
        totalTenants: fetchedNodes.length,
        totalUsers: fetchedNodes.reduce((sum, n) => sum + Number(n.licenses || 0), 0),
        activeUsers: analyticsRes.data?.activeUsers || 8
      });

    } catch (err) {
      console.warn("⚠️ NestJS API offline. Activating localized fallback registry.");
      loadFallbackLocalData();
    } finally {
      setLoading(false);
    }
  };

  // 📂 લોકલ સ્ટોરેજ ફોલબેક લોડર
  const loadFallbackLocalData = () => {
    const saved = localStorage.getItem("amdox_tenants_registry");
    let nodesList = [];
    if (saved) {
      nodesList = JSON.parse(saved);
    } else {
      // ડિફોલ્ટ મોક ડેટા
      nodesList = [
        { _id: "node-101", name: "AMDOX Global", domain: "amdox.com", dbName: "amdox_tenant_prod", status: "HEALTHY", cpuLoad: 12, ramUsed: "1.4 GB", licenses: 120, mfaEnforced: true, dbTarget: "PostgreSQL-Replica-01" },
        { _id: "node-102", name: "Enterprise Corp", domain: "enterprise.com", dbName: "enterprise_tenant_db", status: "HEALTHY", cpuLoad: 8, ramUsed: "840 MB", licenses: 50, mfaEnforced: false, dbTarget: "PostgreSQL-Replica-01" },
        { _id: "node-103", name: "Google Mirror", domain: "google.com", dbName: "google_workspace_mirror", status: "SYNCING", cpuLoad: 45, ramUsed: "2.8 GB", licenses: 250, mfaEnforced: true, dbTarget: "Multi-Region-Replica" }
      ];
      localStorage.setItem("amdox_tenants_registry", JSON.stringify(nodesList));
    }
    setTenantNodes(nodesList);
    setAnalytics({
      totalTenants: nodesList.length,
      totalUsers: nodesList.reduce((sum, n) => sum + Number(n.licenses), 0),
      activeUsers: 8
    });
  };

  // લોકલ સ્ટોરેજ સેવર હેલ્પર
  const saveToLocalCache = (updatedList) => {
    localStorage.setItem("amdox_tenants_registry", JSON.stringify(updatedList));
    setTenantNodes(updatedList);
    setAnalytics({
      totalTenants: updatedList.length,
      totalUsers: updatedList.reduce((sum, n) => sum + Number(n.licenses), 0),
      activeUsers: 8
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  // 🚀 ૧. CREATE: નવો SaaS ટેનન્ટ પ્રોવિઝન કરો (NestJS POST)
  const handleProvisionTenant = async (e) => {
    e.preventDefault();
    if (!form.name || !form.domain) return;

    const cleanDomain = form.domain.toLowerCase().trim();
    const payload = {
      name: form.name,
      domain: cleanDomain,
      licenses: Number(form.licenses),
      mfaEnforced: form.mfaEnforced,
      dbTarget: form.dbTarget
    };

    try {
      setSubmitting(true);
      
      const res = await API.post("/admin/tenants", payload);
      alert(`SaaS Tenant Node [${cleanDomain}] provisioned successfully!`);
      fetchTenantRegistry(); // ડેટા રિફ્રેશ કરો

    } catch (err) {
      console.warn("API Offline: Provisioning via LocalStorage.");
      
      const newLocalNode = {
        _id: `node-${Date.now()}`,
        name: form.name,
        domain: cleanDomain,
        dbName: `${form.name.toLowerCase().replace(/\s+/g, "_")}_db`,
        status: "HEALTHY",
        cpuLoad: Math.floor(Math.random() * 15) + 5,
        ramUsed: `${(Math.random() * 1.5 + 0.5).toFixed(1)} GB`,
        licenses: Number(form.licenses),
        mfaEnforced: form.mfaEnforced,
        dbTarget: form.dbTarget
      };

      const updated = [newLocalNode, ...tenantNodes];
      saveToLocalCache(updated);
      alert(`[Offline Mode] Tenant [${cleanDomain}] saved locally.`);
    } finally {
      setSubmitting(false);
      setShowProvisionModal(false);
      resetForm();
    }
  };

  // ૨. UPDATE: ટેનન્ટ કન્ફિગરેશન અપડેટ કરો (NestJS PUT)
  const handleOpenEdit = (node) => {
    setSelectedNode(node);
    setForm({
      name: node.name,
      domain: node.domain,
      dbTarget: node.dbTarget || "PostgreSQL-Replica-01",
      licenses: node.licenses,
      mfaEnforced: node.mfaEnforced
    });
    setShowEditModal(true);
  };

  const handleUpdateTenant = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      licenses: Number(form.licenses),
      mfaEnforced: form.mfaEnforced,
      dbTarget: form.dbTarget
    };

    try {
      setSubmitting(true);
      
      await API.put(`/admin/tenants/${selectedNode._id}`, payload);
      alert(`Tenant [${selectedNode.domain}] updated successfully!`);
      fetchTenantRegistry();

    } catch (err) {
      console.warn("API Offline: Updating via LocalStorage.");
      
      const updated = tenantNodes.map(n => n._id === selectedNode._id 
        ? { ...n, name: form.name, licenses: Number(form.licenses), mfaEnforced: form.mfaEnforced, dbTarget: form.dbTarget } 
        : n
      );
      saveToLocalCache(updated);
      alert(`[Offline Mode] Updated [${selectedNode.domain}] parameters.`);
    } finally {
      setSubmitting(false);
      setShowEditModal(false);
      resetForm();
    }
  };

  // ૩. DELETE: ટેનન્ટ કાયમી નિકાલ કરો (NestJS DELETE)
  const handleOpenDelete = (node) => {
    setSelectedNode(node);
    setConfirmDomainInput("");
    setShowDeleteModal(true);
  };

  const handleDecommissionTenant = async (e) => {
    e.preventDefault();
    if (confirmDomainInput.trim().toLowerCase() !== selectedNode.domain.toLowerCase()) {
      alert("Domain mismatch! Please type the exact domain name to confirm.");
      return;
    }

    try {
      setSubmitting(true);
      
      await API.delete(`/admin/tenants/${selectedNode._id}`);
      alert(`SaaS Node [${selectedNode.domain}] decommissioned successfully.`);
      fetchTenantRegistry();

    } catch (err) {
      console.warn("API Offline: Decommissioning via LocalStorage.");
      
      const updated = tenantNodes.filter(n => n._id !== selectedNode._id);
      saveToLocalCache(updated);
      alert(`[Offline Mode] Purged node [${selectedNode.domain}].`);
    } finally {
      setSubmitting(false);
      setShowDeleteModal(false);
      setSelectedNode(null);
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      domain: "",
      dbTarget: "PostgreSQL-Replica-01",
      licenses: 50,
      mfaEnforced: true
    });
    setSelectedNode(null);
  };

  return (
    <div className="space-y-8 font-sans max-w-7xl mx-auto">
      {/* Top Header Panel */}
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-[32px] text-white relative overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="space-y-2 relative z-10">
          <span className="text-xs uppercase tracking-widest text-indigo-400 font-bold block">Cloud Cluster Orchestrator</span>
          <h1 className="text-3xl font-black mt-1 flex items-center gap-2">
            <Server className="text-indigo-400" /> Tenant Control Center
          </h1>
          <p className="text-slate-400 text-sm max-w-xl">Monitor isolated multi-tenant databases, provisioned user licenses, and live CPU node capacities.</p>
        </div>

        <button
          onClick={() => { resetForm(); setShowProvisionModal(true); }}
          className="h-12 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition shadow-lg shrink-0 z-10"
        >
          <Plus size={16} /> Provision New Tenant
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Total Active Tenants</span>
            <h2 className="text-3xl font-black text-slate-850 mt-2">{analytics.totalTenants} Nodes</h2>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Building2 size={22} />
          </div>
        </div>

        <div className="bg-white border rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Provisioned Users</span>
            <h2 className="text-3xl font-black text-slate-850 mt-2">{analytics.totalUsers} Licenses</h2>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center">
            <Users size={22} />
          </div>
        </div>

        <div className="bg-white border rounded-3xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Active Sessions</span>
            <h2 className="text-3xl font-black text-emerald-600 mt-2">{analytics.activeUsers} Live</h2>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Radio size={22} className="animate-pulse" />
          </div>
        </div>
      </div>

      {/* Active Database Nodes List */}
      <div className="bg-white rounded-[32px] border p-6 shadow-sm space-y-6">
        <div className="flex justify-between items-center pb-4 border-b">
          <div>
            <h3 className="font-extrabold text-slate-800 text-base">Database Node Clusters</h3>
            <p className="text-xs text-slate-400 mt-0.5">Real-time isolation status of tenant databases</p>
          </div>
          <button
            onClick={fetchTenantRegistry}
            className="h-10 w-10 bg-slate-50 hover:bg-slate-100 border text-slate-600 rounded-xl flex items-center justify-center transition"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        {loading ? (
          <div className="p-20 text-center"><Loader2 className="animate-spin h-8 w-8 text-indigo-600 mx-auto" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tenantNodes.map((node) => (
              <div key={node._id} className="p-5 border rounded-2xl bg-slate-50/50 space-y-4 hover:border-indigo-200 transition relative group">
                
                {/* Float Actions Panel on Hover */}
                <div className="absolute top-4 right-4 hidden group-hover:flex items-center gap-1.5 bg-white border shadow-md rounded-lg p-1 animate-fade-in">
                  <button
                    onClick={() => handleOpenEdit(node)}
                    className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded"
                    title="Edit Configuration"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => handleOpenDelete(node)}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded"
                    title="Decommission Tenant"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-extrabold text-slate-800 text-sm">{node.name}</h4>
                    <span className="text-[10px] text-slate-400 font-bold block mt-1">Domain: {node.domain}</span>
                  </div>
                  
                  <span className={`px-2.5 py-0.5 rounded text-[9px] font-black uppercase ${
                    node.status === "HEALTHY" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-amber-50 text-amber-700 border border-amber-100"
                  }`}>
                    {node.status}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-3 border-t text-[9px] text-slate-400 font-bold uppercase">
                  <div>
                    <span>CPU Load</span>
                    <span className="text-slate-700 text-xs font-black block mt-1 flex items-center gap-1">
                      <Cpu size={12} /> {node.cpuLoad}%
                    </span>
                  </div>
                  <div>
                    <span>Memory</span>
                    <span className="text-slate-700 text-xs font-black block mt-1 flex items-center gap-1">
                      <Activity size={12} /> {node.ramUsed}
                    </span>
                  </div>
                  <div>
                    <span>Licenses</span>
                    <span className="text-slate-700 text-xs font-black block mt-1 flex items-center gap-1">
                      <Users size={12} /> {node.licenses}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🚀 PROVISION NEW SAAS TENANT MODAL */}
      {showProvisionModal && createPortal(
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-6 animate-fade-in">
            <div className="flex justify-between items-center pb-3 border-b">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Plus size={20} className="text-indigo-600" /> Provision SaaS Tenant Node
              </h2>
              <button onClick={() => setShowProvisionModal(false)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
            </div>

            <form onSubmit={handleProvisionTenant} className="space-y-4 text-xs font-semibold text-slate-700">
              <div>
                <label className="block mb-1.5 uppercase tracking-wider">Tenant Corporation Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleInputChange}
                  placeholder="e.g. Acme Industries"
                  className="w-full h-11 border rounded-xl px-4 text-sm bg-slate-50/50 outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block mb-1.5 uppercase tracking-wider">Primary Auth Domain</label>
                <div className="relative">
                  <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    name="domain"
                    required
                    value={form.domain}
                    onChange={handleInputChange}
                    placeholder="e.g. acme.com"
                    className="w-full h-11 border rounded-xl pl-10 pr-4 text-sm bg-slate-50/50 outline-none focus:border-indigo-500 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1.5 uppercase tracking-wider">Target Database Host Replica</label>
                <select
                  name="dbTarget"
                  value={form.dbTarget}
                  onChange={handleInputChange}
                  className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50/50 px-3 outline-none focus:border-indigo-500 text-xs cursor-pointer font-bold text-slate-700"
                >
                  <option value="PostgreSQL-Replica-01">PostgreSQL Isolated Replica-01</option>
                  <option value="TimescaleDB-Telemetry">TimescaleDB Telemetry Cluster-A</option>
                  <option value="Multi-Region-Replica">Multi-Region Hot Standby</option>
                </select>
              </div>

              <div>
                <label className="block mb-1.5 uppercase tracking-wider">User License Allocation Limit</label>
                <input
                  type="number"
                  name="licenses"
                  min="5"
                  max="10000"
                  required
                  value={form.licenses}
                  onChange={handleInputChange}
                  className="w-full h-11 border rounded-xl px-4 text-sm bg-slate-50/50 outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border">
                <div>
                  <span className="text-xs font-bold text-slate-700">Enforce Per-Tenant MFA</span>
                  <p className="text-[9px] text-slate-400 font-semibold mt-0.5">Enforce SMS/Email OTP at workspace login</p>
                </div>
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, mfaEnforced: !prev.mfaEnforced }))}
                  className={`relative h-6 w-11 rounded-full transition-colors ${form.mfaEnforced ? "bg-emerald-500" : "bg-slate-300"}`}
                >
                  <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${form.mfaEnforced ? "left-5.5" : "left-0.5"}`} />
                </button>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowProvisionModal(false)}
                  className="flex-1 h-11 border rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2"
                >
                  {submitting ? <Loader2 className="animate-spin h-4 w-4" /> : <HardDrive size={16} />}
                  Provision Cluster Node
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* 🚀 EDIT/UPDATE TENANT CONFIGURATION MODAL */}
      {showEditModal && createPortal(
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-6 animate-fade-in">
            <div className="flex justify-between items-center pb-3 border-b">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Edit3 size={20} className="text-indigo-600" /> Edit Node Configuration
              </h2>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600"><X size={18} /></button>
            </div>

            <form onSubmit={handleUpdateTenant} className="space-y-4 text-xs font-semibold text-slate-700">
              <div>
                <label className="block mb-1.5 uppercase tracking-wider">Tenant Corporation Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleInputChange}
                  className="w-full h-11 border rounded-xl px-4 text-sm bg-slate-50/50 outline-none focus:border-indigo-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block mb-1.5 uppercase tracking-wider">Domain Router (Immutable)</label>
                <input
                  type="text"
                  disabled
                  value={form.domain}
                  className="w-full h-11 border rounded-xl px-4 text-sm bg-slate-100 text-slate-400 outline-none cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block mb-1.5 uppercase tracking-wider">Target Database Host Replica</label>
                <select
                  name="dbTarget"
                  value={form.dbTarget}
                  onChange={handleInputChange}
                  className="w-full h-11 rounded-xl border border-slate-200 bg-slate-50/50 px-3 outline-none focus:border-indigo-500 text-xs cursor-pointer font-bold text-slate-700"
                >
                  <option value="PostgreSQL-Replica-01">PostgreSQL Isolated Replica-01</option>
                  <option value="TimescaleDB-Telemetry">TimescaleDB Telemetry Cluster-A</option>
                  <option value="Multi-Region-Replica">Multi-Region Hot Standby</option>
                </select>
              </div>

              <div>
                <label className="block mb-1.5 uppercase tracking-wider">Adjust License Limit</label>
                <input
                  type="number"
                  name="licenses"
                  min="5"
                  max="10000"
                  required
                  value={form.licenses}
                  onChange={handleInputChange}
                  className="w-full h-11 border rounded-xl px-4 text-sm bg-slate-50/50 outline-none"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border">
                <div>
                  <span className="text-xs font-bold text-slate-700">Enforce Per-Tenant MFA</span>
                  <p className="text-[9px] text-slate-400 font-semibold mt-0.5">Enforce SMS/Email OTP at workspace login</p>
                </div>
                <button
                  type="button"
                  onClick={() => setForm(prev => ({ ...prev, mfaEnforced: !prev.mfaEnforced }))}
                  className={`relative h-6 w-11 rounded-full transition-colors ${form.mfaEnforced ? "bg-emerald-500" : "bg-slate-300"}`}
                >
                  <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${form.mfaEnforced ? "left-5.5" : "left-0.5"}`} />
                </button>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 h-11 border rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2"
                >
                  {submitting ? <Loader2 className="animate-spin h-4 w-4" /> : <Check size={16} />}
                  Apply Configurations
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* 🚀 SECURE DECOMMISSION MODAL (GitHub-style confirmation) */}
      {showDeleteModal && createPortal(
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-6 animate-fade-in">
            <div className="flex justify-between items-center pb-3 border-b">
              <h2 className="text-lg font-bold text-rose-600 flex items-center gap-2">
                <ShieldAlert size={20} /> Decommission Tenant Node
              </h2>
              <button onClick={() => setShowDeleteModal(false)} className="text-slate-400"><X size={18} /></button>
            </div>

            <form onSubmit={handleDecommissionTenant} className="space-y-4 text-xs font-semibold text-slate-700">
              <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-xs text-rose-700 leading-relaxed space-y-2">
                <p className="font-bold">⚠️ CRITICAL COMPLIANCE WARNING:</p>
                <p>Decommissioning the tenant <strong>{selectedNode?.domain}</strong> will permanently drop its isolated database schema, metadata logs, and invalidate all associated user licenses.</p>
              </div>

              <div>
                <p className="text-slate-500 mb-2 leading-relaxed">To confirm, type <strong className="text-slate-800 select-none">{selectedNode?.domain}</strong> below:</p>
                <input
                  type="text"
                  required
                  value={confirmDomainInput}
                  onChange={(e) => setConfirmDomainInput(e.target.value)}
                  placeholder="Type domain name..."
                  className="w-full h-11 border border-slate-300 rounded-xl px-4 text-sm bg-slate-50/50 outline-none focus:border-rose-500 focus:bg-white text-center font-bold text-slate-800"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 h-11 border rounded-xl font-bold text-sm text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || confirmDomainInput.trim().toLowerCase() !== selectedNode?.domain.toLowerCase()}
                  className="flex-1 h-11 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? <Loader2 className="animate-spin h-4 w-4" /> : <Trash2 size={16} />}
                  Confirm Purge Node
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-semibold pt-4">
        <ShieldCheck size={14} /> Multi-Tenant Row-Level Security Strategy (RLS) Active
      </div>
    </div>
  );
}