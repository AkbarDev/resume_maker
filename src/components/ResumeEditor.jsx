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
              ? "border-indigo-500 text-white bg-indigo-500/5"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Palette size={13} />
          <span>Style</span>
        </button>
        <button
          onClick={() => setActiveTab("sections")}
          className={`flex-1 py-3 px-1 text-xs font-bold border-b-2 tracking-wide uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === "sections"
              ? "border-indigo-500 text-white bg-indigo-500/5"
              : "border-transparent text-slate-400 hover:text-slate-200"
          }`}
        >
          <Sliders size={13} />
          <span>Layout</span>
        </button>
        <button
          onClick={() => setActiveTab("aiSettings")}
          className={`flex-1 py-3 px-1 text-xs font-bold border-b-2 tracking-wide uppercase transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === "aiSettings"
              ? "border-indigo-500 text-white bg-indigo-500/5"
              : "border-transparent text-slate-400 hover:text-slate-200"
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
          <div className="space-y-4">
            
            {/* Color Palette Selector */}
            <div className="border border-dark-border bg-slate-950/30 p-4 rounded-xl space-y-3">
              <h3 className="text-xs font-bold tracking-wide uppercase text-slate-400">Color Themes</h3>
              <div className="grid grid-cols-4 gap-2">
                {COLOR_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      handleLayoutChange("primaryColor", preset.primary);
                      handleLayoutChange("accentColor", preset.accent);
                    }}
                    className="p-1 rounded-lg border border-dark-border bg-slate-900/60 hover:bg-slate-800 hover:border-slate-600 transition-colors flex flex-col items-center gap-1 cursor-pointer"
                    title={preset.name}
                  >
                    <div className="flex gap-0.5">
                      <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: preset.primary }} />
                      <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: preset.accent }} />
                    </div>
                    <span className="text-[8px] text-slate-400 truncate max-w-full text-center">{preset.name.split(" ")[0]}</span>
                  </button>
                ))}
              </div>

              {/* Custom Color Pickers */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 mb-1">Primary Color</label>
                  <div className="flex items-center gap-1.5 bg-slate-900/80 border border-dark-border rounded-lg p-1">
                    <input
                      type="color"
                      value={data.layoutSettings?.primaryColor || "#0f172a"}
                      onChange={(e) => handleLayoutChange("primaryColor", e.target.value)}
                      className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                    />
                    <span className="text-[10px] font-mono text-slate-300 uppercase">{data.layoutSettings?.primaryColor}</span>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-400 mb-1">Accent Accent</label>
                  <div className="flex items-center gap-1.5 bg-slate-900/80 border border-dark-border rounded-lg p-1">
                    <input
                      type="color"
                      value={data.layoutSettings?.accentColor || "#4f46e5"}
                      onChange={(e) => handleLayoutChange("accentColor", e.target.value)}
                      className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                    />
                    <span className="text-[10px] font-mono text-slate-300 uppercase">{data.layoutSettings?.accentColor}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Typography Selection */}
            <div className="border border-dark-border bg-slate-950/30 p-4 rounded-xl space-y-3">
              <h3 className="text-xs font-bold tracking-wide uppercase text-slate-400">Typography Font</h3>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(FONTS).map(([key, value]) => (
                  <button
                    key={key}
                    onClick={() => handleLayoutChange("fontFamily", key)}
                    className={`py-2 px-2.5 rounded-xl border text-xs text-center transition-all cursor-pointer ${
                      data.layoutSettings?.fontFamily === key
                        ? "bg-indigo-600/15 border-indigo-500 text-white font-bold"
                        : "bg-slate-900/60 border-dark-border text-slate-300 hover:border-slate-600"
                    }`}
                  >
                    <span className="block font-medium">{value.label.split(" / ")[0]}</span>
                    <span className="text-[9px] text-slate-400 italic font-normal">{value.label.split(" / ")[1]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Layout Geometry controls */}
            <div className="border border-dark-border bg-slate-950/30 p-4 rounded-xl space-y-4">
              <h3 className="text-xs font-bold tracking-wide uppercase text-slate-400">Geometry Settings</h3>

              {/* Margins */}
              <div>
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mb-1.5">
                  <span>Page Margins</span>
                  <span className="capitalize text-slate-200">{data.layoutSettings?.marginSize || "normal"}</span>
                </div>
                <div className="flex gap-1.5">
                  {["compact", "normal", "loose"].map((sz) => (
                    <button
                      key={sz}
                      onClick={() => handleLayoutChange("marginSize", sz)}
                      className={`flex-1 py-1 rounded text-[10px] font-semibold transition-colors cursor-pointer uppercase ${
                        data.layoutSettings?.marginSize === sz
                          ? "bg-slate-700 text-white"
                          : "bg-slate-900 text-slate-400 hover:bg-slate-800"
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Spacing / Section Padding */}
              <div>
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mb-1.5">
                  <span>Section Padding</span>
                  <span className="capitalize text-slate-200">{data.layoutSettings?.spacing || "normal"}</span>
                </div>
                <div className="flex gap-1.5">
                  {["compact", "normal", "loose"].map((sz) => (
                    <button
                      key={sz}
                      onClick={() => handleLayoutChange("spacing", sz)}
                      className={`flex-1 py-1 rounded text-[10px] font-semibold transition-colors cursor-pointer uppercase ${
                        data.layoutSettings?.spacing === sz
                          ? "bg-slate-700 text-white"
                          : "bg-slate-900 text-slate-400 hover:bg-slate-800"
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Sizing */}
              <div>
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mb-1.5">
                  <span>Font Sizing</span>
                  <span className="uppercase text-slate-200">{data.layoutSettings?.fontSize || "sm"}</span>
                </div>
                <div className="flex gap-1.5">
                  {["xs", "sm", "base", "lg"].map((sz) => (
                    <button
                      key={sz}
                      onClick={() => handleLayoutChange("fontSize", sz)}
                      className={`flex-1 py-1 rounded text-[10px] font-semibold transition-colors cursor-pointer uppercase ${
                        data.layoutSettings?.fontSize === sz
                          ? "bg-slate-700 text-white"
                          : "bg-slate-900 text-slate-400 hover:bg-slate-800"
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Line Heights */}
              <div>
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mb-1.5">
                  <span>Line Height</span>
                  <span className="capitalize text-slate-200">{data.layoutSettings?.lineHeight || "normal"}</span>
                </div>
                <div className="flex gap-1.5">
                  {["tight", "normal", "relaxed"].map((sz) => (
                    <button
                      key={sz}
                      onClick={() => handleLayoutChange("lineHeight", sz)}
                      className={`flex-1 py-1 rounded text-[10px] font-semibold transition-colors cursor-pointer uppercase ${
                        data.layoutSettings?.lineHeight === sz
                          ? "bg-slate-700 text-white"
                          : "bg-slate-900 text-slate-400 hover:bg-slate-800"
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Heading Style Options */}
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
                        ? "bg-indigo-600/15 border-indigo-500 text-white"
                        : "bg-slate-900/60 border-dark-border text-slate-400 hover:border-slate-600"
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
                  className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold tracking-wide uppercase transition-colors cursor-pointer ${
                    data.layoutSettings?.layoutStyle === "single"
                      ? "bg-indigo-600/15 border-indigo-500 text-white"
                      : "bg-slate-900/60 border-dark-border text-slate-400 hover:bg-slate-800"
                  }`}
                >
                  Single Column
                </button>
                <button
                  onClick={() => handleLayoutChange("layoutStyle", "double")}
                  className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold tracking-wide uppercase transition-colors cursor-pointer ${
                    data.layoutSettings?.layoutStyle === "double"
                      ? "bg-indigo-600/15 border-indigo-500 text-white"
                      : "bg-slate-900/60 border-dark-border text-slate-400 hover:bg-slate-800"
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
                        className={`flex-1 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                          data.layoutSettings?.columnRatio === ratio
                            ? "bg-slate-700 text-white"
                            : "bg-slate-900 text-slate-400 hover:bg-slate-800"
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
