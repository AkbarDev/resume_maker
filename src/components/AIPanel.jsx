import React, { useState, useEffect } from "react";
import { Sparkles, Key, AlertTriangle, Check, RefreshCw, Send, HelpCircle, FileText } from "lucide-react";

export default function AIPanel({ resumeData, onApplyChange, activeRequest, onCloseActiveRequest }) {
  const [token, setToken] = useState(() => localStorage.getItem("hf_token") || "");
  const [isDemo, setIsDemo] = useState(() => localStorage.getItem("hf_is_demo") !== "false");
  const [selectedModel, setSelectedModel] = useState("Qwen/Qwen2.5-7B-Instruct");
  const [targetJobDesc, setTargetJobDesc] = useState("");
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [atsScoreReport, setAtsScoreReport] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("optimize"); // optimize, ats, summary

  // Load active request from editor buttons (e.g. AI Refine Summary, AI Bullet Optimizer)
  useEffect(() => {
    if (activeRequest) {
      setInputText(activeRequest.text || "");
      if (activeRequest.type === "summary") {
        setActiveTab("summary");
      } else {
        setActiveTab("optimize");
      }
    }
  }, [activeRequest]);

  const saveTokenSettings = (newToken, demoMode) => {
    setToken(newToken);
    setIsDemo(demoMode);
    localStorage.setItem("hf_token", newToken);
    localStorage.setItem("hf_is_demo", demoMode.toString());
  };

  // Realistic mock responses for Demo Mode
  const getDemoResponse = (type, promptText) => {
    if (type === "optimize") {
      const bulletPoints = promptText.split("\n");
      const optimized = bulletPoints.map(bullet => {
        const text = bullet.replace(/^[•\-\s]*/, "").trim();
        if (!text) return "";
        if (text.toLowerCase().includes("wrote code") || text.toLowerCase().includes("built website")) {
          return "• Engineered and launched responsive web interfaces using React and TailwindCSS, reducing load times by 35% and boosting monthly active users by 18%.";
        }
        if (text.toLowerCase().includes("led") || text.toLowerCase().includes("managed")) {
          return "• Spearheaded a cross-functional squad of 6 software developers to deliver enterprise SaaS endpoints, executing deployment cycles 80% faster through CI/CD optimization.";
        }
        if (text.toLowerCase().includes("fixed") || text.toLowerCase().includes("optimized")) {
          return "• Refactored database schemas and implemented Redis query caching, reducing API latencies by 45% and sustaining 10k+ concurrent transactions.";
        }
        // General rewrite fallback
        return `• Spearheaded design and integration of high-impact features, resulting in a 24% boost in system performance and streamlining operational workflows by 15 hours/week.`;
      });
      return optimized.filter(b => b !== "").join("\n");
    }
    
    if (type === "summary") {
      const title = resumeData.personalInfo.title || "Software Professional";
      const name = resumeData.personalInfo.firstName || "Applicant";
      const skillsList = resumeData.skills.map(s => s.items).join(", ");
      return `Results-driven ${title} with a proven track record of designing and deploying highly scalable software solutions. Expert in leveraging technical resources to optimize application performance, orchestrate cloud integrations, and lead cross-functional development sprints. Technical proficiencies include: ${skillsList.substring(0, 100)}... Champion of clean code practices, automated CI/CD configurations, and aligning product capabilities directly with enterprise business initiatives.`;
    }

    if (type === "ats") {
      // Mock ATS scoring
      const keywordsFound = ["React", "Node.js", "CI/CD", "AWS", "SQL", "Git"];
      const keywordsMissing = ["Docker", "Kubernetes", "Microservices", "System Design", "Agile"];
      const score = Math.floor(Math.random() * 25) + 65; // 65 to 89
      return {
        score,
        keywordsFound,
        keywordsMissing,
        critique: "The resume contains solid experience descriptions, but suffers from lack of specific quantitative achievements in later job details. Job description highlights keywords like 'Kubernetes' and 'System Design' which are absent in your skills structure.",
        recommendations: [
          "Incorporate 2-3 bullet items containing metrics regarding project scaling or cost optimization.",
          "Add 'Docker' and 'Kubernetes' to your Tools & Cloud skills row if you have relevant experience.",
          "Tailor the professional summary to mention enterprise system architecture."
        ]
      };
    }
  };

  const handleAISubmit = async () => {
    setError("");
    setOutputText("");
    setAtsScoreReport(null);
    setIsLoading(true);

    // Prompt construction
    let systemPrompt = "";
    let userPrompt = "";

    if (activeTab === "optimize") {
      systemPrompt = "You are a professional resume writer and ATS optimization expert. Your task is to rewrite the user's resume bullet points to use strong action verbs, quantifiable achievements, and metrics. Keep it highly professional, concise, and structured as bullet points starting with '•'.";
      userPrompt = `Please optimize the following bullet point(s) for a resume. If applicable, keep in mind this role: ${activeRequest?.context || resumeData.personalInfo.title}:\n\n${inputText}`;
    } else if (activeTab === "summary") {
      systemPrompt = "You are a professional resume writing assistant. Your task is to write a highly professional, 3-4 sentence CV summary statement based on the user's profile.";
      userPrompt = `Write an optimized professional summary using this candidate info:
Name: ${resumeData.personalInfo.firstName} ${resumeData.personalInfo.lastName}
Title: ${resumeData.personalInfo.title}
Key Skills: ${resumeData.skills.map(s => `${s.category}: ${s.items}`).join(" | ")}
Experience Summary: ${resumeData.personalInfo.summary || "Not provided"}

Make it punchy, executive-ready, and ATS-friendly.`;
    } else if (activeTab === "ats") {
      systemPrompt = "You are an Applicant Tracking System (ATS) parser and resume checker. Compare the resume against the job description and output a JSON response containing: score (0-100), keywordsFound (array), keywordsMissing (array), critique (string), and recommendations (array of strings). Return ONLY the valid JSON block.";
      userPrompt = `RESUME TEXT:
Personal summary: ${resumeData.personalInfo.summary}
Experience: ${resumeData.experience.map(e => `${e.role} at ${e.company}: ${e.description}`).join("\n\n")}
Skills: ${resumeData.skills.map(s => s.items).join(", ")}

JOB DESCRIPTION:
${targetJobDesc}`;
    }

    // 1. DEMO MODE FALLBACK
    if (isDemo || !token) {
      setTimeout(() => {
        try {
          const res = getDemoResponse(activeTab, activeTab === "ats" ? targetJobDesc : inputText);
          if (activeTab === "ats") {
            setAtsScoreReport(res);
          } else {
            setOutputText(res);
          }
        } catch (err) {
          setError("Failed to generate demo content.");
        } finally {
          setIsLoading(false);
        }
      }, 1000);
      return;
    }

    // 2. LIVE HUGGING FACE CALL
    try {
      const isLegacy = selectedModel === "vsr9awc/resume-optimizer";
      
      let response;
      if (isLegacy) {
        // legacy pipeline endpoint
        response = await fetch(`https://api-inference.huggingface.co/models/${selectedModel}`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            inputs: `[Instruction] Optimize these resume bullets to be ATS-ready:\n[Original] ${inputText}\n[Optimized]`,
            parameters: { max_new_tokens: 300, temperature: 0.7 }
          })
        });
      } else {
        // router OpenAI endpoint
        response = await fetch("https://router.huggingface.co/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            model: selectedModel,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: userPrompt }
            ],
            temperature: 0.7,
            max_tokens: 800
          })
        });
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (isLegacy) {
        const fullOutput = result[0]?.generated_text || "";
        // Strip the prompt
        const clean = fullOutput.split("[Optimized]")?.[1] || fullOutput;
        setOutputText(clean.trim());
      } else {
        const reply = result.choices?.[0]?.message?.content || "";
        if (activeTab === "ats") {
          // Parse JSON block from LLM response
          try {
            const jsonStart = reply.indexOf("{");
            const jsonEnd = reply.lastIndexOf("}") + 1;
            const parsed = JSON.parse(reply.substring(jsonStart, jsonEnd));
            setAtsScoreReport(parsed);
          } catch (e) {
            // parsing failed, treat whole thing as recommendation text
            setAtsScoreReport({
              score: 72,
              keywordsFound: ["General skills matched"],
              keywordsMissing: ["Check job requirements"],
              critique: reply,
              recommendations: ["Review LLM output details directly."]
            });
          }
        } else {
          setOutputText(reply.trim());
        }
      }
    } catch (err) {
      console.error(err);
      setError(`HF API Call Failed: ${err.message}. (Falling back to Demo Mode works!)`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (activeTab === "optimize" && activeRequest) {
      onApplyChange(activeRequest.type, outputText, activeRequest.id);
    } else if (activeTab === "summary") {
      onApplyChange("summary", outputText);
    }
    onCloseActiveRequest();
    setOutputText("");
  };

  return (
    <div className="bg-dark-card border border-dark-border rounded-2xl flex flex-col h-full overflow-hidden text-gray-200">
      
      {/* Header */}
      <div className="p-4 border-b border-dark-border bg-slate-900/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="text-indigo-400 animate-pulse" size={18} />
          <h2 className="font-bold text-sm tracking-wide text-white">AI ATS Resume Assistant</h2>
        </div>
        <div className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-full font-semibold">
          HF OpenSource LLM
        </div>
      </div>

      {/* Settings / API Key Segment */}
      <div className="p-3 bg-slate-950/40 border-b border-dark-border/70 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-gray-400 flex items-center gap-1">
            <Key size={12} /> HF Router Config
          </span>
          <label className="flex items-center gap-1 cursor-pointer">
            <input
              type="checkbox"
              checked={isDemo}
              onChange={(e) => saveTokenSettings(token, e.target.checked)}
              className="rounded bg-slate-900 border-dark-border focus:ring-0 w-3 h-3 text-indigo-600"
            />
            <span className="text-gray-400 font-bold select-none text-[10px]">Demo Mode</span>
          </label>
        </div>

        {!isDemo && (
          <div className="space-y-1.5">
            <input
              type="password"
              value={token}
              onChange={(e) => saveTokenSettings(e.target.value, isDemo)}
              placeholder="Paste Hugging Face API Token (hf_...)"
              className="w-full bg-slate-900 border border-dark-border rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-indigo-500 font-mono"
            />
            <div className="flex justify-between items-center text-[10px] text-gray-500">
              <span>Securely stored locally</span>
              <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noreferrer" className="underline hover:text-gray-300">
                Get a free token
              </a>
            </div>
          </div>
        )}

        {/* Model Picker */}
        <div className="grid grid-cols-3 gap-1">
          {[
            { id: "Qwen/Qwen2.5-7B-Instruct", label: "Qwen 2.5" },
            { id: "meta-llama/Llama-3-8B-Instruct", label: "Llama 3" },
            { id: "vsr9awc/resume-optimizer", label: "ResumeOpt" }
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedModel(m.id)}
              className={`py-1 px-1 text-[9px] rounded font-semibold text-center border transition-all ${
                selectedModel === m.id
                  ? "border-indigo-500 bg-indigo-500/10 text-white"
                  : "border-dark-border bg-slate-900/30 text-gray-400 hover:border-gray-600"
              }`}
              title={m.id}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation tabs */}
      <div className="flex bg-slate-900 border-b border-dark-border text-xs">
        <button
          onClick={() => setActiveTab("optimize")}
          className={`flex-1 py-2 text-center font-semibold border-b-2 transition-all ${
            activeTab === "optimize"
              ? "border-indigo-500 text-white bg-dark-card"
              : "border-transparent text-gray-400 hover:text-white"
          }`}
        >
          Optimize Bullets
        </button>
        <button
          onClick={() => setActiveTab("ats")}
          className={`flex-1 py-2 text-center font-semibold border-b-2 transition-all ${
            activeTab === "ats"
              ? "border-indigo-500 text-white bg-dark-card"
              : "border-transparent text-gray-400 hover:text-white"
          }`}
        >
          ATS Scanner
        </button>
        <button
          onClick={() => setActiveTab("summary")}
          className={`flex-1 py-2 text-center font-semibold border-b-2 transition-all ${
            activeTab === "summary"
              ? "border-indigo-500 text-white bg-dark-card"
              : "border-transparent text-gray-400 hover:text-white"
          }`}
        >
          AI Summary
        </button>
      </div>

      {/* Main Drawer Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {error && (
          <div className="flex gap-2 bg-red-950/40 border border-red-900/50 p-3 rounded-xl text-xs text-red-300">
            <AlertTriangle className="shrink-0" size={14} />
            <span>{error}</span>
          </div>
        )}

        {/* Tab content 1: Bullet Points */}
        {activeTab === "optimize" && (
          <div className="space-y-3">
            <div className="text-xs text-gray-400">
              Rewrite weak resume bullet points to emphasize action verbs, impact metrics, and technical expertise.
            </div>

            {activeRequest && (
              <div className="bg-indigo-500/5 border border-indigo-500/20 p-2 rounded-lg text-[10px] text-indigo-300">
                Editing source context: <span className="font-bold">{activeRequest.context}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Your Draft Bullet Point(s)</label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={3}
                className="w-full bg-slate-900 border border-dark-border rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none font-mono"
                placeholder="e.g. Worked on scaling database queries and built backend systems using Node."
              />
            </div>

            <button
              onClick={handleAISubmit}
              disabled={isLoading || !inputText.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 py-2 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 cursor-pointer transition-all duration-150"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="animate-spin" size={13} /> Optimizing Bullets...
                </>
              ) : (
                <>
                  <Sparkles size={13} /> Run AI Optimization
                </>
              )}
            </button>

            {outputText && (
              <div className="space-y-2 mt-4">
                <div className="flex justify-between items-center text-xs font-semibold text-gray-400">
                  <span>ATS-Optimized Suggestion:</span>
                  <span className="text-[10px] text-green-400">Improved Verb Selection</span>
                </div>
                <div className="bg-slate-900 border border-dark-border p-3 rounded-lg text-xs leading-relaxed text-slate-100 font-mono select-all">
                  {outputText}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleApply}
                    className="flex-1 bg-green-600 hover:bg-green-500 py-1.5 rounded-lg text-xs font-bold text-white flex items-center justify-center gap-1 cursor-pointer transition-all"
                  >
                    <Check size={13} /> Apply to Resume
                  </button>
                  <button
                    onClick={() => { setOutputText(""); onCloseActiveRequest(); }}
                    className="px-3 border border-dark-border hover:bg-slate-800 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white transition-all"
                  >
                    Discard
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab content 2: ATS Scanner */}
        {activeTab === "ats" && (
          <div className="space-y-3">
            <div className="text-xs text-gray-400">
              Provide the target Job Description. We will analyze your entire resume content against it to compute a match score and locate missing keywords.
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Target Job Description</label>
              <textarea
                value={targetJobDesc}
                onChange={(e) => setTargetJobDesc(e.target.value)}
                rows={5}
                className="w-full bg-slate-900 border border-dark-border rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none font-mono"
                placeholder="Paste the target job requirement details here to audit matching alignment..."
              />
            </div>

            <button
              onClick={handleAISubmit}
              disabled={isLoading || !targetJobDesc.trim()}
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 py-2 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 cursor-pointer transition-all duration-150"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="animate-spin" size={13} /> Analyzing Resume Match...
                </>
              ) : (
                <>
                  <FileText size={13} /> Run ATS Scanner
                </>
              )}
            </button>

            {atsScoreReport && (
              <div className="space-y-4 border border-dark-border p-4 bg-slate-900/60 rounded-xl mt-4">
                {/* Score Circle */}
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-full border-4 flex items-center justify-center font-bold text-lg shrink-0 ${
                    atsScoreReport.score >= 80 ? "border-green-500 text-green-400" :
                    atsScoreReport.score >= 60 ? "border-yellow-500 text-yellow-400" :
                    "border-red-500 text-red-400"
                  }`}>
                    {atsScoreReport.score}%
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white">ATS Alignment Rating</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5">Estimated match quality for corporate screeners.</p>
                  </div>
                </div>

                {/* Critique */}
                <div className="text-xs space-y-1">
                  <span className="font-bold text-gray-300">ATS Critique:</span>
                  <p className="text-gray-400 leading-relaxed bg-slate-900 p-2.5 rounded border border-dark-border/40 font-mono text-[11px]">
                    {atsScoreReport.critique}
                  </p>
                </div>

                {/* Keywords Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="font-bold text-green-400 block mb-1">Keywords Found:</span>
                    <div className="flex flex-wrap gap-1">
                      {atsScoreReport.keywordsFound.map((kw, i) => (
                        <span key={i} className="text-[9px] bg-green-500/10 border border-green-500/20 text-green-300 px-1.5 py-0.5 rounded font-semibold">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="font-bold text-red-400 block mb-1">Missing Keywords:</span>
                    <div className="flex flex-wrap gap-1">
                      {atsScoreReport.keywordsMissing.map((kw, i) => (
                        <span key={i} className="text-[9px] bg-red-500/10 border border-red-500/20 text-red-300 px-1.5 py-0.5 rounded font-semibold">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="space-y-1.5 text-xs">
                  <span className="font-bold text-gray-300">Action Recommendations:</span>
                  <ul className="list-disc pl-4 text-gray-400 space-y-1 text-[11px]">
                    {atsScoreReport.recommendations.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab content 3: AI Summary */}
        {activeTab === "summary" && (
          <div className="space-y-3">
            <div className="text-xs text-gray-400">
              Generate a compelling professional summary statement based on the experience roles and technical skills filled out in your editor.
            </div>

            <button
              onClick={handleAISubmit}
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 py-2 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-2 cursor-pointer transition-all duration-150"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="animate-spin" size={13} /> Generating Summary...
                </>
              ) : (
                <>
                  <Sparkles size={13} /> Draft Professional Summary
                </>
              )}
            </button>

            {outputText && (
              <div className="space-y-2 mt-4">
                <div className="flex justify-between items-center text-xs font-semibold text-gray-400">
                  <span>Generated Summary Statement:</span>
                  <span className="text-[10px] text-green-400">ATS Optimized</span>
                </div>
                <div className="bg-slate-900 border border-dark-border p-3 rounded-lg text-xs leading-relaxed text-slate-100 font-mono select-all">
                  {outputText}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleApply}
                    className="flex-1 bg-green-600 hover:bg-green-500 py-1.5 rounded-lg text-xs font-bold text-white flex items-center justify-center gap-1 cursor-pointer transition-all"
                  >
                    <Check size={13} /> Apply Summary
                  </button>
                  <button
                    onClick={() => { setOutputText(""); onCloseActiveRequest(); }}
                    className="px-3 border border-dark-border hover:bg-slate-800 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white transition-all"
                  >
                    Discard
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer / Demo Disclaimer */}
      {isDemo && (
        <div className="p-3 border-t border-dark-border/40 bg-slate-950/30 text-[10px] text-gray-500 flex items-center gap-1.5">
          <HelpCircle size={12} className="text-indigo-400 shrink-0" />
          <span>Currently operating in <strong>Demo Mode</strong> (simulated responses). Toggle off in header settings to use live HF token.</span>
        </div>
      )}

    </div>
  );
}
