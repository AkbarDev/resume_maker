import React, { useState, useEffect } from "react";
import { 
  FileText, Download, RotateCcw, Trash2, Sparkles, Layout, Eye, Settings, Heart, ArrowLeft, RefreshCw 
} from "lucide-react";
import AuthGate from "./components/AuthGate";
import Dashboard from "./components/Dashboard";
import ResumeEditor from "./components/ResumeEditor";
import ResumePreview from "./components/ResumePreview";
import AIPanel from "./components/AIPanel";
import { INITIAL_RESUME_DATA } from "./types/resume";

export default function App() {
  // 1. Session states
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("cv_maker_active_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [resumes, setResumes] = useState([]);
  const [activeResume, setActiveResume] = useState(null);
  const [activeAIRequest, setActiveAIRequest] = useState(null);
  const [isAIPanelOpen, setIsAIPanelOpen] = useState(true);

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
    return <AuthGate onLogin={handleLogin} onGuestLogin={handleGuestLogin} />;
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
      />
    );
  }

  // Active Workspace view
  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-inter">
      
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
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 px-4 py-2 rounded-xl text-xs font-bold text-white shadow-lg shadow-indigo-600/20 cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
          >
            <Download size={14} />
            <span>Download PDF</span>
          </button>
        </div>
      </header>

      {/* Workspace columns */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Column: Form Editor */}
        <main className="no-print w-[24%] border-r border-dark-border bg-dark-card/50 overflow-y-auto p-5 shrink-0">
          <ResumeEditor 
            data={activeResume} 
            onChange={handleResumeChange} 
            onAIEnhance={handleAIEnhanceRequest}
          />
        </main>

        {/* Center Column: Live Sheet Preview */}
        <section className="no-print flex-1 bg-slate-950/60 overflow-y-auto p-8 flex flex-col items-center">
          <div className="mb-4 flex items-center justify-between w-[210mm] max-w-full text-xs text-gray-400">
            <span>Interactive Preview Canvas</span>
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
