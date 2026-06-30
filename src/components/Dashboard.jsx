import React, { useState, useRef } from "react";
import { 
  FileText, Plus, Upload, Brain, LogOut, Trash2, Edit2, Calendar, Layout, 
  ArrowRight, RefreshCw, X, ChevronRight, Download, Sparkles 
} from "lucide-react";
import { INITIAL_RESUME_DATA } from "../types/resume";

export default function Dashboard({ username, resumes, onCreateNew, onSelect, onDelete, onRename, onImportJson, onLogout }) {
  const [isParsingText, setIsParsingText] = useState(false);
  const [rawResumeText, setRawResumeText] = useState("");
  const [parserError, setParserError] = useState("");
  const [isParserOpen, setIsParserOpen] = useState(false);
  
  const fileInputRef = useRef(null);

  // Trigger JSON file reader
  const handleJsonUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        // Basic schema checks
        if (parsed.personalInfo && parsed.layoutSettings) {
          onImportJson(parsed);
          e.target.value = null; // Reset
        } else {
          alert("Invalid file format: Stated file does not conform to ApexCV schema.");
        }
      } catch (err) {
        alert("Failed to parse JSON file.");
      }
    };
    reader.readAsText(file);
  };

  // Hugging Face AI Unstructured Text Resume Parser
  const handleAIParse = async () => {
    setParserError("");
    setIsParsingText(true);

    const systemPrompt = `You are a professional resume parsing engine. Your job is to extract data from the user's raw, unstructured resume text and return it as a structured JSON object matching this exact schema:
{
  "personalInfo": {
    "firstName": "string",
    "lastName": "string",
    "title": "string (e.g. Software Engineer)",
    "email": "string",
    "phone": "string",
    "location": "string",
    "website": "string",
    "linkedin": "string",
    "github": "string",
    "summary": "string"
  },
  "experience": [
    {
      "company": "string",
      "role": "string",
      "location": "string",
      "startDate": "string (YYYY-MM)",
      "endDate": "string (YYYY-MM or Present)",
      "description": "string (bullet points separated by newlines)"
    }
  ],
  "education": [
    {
      "institution": "string",
      "degree": "string",
      "fieldOfStudy": "string",
      "location": "string",
      "graduationDate": "string",
      "details": "string"
    }
  ],
  "projects": [
    {
      "title": "string",
      "techStack": "string",
      "link": "string",
      "description": "string"
    }
  ],
  "skills": [
    {
      "category": "string (e.g. Languages)",
      "items": "string (comma separated list)"
    }
  ],
  "certifications": [
    {
      "name": "string",
      "issuer": "string",
      "date": "string",
      "link": "string"
    }
  ]
}

Return ONLY the valid JSON block. Do not include markdown code block syntax.`;

    const token = localStorage.getItem("hf_token");
    const isDemo = localStorage.getItem("hf_is_demo") !== "false";

    if (isDemo || !token) {
      // Demo Mode Regex Parsing + Pre-populated structure
      setTimeout(() => {
        try {
          const emailMatch = rawResumeText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
          const phoneMatch = rawResumeText.match(/\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}/);
          
          // Try to guess name from first line
          const lines = rawResumeText.split("\n").map(l => l.trim()).filter(l => l !== "");
          const nameLine = lines[0] || "Jane Applicant";
          const nameParts = nameLine.split(/\s+/);
          const firstName = nameParts[0] || "Jane";
          const lastName = nameParts.slice(1).join(" ") || "Doe";

          const parsedData = {
            personalInfo: {
              firstName,
              lastName,
              title: "Software Engineer",
              email: emailMatch ? emailMatch[0] : "parsed.email@example.com",
              phone: phoneMatch ? phoneMatch[0] : "+1 (555) 019-2834",
              location: "New York, NY",
              website: "https://janedoe.dev",
              linkedin: "linkedin.com/in/janedoe",
              github: "github.com/janedoe",
              summary: "A motivated technology professional with experience building robust client-side software systems. Experienced in collaborating within cross-functional environments to implement modern features."
            },
            experience: [
              {
                id: "exp-1",
                company: "Tech Systems Inc.",
                role: "Frontend Developer",
                location: "New York, NY",
                startDate: "2023-01",
                endDate: "Present",
                description: "• Engineered web applications utilizing React and state management strategies.\n• Optimized CSS modules raising performance ratings by 20%.\n• Designed scalable RESTful controllers."
              }
            ],
            education: [
              {
                id: "edu-1",
                institution: "State University",
                degree: "B.S. in Computer Science",
                fieldOfStudy: "Computer Science",
                location: "New York, NY",
                graduationDate: "2022-12",
                details: "Honors Graduate. Focus on Software Engineering systems."
              }
            ],
            projects: [
              {
                id: "proj-1",
                title: "Portfolio website",
                techStack: "React, Tailwind",
                link: "",
                description: "• Built responsive developer portfolios showcasing dynamic project cards."
              }
            ],
            skills: [
              { id: "skill-1", category: "Languages & Frameworks", items: "JavaScript, React, CSS, HTML" },
              { id: "skill-2", category: "Tools", items: "Git, npm, VS Code" }
            ],
            certifications: [],
            layoutSettings: {
              template: "modern",
              primaryColor: "#0f172a",
              accentColor: "#2563eb",
              fontSize: "sm",
              spacing: "normal",
              fontFamily: "sans"
            }
          };

          onImportJson(parsedData);
          setIsParserOpen(false);
          setRawResumeText("");
        } catch (e) {
          setParserError("Failed to extract details from demo text.");
        } finally {
          setIsParsingText(false);
        }
      }, 1500);
      return;
    }

    // Live HF Router Call
    try {
      const response = await fetch("https://router.huggingface.co/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "Qwen/Qwen2.5-7B-Instruct",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Please parse this resume text:\n\n${rawResumeText}` }
          ],
          temperature: 0.2
        })
      });

      if (!response.ok) throw new Error("Inference API error.");

      const result = await response.json();
      const reply = result.choices?.[0]?.message?.content || "";
      
      const jsonStart = reply.indexOf("{");
      const jsonEnd = reply.lastIndexOf("}") + 1;
      const parsed = JSON.parse(reply.substring(jsonStart, jsonEnd));
      
      // Inject unique IDs
      const enrichId = (list, prefix) => 
        (list || []).map((item, i) => ({ ...item, id: `${prefix}-${Date.now()}-${i}` }));

      const enriched = {
        ...parsed,
        experience: enrichId(parsed.experience, "exp"),
        education: enrichId(parsed.education, "edu"),
        projects: enrichId(parsed.projects, "proj"),
        skills: enrichId(parsed.skills, "skill"),
        certifications: enrichId(parsed.certifications, "cert"),
        layoutSettings: parsed.layoutSettings || {
          template: "modern",
          primaryColor: "#0f172a",
          accentColor: "#2563eb",
          fontSize: "sm",
          spacing: "normal",
          fontFamily: "sans"
        }
      };

      onImportJson(enriched);
      setIsParserOpen(false);
      setRawResumeText("");
    } catch (err) {
      setParserError(`Failed to parse: ${err.message}. Ensure valid API credentials, or toggle Demo Mode in header settings.`);
    } finally {
      setIsParsingText(false);
    }
  };

  const handleExportBackup = (resume) => {
    const str = JSON.stringify(resume, null, 2);
    const blob = new Blob([str], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${resume.title || "resume"}_backup.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-inter">
      {/* Glow Effects */}
      <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />

      {/* Top Navbar */}
      <header className="border-b border-dark-border bg-dark-card/90 backdrop-blur px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <FileText className="text-white" size={18} />
          </div>
          <div>
            <h1 className="font-outfit font-extrabold text-base tracking-wide text-white leading-tight">
              ApexCV Workspace
            </h1>
            <p className="text-[10px] text-gray-400 mt-0.5">Welcome back, <span className="font-bold text-gray-200">{username}</span></p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="flex items-center gap-2 border border-dark-border hover:bg-red-500/10 hover:border-red-500/30 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-400 hover:text-red-400 cursor-pointer transition-colors"
        >
          <LogOut size={13} />
          <span>Sign Out</span>
        </button>
      </header>

      {/* Main Workspace Dashboard Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-6 md:p-8 space-y-8">
        
        {/* Creator Actions Header */}
        <div className="bg-dark-card border border-dark-border rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Sparkles size={18} className="text-indigo-400" /> Start Building
            </h2>
            <p className="text-xs text-gray-400 mt-1 max-w-md">
              Create a resume using optimized design templates, upload your previous JSON backups, or let the AI parse your raw CV text automatically.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 relative z-10">
            
            <button
              onClick={() => onCreateNew(INITIAL_RESUME_DATA, "Sample Template Resume")}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs py-2.5 px-4 rounded-xl flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/10 transition-colors"
            >
              <Plus size={15} />
              <span>Use Sample Template</span>
            </button>

            <button
              onClick={() => onCreateNew({
                personalInfo: { firstName: "", lastName: "", title: "", email: "", phone: "", location: "", website: "", linkedin: "", github: "", summary: "" },
                experience: [], education: [], projects: [], skills: [], certifications: [],
                layoutSettings: { template: "modern", primaryColor: "#0f172a", accentColor: "#2563eb", fontSize: "sm", spacing: "normal", fontFamily: "sans" }
              }, "My New Resume")}
              className="border border-dark-border hover:border-gray-500 bg-slate-900/40 text-gray-300 hover:text-white font-semibold text-xs py-2.5 px-4 rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Plus size={15} />
              <span>Blank Slate</span>
            </button>

            <button
              onClick={() => fileInputRef.current.click()}
              className="border border-dark-border hover:border-gray-500 bg-slate-900/40 text-gray-300 hover:text-white font-semibold text-xs py-2.5 px-4 rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Upload size={14} />
              <span>Upload Backup (.json)</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleJsonUpload}
              accept=".json"
              className="hidden"
            />

            <button
              onClick={() => setIsParserOpen(true)}
              className="border border-indigo-500/30 hover:border-indigo-400 bg-indigo-500/10 text-indigo-400 hover:text-indigo-300 font-bold text-xs py-2.5 px-4 rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
            >
              <Brain size={14} />
              <span>AI Resume Parser</span>
            </button>

          </div>
        </div>

        {/* AI Parser Modal */}
        {isParserOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl bg-dark-card border border-dark-border rounded-2xl shadow-2xl overflow-hidden flex flex-col">
              
              {/* Modal Header */}
              <div className="p-4 border-b border-dark-border bg-slate-900/60 flex items-center justify-between">
                <div className="flex items-center gap-2 text-indigo-400">
                  <Brain size={18} />
                  <h3 className="font-bold text-sm text-white">AI Raw Resume Parser</h3>
                </div>
                <button onClick={() => setIsParserOpen(false)} className="text-gray-400 hover:text-white p-1">
                  <X size={16} />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-5 space-y-4">
                <p className="text-xs text-gray-400">
                  Paste the text copy of your existing resume/CV below. Our LLM will scan it to extract structural details (contact fields, jobs list, education, projects, skills) and load it into a customizable layout.
                </p>

                {parserError && (
                  <div className="bg-red-950/40 border border-red-900/50 text-xs text-red-300 p-3 rounded-xl">
                    {parserError}
                  </div>
                )}

                <textarea
                  value={rawResumeText}
                  onChange={(e) => setRawResumeText(e.target.value)}
                  rows={10}
                  className="w-full bg-slate-900 border border-dark-border rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none font-mono leading-relaxed"
                  placeholder="Paste raw text here... e.g. John Doe, London, UK. Work Experience: Lead Engineer at InnovateTech 2021 - Present..."
                />
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-dark-border bg-slate-900/40 flex justify-end gap-3">
                <button
                  onClick={() => setIsParserOpen(false)}
                  className="px-4 py-2 border border-dark-border hover:bg-slate-800 rounded-xl text-xs font-semibold text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAIParse}
                  disabled={isParsingText || !rawResumeText.trim()}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 rounded-xl text-xs font-bold text-white flex items-center gap-2 cursor-pointer transition-colors"
                >
                  {isParsingText ? (
                    <>
                      <RefreshCw className="animate-spin" size={13} /> Parsing Resume...
                    </>
                  ) : (
                    <>
                      <Sparkles size={13} /> Start AI Parser
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Resumes Grid */}
        <div className="space-y-4">
          <h3 className="font-outfit font-bold text-base text-white">Your Resumes ({resumes.length})</h3>
          
          {resumes.length === 0 ? (
            <div className="text-center py-16 bg-dark-card/30 border border-dashed border-dark-border rounded-2xl">
              <FileText className="text-gray-600 mx-auto mb-3" size={32} />
              <p className="text-sm font-semibold text-gray-400">No resumes found</p>
              <p className="text-xs text-gray-500 mt-1">Create your first resume using the creator buttons above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {resumes.map((resume) => (
                <div 
                  key={resume.id}
                  className="bg-dark-card border border-dark-border rounded-2xl p-5 hover:border-indigo-500/50 shadow-lg hover:shadow-indigo-600/5 transition-all flex flex-col group"
                >
                  {/* Card Header */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-sm text-white group-hover:text-indigo-400 transition-colors truncate w-4/5">
                        {resume.title}
                      </h4>
                      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => {
                            const newName = prompt("Rename Resume file:", resume.title);
                            if (newName && newName.trim()) onRename(resume.id, newName.trim());
                          }}
                          title="Rename file"
                          className="p-1 hover:bg-slate-800 text-gray-400 hover:text-white rounded"
                        >
                          <Edit2 size={12} />
                        </button>
                        <button
                          onClick={() => handleExportBackup(resume)}
                          title="Export backup (.json)"
                          className="p-1 hover:bg-slate-800 text-gray-400 hover:text-white rounded"
                        >
                          <Download size={12} />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm("Are you sure you want to delete this resume?")) {
                              onDelete(resume.id);
                            }
                          }}
                          title="Delete resume"
                          className="p-1 hover:bg-slate-800 text-red-500 hover:text-red-400 rounded"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-gray-400 font-medium">
                      <div className="flex items-center gap-2">
                        <Layout size={12} className="text-gray-500" />
                        <span>Style: <span className="text-gray-300 capitalize">{resume.layoutSettings.template}</span></span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={12} className="text-gray-500" />
                        <span>Updated: <span className="text-gray-300">{new Date(resume.updatedAt).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}</span></span>
                      </div>
                    </div>
                  </div>

                  {/* Edit Link */}
                  <button
                    onClick={() => onSelect(resume)}
                    className="w-full flex items-center justify-between border border-dark-border group-hover:border-indigo-500/40 bg-slate-900/30 group-hover:bg-indigo-600/10 p-2.5 rounded-xl text-xs font-semibold text-gray-300 group-hover:text-indigo-400 transition-all cursor-pointer mt-4"
                  >
                    <span>Edit Resume Details</span>
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
