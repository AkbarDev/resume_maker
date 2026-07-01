import React, { useState } from "react";
import { 
  Palette, Sliders, Settings, Check, Sparkles, AlertTriangle, Key, Plus, Trash2, 
  ArrowLeft, ArrowRight, ArrowUp, ArrowDown, Eye, ShieldCheck, Info
} from "lucide-react";
import { COLOR_PRESETS, FONTS } from "../types/resume";

export default function ResumeEditor({ data, onChange, onAIEnhance }) {
  const [activeTab, setActiveTab] = useState("design"); // design, sections, aiSettings

  // Hugging Face details (kept in LocalStorage)
  const [token, setToken] = useState(() => localStorage.getItem("hf_token") || "");
  const [isDemo, setIsDemo] = useState(() => localStorage.getItem("hf_is_demo") !== "false");

  const handleLayoutChange = (key, value) => {
    onChange({
      ...data,
      layoutSettings: {
        ...data.layoutSettings,
        [key]: value
      }
    });
  };

  const handleSaveHuggingFace = (newToken, demoMode) => {
    setToken(newToken);
    setIsDemo(demoMode);
    localStorage.setItem("hf_token", newToken);
    localStorage.setItem("hf_is_demo", demoMode.toString());
  };

  // Section toggle helper (visibility is tracked in layoutSettings.disabledSections)
  const disabledSections = data.layoutSettings?.disabledSections || [];
  
  const toggleSectionVisibility = (sectionId) => {
    let updated;
    if (disabledSections.includes(sectionId)) {
      updated = disabledSections.filter(id => id !== sectionId);
    } else {
      updated = [...disabledSections, sectionId];
    }
    handleLayoutChange("disabledSections", updated);
  };

  // Move section between Left and Right columns
  const moveSectionColumn = (sectionId, targetColumn) => {
    const leftCols = data.layoutSettings?.leftColumnSections || [];
    const rightCols = data.layoutSettings?.rightColumnSections || [];

    let newLeft = [...leftCols];
    let newRight = [...rightCols];

    if (targetColumn === "right") {
      newLeft = newLeft.filter(id => id !== sectionId);
      if (!newRight.includes(sectionId)) newRight.push(sectionId);
    } else {
      newRight = newRight.filter(id => id !== sectionId);
      if (!newLeft.includes(sectionId)) newLeft.push(sectionId);
    }

    onChange({
      ...data,
      layoutSettings: {
        ...data.layoutSettings,
        leftColumnSections: newLeft,
        rightColumnSections: newRight
      }
    });
  };

  // Move section position up/down inside its column list
  const moveSectionOrder = (sectionId, column, direction) => {
    const columnKey = column === "left" ? "leftColumnSections" : "rightColumnSections";
    const sectionList = [...(data.layoutSettings?.[columnKey] || [])];
    const index = sectionList.indexOf(sectionId);
    if (index === -1) return;

    if (direction === "up" && index > 0) {
      const temp = sectionList[index];
      sectionList[index] = sectionList[index - 1];
      sectionList[index - 1] = temp;
    } else if (direction === "down" && index < sectionList.length - 1) {
      const temp = sectionList[index];
      sectionList[index] = sectionList[index + 1];
      sectionList[index + 1] = temp;
    }

    handleLayoutChange(columnKey, sectionList);
  };

  // Single column section reorder
  const moveSingleColumnOrder = (sectionId, direction) => {
    const sectionOrder = [...(data.layoutSettings?.sectionOrder || [])];
    const index = sectionOrder.indexOf(sectionId);
    if (index === -1) return;

    if (direction === "up" && index > 0) {
      const temp = sectionOrder[index];
      sectionOrder[index] = sectionOrder[index - 1];
      sectionOrder[index - 1] = temp;
    } else if (direction === "down" && index < sectionOrder.length - 1) {
      const temp = sectionOrder[index];
      sectionOrder[index] = sectionOrder[index + 1];
      sectionOrder[index + 1] = temp;
    }
    handleLayoutChange("sectionOrder", sectionOrder);
  };

  // Create new Custom Section
  const handleAddCustomSection = () => {
    const title = prompt("Enter Custom Section Title:", "Additional Information");
    if (!title) return;

    const sectionId = `custom_${Date.now()}`;
    const newCustomSectionObj = {
      id: sectionId,
      title: title,
      items: [
        { id: `citem-${Date.now()}`, title: "Item Title", subtitle: "Subtitle", date: "2024", description: "Details or bullet points..." }
      ]
    };

    // Add to custom sections state list
    const updatedCustoms = [...(data.customSections || []), newCustomSectionObj];
    
    // Add to layout settings columns list (Left Column by default)
    const updatedLeft = [...(data.layoutSettings?.leftColumnSections || []), sectionId];
    const updatedOrder = [...(data.layoutSettings?.sectionOrder || []), sectionId];

    onChange({
      ...data,
      customSections: updatedCustoms,
      layoutSettings: {
        ...data.layoutSettings,
        leftColumnSections: updatedLeft,
        sectionOrder: updatedOrder
      }
    });
  };

  const getSectionLabel = (id) => {
    if (id.startsWith("custom_")) {
      const cust = data.customSections?.find(c => c.id === id);
      return cust ? cust.title : "Custom Section";
    }
    const labels = {
      summary: "Summary Profile",
      experience: "Work Experience",
      education: "Education History",
      projects: "Featured Projects",
      skills: "Skills & Expertise",
      certifications: "Certifications",
      strengths: "Strengths & Talents",
      languages: "Languages Spoken",
      achievements: "Achievements",
      passions: "Passions & Hobbies",
      books: "Books Read",
      quotes: "Favorite Quotes",
      dayInLife: "A Day in My Life"
    };
    return labels[id] || id;
  };

  return (
    <div className="flex flex-col h-full text-slate-200">
      
      {/* Visual Sidebar Header Tabs */}
      <div className="flex border-b border-dark-border bg-slate-950/20 sticky top-0 z-10 shrink-0">
        <button
          onClick={() => setActiveTab("design")}
          className={`flex-1 py-3 px-1 text-xs font-bold border-b-2 tracking-wide uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === "design"
              ? "border-indigo-500 text-indigo-400 bg-indigo-600/10"
              : "border-transparent text-slate-400 hover:text-indigo-400 hover:font-extrabold"
          }`}
        >
          <Palette size={13} />
          <span>Style</span>
        </button>
        <button
          onClick={() => setActiveTab("sections")}
          className={`flex-1 py-3 px-1 text-xs font-bold border-b-2 tracking-wide uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === "sections"
              ? "border-indigo-500 text-indigo-400 bg-indigo-600/10"
              : "border-transparent text-slate-400 hover:text-indigo-400 hover:font-extrabold"
          }`}
        >
          <Sliders size={13} />
          <span>Layout</span>
        </button>
        <button
          onClick={() => setActiveTab("aiSettings")}
          className={`flex-1 py-3 px-1 text-xs font-bold border-b-2 tracking-wide uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === "aiSettings"
              ? "border-indigo-500 text-indigo-400 bg-indigo-600/10"
              : "border-transparent text-slate-400 hover:text-indigo-400 hover:font-extrabold"
          }`}
        >
          <Settings size={13} />
          <span>AI Config</span>
        </button>
      </div>

      {/* Sidebar Content Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        
        {/* DESIGN TAB */}
        {activeTab === "design" && (
          <div className="space-y-5">
            
            {/* 1. Page Margins Slider */}
            <div className="border border-dark-border bg-slate-950/30 p-4 rounded-xl space-y-2">
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                <span>PAGE MARGINS: {{ compact: 1, normal: 2, loose: 3 }[data.layoutSettings?.marginSize] || 2}</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-500 font-semibold">
                <span>narrow</span>
                <input
                  type="range"
                  min="1"
                  max="3"
                  value={{ compact: 1, normal: 2, loose: 3 }[data.layoutSettings?.marginSize] || 2}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    const size = { 1: "compact", 2: "normal", 3: "loose" }[val];
                    handleLayoutChange("marginSize", size);
                  }}
                  className="flex-1 accent-emerald-500 bg-slate-800 h-1 rounded-lg cursor-pointer"
                />
                <span>wide</span>
              </div>
            </div>

            {/* 2. Section Spacing Slider */}
            <div className="border border-dark-border bg-slate-950/30 p-4 rounded-xl space-y-2">
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                <span>SECTION SPACING: {{ compact: 1, normal: 2, loose: 3 }[data.layoutSettings?.spacing] || 2}</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-500 font-semibold">
                <span>compact</span>
                <input
                  type="range"
                  min="1"
                  max="3"
                  value={{ compact: 1, normal: 2, loose: 3 }[data.layoutSettings?.spacing] || 2}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    const size = { 1: "compact", 2: "normal", 3: "loose" }[val];
                    handleLayoutChange("spacing", size);
                  }}
                  className="flex-1 accent-emerald-500 bg-slate-800 h-1 rounded-lg cursor-pointer"
                />
                <span>more space</span>
              </div>
            </div>

            {/* 3. Colors Palette Picker */}
            <div className="border border-dark-border bg-slate-950/30 p-4 rounded-xl space-y-3">
              <h3 className="text-xs font-bold tracking-wide uppercase text-slate-400">Colors</h3>
              <div className="flex flex-wrap gap-2.5 items-center">
                {[
                  { primary: "#1d4ed8", accent: "#2dc08d" }, // Blue Mint
                  { primary: "#0f172a", accent: "#f97316" }, // Slate Orange
                  { primary: "#312e81", accent: "#8b5cf6" }, // Indigo Violet
                  { primary: "#111827", accent: "#06b6d4" }, // Slate Cyan
                  { primary: "#1c1917", accent: "#eab308" }, // Stone Gold
                  { primary: "#0f172a", accent: "#2563eb" }, // Slate Blue
                  { primary: "#0f172a", accent: "#dc2626" }, // Slate Red
                  { primary: "#064e3b", accent: "#059669" }  // Dark Green
                ].map((pres, idx) => {
                  const isSelected = data.layoutSettings?.primaryColor === pres.primary && data.layoutSettings?.accentColor === pres.accent;
                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        handleLayoutChange("primaryColor", pres.primary);
                        handleLayoutChange("accentColor", pres.accent);
                      }}
                      className="w-7 h-7 rounded-full relative border border-slate-700/50 cursor-pointer shadow flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
                      style={{
                        background: `linear-gradient(135deg, ${pres.primary} 50%, ${pres.accent} 50%)`
                      }}
                    >
                      {isSelected && (
                        <span className="text-[10px] text-white font-bold drop-shadow">✓</span>
                      )}
                    </button>
                  );
                })}

                {/* Custom Add Color Trigger */}
                <div className="relative group">
                  <input
                    type="color"
                    id="custom-color-bubble"
                    value={data.layoutSettings?.accentColor || "#2dc08d"}
                    onChange={(e) => {
                      handleLayoutChange("accentColor", e.target.value);
                    }}
                    className="absolute inset-0 w-7 h-7 opacity-0 cursor-pointer z-10"
                  />
                  <button className="w-7 h-7 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm flex items-center justify-center shadow transition-transform group-hover:scale-110">
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* 4. Font Style Dropdown Selector */}
            {/* 4. Font Style Selector List */}
            <div className="border border-dark-border bg-slate-950/30 p-4 rounded-xl space-y-3">
              <h3 className="text-xs font-bold tracking-wide uppercase text-slate-400">Font Style</h3>
              
              {/* Vertical Scrollable Font List */}
              <div className="max-h-[320px] overflow-y-auto border border-dark-border bg-slate-950/50 rounded-xl p-2.5 flex flex-col gap-1 text-slate-200">
                {Object.entries(FONTS).map(([key, val]) => {
                  const isSelected = (data.layoutSettings?.fontFamily || "sans") === key;
                  
                  // Extract family name and description
                  const parts = val.label.split(" / ");
                  const name = parts[0];
                  const desc = parts[1];

                  return (
                    <button
                      key={key}
                      onClick={() => handleLayoutChange("fontFamily", key)}
                      style={val.style}
                      className={`w-full py-2.5 px-3 rounded-lg text-left transition-all flex items-center justify-between cursor-pointer group ${
                        isSelected 
                          ? "bg-emerald-500/10 text-emerald-400 font-extrabold" 
                          : "hover:bg-slate-900/80 hover:text-slate-100 font-medium"
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="text-sm tracking-wide">{name}</span>
                        {desc && (
                          <span className="text-[9px] text-slate-400 group-hover:text-slate-300 italic font-sans font-normal mt-0.5">
                            {desc}
                          </span>
                        )}
                      </div>
                      {isSelected && (
                        <span className="text-emerald-400 text-sm font-bold">✓</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Save Font Button */}
              <button
                onClick={() => {
                  alert(`Font configuration saved successfully!`);
                }}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 rounded-lg text-xs tracking-wider uppercase shadow-md transition-all hover:scale-102 cursor-pointer text-center"
              >
                Save Font
              </button>
            </div>

            {/* 5. Font Size Slider */}
            <div className="border border-dark-border bg-slate-950/30 p-4 rounded-xl space-y-2">
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                <span className="uppercase">FONT SIZE: {{ xs: "Extra Small", sm: "Small", base: "Medium", lg: "Large" }[data.layoutSettings?.fontSize] || "Medium"}</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-500 font-semibold">
                <span>- A</span>
                <input
                  type="range"
                  min="1"
                  max="4"
                  value={{ xs: 1, sm: 2, base: 3, lg: 4 }[data.layoutSettings?.fontSize] || 3}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    const size = { 1: "xs", 2: "sm", 3: "base", 4: "lg" }[val];
                    handleLayoutChange("fontSize", size);
                  }}
                  className="flex-1 accent-emerald-500 bg-slate-800 h-1 rounded-lg cursor-pointer"
                />
                <span>+ A</span>
              </div>
            </div>

            {/* 6. Line Height Slider */}
            <div className="border border-dark-border bg-slate-950/30 p-4 rounded-xl space-y-2">
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                <span>LINE HEIGHT: {{ tight: 1, normal: 2, relaxed: 3 }[data.layoutSettings?.lineHeight] || 2}</span>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-500 font-semibold">
                <span>condensed</span>
                <input
                  type="range"
                  min="1"
                  max="3"
                  value={{ tight: 1, normal: 2, relaxed: 3 }[data.layoutSettings?.lineHeight] || 2}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    const height = { 1: "tight", 2: "normal", 3: "relaxed" }[val];
                    handleLayoutChange("lineHeight", height);
                  }}
                  className="flex-1 accent-emerald-500 bg-slate-800 h-1 rounded-lg cursor-pointer"
                />
                <span>spacious</span>
              </div>
            </div>

            {/* 7. Backgrounds Grid */}
            <div className="border border-dark-border bg-slate-950/30 p-4 rounded-xl space-y-3">
              <h3 className="text-xs font-bold tracking-wide uppercase text-slate-400">Backgrounds</h3>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: "blank", label: "Blank" },
                  { id: "grid", label: "Grid" },
                  { id: "dots", label: "Dots" },
                  { id: "diagonal", label: "Stripes" },
                  { id: "soft", label: "Gradient" }
                ].map((pat) => {
                  const isSelected = (data.layoutSettings?.backgroundPattern || "blank") === pat.id;
                  return (
                    <button
                      key={pat.id}
                      onClick={() => handleLayoutChange("backgroundPattern", pat.id)}
                      className={`h-11 rounded-lg border text-[9px] font-extrabold flex flex-col items-center justify-center gap-1 cursor-pointer transition-all relative overflow-hidden ${
                        isSelected 
                          ? "bg-emerald-500/10 border-emerald-400 text-emerald-400 shadow-sm" 
                          : "bg-slate-900/60 border-dark-border text-slate-400 hover:border-slate-700 hover:text-slate-200"
                      }`}
                    >
                      {isSelected && (
                        <span className="absolute top-1 right-1 text-[8px] font-bold">✓</span>
                      )}
                      <span className="truncate max-w-full px-1">{pat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 8. Signature Block */}
            <div className="border border-dark-border bg-slate-950/30 p-4 rounded-xl space-y-2">
              <h3 className="text-xs font-bold tracking-wide uppercase text-slate-400">Signature Line</h3>
              <input
                type="text"
                value={data.layoutSettings?.signatureText || ""}
                onChange={(e) => handleLayoutChange("signatureText", e.target.value)}
                placeholder="Type your name to sign CV"
                className="w-full bg-slate-900 border border-dark-border rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 font-semibold"
              />
            </div>

            {/* 9. Heading Style Options */}
            <div className="border border-dark-border bg-slate-950/30 p-4 rounded-xl space-y-3">
              <h3 className="text-xs font-bold tracking-wide uppercase text-slate-400">Heading Decors</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "accent", label: "Accent Block" },
                  { id: "line", label: "Bottom Border" },
                  { id: "block", label: "Solid Background" },
                  { id: "clean", label: "Clean Minimal" }
                ].map((style) => (
                  <button
                    key={style.id}
                    onClick={() => handleLayoutChange("headingStyle", style.id)}
                    className={`py-2 px-2 rounded-xl border text-[10px] font-bold text-center transition-all cursor-pointer ${
                      data.layoutSettings?.headingStyle === style.id
                        ? "bg-indigo-600/10 border-indigo-500/30 text-indigo-400 font-bold shadow-sm"
                        : "bg-slate-900/60 border-dark-border text-slate-400 hover:border-indigo-500/20 hover:font-bold hover:text-slate-200"
                    }`}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* LAYOUT TAB */}
        {activeTab === "sections" && (
          <div className="space-y-4">
            
            {/* Column Layout togglers */}
            <div className="border border-dark-border bg-slate-950/30 p-4 rounded-xl space-y-3">
              <h3 className="text-xs font-bold tracking-wide uppercase text-slate-400">Section Layouts</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleLayoutChange("layoutStyle", "single")}
                  className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold tracking-wide uppercase transition-all cursor-pointer ${
                    data.layoutSettings?.layoutStyle === "single"
                      ? "bg-indigo-600/10 border-indigo-500/30 text-indigo-400 font-bold"
                      : "bg-slate-900/60 border-dark-border text-slate-400 hover:border-indigo-500/20 hover:font-bold hover:text-slate-200"
                  }`}
                >
                  Single Column
                </button>
                <button
                  onClick={() => handleLayoutChange("layoutStyle", "double")}
                  className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold tracking-wide uppercase transition-all cursor-pointer ${
                    data.layoutSettings?.layoutStyle === "double"
                      ? "bg-indigo-600/10 border-indigo-500/30 text-indigo-400 font-bold"
                      : "bg-slate-900/60 border-dark-border text-slate-400 hover:border-indigo-500/20 hover:font-bold hover:text-slate-200"
                  }`}
                >
                  Double Column
                </button>
              </div>

              {/* Column ratios */}
              {data.layoutSettings?.layoutStyle === "double" && (
                <div className="pt-2">
                  <label className="block text-[10px] font-bold text-slate-400 mb-1.5">Column Spacing Ratio</label>
                  <div className="flex gap-1.5">
                    {["50-50", "60-40", "70-30"].map((ratio) => (
                      <button
                        key={ratio}
                        onClick={() => handleLayoutChange("columnRatio", ratio)}
                        className={`flex-1 py-1 rounded text-[10px] font-bold transition-all cursor-pointer border ${
                          data.layoutSettings?.columnRatio === ratio
                            ? "bg-indigo-600/10 border-indigo-500/30 text-indigo-400 font-bold"
                            : "bg-slate-900/60 border-dark-border text-slate-400 hover:border-indigo-500/20 hover:font-bold hover:text-slate-200"
                        }`}
                      >
                        {ratio.replace("-", " : ")}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Toggle Sections Checkboxes */}
            <div className="border border-dark-border bg-slate-950/30 p-4 rounded-xl space-y-2.5">
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-xs font-bold tracking-wide uppercase text-slate-400">Visible Modules</h3>
                <button
                  onClick={handleAddCustomSection}
                  className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-full flex items-center gap-0.5 transition-colors cursor-pointer"
                >
                  <Plus size={10} /> Add Custom
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  "summary", "experience", "education", "projects", "skills", "certifications", 
                  "strengths", "languages", "achievements", "passions", "books", "quotes", "dayInLife"
                ].map((secId) => {
                  const isVisible = !disabledSections.includes(secId);
                  return (
                    <label key={secId} className="flex items-center gap-2 bg-slate-900/40 p-2 rounded-lg border border-dark-border cursor-pointer select-none hover:border-slate-700 transition-colors">
                      <input
                        type="checkbox"
                        checked={isVisible}
                        onChange={() => toggleSectionVisibility(secId)}
                        className="rounded border-dark-border text-indigo-500 focus:ring-indigo-500 w-3.5 h-3.5 bg-slate-950"
                      />
                      <span className="text-[11px] font-medium truncate capitalize">{getSectionLabel(secId)}</span>
                    </label>
                  );
                })}

                {/* Custom sections toggles */}
                {data.customSections?.map((cust) => {
                  const isVisible = !disabledSections.includes(cust.id);
                  return (
                    <label key={cust.id} className="flex items-center gap-2 bg-slate-900/40 p-2 rounded-lg border border-dark-border cursor-pointer select-none hover:border-slate-700 transition-colors">
                      <input
                        type="checkbox"
                        checked={isVisible}
                        onChange={() => toggleSectionVisibility(cust.id)}
                        className="rounded border-dark-border text-indigo-500 focus:ring-indigo-500 w-3.5 h-3.5 bg-slate-950"
                      />
                      <span className="text-[11px] font-medium truncate">{cust.title}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Column Allocation Assignment Manager (Double Column only) */}
            {data.layoutSettings?.layoutStyle === "double" ? (
              <div className="border border-dark-border bg-slate-950/30 p-4 rounded-xl space-y-4">
                <h3 className="text-xs font-bold tracking-wide uppercase text-slate-400">Position Allocation</h3>

                <div className="grid grid-cols-2 gap-4">
                  {/* Left Column Section List */}
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-extrabold uppercase text-slate-400 pb-1.5 border-b border-dark-border flex items-center justify-between">
                      <span>Column 1 (Left)</span>
                      <span className="text-[8px] bg-slate-800 px-1 rounded">Main</span>
                    </h4>
                    
                    <div className="space-y-1">
                      {data.layoutSettings?.leftColumnSections
                        ?.filter(id => !disabledSections.includes(id))
                        ?.map((secId, idx, arr) => (
                          <div key={secId} className="flex items-center justify-between bg-slate-900/80 p-2 rounded-lg border border-dark-border text-[10px] font-bold">
                            <span className="truncate max-w-[55%]">{getSectionLabel(secId)}</span>
                            <div className="flex items-center gap-0.5">
                              <button
                                onClick={() => moveSectionOrder(secId, "left", "up")}
                                disabled={idx === 0}
                                className="p-0.5 text-slate-400 hover:text-white disabled:opacity-20 cursor-pointer"
                              >
                                <ArrowUp size={10} />
                              </button>
                              <button
                                onClick={() => moveSectionOrder(secId, "left", "down")}
                                disabled={idx === arr.length - 1}
                                className="p-0.5 text-slate-400 hover:text-white disabled:opacity-20 cursor-pointer"
                              >
                                <ArrowDown size={10} />
                              </button>
                              <button
                                onClick={() => moveSectionColumn(secId, "right")}
                                className="p-0.5 text-slate-400 hover:text-indigo-400 cursor-pointer ml-0.5"
                                title="Move right"
                              >
                                <ArrowRight size={10} />
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Right Column Section List */}
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-extrabold uppercase text-slate-400 pb-1.5 border-b border-dark-border flex items-center justify-between">
                      <span>Column 2 (Right)</span>
                      <span className="text-[8px] bg-indigo-900/30 text-indigo-400 px-1 rounded">Sidebar</span>
                    </h4>
                    
                    <div className="space-y-1">
                      {data.layoutSettings?.rightColumnSections
                        ?.filter(id => !disabledSections.includes(id))
                        ?.map((secId, idx, arr) => (
                          <div key={secId} className="flex items-center justify-between bg-slate-900/80 p-2 rounded-lg border border-dark-border text-[10px] font-bold">
                            <span className="truncate max-w-[55%]">{getSectionLabel(secId)}</span>
                            <div className="flex items-center gap-0.5">
                              <button
                                onClick={() => moveSectionColumn(secId, "left")}
                                className="p-0.5 text-slate-400 hover:text-indigo-400 cursor-pointer mr-0.5"
                                title="Move left"
                              >
                                <ArrowLeft size={10} />
                              </button>
                              <button
                                onClick={() => moveSectionOrder(secId, "right", "up")}
                                disabled={idx === 0}
                                className="p-0.5 text-slate-400 hover:text-white disabled:opacity-20 cursor-pointer"
                              >
                                <ArrowUp size={10} />
                              </button>
                              <button
                                onClick={() => moveSectionOrder(secId, "right", "down")}
                                disabled={idx === arr.length - 1}
                                className="p-0.5 text-slate-400 hover:text-white disabled:opacity-20 cursor-pointer"
                              >
                                <ArrowDown size={10} />
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Single column vertical positioning */
              <div className="border border-dark-border bg-slate-950/30 p-4 rounded-xl space-y-3">
                <h3 className="text-xs font-bold tracking-wide uppercase text-slate-400">Vertical Ordering</h3>
                <div className="space-y-1">
                  {data.layoutSettings?.sectionOrder
                    ?.filter(id => !disabledSections.includes(id))
                    ?.map((secId, idx, arr) => (
                      <div key={secId} className="flex items-center justify-between bg-slate-900/80 p-2 rounded-lg border border-dark-border text-xs font-semibold">
                        <span>{getSectionLabel(secId)}</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => moveSingleColumnOrder(secId, "up")}
                            disabled={idx === 0}
                            className="p-1 text-slate-400 hover:text-white disabled:opacity-20 cursor-pointer"
                          >
                            <ArrowUp size={12} />
                          </button>
                          <button
                            onClick={() => moveSingleColumnOrder(secId, "down")}
                            disabled={idx === arr.length - 1}
                            className="p-1 text-slate-400 hover:text-white disabled:opacity-20 cursor-pointer"
                          >
                            <ArrowDown size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* AI CONFIG TAB */}
        {activeTab === "aiSettings" && (
          <div className="space-y-4">
            
            <div className="border border-dark-border bg-slate-950/30 p-4 rounded-xl space-y-4">
              <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
                <Sparkles size={14} />
                <span>AI Rewriter Settings</span>
              </div>
              
              <p className="text-[11px] text-slate-400 leading-relaxed">
                ApexCV connects directly to Hugging Face serverless APIs for ATS rewrites. Your API keys are stored securely in your browser's local sandbox.
              </p>

              {/* Demo Mode toggle */}
              <div className="bg-slate-900/60 p-3 rounded-lg border border-dark-border space-y-2">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isDemo}
                    onChange={(e) => handleSaveHuggingFace(token, e.target.checked)}
                    className="rounded border-dark-border text-indigo-500 focus:ring-indigo-500 w-4 h-4 bg-slate-950"
                  />
                  <div>
                    <span className="text-xs font-bold block text-white">Enable Sandbox Demo Mode</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Use pre-generated AI content without providing a Token.</span>
                  </div>
                </label>
              </div>

              {/* Hugging Face Token */}
              {!isDemo && (
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold text-slate-400">Hugging Face Read Access Token</label>
                  <div className="relative">
                    <input
                      type="password"
                      value={token}
                      onChange={(e) => handleSaveHuggingFace(e.target.value, isDemo)}
                      placeholder="hf_xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                      className="w-full bg-slate-900 border border-dark-border rounded-lg pl-3 pr-8 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500 font-mono transition-colors"
                    />
                    <Key size={12} className="absolute right-2.5 top-3 text-slate-500" />
                  </div>
                  <span className="text-[9px] text-slate-500 block leading-tight">
                    Obtain a free read token at huggingface.co/settings/tokens to use active live inference.
                  </span>
                </div>
              )}

              {/* Status Indicator */}
              <div className="bg-slate-900/30 border border-dark-border p-3 rounded-lg flex items-center gap-2.5 text-xs text-slate-300">
                {isDemo ? (
                  <>
                    <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
                    <span>Demo sandbox active (No account needed)</span>
                  </>
                ) : token ? (
                  <>
                    <Check size={16} className="text-emerald-400 shrink-0" />
                    <span className="truncate">Token set ({token.substring(0, 8)}...)</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle size={16} className="text-amber-400 shrink-0" />
                    <span>Token missing. Please set token or enable Demo.</span>
                  </>
                )}
              </div>
            </div>

            {/* Quick guide */}
            <div className="bg-indigo-950/20 border border-indigo-900/30 p-4 rounded-xl space-y-2 text-xs">
              <h4 className="font-bold text-indigo-300 flex items-center gap-1">
                <Info size={12} />
                <span>Quick Inline Tip</span>
              </h4>
              <p className="text-[11px] text-indigo-200/80 leading-relaxed">
                Click directly on any text inside the resume preview sheet to edit its contents inline. Hover over list rows to access re-ordering arrows, delete keys, and AI-enhancement sparkles!
              </p>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
