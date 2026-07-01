import React, { useState } from "react";
import { 
  User, Lock, Mail, FileText, ArrowRight, UserPlus, AlertCircle, Sun, Moon, 
  Sparkles, Check, Layout, Sliders, Menu, X, Star, Users, Brain, Shield, ArrowUpRight
} from "lucide-react";

// Mock resume data categorized by role to demo dynamic resume preview matching
const MOCK_RESUMES_BY_ROLE = {
  "Software Engineer": {
    name: "Alex Rivera",
    title: "Senior Full-Stack Engineer",
    summary: "Innovative engineer with 7+ years of experience designing scalable microservices, REST APIs, and responsive React frontend systems. Expertise in Docker, Node.js, and AWS cloud architecture.",
    experience: [
      { role: "Staff Engineer at TechCorp", date: "2023 - Present", desc: "Led architectural migration of legacy billing engine into microservices, improving throughput by 42%." },
      { role: "Software Engineer at DevLabs", date: "2020 - 2023", desc: "Built real-time dashboard visualization tools utilizing React and WebSockets, used by 150k active daily visitors." }
    ],
    skills: ["JavaScript (ES6+)", "React / Next.js", "Node.js", "Docker / Kubernetes", "TypeScript", "AWS (S3/EC2)"]
  },
  "Data Scientist": {
    name: "Dr. Elena Rostova",
    title: "Lead Machine Learning Researcher",
    summary: "Ph.D. in Computer Science with a passion for natural language processing and computer vision algorithms. Proven record of deploying production-grade neural networks.",
    experience: [
      { role: "Principal Scientist at NeuralGrid", date: "2022 - Present", desc: "Developed customized BERT-based classification models, boosting customer sentiment accuracy by 18%." },
      { role: "Data Scientist at AnalyticsIQ", date: "2019 - 2022", desc: "Engineered robust pipeline scripts scaling large database ETL transformations, reducing processing latencies by 30%." }
    ],
    skills: ["Python", "TensorFlow / PyTorch", "SQL / Spark", "Data Analytics", "NLP Modeling", "Scikit-Learn"]
  },
  "Product Manager": {
    name: "Marcus Vance",
    title: "Director of Product Management",
    summary: "Metrics-driven product leader with 10 years of experience coordinating cross-functional engineering teams to launch cloud SaaS applications.",
    experience: [
      { role: "VP of Product at CloudSync", date: "2021 - Present", desc: "Owned product lifecycle roadmap of core collaboration suite, scaling active monthly subscriptions by 200%." },
      { role: "Senior PM at EnterpriseOS", date: "2018 - 2021", desc: "Launched unified workspace client resulting in a 4.8 App Store rating and generating $4.2M in annual recurring revenue." }
    ],
    skills: ["Product Roadmap Strategy", "Agile Management", "Market Research", "SQL Data Analytics", "User Interviews", "SaaS Lifecycle Management"]
  },
  "Business Analyst": {
    name: "Sarah Chen",
    title: "Senior Business Operations Analyst",
    summary: "Analytical strategist with 6+ years of experience helping Fortune 500 firms optimize supply chain logistics and operational cost centers.",
    experience: [
      { role: "Lead Analyst at BizGrowth Solutions", date: "2022 - Present", desc: "Analyzed overhead expenditures across 12 warehouses, trimming waste and saving $1.2M annually." },
      { role: "Business Consultant at ApexGroup", date: "2019 - 2022", desc: "Facilitated integration of ERP systems across merging corporate subsidiaries, aligning operations for 2k+ employees." }
    ],
    skills: ["Financial Analysis", "SQL & Tableau", "Process Optimization", "Requirements Gathering", "Risk Management", "Business Case Analysis"]
  },
  "Sales": {
    name: "Jordan Brooks",
    title: "Director of Strategic Accounts",
    summary: "High-performing sales executive with a consistent record of exceeding multi-million dollar annual quotas and securing strategic Fortune 500 enterprise accounts.",
    experience: [
      { role: "Enterprise Sales Director at SaaSify", date: "2023 - Present", desc: "Closed 14 high-value enterprise accounts, driving $3.2M in new ARR and exceeding target goals by 135%." },
      { role: "Senior Account Executive at TechScale", date: "2020 - 2023", desc: "Cultivated strategic accounts pipeline, maintaining a 94% retention rate and leading sales team in expansion revenues." }
    ],
    skills: ["Enterprise B2B Sales", "Deal Negotiation", "SaaS Solutions Selling", "Strategic Account Management", "CRM (Salesforce)", "Sales Forecast Analytics"]
  },
  "Teacher": {
    name: "Emily Watson",
    title: "Lead Mathematics Educator",
    summary: "Dedicated mathematics teacher with 8+ years of classroom instruction experience. Passionate about designing interactive STEM curricula and improving standardized test success.",
    experience: [
      { role: "Mathematics Department Head at Oakridge High", date: "2021 - Present", desc: "Spearheaded interactive algebra-learning initiatives, raising school average SAT score by 12%." },
      { role: "STEM Instructor at Lincoln Academy", date: "2018 - 2021", desc: "Coordinated after-school robotics club, leading student teams to win regional design competitions." }
    ],
    skills: ["Curriculum Development", "STEM Instruction", "Student Mentorship", "Classroom Leadership", "Educational Technology", "Parent-Teacher Relations"]
  },
  "Engineer": {
    name: "David K. Miller",
    title: "Senior Mechanical Design Engineer",
    summary: "Creative hardware designer with 9+ years of experience developing medical devices and precision machinery prototypes. Expert in CAD modeling and stress analysis.",
    experience: [
      { role: "Lead CAD Designer at MedTech Devices", date: "2022 - Present", desc: "Engineered ergonomic surgical tool casings, shortening regulatory approval pipelines by 6 months." },
      { role: "Product Development Engineer at HydroFlow", date: "2019 - 2022", desc: "Refined turbine blade castings to enhance fluid dynamic efficiencies by 8% and lower manufacturing costs." }
    ],
    skills: ["SolidWorks CAD", "FEA Stress Analysis", "Rapid Prototyping", "GD&T Tolerancing", "DFMA Standards", "Materials Selection"]
  },
  "Accounting": {
    name: "Lisa Sterling, CPA",
    title: "Senior Corporate Controller",
    summary: "Detail-oriented Certified Public Accountant with a strong background in auditing, corporate tax filings, and internal risk mitigation controls.",
    experience: [
      { role: "Controller at Sterling & Sterling LLC", date: "2022 - Present", desc: "Managed end-of-year tax returns and internal audits for 45 corporate accounts, ensuring 100% compliance." },
      { role: "Senior Accountant at Horizon Financials", date: "2019 - 2022", desc: "Supervised accounts ledger reconciliations and payroll pipelines, trimming quarterly balancing delays by 22%." }
    ],
    skills: ["CPA Standards", "Financial Auditing", "Tax Compliance", "GAAP Standards", "Ledger Reconciliation", "ERP Ledger Software"]
  },
  "Designer": {
    name: "Zoe Lin",
    title: "Lead UX/UI & Brand Designer",
    summary: "Human-centric designer with 7 years of experience crafting intuitive mobile apps, web interfaces, and high-converting marketing campaigns.",
    experience: [
      { role: "UX Designer at Pixels & Co", date: "2022 - Present", desc: "Redesigned checkout interfaces for major e-commerce brands, slashing cart abandonment rates by 28%." },
      { role: "Creative Designer at StudioNine", date: "2019 - 2022", desc: "Designed holistic brand identity frameworks, logos, and print assets for 15+ early-stage startups." }
    ],
    skills: ["UI/UX Design", "Figma / Adobe Suite", "Design Systems", "User Flows & Wireframes", "Interactive Prototyping", "Design Usability Testing"]
  },
  "Marketing": {
    name: "Rachel Green",
    title: "VP of Digital Growth Marketing",
    summary: "Acquisition strategist with a passion for search engine optimization, pay-per-click ads, and analytics-driven lead generation campaigns.",
    experience: [
      { role: "Digital Growth Director at BrandBoost", date: "2021 - Present", desc: "Orchestrated targeted multi-channel ad spend, securing a 4.2x ROI and driving $5.8M in acquisition revenue." },
      { role: "SEO Specialist at TrafficGen", date: "2018 - 2021", desc: "Optimized editorial sites and organic keyword strategies, increasing monthly website traffic by 340%." }
    ],
    skills: ["Google Analytics / SEO", "PPC Google & Meta Ads", "Conversion Rate Optimization (CRO)", "Copywriting & Creative Strategy", "Email Automation Marketing", "B2B Marketing Funnels"]
  }
};

