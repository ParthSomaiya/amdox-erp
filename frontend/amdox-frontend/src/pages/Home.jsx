import { useNavigate, Link } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  Building2,
  CheckCircle2,
  Globe2,
  ShieldCheck,
  Users,
  Sparkles,
  TrendingUp,
  Zap,
  Check,
  ChevronDown,
  Activity,
  Database,
  Lock,
  Package,
  ShoppingCart,
  Loader2,
} from "lucide-react";
import Navbar from "../components/Navbar";
import axios from "axios"; // 🔹 ડાયરેક્ટ પબ્લિક કનેક્શન માટે

export default function Home() {
  const navigate = useNavigate();

  // Interactive Tab State (Module Spotlight)
  const [activeTab, setActiveTab] = useState("hr");

  // Interactive FAQ State
  const [openFaq, setOpenFaq] = useState(null);

  // Live Products State
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      // પબ્લિક યુઆરએલ દ્વારા ડેટા મેળવવો
      const res = await axios.get("http://localhost:5000/api/inventory/product");
      setProducts(res.data || []);
    } catch (err) {
      console.error("Failed to load products on landing page:", err);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Razorpay સ્ક્રિપ્ટ લોડ કરવાનું હેલ્પર
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Razorpay ટેસ્ટ પેમેન્ટ હેન્ડલર (ડાયરેક્ટ axios પોસ્ટ કોલ સાથે ગેસ્ટ સપોર્ટ)
  const handlePurchase = async (product) => {
    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    try {
      // ૧. બેકએન્ડ પર ઓર્ડર ક્રિએટ કરવો (ડાયરેક્ટ ક્રોસઓરિજિન બાયપાસ કોલ)
      const res = await axios.post("http://localhost:5000/api/payment/create-order", {
        productId: product._id,
        amount: product.price,
      });

      const { id: order_id, amount, currency } = res.data;

      // ૨. Razorpay પોપઅપ કન્ફિગરેશન
      const options = {
        key: "rzp_test_SvHkUG3LDOpePY", // 🔹 તમારો ટેસ્ટ કી આઈડી ઉમેરો
        amount: amount,
        currency: currency,
        name: "AMDOX ERP",
        description: `Order placement for ${product.name}`,
        order_id: order_id,
        handler: async function (response) {
          try {
            // ૩. બેકએન્ડ વેરિફિકેશન (ડાયરેક્ટ axios કોલ)
            const verifyRes = await axios.post("http://localhost:5000/api/payment/verify-order", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              productId: product._id,
            });

            if (verifyRes.data.success) {
              alert("🎉 Payment Completed Successfully! Stock and Purchase History updated.");
              fetchProducts(); // હોમપેજ કેટલોગ અપડેટ કરવા
            }
          } catch (verifyErr) {
            console.error(verifyErr);
            alert("Payment Verification Failed!");
          }
        },
        prefill: {
          name: "Guest Client",
          email: "guest@amdox.com",
          contact: "9999999999",
        },
        theme: {
          color: "#4f46e5",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Oops! Something went wrong. Payment failed");
    }
  };

  // Staggered Load Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 25, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 90, damping: 14 },
    },
  };

  const features = useMemo(
    () => [
      {
        icon: <Users size={22} className="text-indigo-600" />,
        title: "HR & Workforce",
        description:
          "Manage full employee life cycles, generate payrolls, record daily attendance, and approve leave requests.",
      },
      {
        icon: <Building2 size={22} className="text-indigo-600" />,
        title: "Finance Suite",
        description:
          "Comprehensive General Ledgers, bills, receivables, automated GST calculations, and bank reconciliation.",
      },
      {
        icon: <BarChart3 size={22} className="text-indigo-600" />,
        title: "Business Analytics",
        description:
          "Live business indicators, real-time KPI aggregates, custom metrics, and progress tracking.",
      },
      {
        icon: <BrainCircuit size={22} className="text-indigo-600" />,
        title: "AI Automation",
        description:
          "Gemini-powered recommendations, predictive operational forecasts, and instant workflow answers.",
      },
      {
        icon: <Globe2 size={22} className="text-indigo-600" />,
        title: "Global Operations",
        description:
          "Engineered for modern, secure multi-tenant structures with isolated tenant databases.",
      },
      {
        icon: <ShieldCheck size={22} className="text-indigo-600" />,
        title: "Enterprise Security",
        description:
          "Configure strict password criteria, two-factor auth (2FA) locks, and session timeouts.",
      },
    ],
    []
  );

  const mockPartners = ["Acron", "Stark Industries", "Segment Corp", "Vercel", "Retool", "Linear"];

  const faqs = [
    {
      q: "How does the multi-tenant architecture protect our data?",
      a: "AMDOX employs deep logical isolation at the database layer. Each tenant's records are keyed and separated using row-level security policies, ensuring your corporate data is completely unreachable by other instances.",
    },
    {
      q: "Can we integrate with external payment and banking APIs?",
      a: "Yes. The platform provides out-of-the-box configurations for Stripe payment intents, Razorpay integrations, and Plaid API endpoints to reconcile bank statements seamlessly.",
    },
    {
      q: "Is there support for automated tax and GST calculations?",
      a: "Absolutely. When generating invoices or payroll records, the systems dynamically apply customizable local, state, and central taxes (such as Slate/GST matrices) based on the business region.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-indigo-500/20 overflow-x-hidden">
      <Navbar />

      {/* ================= HERO SECTION ================= */}
      <section className="relative px-6 pt-20 pb-24 md:pt-28 md:pb-36">
        <div className="absolute top-0 right-0 w-[550px] h-[550px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-[5%] w-[450px] h-[450px] rounded-full bg-cyan-500/5 blur-[100px] pointer-events-none" />

        <div className="mx-auto max-w-7xl grid lg:grid-cols-12 gap-16 items-center">
          <motion.div
            className="lg:col-span-7 space-y-8"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 rounded-full border border-indigo-200/80 bg-indigo-50/50 px-4 py-1.5 text-xs font-semibold text-indigo-700">
              <Zap size={14} className="animate-pulse" />
              SaaS Multi-Tenant ERP Workspace
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] text-slate-900">
              Intelligent ERP
              <br />
              <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Designed for Growth
              </span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-lg text-slate-500 leading-relaxed max-w-xl">
              Unify HR modules, financial ledgers, sprint project tracking, and live warehouses into one beautifully aligned software ecosystem.
            </motion.p>

            <div className="flex flex-wrap gap-4">
              <button onClick={() => navigate("/login")} className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-4 text-base font-bold shadow-lg shadow-indigo-600/10 hover:scale-[1.03] active:scale-95 transition-all duration-200">
                Access Workspace
                <ArrowRight size={18} />
              </button>
              <button onClick={() => navigate("/register")} className="rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 px-6 py-4 text-base font-semibold transition-all active:scale-95">
                Create Account
              </button>
            </div>
          </motion.div>

          {/* Hero Right Card */}
          <motion.div
            className="lg:col-span-5 relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 70 }}
          >
            <div className="bg-white rounded-[32px] border border-slate-200/80 p-8 shadow-xl hover:shadow-2xl transition-all duration-300">
              <div className="flex justify-between items-center mb-8 pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Business Health</h3>
                  <p className="text-xs text-slate-400 font-medium">Real-time parameters</p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <TrendingUp size={18} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Revenue</span>
                  <p className="text-2xl font-black text-slate-800 mt-2">₹85.4L</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Employees</span>
                  <p className="text-2xl font-black text-slate-800 mt-2">120</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Live Efficiency</span>
                  <p className="text-2xl font-black text-slate-800 mt-2">96.8%</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Tasks</span>
                  <p className="text-2xl font-black text-slate-800 mt-2">48</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= SECTION 1: MINIMALIST LOGO CLOUD ================= */}
      <section className="py-10 bg-white border-y border-slate-200/60 text-center">
        <p className="text-xs uppercase tracking-widest text-slate-400 font-black mb-6">
          Powering modern enterprises globally
        </p>
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center items-center gap-10 md:gap-16 opacity-50">
          {mockPartners.map((partner, index) => (
            <span key={index} className="text-slate-500 font-extrabold tracking-tight text-lg">
              {partner}
            </span>
          ))}
        </div>
      </section>

      {/* ================= 🔹 NEW LIVE PRODUCTS SECTION (PRODUCTION GRADE) ================= */}
      <section className="px-6 py-24 bg-slate-50 border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs uppercase tracking-widest text-indigo-600 font-bold flex items-center justify-center gap-1">
              <Sparkles size={14} /> Global Shop
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Enterprise Tools & Products</h2>
            <p className="text-slate-500 text-sm">Purchase modern systems seamlessly with secure Razorpay test gates.</p>
          </div>

          {loadingProducts ? (
            <div className="py-20 text-center">
              <Loader2 className="animate-spin h-10 w-10 text-indigo-600 mx-auto" />
              <p className="mt-4 text-slate-500 font-semibold text-sm">Synchronizing live catalog...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product) => {
                const currentPath = product.image || product.imageUrl;
                const cleanPath = currentPath ? currentPath.replace(/^\//, "") : "";
                const imgUrl = currentPath
                  ? (currentPath.startsWith("http")
                      ? currentPath
                      : (cleanPath.startsWith("uploads/")
                          ? `http://localhost:5000/${cleanPath}`
                          : `http://localhost:5000/uploads/${cleanPath}`))
                  : "";

                return (
                  <div key={product._id} className="bg-white rounded-3xl border border-slate-200/80 p-6 flex flex-col justify-between hover:shadow-xl transition-all duration-300">
                    <div>
                      {imgUrl ? (
                        <img src={imgUrl} alt={product.name} crossOrigin="anonymous" className="h-48 w-full rounded-2xl object-cover border bg-white" />
                      ) : (
                        <div className="h-48 w-full rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 border"><Package size={48} /></div>
                      )}

                      <div className="mt-6 space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-extrabold text-slate-800 text-lg">{product.name}</h4>
                          <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${product.quantity > 0 ? "bg-green-50 text-green-700 border-green-100" : "bg-red-50 text-red-700 border-red-100"}`}>
                            {product.quantity > 0 ? "In Stock" : "Out of Stock"}
                          </span>
                        </div>
                        <p className="text-slate-500 text-xs">Stock Remaining: {product.quantity || 0} units</p>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center justify-between">
                      <span className="text-xl font-black text-slate-900">₹{product.price?.toLocaleString()}</span>
                      <button
                        onClick={() => handlePurchase(product)}
                        disabled={product.quantity < 1}
                        className="h-11 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white disabled:text-slate-400 font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
                      >
                        <ShoppingCart size={14} /> Buy Now
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ================= SECTION 2: INTERACTIVE MODULE SPOTLIGHT (TABS) ================= */}
      <section className="px-6 py-24 bg-slate-50 border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              One Workspace, Multi-Module Sync
            </h2>
            <p className="text-slate-500 text-sm">
              Toggle the modules below to see how our micro-systems sync with each other live.
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Tabs */}
            <div className="lg:col-span-4 space-y-4">
              <button
                onClick={() => setActiveTab("hr")}
                className={`w-full p-6 rounded-2xl text-left border transition-all flex items-start gap-4 ${
                  activeTab === "hr"
                    ? "bg-white border-indigo-200 shadow-md ring-2 ring-indigo-50"
                    : "bg-transparent border-transparent hover:bg-slate-100"
                }`}
              >
                <div className={`p-2.5 rounded-lg ${activeTab === "hr" ? "bg-indigo-50 text-indigo-600" : "bg-slate-200 text-slate-500"}`}>
                  <Users size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Onboard & Approve</h4>
                  <p className="text-xs text-slate-400 mt-1">Accept leave applications and compute attendance rates instantly.</p>
                </div>
              </button>

              <button
                onClick={() => setActiveTab("finance")}
                className={`w-full p-6 rounded-2xl text-left border transition-all flex items-start gap-4 ${
                  activeTab === "finance"
                    ? "bg-white border-indigo-200 shadow-md ring-2 ring-indigo-50"
                    : "bg-transparent border-transparent hover:bg-slate-100"
                }`}
              >
                <div className={`p-2.5 rounded-lg ${activeTab === "finance" ? "bg-indigo-50 text-indigo-600" : "bg-slate-200 text-slate-500"}`}>
                  <Building2 size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Ledgers & Tax Compliance</h4>
                  <p className="text-xs text-slate-400 mt-1">Review accounts receivable, compute GST, and verify vendor bills.</p>
                </div>
              </button>

              <button
                onClick={() => setActiveTab("projects")}
                className={`w-full p-6 rounded-2xl text-left border transition-all flex items-start gap-4 ${
                  activeTab === "projects"
                    ? "bg-white border-indigo-200 shadow-md ring-2 ring-indigo-50"
                    : "bg-transparent border-transparent hover:bg-slate-100"
                }`}
              >
                <div className={`p-2.5 rounded-lg ${activeTab === "projects" ? "bg-indigo-50 text-indigo-600" : "bg-slate-200 text-slate-500"}`}>
                  <BarChart3 size={20} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Taskboards & Burn Rates</h4>
                  <p className="text-xs text-slate-400 mt-1">Create agile tasks, schedule projects, and check developer sprint burnouts.</p>
                </div>
              </button>
            </div>

            {/* Right tab output panel */}
            <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-8 shadow-md min-h-[350px] flex flex-col justify-between">
              <AnimatePresence mode="wait">
                {activeTab === "hr" && (
                  <motion.div
                    key="hr"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold">HR Workspace</span>
                      <h3 className="text-xl font-bold text-slate-800">Automate Onboarding</h3>
                    </div>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      Whenever a new employee joins the organization, credentials are automatically created, invitations are generated, and background databases initialize safe workspace rows.
                    </p>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs font-semibold text-slate-600 flex justify-between items-center">
                      <span>✓ Auto-triggered OTP verification emails sent</span>
                      <span className="text-indigo-600">Active</span>
                    </div>
                  </motion.div>
                )}

                {activeTab === "finance" && (
                  <motion.div
                    key="finance"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold">Finance Module</span>
                      <h3 className="text-xl font-bold text-slate-800">GST Compliance Invoicing</h3>
                    </div>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      Every generated invoice automatically computes localized state and central tax rates, saving accounting overhead. Integration with Plaid and Stripe processes payouts instantly.
                    </p>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs font-semibold text-slate-600 flex justify-between items-center">
                      <span>✓ Invoices automatically recorded in General Ledgers</span>
                      <span className="text-emerald-600">Active</span>
                    </div>
                  </motion.div>
                )}

                {activeTab === "projects" && (
                  <motion.div
                    key="projects"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-sky-50 text-sky-600 rounded-lg text-xs font-bold">Agile Project Suite</span>
                      <h3 className="text-xl font-bold text-slate-800">Kanban Board & Sprint Scopes</h3>
                    </div>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      Sync developer activities and milestones directly. Interactive drag-and-drop actions automatically update burndown charts and allocate corporate timesheets.
                    </p>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs font-semibold text-slate-600 flex justify-between items-center">
                      <span>✓ Agile task progress synchronized with Gantt charts</span>
                      <span className="text-sky-600">Active</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CORE FEATURES MODULES SECTION ================= */}
      <section className="px-6 py-24 bg-white">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-20 space-y-3">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Everything Your Business Needs
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-base">
              A comprehensive system of modules built for enterprise efficiency.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                className="p-8 rounded-3xl border border-slate-200/70 bg-slate-50/50 hover:bg-white hover:border-indigo-100 transition-all duration-300 hover:shadow-lg flex flex-col justify-between"
                whileHover={{ y: -6 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                <div>
                  <div className="h-12 w-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-6 shadow-sm">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{feature.title}</h3>
                  <p className="text-slate-500 text-sm mt-3 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SECTION 3: SYSTEM METRICS HIGHLIGHT ================= */}
      <section className="px-6 py-20 bg-slate-50 border-y border-slate-200/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-2 p-6 bg-white border border-slate-200/60 rounded-3xl shadow-sm">
              <div className="h-10 w-10 mx-auto rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg">
                <Activity size={18} />
              </div>
              <h3 className="text-3xl font-black text-slate-900 mt-2">99.99%</h3>
              <p className="text-sm font-semibold text-slate-500">Service SLA Uptime</p>
            </div>

            <div className="text-center space-y-2 p-6 bg-white border border-slate-200/60 rounded-3xl shadow-sm">
              <div className="h-10 w-10 mx-auto rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg">
                <Database size={18} />
              </div>
              <h3 className="text-3xl font-black text-slate-900 mt-2">₹45B+</h3>
              <p className="text-sm font-semibold text-slate-500">Workspace Invoices Handled</p>
            </div>

            <div className="text-center space-y-2 p-6 bg-white border border-slate-200/60 rounded-3xl shadow-sm">
              <div className="h-10 w-10 mx-auto rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg">
                <Lock size={18} />
              </div>
              <h3 className="text-3xl font-black text-slate-900 mt-2">MFA / 2FA</h3>
              <p className="text-sm font-semibold text-slate-500">Enterprise Access Security</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 4: TESTIMONIALS SECTION ================= */}
      <section className="px-6 py-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">What business leaders say</h2>
            <p className="text-slate-400 text-sm">Read reviews from executives managing operations through AMDOX.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-8 rounded-3xl bg-slate-50/50 border border-slate-200/80 space-y-4">
              <p className="text-slate-600 text-sm italic leading-relaxed">
                "Consolidating our local office HR processes, payroll spreadsheets, and engineering task board sprints into a single integrated platform has significantly optimized our administrative workflows."
              </p>
              <div className="flex items-center gap-3 pt-4 border-t">
                <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                  VK
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Vikram Kothari</h4>
                  <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">COO, Stark Corp</p>
                </div>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50/50 border border-slate-200/80 space-y-4">
              <p className="text-slate-600 text-sm italic leading-relaxed">
                "Having automatic GST calculation matrices directly within accounts receivable ledgers eliminated external calculations. The live dashboard keeps our executives updated on budget utilization."
              </p>
              <div className="flex items-center gap-3 pt-4 border-t">
                <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                  AP
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Ananya Patel</h4>
                  <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">Director of Finance, Segment Corp</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 5: PLANS & PRICING PREVIEW ================= */}
      <section className="px-6 py-24 bg-slate-50 border-t border-slate-200/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Flexible, Transparent Pricing</h2>
            <p className="text-slate-400 text-sm">Choose the tier that matches your company scale.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Startup Plan */}
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Growth Plan</h3>
                <p className="text-slate-400 text-xs mt-1">For growing teams</p>
              </div>
              <div className="flex items-baseline gap-1.5 text-slate-800">
                <span className="text-4xl font-black">₹4,999</span>
                <span className="text-slate-400 text-sm font-medium">/ month</span>
              </div>
              <ul className="space-y-3 text-slate-600 text-sm">
                <li className="flex items-center gap-2"><Check size={16} className="text-emerald-500" /> Complete HR Module</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-emerald-500" /> Basic Finance Ledger</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-emerald-500" /> Task Management board</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-emerald-500" /> Up to 50 active employee rows</li>
              </ul>
              <button
                onClick={() => navigate("/register")}
                className="w-full h-11 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold transition"
              >
                Choose Growth
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white rounded-3xl border-2 border-indigo-500 p-8 shadow-md space-y-6 relative">
              <div className="absolute top-4 right-4 bg-indigo-50 text-indigo-600 text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full">
                Popular
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Enterprise Plan</h3>
                <p className="text-slate-400 text-xs mt-1">For full operational scale</p>
              </div>
              <div className="flex items-baseline gap-1.5 text-slate-800">
                <span className="text-4xl font-black">₹14,999</span>
                <span className="text-slate-400 text-sm font-medium">/ month</span>
              </div>
              <ul className="space-y-3 text-slate-600 text-sm">
                <li className="flex items-center gap-2"><Check size={16} className="text-emerald-500" /> Every single Growth module</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-emerald-500" /> Advanced AI forecasting panel</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-emerald-500" /> Complete multi-tenant API control</li>
                <li className="flex items-center gap-2"><Check size={16} className="text-emerald-500" /> Unlimited active employee rows</li>
              </ul>
              <button
                onClick={() => navigate("/register")}
                className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold transition"
              >
                Choose Enterprise
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 6: FAQ ACCORDION ================= */}
      <section className="px-6 py-24 bg-white border-t border-slate-200/50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Frequently Asked Questions</h2>
            <p className="text-slate-400 text-sm">Common questions regarding data structures and platforms.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={index} className="border border-slate-200/80 rounded-2xl overflow-hidden transition bg-slate-50/30">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-5 flex items-center justify-between font-bold text-left text-slate-800 hover:bg-slate-50 transition"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown size={18} className={`text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="p-5 border-t border-slate-200 text-sm leading-relaxed text-slate-500 bg-white">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= CALL-TO-ACTION (CTA) ================= */}
      <section className="px-6 pb-24 bg-white">
        <div className="mx-auto max-w-5xl rounded-[32px] bg-gradient-to-r from-indigo-900 to-slate-900 p-10 md:p-14 text-center text-white shadow-xl relative overflow-hidden border border-indigo-950">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Ready to automate your operations?
            </h2>
            <p className="text-slate-300 max-w-2xl mx-auto text-base">
              Configure your multi-tenant employee workspace and activate AI-powered resource forecasting instantly.
            </p>
            <div className="pt-4 flex justify-center gap-4">
              <button
                onClick={() => navigate("/register")}
                className="h-12 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition shadow-md shadow-indigo-600/10 hover:scale-[1.02]"
              >
                Get Started Free
              </button>
              <button
                onClick={() => navigate("/login")}
                className="h-12 px-6 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold transition border border-white/10"
              >
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 px-6 py-10 text-center text-slate-400 text-xs font-semibold">
        © 2026 AMDOX ERP — High-Performance SaaS Architecture
      </footer>
    </div>
  );
}