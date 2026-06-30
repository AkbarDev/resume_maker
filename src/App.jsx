import React, { useState, useEffect } from "react";
import { 
  FileText, Download, RotateCcw, Trash2, Sparkles, Layout, Eye, Settings, Heart 
} from "lucide-react";
import ResumeEditor from "./components/ResumeEditor";
import ResumePreview from "./components/ResumePreview";
import AIPanel from "./components/AIPanel";
import { INITIAL_RESUME_DATA } from "./types/resume";

export default function App() {
  const [resumeData, setResumeData] = useState(() => {
    const saved = localStorage.getItem("cv_maker_resume_data");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse saved resume data, using initial mock", e);
      }
    }
    return INITIAL_RESUME_DATA;
  });

  const [activeAIRequest, setActiveAIRequest] = useState(null);
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(true);

  // Autosave to localStorage
  useEffect(() => {
    localStorage.setItem("cv_maker_resume_data", JSON.stringify(resumeData));
  }, [resumeData]);

  // Reset to initial mock template
  const handleResetData = () => {
    if (window.confirm("Are you sure you want to reset the resume to the default template data? Your current changes will be overwritten.")) {
      setResumeData(INITIAL_RESUME_DATA);
    }
  };

  // Clear all form fields
  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear all fields? This will start a completely blank resume.")) {
      setResumeData({
        personalInfo: {
          firstName: "",
          lastName: "",
          title: "",
          email: "",
          phone: "",
          location: "",
          website: "",
          linkedin: "",
          github: "",
          summary: ""
        },
        experience: [],
        education: [],
        projects: [],
        skills: [],
        certifications: [],
        layoutSettings: {
          template: "modern",
          primaryColor: "#0f172a",
          accentColor: "#2563eb",
          fontSize: "sm",
          spacing: "normal",
          fontFamily: "sans"
        }
      });
    }
  };

  // Callback to enhance text from Editor
  const handleAIEnhanceRequest = (requestObj) => {
    setActiveAIRequest(requestObj);
    setIsAIPanelOpen(true); // Auto-open if closed
  };

  // Callback to apply AI output back to the main state
  const handleApplyAIChange = (type, value, id) => {
    if (type === "summary") {
      setResumeData(prev => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          summary: value
        }
      }));
    } else if (type === "experience") {
      setResumeData(prev => ({
        ...prev,
        experience: prev.experience.map(exp => exp.id === id ? { ...exp, description: value } : exp)
      }));
    } else if (type === "project") {
      setResumeData(prev => ({
        ...prev,
        projects: prev.projects.map(p => p.id === id ? { ...p, description: value } : p)
      }));
    }
  };

  // Trigger browser printing for PDF download
  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-inter">
      
      {/* Top Header Navigation */}
      <header className="no-print border-b border-dark-border bg-dark-card/90 backdrop-blur px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <FileText className="text-white" size={20} />
          </div>
          <div>
            <h1 className="font-outfit font-extrabold text-base tracking-wide text-white leading-tight flex items-center gap-2">
              ApexCV <span className="text-[10px] uppercase font-bold tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">Free & Open-Source</span>
            </h1>
            <p className="text-[10px] text-gray-400 mt-0.5">ATS-Optimized Resume Maker & Optimizer</p>
          </div>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-2">
          
          {/* AI Drawer toggle */}
          <button
            onClick={() => setIsAIPanelOpen(!isAIPanelOpen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              isAIPanelOpen 
                ? "bg-indigo-600/10 border-indigo-500/30 text-indigo-400" 
                : "border-dark-border bg-slate-900/40 text-gray-300 hover:text-white"
            }`}
          >
            <Sparkles size={14} className={isAIPanelOpen ? "animate-pulse" : ""} />
            <span>AI Assistant</span>
            {activeAIRequest && (
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping ml-0.5" />
            )}
          </button>

          <button
            onClick={handleResetData}
            title="Reset to sample data"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-dark-border bg-slate-900/40 text-gray-300 hover:text-white cursor-pointer transition-all"
          >
            <RotateCcw size={14} />
            <span className="hidden sm:inline">Reset Template</span>
          </button>

          <button
            onClick={handleClearAll}
            title="Clear all fields"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-dark-border bg-slate-900/40 text-red-400 hover:bg-red-500/10 cursor-pointer transition-all animate-none"
          >
            <Trash2 size={14} />
            <span className="hidden sm:inline">Clear All</span>
          </button>

          <button
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-lg shadow-indigo-600/20 cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
          >
            <Download size={14} />
            <span>Download PDF</span>
          </button>
        </div>
      </header>

      {/* Main Content Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Column: Form Editor */}
        <main className="no-print w-[33%] border-r border-dark-border bg-dark-card/50 overflow-y-auto p-5 shrink-0">
          <div className="mb-4">
            <h2 className="text-sm font-semibold tracking-wide uppercase text-gray-400">Fill Details</h2>
            <p className="text-[11px] text-gray-500 mt-0.5">Your modifications are automatically saved locally.</p>
          </div>
          <ResumeEditor 
            data={resumeData} 
            onChange={setResumeData} 
            onAIEnhance={handleAIEnhanceRequest}
          />
        </main>

        {/* Center Column: Live Sheet Preview Canvas */}
        <section className="no-print flex-1 bg-slate-950/60 overflow-y-auto p-8 flex flex-col items-center">
          <div className="mb-4 flex items-center justify-between w-[210mm] max-w-full text-xs text-gray-400">
            <span className="flex items-center gap-1.5"><Eye size={12} /> Interactive Preview Canvas</span>
            <span>A4 Portrait Standard Layout</span>
          </div>
          
          <div className="w-[210mm] max-w-full shadow-2xl shadow-black/40 border border-slate-800/50 rounded-lg overflow-hidden shrink-0">
            <ResumePreview data={resumeData} isPrintView={false} />
          </div>
          
          <div className="mt-8 text-center text-[11px] text-gray-500 flex items-center gap-1.5 justify-center">
            <span>Built for the open-source community</span>
            <Heart size={10} className="text-red-500 fill-red-500" />
            <span>ATS compliant & print ready</span>
          </div>
        </section>

        {/* Right Column: AI Assistant Drawer Panel */}
        {isAIPanelOpen && (
          <aside className="no-print w-[25%] border-l border-dark-border bg-dark-card/50 p-4 shrink-0 flex flex-col h-full overflow-hidden">
            <AIPanel 
              resumeData={resumeData}
              onApplyChange={handleApplyAIChange}
              activeRequest={activeAIRequest}
              onCloseActiveRequest={() => setActiveAIRequest(null)}
            />
          </aside>
        )}
      </div>

      {/* Hidden Print Area: ONLY rendered when page print is triggered */}
      <div className="hidden print:block print-area">
        <ResumePreview data={resumeData} isPrintView={true} />
      </div>

    </div>
  );
}