export default function AuthGate({ onLogin, onGuestLogin, theme, setTheme }) {
  // Landing Page Interactive UI States
  const [activeCategory, setActiveCategory] = useState("Software Engineer");
  const [heroMargin, setHeroMargin] = useState(2); // 1 = narrow, 2 = default, 3 = wide
  const [heroSpacing, setHeroSpacing] = useState(2); // 1 = compact, 2 = default, 3 = spacious
  const [heroFont, setHeroFont] = useState("Rubik");
  const [aiActiveTab, setAiActiveTab] = useState("parsing"); // parsing | finder | translate

  // Modal authentication gateway states
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getStoredUsers = () => {
    try {
      const users = localStorage.getItem("cv_maker_users_list");
      return users ? JSON.parse(users) : [];
    } catch (e) {
      return [];
    }
  };

  const handleAuth = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!username || !password || (!isLoginMode && !email)) {
      setError("Please fill out all fields.");
      return;
    }

    const users = getStoredUsers();

    if (isLoginMode) {
      // Login Flow
      const foundUser = users.find(
        (u) => 
          (u.username.toLowerCase() === username.toLowerCase() || u.email.toLowerCase() === username.toLowerCase()) && 
          u.password === password
      );

      if (foundUser) {
        onLogin({ username: foundUser.username, email: foundUser.email });
        setIsAuthOpen(false);
      } else {
        setError("Invalid username/email or password.");
      }
    } else {
      // Signup Flow
      const nameExists = users.some((u) => u.username.toLowerCase() === username.toLowerCase());
      const emailExists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());

      if (nameExists) {
        setError("Username is already taken.");
        return;
      }
      if (emailExists) {
        setError("Email is already registered.");
        return;
      }

      const newUser = { username, email, password };
      users.push(newUser);
      localStorage.setItem("cv_maker_users_list", JSON.stringify(users));

      setSuccess("Account created successfully! Switching to Login.");
      setTimeout(() => {
        setIsLoginMode(true);
        setUsername(newUser.username);
        setPassword("");
        setSuccess("");
      }, 1500);
    }
  };

  // Helper font class generator
  const getFontFamilyClass = (font) => {
    switch(font) {
      case "Rubik": return "font-outfit";
      case "Lato": return "font-lato";
      case "Raleway": return "font-montserrat";
      case "Chivo": return "font-inter";
      case "Georgia": return "font-playfair";
      default: return "font-inter";
    }
  };

  // Helper padding generator for spacing demo
  const getSpacingClass = (spacing) => {
    if (spacing === 1) return "space-y-1 mt-1.5";
    if (spacing === 3) return "space-y-4 mt-4";
    return "space-y-2 mt-2.5";
  };

  // Helper padding generator for margin demo
  const getMarginClass = (margin) => {
    if (margin === 1) return "p-3";
    if (margin === 3) return "p-7";
    return "p-5";
  };

  return (
    <div className={`min-h-screen ${theme} bg-dark-bg text-slate-100 font-inter transition-colors duration-200 relative overflow-x-hidden`}>
      
      {/* Background glowing gradients */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-indigo-600/5 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] rounded-full bg-emerald-600/5 blur-[120px] pointer-events-none -z-10" />

      {/* 1. Header Navigation */}
      <header className="border-b border-dark-border bg-dark-card/80 backdrop-blur-md sticky top-0 z-30 transition-all duration-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-600/10">
            <FileText className="text-white" size={20} />
          </div>
          <span className="font-outfit font-extrabold text-lg text-white tracking-wide">
            ApexCV<span className="text-indigo-400">.</span>
          </span>
        </div>

        {/* Navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-gray-400">
          <a href="#features" className="hover:text-indigo-400 transition-colors">Features</a>
          <a href="#ats" className="hover:text-indigo-400 transition-colors">ATS Optimize</a>
          <a href="#ai" className="hover:text-indigo-400 transition-colors">AI Engine</a>
          <a href="#templates" className="hover:text-indigo-400 transition-colors">Pre-made Presets</a>
        </nav>

        {/* Toolbar CTAs */}
        <div className="flex items-center gap-3">
          {/* Day / Night Theme manual toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={`p-1.5 rounded-lg border cursor-pointer transition-all ${
              theme === "dark" 
                ? "border-dark-border bg-slate-900/40 text-yellow-400 hover:text-yellow-300" 
                : "border-slate-200 bg-white text-indigo-600 hover:bg-slate-100 shadow-sm"
            }`}
            title={theme === "dark" ? "Switch to Day Theme" : "Switch to Night Theme"}
          >
            {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          <button
            onClick={() => {
              setIsLoginMode(true);
              setIsAuthOpen(true);
            }}
            className="text-xs font-bold text-gray-400 hover:text-white px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            Sign In
          </button>

          <button
            onClick={() => {
              setIsLoginMode(false);
              setIsAuthOpen(true);
            }}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-md shadow-indigo-600/10 cursor-pointer transition-all hover:-translate-y-0.5"
          >
            Start Free
          </button>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left column copywriting */}
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-1.5 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
            <Sparkles size={10} /> Fully Powered by AI
          </div>
          <h1 className="font-outfit font-extrabold text-4xl md:text-5xl text-white leading-tight">
            Land more interviews with <span className="bg-gradient-to-r from-indigo-400 to-indigo-600 bg-clip-text text-transparent">ApexCV's</span> Resume Builder
          </h1>
          <p className="text-sm text-gray-400 leading-relaxed">
            ATS Check, AI Writer, and One-Click Job Tailoring make your resume stand out to recruiters. Fully offline autosave protects your data privacy.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => {
                setIsLoginMode(false);
                setIsAuthOpen(true);
              }}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-indigo-600/20 cursor-pointer transition-all duration-150 hover:-translate-y-0.5 text-center"
            >
              Build Your Resume
            </button>
            <button
              onClick={onGuestLogin}
              className="border border-dark-border bg-slate-900/40 text-gray-300 hover:text-white font-bold text-sm px-6 py-3.5 rounded-xl cursor-pointer transition-all duration-150 text-center"
            >
              Get Your Resume Score
            </button>
          </div>

          {/* Social Proof */}
          <div className="grid grid-cols-2 gap-4 pt-6 border-t border-dark-border/40">
            <div className="flex items-center gap-2">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
              </div>
              <span className="text-xs text-gray-400"><span className="font-bold text-white">5,291</span> Reviews</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-1 bg-indigo-600/10 rounded-lg text-indigo-400">
                <Users size={14} />
              </div>
              <span className="text-xs text-gray-400"><span className="font-bold text-white">28,452</span> Users last month</span>
            </div>
          </div>
        </div>

        {/* Right column: Interactive mockup editor (demonstrating spacing & fonts changes) */}
        <div className="lg:col-span-6 bg-dark-card border border-dark-border rounded-2xl p-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 blur-[80px] pointer-events-none" />
          
          <div className="flex items-center justify-between border-b border-dark-border/60 pb-4 mb-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <Sliders size={13} className="text-indigo-400" /> Interactive Customizer Demo
            </h3>
            <span className="text-[10px] text-gray-500">Live Preview</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Font selector */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-gray-400 block uppercase">Font Pair</label>
              <select
                value={heroFont}
                onChange={(e) => setHeroFont(e.target.value)}
                className="w-full bg-slate-900/60 border border-dark-border rounded-lg p-2 text-xs text-white focus:outline-none"
              >
                <option value="Rubik">Outfit (Modern)</option>
                <option value="Lato">Lato (Warm)</option>
                <option value="Raleway">Montserrat (Tech)</option>
                <option value="Chivo">Chivo (Neutral)</option>
                <option value="Georgia">Playfair (Serif)</option>
              </select>
            </div>

            {/* Page Margin Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase">
                <span>Page Margins</span>
                <span className="text-indigo-400">{heroMargin}</span>
              </div>
              <input
                type="range" min="1" max="3"
                value={heroMargin}
                onChange={(e) => setHeroMargin(Number(e.target.value))}
                className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            {/* Section Spacing Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase">
                <span>Section Spacing</span>
                <span className="text-indigo-400">{heroSpacing}</span>
              </div>
              <input
                type="range" min="1" max="3"
                value={heroSpacing}
                onChange={(e) => setHeroSpacing(Number(e.target.value))}
                className="w-full h-1 bg-slate-900 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>
          </div>

          {/* Actual Resume Sheet Layout Rendered Inline */}
          <div className="bg-white text-slate-800 rounded-xl shadow-lg border border-slate-200 max-h-[320px] overflow-y-auto custom-scroll transition-all duration-200">
            <div className={`${getMarginClass(heroMargin)} ${getFontFamilyClass(heroFont)}`}>
              
              {/* Mock Resume Header */}
              <div className="border-b-2 border-indigo-600 pb-2 flex justify-between items-end">
                <div>
                  <h4 className="font-extrabold text-base text-slate-900 leading-none">Alex Rivera</h4>
                  <p className="text-[10px] text-indigo-600 font-bold uppercase mt-1">Senior Full-Stack Engineer</p>
                </div>
                <div className="text-[8px] text-slate-500 text-right space-y-0.5">
                  <p>alex.rivera@example.com</p>
                  <p>San Francisco, CA</p>
                </div>
              </div>

              {/* Experience list */}
              <div className={getSpacingClass(heroSpacing)}>
                <h5 className="text-[9px] font-bold uppercase text-slate-900 tracking-wider">Experience</h5>
                
                <div className="border-l border-slate-200 pl-2 py-0.5">
                  <div className="flex justify-between text-[8px] font-bold text-slate-800">
                    <span>Staff Engineer at TechCorp</span>
                    <span className="text-slate-500 font-normal">2023 - Present</span>
                  </div>
                  <p className="text-[8px] text-slate-600 mt-0.5 leading-relaxed">
                    Led migration of legacy architectures into microservices, boosting pipeline capacity by 42%.
                  </p>
                </div>

                <div className="border-l border-slate-200 pl-2 py-0.5">
                  <div className="flex justify-between text-[8px] font-bold text-slate-800">
                    <span>Software Engineer at DevLabs</span>
                    <span className="text-slate-500 font-normal">2020 - 2023</span>
                  </div>
                  <p className="text-[8px] text-slate-600 mt-0.5 leading-relaxed">
                    Designed socket-driven dashboards rendering layouts dynamically for 150k daily active users.
                  </p>
                </div>
              </div>

              {/* Skills list */}
              <div className={getSpacingClass(heroSpacing)}>
                <h5 className="text-[9px] font-bold uppercase text-slate-900 tracking-wider">Skills</h5>
                <div className="flex flex-wrap gap-1 mt-1">
                  {["React", "Node.js", "TypeScript", "Docker", "AWS"].map(skill => (
                    <span key={skill} className="text-[8px] font-semibold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 3. ATS Optimization Section */}
      <section id="ats" className="bg-dark-card/40 border-y border-dark-border py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column Text details */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-1.5 bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
              <Shield size={10} /> ATS Parser Compatibility
            </div>
            <h2 className="font-outfit font-extrabold text-3xl md:text-4xl text-white">
              Resumes optimized for Applicant Tracking Systems (ATS)
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              All ApexCV resume templates are tested with top Applicant Tracking Systems (ATS) to guarantee full compatibility. With clean layouts, readable fonts, and standard section titles, nothing gets lost by the software. Every template has been expertly reviewed by Certified Professional Résumé Writers to ensure it's not only ATS-proof but recruiter-friendly, too.
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  setIsLoginMode(false);
                  setIsAuthOpen(true);
                }}
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs px-5 py-3 rounded-xl shadow-lg shadow-indigo-600/20 cursor-pointer transition-all duration-150 hover:-translate-y-0.5"
              >
                Build an ATS-Friendly Resume
              </button>
            </div>
          </div>

          {/* Right Column Badge display cards */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Badge 1 */}
            <div className="bg-dark-card border border-dark-border/80 rounded-2xl p-4 flex items-start gap-4 hover:border-indigo-500/30 transition-colors">
              <div className="p-3 bg-indigo-600/10 rounded-xl text-indigo-400 shrink-0">
                <Check size={18} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">Readable contact information</h4>
                <p className="text-xs text-gray-400 mt-1">Parses standard email, phone, LinkedIn profiles, and URLs instantly.</p>
              </div>
            </div>

            {/* Badge 2 */}
            <div className="bg-dark-card border border-dark-border/80 rounded-2xl p-4 flex items-start gap-4 hover:border-indigo-500/30 transition-colors">
              <div className="p-3 bg-indigo-600/10 rounded-xl text-indigo-400 shrink-0">
                <Check size={18} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">Full experience section parsing</h4>
                <p className="text-xs text-gray-400 mt-1">Keeps structural timelines intact so chronological parsers don't glitch.</p>
              </div>
            </div>

            {/* Badge 3 */}
            <div className="bg-dark-card border border-dark-border/80 rounded-2xl p-4 flex items-start gap-4 hover:border-indigo-500/30 transition-colors">
              <div className="p-3 bg-indigo-600/10 rounded-xl text-indigo-400 shrink-0">
                <Check size={18} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-white">Optimized skills section</h4>
                <p className="text-xs text-gray-400 mt-1">Formats skills as tags to help keyword analyzers match target criteria.</p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. AI Feature Block Section */}
      <section id="ai" className="max-w-6xl mx-auto px-6 py-16 md:py-24 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-1.5 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
            <Brain size={10} /> Copilot Assistance
          </div>
          <h2 className="font-outfit font-extrabold text-3xl md:text-4xl text-white">
            Fully equipped for the age of AI
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed">
            The AI Resume Builder helps you create resumes faster and smarter. Start with a job title, description, or custom prompt—and get high-quality text tailored to the role.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Side options list */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <button
                onClick={() => setAiActiveTab("parsing")}
                className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                  aiActiveTab === "parsing" 
                    ? "bg-indigo-600/10 border-indigo-500/30 text-white" 
                    : "bg-dark-card/30 border-dark-border text-gray-400 hover:text-white"
                }`}
              >
                <h4 className="font-bold text-sm flex items-center gap-2">
                  <Check size={14} className={aiActiveTab === "parsing" ? "text-indigo-400" : "text-gray-500"} />
                  AI content generation
                </h4>
                <p className="text-xs text-gray-500 mt-1 pl-5">Get customized experience bullet items based on your target job title.</p>
              </button>

              <button
                onClick={() => setAiActiveTab("finder")}
                className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                  aiActiveTab === "finder" 
                    ? "bg-indigo-600/10 border-indigo-500/30 text-white" 
                    : "bg-dark-card/30 border-dark-border text-gray-400 hover:text-white"
                }`}
              >
                <h4 className="font-bold text-sm flex items-center gap-2">
                  <Check size={14} className={aiActiveTab === "finder" ? "text-indigo-400" : "text-gray-500"} />
                  AI skills analyzer
                </h4>
                <p className="text-xs text-gray-500 mt-1 pl-5">Auto-suggest missing keywords from target job description files.</p>
              </button>

              <button
                onClick={() => setAiActiveTab("translate")}
                className={`w-full text-left p-4 rounded-xl border transition-all cursor-pointer ${
                  aiActiveTab === "translate" 
                    ? "bg-indigo-600/10 border-indigo-500/30 text-white" 
                    : "bg-dark-card/30 border-dark-border text-gray-400 hover:text-white"
                }`}
              >
                <h4 className="font-bold text-sm flex items-center gap-2">
                  <Check size={14} className={aiActiveTab === "translate" ? "text-indigo-400" : "text-gray-500"} />
                  One-click translation
                </h4>
                <p className="text-xs text-gray-500 mt-1 pl-5">Translate entire CV content while keeping layout parameters constant.</p>
              </button>
            </div>

            <button
              onClick={() => {
                setIsLoginMode(false);
                setIsAuthOpen(true);
              }}
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 cursor-pointer"
            >
              Explore ApexCV AI <ArrowUpRight size={13} />
            </button>
          </div>

          {/* Right Side: AI autocomplete dynamic preview mockup card (Image 4 right side) */}
          <div className="lg:col-span-7 bg-dark-card border border-dark-border rounded-2xl p-6 flex flex-col justify-between shadow-xl relative min-h-[300px]">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/5 blur-[80px] pointer-events-none" />
            
            <div className="border-b border-dark-border pb-3 mb-3">
              <span className="text-[10px] uppercase font-bold tracking-widest text-indigo-400">AI Assist Preview</span>
            </div>

            <div className="flex-1 space-y-4">
              {aiActiveTab === "parsing" && (
                <div className="space-y-3">
                  <div className="bg-slate-900/80 rounded-xl p-3 border border-dark-border">
                    <span className="text-[9px] uppercase font-bold tracking-widest text-emerald-400">AI content generation in progress...</span>
                    <p className="text-xs text-gray-300 mt-1.5 leading-relaxed">
                      "Developed custom REST server models, <span className="bg-indigo-600/35 px-1 py-0.5 rounded text-white font-semibold">improving throughput latency by 42%</span> and optimizing database query executions."
                    </p>
                  </div>
                  <div className="bg-slate-950/90 border border-dark-border/80 rounded-xl p-3 shadow-lg max-w-sm space-y-2">
                    <span className="text-[9px] uppercase font-bold text-gray-400 flex items-center gap-1.5">
                      <Sparkles size={11} className="text-indigo-400 animate-pulse" /> AI Suggestions
                    </span>
                    <p className="text-[11px] text-gray-200">Replace with: "Spearheaded core microservice conversion, raising processing speeds by 42%."</p>
                    <div className="flex gap-2 justify-end pt-1">
                      <button className="text-[9px] font-bold text-gray-400 hover:text-white px-2 py-1 rounded bg-slate-800">Restore</button>
                      <button className="text-[9px] font-bold text-white bg-indigo-600 hover:bg-indigo-500 px-2 py-1 rounded">Approve</button>
                    </div>
                  </div>
                </div>
              )}

              {aiActiveTab === "finder" && (
                <div className="space-y-3">
                  <p className="text-xs text-gray-300 leading-relaxed">We analyzed the job requirements and found keywords missing in your skills block:</p>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-[10px] bg-red-950/40 text-red-400 border border-red-900/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                      Docker (Missing)
                    </span>
                    <span className="text-[10px] bg-red-950/40 text-red-400 border border-red-900/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                      Kubernetes (Missing)
                    </span>
                    <span className="text-[10px] bg-emerald-950/40 text-emerald-400 border border-emerald-900/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                      React <Check size={10} />
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setIsLoginMode(false);
                      setIsAuthOpen(true);
                    }}
                    className="mt-2 text-[10px] font-bold text-indigo-400 bg-indigo-600/10 border border-indigo-500/20 px-3 py-1.5 rounded-lg inline-flex items-center gap-1"
                  >
                    Add Missing Keywords Automatically
                  </button>
                </div>
              )}

              {aiActiveTab === "translate" && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-900/60 p-2.5 rounded-xl border border-dark-border">
                      <span className="text-[9px] uppercase text-gray-500">English (Source)</span>
                      <p className="text-xs text-gray-300 mt-1 leading-relaxed">7+ years experience designing cloud SaaS layouts.</p>
                    </div>
                    <div className="bg-slate-900/60 p-2.5 rounded-xl border border-dark-border">
                      <span className="text-[9px] uppercase text-indigo-400">German (Translated)</span>
                      <p className="text-xs text-gray-300 mt-1 leading-relaxed">Mehr als 7 Jahre Erfahrung im Design von Cloud-SaaS-Layouts.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </section>

      {/* 5. Resume Category Tabs & Dynamic Example Previews (Image 5) */}
      <section id="templates" className="bg-dark-card/30 border-y border-dark-border py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column copy + role list */}
          <div className="lg:col-span-5 space-y-6">
            <h2 className="font-outfit font-extrabold text-3xl text-white">
              Resume examples tailored for your job and experience
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              Our Certified Professional Résumé Writers have created over 1,400 in-depth guides and reviewed 10,000+ resumes across U.S. industries and career levels—each reflecting today's job market.
            </p>

            {/* Vertically scrolling / stacked category tabs */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              {Object.keys(MOCK_RESUMES_BY_ROLE).map((role) => (
                <button
                  key={role}
                  onClick={() => setActiveCategory(role)}
                  className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer truncate ${
                    activeCategory === role 
                      ? "bg-indigo-600/10 border-indigo-500/40 text-indigo-400 font-bold" 
                      : "bg-dark-card border-dark-border text-gray-400 hover:text-white"
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Dynamic mock resume sheet showing selected role details */}
          <div className="lg:col-span-7 bg-white text-slate-800 rounded-2xl p-6 shadow-2xl border border-slate-200 transition-all duration-200">
            
            {/* Sheet header */}
            <div className="border-b-2 border-indigo-600 pb-3 flex justify-between items-end">
              <div>
                <h3 className="font-extrabold text-lg text-slate-900 leading-none">
                  {MOCK_RESUMES_BY_ROLE[activeCategory].name}
                </h3>
                <p className="text-xs text-indigo-600 font-bold uppercase mt-1">
                  {MOCK_RESUMES_BY_ROLE[activeCategory].title}
                </p>
              </div>
              <div className="text-[10px] text-slate-500 text-right">
                <p>contact@apexcv.com</p>
                <p>United States</p>
              </div>
            </div>

            {/* Profile summary */}
            <div className="mt-4">
              <h4 className="text-xs font-bold uppercase text-slate-900 tracking-wider">Summary</h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {MOCK_RESUMES_BY_ROLE[activeCategory].summary}
              </p>
            </div>

            {/* Experience list */}
            <div className="mt-4 space-y-3">
              <h4 className="text-xs font-bold uppercase text-slate-900 tracking-wider">Experience</h4>
              
              {MOCK_RESUMES_BY_ROLE[activeCategory].experience.map((exp, idx) => (
                <div key={idx} className="border-l border-slate-200 pl-3">
                  <div className="flex justify-between text-xs font-bold text-slate-800">
                    <span>{exp.role}</span>
                    <span className="text-slate-500 font-normal">{exp.date}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {exp.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* Skills tag group */}
            <div className="mt-4">
              <h4 className="text-xs font-bold uppercase text-slate-900 tracking-wider">Skills</h4>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {MOCK_RESUMES_BY_ROLE[activeCategory].skills.map((skill) => (
                  <span key={skill} className="text-xs font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Direct click-to-edit CTA inside sheet mockup */}
            <button
              onClick={() => {
                setIsLoginMode(false);
                setIsAuthOpen(true);
              }}
              className="w-full mt-6 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs py-3 rounded-xl shadow-md shadow-indigo-600/10 cursor-pointer text-center block transition-all"
            >
              Use This Example Template
            </button>

          </div>

        </div>
      </section>

      {/* 6. Footer section with Trademark */}
      <footer className="bg-dark-card border-t border-dark-border py-12 text-xs font-semibold text-gray-500">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          
          <div className="space-y-3">
            <h4 className="text-white text-sm font-bold">ApexCV</h4>
            <p className="text-xs text-gray-500 leading-relaxed font-normal">A high-fidelity Enhancv replica designed to build ATS-compatible resumes with copilot AI writer models completely in-browser.</p>
          </div>

          <div className="space-y-2">
            <h4 className="text-white text-xs font-bold uppercase">Builder</h4>
            <button onClick={onGuestLogin} className="block text-gray-500 hover:text-indigo-400 font-normal">Guest Builder</button>
            <button onClick={() => { setIsLoginMode(false); setIsAuthOpen(true); }} className="block text-gray-500 hover:text-indigo-400 font-normal">Start Free</button>
          </div>

          <div className="space-y-2">
            <h4 className="text-white text-xs font-bold uppercase">Resources</h4>
            <a href="https://github.com/AkbarDev/resume_maker" target="_blank" rel="noopener noreferrer" className="block text-gray-500 hover:text-indigo-400 font-normal">GitHub Repo</a>
            <a href="https://enhancv.com/" target="_blank" rel="noopener noreferrer" className="block text-gray-500 hover:text-indigo-400 font-normal">Inspiration</a>
          </div>

          <div className="space-y-2">
            <h4 className="text-white text-xs font-bold uppercase">Settings</h4>
            <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="block text-gray-500 hover:text-indigo-400 font-normal">Toggle Layout Style</button>
          </div>

        </div>

        <div className="max-w-6xl mx-auto px-6 pt-8 mt-8 border-t border-dark-border/40 text-center flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-normal text-gray-600">
            © 2026 ApexCV™. All rights reserved. Registered trademarks are the property of their respective owners.
          </p>
          <div className="flex gap-4">
            <a href="#nav-default" className="text-gray-600 hover:text-white font-normal">Back to Top</a>
          </div>
        </div>
      </footer>

      {/* 7. Modal Auth Gate Dialog */}
      {isAuthOpen && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4">
          
          <div className="w-full max-w-md bg-dark-card border border-dark-border/80 rounded-2xl shadow-2xl p-8 relative z-10 animate-in fade-in zoom-in duration-200">
            
            {/* Close Button */}
            <button
              onClick={() => {
                setIsAuthOpen(false);
                setError("");
                setSuccess("");
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 hover:bg-slate-800 rounded-lg cursor-pointer"
            >
              <X size={16} />
            </button>

            {/* Logo */}
            <div className="flex flex-col items-center mb-8">
              <div className="p-3.5 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/30 mb-3">
                <FileText className="text-white" size={28} />
              </div>
              <h1 className="font-outfit font-extrabold text-2xl tracking-wide text-white">
                ApexCV
              </h1>
              <p className="text-xs text-gray-400 mt-1">Free & Open-Source ATS CV Maker</p>
            </div>

            <h2 className="text-lg font-bold text-white mb-6 text-center">
              {isLoginMode ? "Sign in to your account" : "Create your free account"}
            </h2>

            {error && (
              <div className="flex items-center gap-2 bg-red-950/40 border border-red-900/50 p-3.5 rounded-xl text-xs text-red-300 mb-4">
                <AlertCircle className="shrink-0" size={16} />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 bg-emerald-950/40 border border-emerald-900/50 p-3.5 rounded-xl text-xs text-emerald-300 mb-4">
                <Check className="shrink-0 text-emerald-400" size={16} />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">
                  {isLoginMode ? "Username or Email" : "Username"}
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                    <User size={15} />
                  </span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-slate-900 border border-dark-border rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder={isLoginMode ? "username or email" : "choose username"}
                    autoFocus
                  />
                </div>
              </div>

              {!isLoginMode && (
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1.5">Email Address</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                      <Mail size={15} />
                    </span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-900 border border-dark-border rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Password</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                    <Lock size={15} />
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-900 border border-dark-border rounded-xl pl-9 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 py-2.5 rounded-xl text-xs font-bold text-white shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer transition-colors duration-150 mt-6"
              >
                <span>{isLoginMode ? "Sign In" : "Register Account"}</span>
                <ArrowRight size={15} />
              </button>
            </form>

            <div className="relative my-6 text-center">
              <span className="absolute inset-x-0 top-1/2 border-t border-dark-border/60 -z-10" />
              <span className="bg-[#151b2c] px-3 text-[10px] uppercase font-bold tracking-widest text-gray-500">
                or
              </span>
            </div>

            {/* Guest access */}
            <button
              type="button"
              onClick={() => {
                onGuestLogin();
                setIsAuthOpen(false);
              }}
              className="w-full border border-dark-border hover:border-gray-500 bg-slate-900/30 py-2.5 rounded-xl text-xs font-bold text-gray-300 hover:text-white flex items-center justify-center gap-2 cursor-pointer transition-colors"
            >
              <span>Continue as Guest</span>
            </button>

            {/* Switch Mode Link */}
            <div className="text-center mt-6">
              <button
                type="button"
                onClick={() => {
                  setIsLoginMode(!isLoginMode);
                  setError("");
                }}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 mx-auto"
              >
                {isLoginMode ? (
                  <>
                    <UserPlus size={13} />
                    Don't have an account? Sign Up
                  </>
                ) : (
                  <>
                    <User size={13} />
                    Already have an account? Sign In
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
