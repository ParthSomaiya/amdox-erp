import { useNavigate } from "react-router-dom";
import { useMemo, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  BrainCircuit,
  Building2,
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
  AlertCircle,
  Calculator,
  X,
  Shield,
  MessageSquare,
  Server
} from "lucide-react";
import Navbar from "../components/Navbar";
import axios from "axios";

export default function Home() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("hr");
  const [openFaq, setOpenFaq] = useState(null);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [outOfStockProduct, setOutOfStockProduct] = useState(null);

  // ================= 🔮 3 CUSTOM PLUGINS SUITE STATE =================
  const [isSuiteOpen, setIsSuiteOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isSecurityOpen, setIsSecurityOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);

  // Plugin 1: ROI Calculator Parameters
  const [employeeCount, setEmployeeCount] = useState(25);
  const [hourlyRate, setHourlyRate] = useState(450); // Hourly Rate in INR

  // Plugin 2: Security Latency Simulation
  const [latency, setLatency] = useState(12);

  // Plugin 3: AI Chat Bot State
  const [chatMessages, setChatMessages] = useState([
    { sender: "ai", text: "Hello! I am your Amdox Workspace Co-Pilot. Click any prompt below to evaluate my architecture." }
  ]);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  // Latency Simulator
  useEffect(() => {
    const interval = setInterval(() => {
      setLatency(Math.floor(Math.random() * 8) + 8);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isAiTyping]);

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const res = await axios.get("http://localhost:5000/api/inventory/product");
      setProducts(res.data || []);
    } catch (err) {
      console.error("Failed to load products on landing page:", err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePurchase = async (product) => {
    if (!product.quantity || product.quantity < 1) {
      setOutOfStockProduct(product);
      return;
    }

    const isScriptLoaded = await loadRazorpayScript();
    if (!isScriptLoaded) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/payment/create-order", {
        productId: product._id,
        amount: product.price,
      });

      const { id: order_id, amount, currency } = res.data;

      const options = {
        key: "rzp_test_SvHkUG3LDOpePY",
        amount: amount,
        currency: currency,
        name: "AMDOX ERP",
        description: `Order placement for ${product.name}`,
        order_id: order_id,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post("http://localhost:5000/api/payment/verify-order", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              productId: product._id,
            });

            if (verifyRes.data.success) {
              alert("🎉 Payment Completed Successfully! Stock and Purchase History updated.");
              fetchProducts();
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

  // ROI calculation formula: Staff * Hours Saved (14) * Hourly Rate * 12 Months
  const calculatedSavings = useMemo(() => {
    return employeeCount * 14 * hourlyRate * 12; 
  }, [employeeCount, hourlyRate]);

  // AI Assistant simulated response generator
  const handleAiPromptClick = (id, promptText) => {
    if (isAiTyping) return;

    setChatMessages((prev) => [...prev, { sender: "user", text: promptText }]);
    setIsAiTyping(true);

    setTimeout(() => {
      let answerText = "";
      if (id === "tenant") {
        answerText = "Amdox utilizes Logical Database Isolation combined with dynamic Row-Level Security (RLS) keys to guarantee absolute data segregation at the persistence tier.";
      } else if (id === "invoice") {
        answerText = "Invoices compiled on our Ledger automatically calculate central and state localized taxes (such as dynamic GST matrices) based on the business region key.";
      } else {
        answerText = "Yes! Amdox supports SAML 2.0 and OpenID Connect to securely map user profiles dynamically from Okta, Azure AD, and Google Workspace SSO directories.";
      }

      setChatMessages((prev) => [...prev, { sender: "ai", text: answerText }]);
      setIsAiTyping(false);
    }, 1400);
  };

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
        icon: <Users size={20} className="text-indigo-600" />,
        title: "HR & Workforce",
        description:
          "Manage full employee life cycles, generate payrolls, record daily attendance, and approve leave requests.",
      },
      {
        icon: <Building2 size={20} className="text-indigo-600" />,
        title: "Finance Suite",
        description:
          "Comprehensive General Ledgers, bills, receivables, automated GST calculations, and bank reconciliation.",
      },
      {
        icon: <BarChart3 size={20} className="text-indigo-600" />,
        title: "Business Analytics",
        description:
          "Live business indicators, real-time KPI aggregates, custom metrics, and progress tracking.",
      },
      {
        icon: <BrainCircuit size={20} className="text-indigo-600" />,
        title: "AI Automation",
        description:
          "Gemini-powered recommendations, predictive operational forecasts, and instant workflow answers.",
      },
      {
        icon: <Globe2 size={20} className="text-indigo-600" />,
        title: "Global Operations",
        description:
          "Engineered for modern, secure multi-tenant structures with isolated tenant databases.",
      },
      {
        icon: <ShieldCheck size={20} className="text-indigo-600" />,
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
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-indigo-500/20 overflow-x-hidden w-full relative animate-none">
      <Navbar />

      {/* ================= HERO SECTION ================= */}
      <section className="relative px-3 sm:px-6 lg:px-8 pt-6 sm:pt-12 pb-12 sm:pb-20 md:pt-24 md:pb-32 overflow-hidden w-full max-w-[1440px] mx-auto">
        <div className="absolute top-0 right-0 w-[550px] h-[550px] rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-[5%] w-[450px] h-[450px] rounded-full bg-cyan-500/5 blur-[100px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 lg:gap-16 items-center w-full">
          <motion.div
            className="lg:col-span-7 space-y-5 sm:space-y-8 text-center lg:text-left flex flex-col items-center lg:items-start"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-1.5 rounded-full border border-indigo-200/80 bg-indigo-50/50 px-3.5 py-1 text-[10px] sm:text-xs font-semibold text-indigo-700">
              <Zap size={11} className="animate-pulse shrink-0" />
              SaaS Multi-Tenant ERP Workspace
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-2xl sm:text-4xl md:text-5xl lg:text-7xl font-black tracking-tight leading-[1.15] text-slate-900">
              Intelligent ERP
              <br />
              <span className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Designed for Growth
              </span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-[11px] sm:text-base text-slate-500 leading-relaxed max-w-xl">
              Unify HR modules, financial ledgers, sprint project tracking, and live warehouses into one beautifully aligned software ecosystem.
            </motion.p>

            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3 w-full sm:w-auto">
              <button onClick={() => navigate("/login")} className="w-full sm:w-auto flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-5 sm:px-6 py-3.5 text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/10 hover:scale-[1.02] active:scale-95 transition-all duration-200 cursor-pointer">
                Access Workspace
                <ArrowRight size={14} />
              </button>
              <button onClick={() => navigate("/register")} className="w-full sm:w-auto rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 px-5 sm:px-6 py-3.5 text-xs sm:text-sm font-semibold transition-all active:scale-95 cursor-pointer">
                Create Account
              </button>
            </div>
          </motion.div>

          {/* Hero Right Card */}
          <motion.div
            className="lg:col-span-5 relative w-full"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 70 }}
          >
            <div className="bg-white rounded-2xl sm:rounded-[32px] border border-slate-200/80 p-4 sm:p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 w-full box-border">
              <div className="flex justify-between items-center mb-4 sm:mb-6 pb-3 border-b border-slate-100 gap-3">
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base md:text-lg font-bold text-slate-800 truncate">Business Health</h3>
                  <p className="text-[9px] sm:text-xs text-slate-400 font-medium truncate">Real-time parameters</p>
                </div>
                <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <TrendingUp size={15} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5 sm:gap-4 text-[10px] sm:text-xs font-semibold">
                <div className="p-3 rounded-lg sm:rounded-2xl bg-slate-50 border border-slate-100 min-w-0">
                  <span className="text-[8px] sm:text-[9px] text-slate-400 font-bold uppercase tracking-wider block truncate">Total Revenue</span>
                  <p className="text-base sm:text-xl md:text-2xl font-black text-slate-800 mt-0.5 truncate">₹85.4L</p>
                </div>
                <div className="p-3 rounded-lg sm:rounded-2xl bg-slate-50 border border-slate-100 min-w-0">
                  <span className="text-[8px] sm:text-[9px] text-slate-400 font-bold uppercase tracking-wider block truncate">Employees</span>
                  <p className="text-base sm:text-xl md:text-2xl font-black text-slate-800 mt-0.5 truncate">120</p>
                </div>
                <div className="p-3 rounded-lg sm:rounded-2xl bg-slate-50 border border-slate-100 min-w-0">
                  <span className="text-[8px] sm:text-[9px] text-slate-400 font-bold uppercase tracking-wider block truncate">Live Efficiency</span>
                  <p className="text-base sm:text-xl md:text-2xl font-black text-slate-800 mt-0.5 truncate">96.8%</p>
                </div>
                <div className="p-3 rounded-lg sm:rounded-2xl bg-slate-50 border border-slate-100 min-w-0">
                  <span className="text-[8px] sm:text-[9px] text-slate-400 font-bold uppercase tracking-wider block truncate">Active Tasks</span>
                  <p className="text-base sm:text-xl md:text-2xl font-black text-slate-800 mt-0.5 truncate">48</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ================= Partner Cloud ================= */}
      <section className="py-6 sm:py-8 bg-white border-y border-slate-200/60 text-center w-full">
        <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-slate-400 font-black mb-3 px-3">
          Powering modern enterprises globally
        </p>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 items-center justify-items-center opacity-50">
          {mockPartners.map((partner, index) => (
            <span key={index} className="text-slate-500 font-black tracking-tight text-sm sm:text-base md:text-lg">
              {partner}
            </span>
          ))}
        </div>
      </section>

      {/* ================= LIVE PRODUCTS CATALOG SECTION ================= */}
      <section className="px-3 sm:px-6 py-12 sm:py-20 bg-slate-50 border-b border-slate-200/50 w-full">
        <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12 w-full">
          <div className="text-center max-w-2xl mx-auto space-y-1 sm:space-y-2">
            <span className="text-xs uppercase tracking-widest text-indigo-600 font-bold flex items-center justify-center gap-1">
              <Sparkles size={12} className="shrink-0" /> Global Shop
            </span>
            <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Enterprise Tools & Products</h2>
            <p className="text-slate-500 text-xs sm:text-sm">Purchase modern systems seamlessly with secure Razorpay test gates.</p>
          </div>

          {loadingProducts ? (
            <div className="py-16 text-center">
              <Loader2 className="animate-spin h-7 w-7 text-indigo-600 mx-auto" />
              <p className="mt-3 text-slate-500 font-semibold text-xs">Synchronizing live catalog...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8 w-full">
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

                const hasStock = product.quantity && product.quantity > 0;

                return (
                  <div key={product._id} className="bg-white rounded-2xl p-4 sm:p-6 flex flex-col justify-between hover:shadow-xl transition-all duration-300 w-full box-border">
                    <div className="min-w-0">
                      {imgUrl ? (
                        <img src={imgUrl} alt={product.name} crossOrigin="anonymous" className="h-40 sm:h-48 w-full rounded-xl object-cover border bg-white" />
                      ) : (
                        <div className="h-40 sm:h-48 w-full rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 border shrink-0"><Package size={36} /></div>
                      )}

                      <div className="mt-4 space-y-1">
                        <div className="flex items-center justify-between gap-3">
                          <h4 className="font-extrabold text-slate-800 text-xs sm:text-sm md:text-base truncate">{product.name}</h4>
                          <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-full border shrink-0 ${hasStock ? "bg-green-50 text-green-700 border-green-100" : "bg-red-50 text-red-700 border-red-100"}`}>
                            {hasStock ? "In Stock" : "Out of Stock"}
                          </span>
                        </div>
                        <p className="text-slate-400 text-[10px] sm:text-xs">Stock Remaining: {product.quantity || 0} units</p>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between gap-3">
                      <span className="text-base sm:text-lg md:text-xl font-black text-slate-900">₹{product.price?.toLocaleString()}</span>
                      <button
                        onClick={() => handlePurchase(product)}
                        className={`h-9 px-3.5 rounded-lg text-white font-bold text-[10px] sm:text-xs flex items-center gap-1 transition-all shadow-md cursor-pointer ${
                          hasStock ? "bg-indigo-600 hover:bg-indigo-700" : "bg-rose-500 hover:bg-rose-600"
                        }`}
                      >
                        <ShoppingCart size={12} /> {hasStock ? "Buy Now" : "Request Stock"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ================= INTERACTIVE TABS MODULE (HIGH MOBILE RESPONSIVE TABS) ================= */}
      <section className="px-3 sm:px-6 py-12 sm:py-20 bg-white border-b border-slate-200/50 w-full max-w-[1440px] mx-auto">
        <div className="w-full">
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12 space-y-1">
            <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              One Workspace, Multi-Module Sync
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm">
              Toggle the modules below to see how our micro-systems sync with each other live.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-start w-full">
            {/* Left Tabs */}
            <div className="lg:col-span-4 flex lg:flex-col gap-2 overflow-x-auto pb-3 lg:pb-0 scrollbar-none shrink-0 w-full">
              <button
                onClick={() => setActiveTab("hr")}
                className={`flex-1 lg:flex-initial p-3 sm:p-4 rounded-xl text-left border transition-all flex items-center lg:items-start gap-2.5 sm:gap-3.5 cursor-pointer shrink-0 min-w-[180px] lg:min-w-0 ${
                  activeTab === "hr"
                    ? "bg-indigo-50/50 border-indigo-200 shadow-sm ring-2 ring-indigo-50/20"
                    : "bg-transparent border-transparent hover:bg-slate-50"
                }`}
              >
                <div className={`p-1.5 sm:p-2 rounded-lg shrink-0 ${activeTab === "hr" ? "bg-indigo-50 text-indigo-600" : "bg-slate-200 text-slate-500"}`}>
                  <Users size={16} />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-slate-800 text-[11px] sm:text-xs md:text-sm truncate">Onboard & Approve</h4>
                  <p className="hidden lg:block text-[10px] text-slate-400 mt-0.5 leading-tight">Accept leave applications and compute attendance rates instantly.</p>
                </div>
              </button>

              <button
                onClick={() => setActiveTab("finance")}
                className={`flex-1 lg:flex-initial p-3 sm:p-4 rounded-xl text-left border transition-all flex items-center lg:items-start gap-2.5 sm:gap-3.5 cursor-pointer shrink-0 min-w-[180px] lg:min-w-0 ${
                  activeTab === "finance"
                    ? "bg-indigo-50/50 border-indigo-200 shadow-sm ring-2 ring-indigo-50/20"
                    : "bg-transparent border-transparent hover:bg-slate-50"
                }`}
              >
                <div className={`p-1.5 sm:p-2 rounded-lg shrink-0 ${activeTab === "finance" ? "bg-indigo-50 text-indigo-600" : "bg-slate-200 text-slate-500"}`}>
                  <Building2 size={16} />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-slate-800 text-[11px] sm:text-xs md:text-sm truncate">Ledgers & Tax Compliance</h4>
                  <p className="hidden lg:block text-[10px] text-slate-400 mt-0.5 leading-tight">Review accounts receivable, compute GST, and verify vendor bills.</p>
                </div>
              </button>

              <button
                onClick={() => setActiveTab("projects")}
                className={`flex-1 lg:flex-initial p-3 sm:p-4 rounded-xl text-left border transition-all flex items-center lg:items-start gap-2.5 sm:gap-3.5 cursor-pointer shrink-0 min-w-[180px] lg:min-w-0 ${
                  activeTab === "projects"
                    ? "bg-indigo-50/50 border-indigo-200 shadow-sm ring-2 ring-indigo-50/20"
                    : "bg-transparent border-transparent hover:bg-slate-50"
                }`}
              >
                <div className={`p-1.5 sm:p-2 rounded-lg shrink-0 ${activeTab === "projects" ? "bg-indigo-50 text-indigo-600" : "bg-slate-200 text-slate-500"}`}>
                  <BarChart3 size={16} />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-slate-800 text-[11px] sm:text-xs md:text-sm truncate">Taskboards & Burn Rates</h4>
                  <p className="hidden lg:block text-[10px] text-slate-400 mt-0.5 leading-tight">Create agile tasks, schedule projects, and check developer sprint burnouts.</p>
                </div>
              </button>
            </div>

            {/* Right tab output panel */}
            <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 md:p-8 shadow-md min-h-[180px] sm:min-h-[220px] flex flex-col justify-between w-full box-border">
              <AnimatePresence mode="wait">
                {activeTab === "hr" && (
                  <motion.div
                    key="hr"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-3"
                  >
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-600 rounded-lg text-[9px] sm:text-xs font-bold shrink-0">HR Workspace</span>
                      <h3 className="text-sm sm:text-lg md:text-xl font-bold text-slate-800">Automate Onboarding</h3>
                    </div>
                    <p className="text-slate-500 text-xs leading-relaxed sm:text-sm">
                      Whenever a new employee joins the organization, credentials are automatically created, invitations are generated, and background databases initialize safe workspace rows.
                    </p>
                    <div className="bg-slate-50 p-2.5 sm:p-4 rounded-xl border border-slate-100 text-[10px] sm:text-xs font-semibold text-slate-600 flex justify-between items-center gap-3">
                      <span>✓ Auto-triggered OTP verification emails sent</span>
                      <span className="text-indigo-600 shrink-0">Active</span>
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
                    className="space-y-3"
                  >
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] sm:text-xs font-bold shrink-0">Finance Module</span>
                      <h3 className="text-sm sm:text-lg md:text-xl font-bold text-slate-800">GST Compliance Invoicing</h3>
                    </div>
                    <p className="text-slate-500 text-xs leading-relaxed sm:text-sm">
                      Every generated invoice automatically computes localized state and central tax rates, saving accounting overhead. Integration with Plaid and Stripe processes payouts instantly.
                    </p>
                    <div className="bg-slate-50 p-2.5 sm:p-4 rounded-xl border border-slate-100 text-[10px] sm:text-xs font-semibold text-slate-600 flex justify-between items-center gap-3">
                      <span>✓ Invoices automatically recorded in General Ledgers</span>
                      <span className="text-emerald-600 shrink-0">Active</span>
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
                    className="space-y-3"
                  >
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-sky-50 text-sky-600 rounded-lg text-[9px] sm:text-xs font-bold shrink-0">Agile Project Suite</span>
                      <h3 className="text-sm sm:text-lg md:text-xl font-bold text-slate-800">Kanban Board & Sprint Scopes</h3>
                    </div>
                    <p className="text-slate-500 text-xs leading-relaxed sm:text-sm">
                      Sync developer activities and milestones directly. Interactive drag-and-drop actions automatically update burndown charts and allocate corporate timesheets.
                    </p>
                    <div className="bg-slate-50 p-2.5 sm:p-4 rounded-xl border border-slate-100 text-[10px] sm:text-xs font-semibold text-slate-600 flex justify-between items-center gap-3">
                      <span>✓ Agile task progress synchronized with Gantt charts</span>
                      <span className="text-sky-600 shrink-0">Active</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CORE FEATURES MODULES SECTION ================= */}
      <section className="px-4 sm:px-6 py-16 sm:py-24 bg-white w-full">
        <div className="mx-auto max-w-7xl w-full">
          <div className="text-center mb-12 sm:mb-20 space-y-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              Everything Your Business Needs
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto text-xs sm:text-sm">
              A comprehensive system of modules built for enterprise efficiency.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-full">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                className="p-5 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200/70 bg-slate-50/50 hover:bg-white hover:border-indigo-100 transition-all duration-300 hover:shadow-lg flex flex-col justify-between w-full box-border"
                whileHover={{ y: -4 }}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
              >
                <div className="min-w-0">
                  <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 sm:mb-6 shadow-sm shrink-0">
                    {feature.icon}
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">{feature.title}</h3>
                  <p className="text-slate-500 text-xs sm:text-sm mt-2 leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= SYSTEM METRICS HIGHLIGHT ================= */}
      <section className="px-4 sm:px-6 py-12 bg-slate-50 border-y border-slate-200/50 w-full">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 w-full">
            <div className="text-center space-y-1.5 p-4 bg-white border border-slate-200/60 rounded-xl shadow-sm">
              <div className="h-9 w-9 mx-auto rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Activity size={16} />
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">99.99%</h3>
              <p className="text-xs font-semibold text-slate-500">Service SLA Uptime</p>
            </div>

            <div className="text-center space-y-1.5 p-4 bg-white border border-slate-200/60 rounded-xl shadow-sm">
              <div className="h-9 w-9 mx-auto rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Database size={16} />
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">₹45B+</h3>
              <p className="text-xs font-semibold text-slate-500">Workspace Invoices Handled</p>
            </div>

            <div className="text-center space-y-1.5 p-4 bg-white border border-slate-200/60 rounded-xl shadow-sm">
              <div className="h-9 w-9 mx-auto rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Lock size={16} />
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">MFA / 2FA</h3>
              <p className="text-xs font-semibold text-slate-500">Enterprise Access Security</p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= TESTIMONIALS SECTION ================= */}
      <section className="px-4 sm:px-6 py-16 bg-white w-full">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16 space-y-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">What business leaders say</h2>
            <p className="text-slate-400 text-xs sm:text-sm">Read reviews from executives managing operations through AMDOX.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 w-full">
            <div className="p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-slate-50/50 border border-slate-200/80 space-y-3.5 min-w-0 box-border">
              <p className="text-slate-600 text-xs sm:text-sm italic leading-relaxed">
                "Consolidating our local office HR processes, payroll spreadsheets, and engineering task board sprints into a single integrated platform has significantly optimized our administrative workflows."
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                <div className="h-9 w-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                  VK
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-slate-800 text-xs sm:text-sm truncate">Vikram Kothari</h4>
                  <p className="text-slate-400 text-[9px] sm:text-[10px] uppercase font-bold tracking-wider truncate">COO, Stark Corp</p>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-slate-50/50 border border-slate-200/80 space-y-3.5 min-w-0 box-border">
              <p className="text-slate-600 text-xs sm:text-sm italic leading-relaxed">
                "Having automatic GST calculation matrices directly within accounts receivable ledgers eliminated external calculations. The live dashboard keeps our executives updated on budget utilization."
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                <div className="h-9 w-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs shrink-0">
                  AP
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-slate-800 text-xs sm:text-sm truncate">Ananya Patel</h4>
                  <p className="text-slate-400 text-[9px] sm:text-[10px] uppercase font-bold tracking-wider truncate">Director of Finance, Segment Corp</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= PLANS & PRICING PREVIEW ================= */}
      <section className="px-4 sm:px-6 py-16 bg-slate-50 border-t border-slate-200/50 w-full">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16 space-y-2">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Flexible, Transparent Pricing</h2>
            <p className="text-slate-400 text-xs sm:text-sm">Choose the tier that matches your company scale.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto w-full">
            {/* Growth Plan */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-8 shadow-sm space-y-4 w-full box-border">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-800">Growth Plan</h3>
                <p className="text-slate-400 text-[11px] sm:text-xs mt-1">For growing teams</p>
              </div>
              <div className="flex items-baseline gap-1.5 text-slate-800">
                <span className="text-3xl sm:text-4xl font-black">₹4,999</span>
                <span className="text-slate-400 text-xs sm:text-sm font-semibold">/ month</span>
              </div>
              <ul className="space-y-2.5 text-slate-600 text-xs sm:text-sm font-semibold">
                <li className="flex items-center gap-2"><Check size={14} className="text-emerald-500 shrink-0" /> Complete HR Module</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-emerald-500 shrink-0" /> Basic Finance Ledger</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-emerald-500 shrink-0" /> Task Management board</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-emerald-500 shrink-0" /> Up to 50 active employee rows</li>
              </ul>
              <button
                onClick={() => navigate("/register")}
                className="w-full h-10 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
              >
                Choose Growth
              </button>
            </div>

            {/* Enterprise Plan */}
            <div className="bg-white rounded-2xl border-2 border-indigo-500 p-5 sm:p-8 shadow-md space-y-4 relative w-full box-border">
              <div className="absolute top-4 right-4 bg-indigo-50 text-indigo-600 text-[9px] uppercase font-black tracking-wider px-2.5 py-0.5 rounded-full border border-indigo-100 shrink-0">
                Popular
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-800">Enterprise Plan</h3>
                <p className="text-slate-400 text-[11px] sm:text-xs mt-1">For full operational scale</p>
              </div>
              <div className="flex items-baseline gap-1.5 text-slate-800">
                <span className="text-3xl sm:text-4xl font-black">₹14,999</span>
                <span className="text-slate-400 text-xs sm:text-sm font-semibold">/ month</span>
              </div>
              <ul className="space-y-2.5 text-slate-600 text-xs sm:text-sm font-semibold">
                <li className="flex items-center gap-2"><Check size={14} className="text-emerald-500 shrink-0" /> Every single Growth module</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-emerald-500 shrink-0" /> Advanced AI forecasting panel</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-emerald-500 shrink-0" /> Complete multi-tenant API control</li>
                <li className="flex items-center gap-2"><Check size={14} className="text-emerald-500 shrink-0" /> Unlimited active employee rows</li>
              </ul>
              <button
                onClick={() => navigate("/register")}
                className="w-full h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition cursor-pointer"
              >
                Choose Enterprise
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FAQ ACCORDION ================= */}
      <section className="px-4 sm:px-6 py-16 bg-white border-t border-slate-200/50 w-full">
        <div className="max-w-4xl mx-auto w-full">
          <div className="text-center mb-10 sm:mb-16 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Frequently Asked Questions</h2>
            <p className="text-slate-400 text-xs sm:text-sm">Common questions regarding data structures and platforms.</p>
          </div>

          <div className="space-y-3.5 w-full">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={index} className="border border-slate-200 rounded-xl overflow-hidden transition bg-slate-50/30 w-full box-border">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between font-bold text-left text-slate-800 hover:bg-slate-50 transition text-xs sm:text-sm cursor-pointer gap-4"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown size={16} className={`text-slate-400 transition-transform shrink-0 ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden w-full"
                      >
                        <div className="p-4 sm:p-5 border-t border-slate-100 text-xs sm:text-sm leading-relaxed text-slate-500 bg-white">
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
      <section className="px-4 sm:px-6 pb-16 bg-white w-full">
        <div className="mx-auto max-w-5xl rounded-2xl sm:rounded-[32px] bg-gradient-to-r from-indigo-900 to-slate-900 p-6 sm:p-10 md:p-14 text-center text-white shadow-xl relative overflow-hidden border border-indigo-950 w-full box-border">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 space-y-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
              Ready to automate your operations?
            </h2>
            <p className="text-slate-300 max-w-2xl mx-auto text-xs sm:text-sm">
              Configure your multi-tenant employee workspace and activate AI-powered resource forecasting instantly.
            </p>
            <div className="pt-3 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 w-full">
              <button
                onClick={() => navigate("/register")}
                className="h-10 sm:h-12 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm transition shadow-md shadow-indigo-600/10 hover:scale-[1.02] cursor-pointer w-full sm:w-auto text-center"
              >
                Get Started Free
              </button>
              <button
                onClick={() => navigate("/login")}
                className="h-10 sm:h-12 px-6 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs sm:text-sm transition border border-white/10 cursor-pointer w-full sm:w-auto text-center"
              >
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50 px-4 sm:px-6 py-8 sm:py-10 text-center text-slate-400 text-[10px] sm:text-xs font-semibold w-full box-border">
        © 2026 AMDOX ERP — High-Performance SaaS Architecture
      </footer>

      {/* ================= 🚨 OUT OF STOCK MODAL POPUP ================= */}
      <AnimatePresence>
        {outOfStockProduct && (
          <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-100 shadow-2xl relative text-center space-y-4"
            >
              <button
                onClick={() => setOutOfStockProduct(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition"
              >
                <X size={18} />
              </button>

              <div className="h-14 w-14 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto shrink-0">
                <AlertCircle size={28} />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-lg font-black text-slate-800">Item Currently Unavailable</h3>
                <p className="text-slate-500 text-xs sm:text-sm">
                  We apologize, but <span className="font-bold text-slate-700">"{outOfStockProduct.name}"</span> is currently out of stock. We have notified the warehouse administrator.
                </p>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  onClick={() => setOutOfStockProduct(null)}
                  className="flex-1 h-11 border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-600 font-bold text-xs sm:text-sm transition cursor-pointer"
                >
                  Go Back
                </button>
                <button
                  onClick={() => {
                    alert(`Request logged for ${outOfStockProduct.name}! We will update you via email.`);
                    setOutOfStockProduct(null);
                  }}
                  className="flex-1 h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs sm:text-sm shadow-md transition cursor-pointer"
                >
                  Notify Me
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= 🔮 WORLD-CLASS ROI CALCULATOR PLUG-IN ================= */}
      <div className="fixed bottom-6 right-6 z-[90] flex flex-col items-end">
        <AnimatePresence>
          {isCalculatorOpen && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.9 }}
              className="bg-slate-900 text-white rounded-3xl p-6 shadow-2xl border border-slate-800 w-[calc(100vw-32px)] sm:w-[360px] max-w-full mb-4 space-y-4"
            >
              <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Calculator size={18} className="text-indigo-400" />
                  <span className="font-extrabold text-sm tracking-tight text-indigo-100">Live ROI Simulator</span>
                </div>
                <button
                  onClick={() => setIsCalculatorOpen(false)}
                  className="text-slate-400 hover:text-white transition cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-indigo-300 tracking-wider">Number of Employees</label>
                <div className="flex items-center justify-between text-white">
                  <span className="text-xs font-semibold font-sans">5 units</span>
                  <span className="text-base sm:text-lg font-black text-indigo-400">{employeeCount} members</span>
                  <span className="text-xs font-semibold font-sans">500+</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="500"
                  step="5"
                  value={employeeCount}
                  onChange={(e) => setEmployeeCount(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800/80 text-center space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Estimated Yearly Savings</span>
                <p className="text-xl sm:text-2xl font-black text-emerald-400">₹{calculatedSavings.toLocaleString()}</p>
                <p className="text-[9px] text-slate-500">Based on administrative efficiency improvement metrics.</p>
              </div>

              <button
                onClick={() => {
                  setIsCalculatorOpen(false);
                  navigate("/register");
                }}
                className="w-full h-10 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md cursor-pointer"
              >
                Claim Your Savings <ArrowRight size={12} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setIsCalculatorOpen(!isCalculatorOpen)}
          className="h-14 w-14 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-2xl transition-all hover:scale-105 active:scale-95 cursor-pointer ring-4 ring-indigo-600/20 relative"
        >
          <div className="absolute inset-0 rounded-full animate-ping bg-indigo-600/10 pointer-events-none" />
          {isCalculatorOpen ? <X size={22} /> : <Calculator size={22} />}
        </button>
      </div>
    </div>
  );
} 