import React, { useState, useEffect } from "react";
import { 
  FileText, Download, RotateCcw, Trash2, Sparkles, Layout, Eye, Settings, Heart, ArrowLeft, RefreshCw, Sun, Moon,
  Undo, Redo, History, Link, CheckCircle2, ArrowDownUp
} from "lucide-react";
import AuthGate from "./components/AuthGate";
import Dashboard from "./components/Dashboard";
import ResumeEditor from "./components/ResumeEditor";
import ResumePreview from "./components/ResumePreview";
import AIPanel from "./components/AIPanel";
import { INITIAL_RESUME_DATA } from "./types/resume";

export default function App() {
  // Theme state detecting Day (6 AM to 6 PM) vs Night
  const [theme, setTheme] = useState(() => {
    const hour = new Date().getHours();
    return (hour >= 6 && hour < 18) ? "light" : "dark";
  });

  useEffect(() => {
    document.documentElement.className = theme;
  }, [theme]);

  // 1. Session states
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("cv_maker_active_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [resumes, setResumes] = useState([]);
  const [activeResume, setActiveResume] = useState(null);
  const [activeAIRequest, setActiveAIRequest] = useState(null);
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(false);
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(false);

  // Load resumes when user logs in
  useEffect(() => {
    if (currentUser) {
      const key = `cv_maker_resumes_${currentUser.username}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        try {
          setResumes(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to parse resumes list");
          setResumes([]);
        }
      } else {
        setResumes([]);
      }
    } else {
      setResumes([]);
    }
  }, [currentUser]);

  // Helper to save resumes list & sync to localStorage
  const saveResumesList = (updatedList) => {
    setResumes(updatedList);
    if (currentUser) {
      const key = `cv_maker_resumes_${currentUser.username}`;
      localStorage.setItem(key, JSON.stringify(updatedList));
    }
  };

  // Create new resume file
  const handleCreateNew = (templateData, initialTitle) => {
    const now = new Date().toISOString();
    const newResume = {
      ...templateData,
      id: `resume-${Date.now()}`,
      title: initialTitle,
      createdAt: now,
      updatedAt: now
    };
    const updated = [newResume, ...resumes];
    saveResumesList(updated);
    setActiveResume(newResume);
  };

  // Select/edit resume
  const handleSelectResume = (resume) => {
    setActiveResume(resume);
  };

  // Delete resume
  const handleDeleteResume = (id) => {
    const updated = resumes.filter(r => r.id !== id);
    saveResumesList(updated);
  };

  // Rename resume file
  const handleRenameResume = (id, newTitle) => {
    const updated = resumes.map(r => 
      r.id === id 
        ? { ...r, title: newTitle, updatedAt: new Date().toISOString() } 
        : r
    );
    saveResumesList(updated);
    if (activeResume && activeResume.id === id) {
      setActiveResume(prev => ({ ...prev, title: newTitle }));
    }
  };

  // Import JSON backup or AI Parse output
  const handleImportJson = (jsonData) => {
    const now = new Date().toISOString();
    const newResume = {
      ...jsonData,
      id: `resume-${Date.now()}`,
      title: jsonData.title || (jsonData.personalInfo?.firstName 
        ? `${jsonData.personalInfo.firstName}'s Resume` 
        : "Imported Resume"),
      createdAt: now,
      updatedAt: now
    };
    const updated = [newResume, ...resumes];
    saveResumesList(updated);
    setActiveResume(newResume);
  };

  // Handle keystroke save
  const handleResumeChange = (updatedData) => {
    const now = new Date().toISOString();
    const enriched = { ...updatedData, updatedAt: now };
    setActiveResume(enriched);

    // Sync changes back to list item immediately
    const updatedList = resumes.map(r => r.id === enriched.id ? enriched : r);
    saveResumesList(updatedList);
  };

  // Auth Callbacks
  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem("cv_maker_active_user", JSON.stringify(user));
  };

  const handleGuestLogin = () => {
    const guestUser = { username: "Guest", email: "guest@apeccv.in" };
    setCurrentUser(guestUser);
    localStorage.setItem("cv_maker_active_user", JSON.stringify(guestUser));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveResume(null);
    localStorage.removeItem("cv_maker_active_user");
  };

  // Editor AI Refine Request
  const handleAIEnhanceRequest = (requestObj) => {
    setActiveAIRequest(requestObj);
    setIsAIPanelOpen(true); // Open AI panel
  };

  // Apply AI output
  const handleApplyAIChange = (type, value, id) => {
    if (!activeResume) return;

    let updated = { ...activeResume };
    if (type === "summary") {
      updated.personalInfo = { ...updated.personalInfo, summary: value };
    } else if (type === "experience") {
      updated.experience = updated.experience.map(exp => exp.id === id ? { ...exp, description: value } : exp);
    } else if (type === "project") {
      updated.projects = updated.projects.map(p => p.id === id ? { ...p, description: value } : p);
    }

    handleResumeChange(updated);
  };

  // Trigger PDF Printing
  const handleDownloadPDF = () => {
    window.print();
  };

  // Auth gate check
  if (!currentUser) {
    return <AuthGate onLogin={handleLogin} onGuestLogin={handleGuestLogin} theme={theme} setTheme={setTheme} />;
  }

  // Dashboard check
  if (!activeResume) {
    return (
      <Dashboard
        username={currentUser.username}
        resumes={resumes}
        onCreateNew={handleCreateNew}
        onSelect={handleSelectResume}
        onDelete={handleDeleteResume}
        onRename={handleRenameResume}
        onImportJson={handleImportJson}
        onLogout={handleLogout}
        theme={theme}
        setTheme={setTheme}
      />
    );
  }

  // Active Workspace view
  return (
    <div className={`min-h-screen ${theme} bg-dark-bg text-slate-100 flex flex-col font-inter transition-colors duration-200`}>
      
      {/* Top Header Navigation */}
      <header className="no-print border-b border-dark-border bg-dark-card/90 backdrop-blur px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveResume(null)}
            className="flex items-center gap-1 bg-slate-900/60 border border-dark-border hover:bg-slate-800 p-2 rounded-xl text-gray-400 hover:text-white cursor-pointer transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft size={16} />
          </button>
          
          <div>
            {/* Direct Resume Title Renaming */}
            <input
              type="text"
              value={activeResume.title || ""}
              onChange={(e) => handleRenameResume(activeResume.id, e.target.value)}
              className="bg-transparent border-b border-transparent hover:border-indigo-500/40 focus:border-indigo-500 font-outfit font-extrabold text-base tracking-wide text-white leading-tight focus:outline-none py-0.5"
              placeholder="Resume Title"
            />
            <p className="text-[10px] text-gray-400 mt-0.5">
              Autosaved to your dashboard • Style: <span className="capitalize">{activeResume.layoutSettings.template}</span>
            </p>
          </div>
        </div>
        
        {/* Toolbar Controls */}
        <div className="flex items-center gap-2">
          {/* Improve text button with badge */}
          <button
            onClick={() => setIsAIPanelOpen(!isAIPanelOpen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              isAIPanelOpen 
                ? "bg-indigo-600/10 border-indigo-500/30 text-indigo-400" 
                : "border-dark-border bg-slate-900/40 text-gray-300 hover:text-white"
            }`}
            title="Improve text (AI Suggestions)"
          >
            <Sparkles size={13} className={isAIPanelOpen ? "animate-pulse" : ""} />
            <span>Improve text</span>
            <span className="bg-red-500 text-white font-extrabold text-[9px] px-1.5 py-0.2 rounded-full">3</span>
          </button>

          {/* ATS Check button */}
          <button
            onClick={() => {
              setIsAIPanelOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-dark-border bg-slate-900/40 text-gray-300 hover:text-white cursor-pointer transition-all"
            title="Perform ATS Optimization Audit"
          >
            <CheckCircle2 size={13} />
            <span>ATS Check</span>
          </button>

          {/* Rearrange button */}
          <button
            onClick={() => {
              alert("Rearrange Mode Activated: Drag or use arrow controls on cards to shift sections.");
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-dark-border bg-slate-900/40 text-gray-300 hover:text-white cursor-pointer transition-all"
            title="Reorder and Shift Resume Sections"
          >
            <ArrowDownUp size={13} />
            <span>Rearrange</span>
          </button>

          {/* Templates button */}
          <button
            onClick={() => setActiveResume(null)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-dark-border bg-slate-900/40 text-gray-300 hover:text-white cursor-pointer transition-all"
            title="Choose a Different Template"
          >
            <FileText size={13} />
            <span>Templates</span>
          </button>

          {/* Design & Font button */}
          <button
            onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
              isLeftSidebarOpen 
                ? "bg-indigo-600/10 border-indigo-500/30 text-indigo-400" 
                : "border-dark-border bg-slate-900/40 text-gray-300 hover:text-white"
            }`}
            title="Configure Fonts, Margins and Spacing"
          >
            <Layout size={13} />
            <span>Design & Font</span>
          </button>
        </div>

        {/* Right side Undo, Redo, History, and Theme */}
        <div className="flex items-center gap-2">
          {/* Undo */}
          <button className="p-1.5 rounded-lg border border-dark-border bg-slate-900/40 text-gray-400 hover:text-white cursor-pointer" title="Undo">
            <Undo size={14} />
          </button>

          {/* Redo */}
          <button className="p-1.5 rounded-lg border border-dark-border bg-slate-900/40 text-gray-400 hover:text-white cursor-pointer" title="Redo">
            <Redo size={14} />
          </button>

          {/* History */}
          <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-dark-border bg-slate-900/40 text-gray-400 hover:text-white text-xs cursor-pointer" title="Version History">
            <History size={13} />
            <span>History</span>
          </button>

          <div className="w-px h-4 bg-slate-800 mx-1" />

          {/* Day / Night Theme */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={`p-1.5 rounded-lg border cursor-pointer transition-all ${
              theme === "dark" 
                ? "border-dark-border bg-slate-900/40 text-yellow-400 hover:text-yellow-300" 
                : "border-slate-200 bg-white text-indigo-600 hover:bg-slate-100 shadow-sm"
            }`}
          >
            {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>
      </header>

      {/* Workspace columns */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Column: Form Editor */}
        {isLeftSidebarOpen && (
          <main className="no-print w-[24%] border-r border-dark-border bg-dark-card/50 overflow-y-auto p-5 shrink-0">
            <ResumeEditor 
              data={activeResume} 
              onChange={handleResumeChange} 
              onAIEnhance={handleAIEnhanceRequest}
            />
          </main>
        )}

        {/* Center Column: Live Sheet Preview */}
        <section className="no-print flex-1 bg-slate-950/60 overflow-y-auto p-8 flex flex-col items-center relative">
          
          {/* Floating Actions Stack on the right side of A4 sheet */}
          <div className="fixed right-6 top-28 flex flex-col gap-2.5 z-20">
            {/* View Mode Toggle */}
            <button 
              onClick={() => {
                alert("Preview mode activated: PDF formatting optimized.");
              }}
              className="bg-white dark:bg-slate-900 border border-slate-200/85 dark:border-slate-800 text-slate-500 hover:text-indigo-400 p-2.5 rounded-xl shadow-lg cursor-pointer transition-all hover:scale-105" 
              title="Toggle View Mode"
            >
              <Eye size={16} />
            </button>
            {/* Download PDF */}
            <button 
              onClick={handleDownloadPDF} 
              className="bg-white dark:bg-slate-900 border border-slate-200/85 dark:border-slate-800 text-slate-500 hover:text-indigo-400 p-2.5 rounded-xl shadow-lg cursor-pointer transition-all hover:scale-105" 
              title="Download PDF"
            >
              <Download size={16} />
            </button>
            {/* Share Link */}
            <button 
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert("ApexCV public link copied to clipboard!");
              }}
              className="bg-white dark:bg-slate-900 border border-slate-200/85 dark:border-slate-800 text-slate-500 hover:text-indigo-400 p-2.5 rounded-xl shadow-lg cursor-pointer transition-all hover:scale-105" 
              title="Share Link"
            >
              <Link size={16} />
            </button>
          </div>

          <div className="mb-4 flex items-center justify-between w-[210mm] max-w-full text-xs text-gray-400">
            <span>Interactive Preview Canvas (Click boxes to edit inline)</span>
            <span>A4 Portrait Layout</span>
          </div>
          
          <div className="w-[210mm] max-w-full shadow-2xl shadow-black/40 border border-slate-800/50 rounded-lg overflow-hidden shrink-0">
            <ResumePreview 
              data={activeResume} 
              onChange={handleResumeChange}
              onAIEnhance={handleAIEnhanceRequest}
              isPrintView={false} 
            />
          </div>
          
          <div className="mt-8 text-center text-[11px] text-gray-500 flex items-center gap-1.5 justify-center">
            <span>ApexCV • Powered by local browser storage</span>
            <Heart size={10} className="text-red-500 fill-red-500" />
            <span>Selectable PDF text standard</span>
          </div>
        </section>

        {/* Right Column: AI Assistant Drawer */}
        {isAIPanelOpen && (
          <aside className="no-print w-[25%] border-l border-dark-border bg-dark-card/50 p-4 shrink-0 flex flex-col h-full overflow-hidden">
            <AIPanel 
              resumeData={activeResume}
              onApplyChange={handleApplyAIChange}
              activeRequest={activeAIRequest}
              onCloseActiveRequest={() => setActiveAIRequest(null)}
            />
          </aside>
        )}
      </div>

      {/* Hidden Print Target */}
      <div className="hidden print:block print-area">
        <ResumePreview 
          data={activeResume} 
          onChange={handleResumeChange}
          onAIEnhance={handleAIEnhanceRequest}
          isPrintView={true} 
        />
      </div>

    </div>
  );
}
