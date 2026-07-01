import React, { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Globe, ExternalLink, Plus, Trash2, ArrowUp, ArrowDown, Sparkles, Calendar, Settings } from "lucide-react";
import { FONTS, SIZES } from "../types/resume";

// Simple Inline-Editable Component
function EditableField({ value, placeholder, onSave, className = "", isTextArea = false, isPrintView = false }) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value || "");

  useEffect(() => {
    setTempValue(value || "");
  }, [value]);

  const handleBlur = () => {
    setIsEditing(false);
    onSave(tempValue);
  };

  const handleKeyDown = (e) => {
    if (!isTextArea && e.key === "Enter") {
      e.preventDefault();
      setIsEditing(false);
      onSave(tempValue);
    }
  };

  // If we are in print view, don't allow edits and don't render placeholders
  if (isPrintView) {
    return value ? <span className={className}>{value}</span> : null;
  }

  if (isEditing) {
    if (isTextArea) {
      return (
        <textarea
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={handleBlur}
          className="w-full bg-slate-100 border border-indigo-500 rounded p-1 text-gray-950 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-inherit leading-normal"
          autoFocus
          rows={3}
          placeholder={placeholder}
        />
      );
    }
    return (
      <input
        type="text"
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="bg-slate-100 border border-indigo-500 rounded px-1 py-0.5 text-gray-950 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-inherit inline-block"
        autoFocus
        placeholder={placeholder}
      />
    );
  }

  const isEmpty = !value;
  return (
    <span
      onClick={() => setIsEditing(true)}
      className={`cursor-text hover:bg-slate-100 rounded px-0.5 py-0.2 -mx-0.5 transition-colors border border-transparent hover:border-slate-200/60 inline-block min-w-[20px] ${
        isEmpty ? "text-gray-400 italic text-[11px] font-normal" : ""
      } ${className}`}
    >
      {isEmpty ? placeholder : value}
    </span>
  );
}

// Simple SVG Icons
const Linkedin = ({ size = 12, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const Github = ({ size = 12, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function ResumePreview({ data, onChange = () => {}, onAIEnhance = () => {}, isPrintView = false }) {
  const { 
    personalInfo = {}, 
    experience = [], 
    education = [], 
    projects = [], 
    skills = [], 
    certifications = [], 
    strengths = [],
    languages = [],
    achievements = [],
    passions = [],
    books = [],
    quotes = [],
    dayInLife = [],
    customSections = [],
    layoutSettings = {} 
  } = data;

  const [focusedItemId, setFocusedItemId] = useState(null);

  const { 
    template = "modern", 
    primaryColor = "#0f172a", 
    accentColor = "#4f46e5", 
    fontSize = "sm", 
    spacing = "normal", 
    fontFamily = "sans",
    lineHeight = "normal", 
    marginSize = "normal",
    headingStyle = "accent",
    layoutStyle = "double",
    columnRatio = "60-40",
    disabledSections = [],
    leftColumnSections = ["summary", "experience", "education", "projects"],
    rightColumnSections = ["skills", "certifications", "strengths", "languages", "achievements", "passions", "books", "quotes", "dayInLife"]
  } = layoutSettings;

  // Simple Toggle Switch
  const ToggleSwitch = ({ checked, onChange }) => (
    <button 
      onClick={(e) => {
        e.stopPropagation();
        onChange(!checked);
      }}
      className={`w-8 h-4 rounded-full relative transition-colors cursor-pointer shrink-0 ${
        checked ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"
      }`}
    >
      <span className={`w-3.5 h-3.5 rounded-full bg-white absolute top-[1px] left-[1px] transition-transform shadow-sm transform ${
        checked ? "translate-x-4" : "translate-x-0"
      }`} />
    </button>
  );

  // Helper to wrap items with click-to-edit box, green outline, and floating toolbar controls
  const EditorItemBox = ({ id, type, index, itemsArray = [], onAdd, onDelete, toggles = [], children }) => {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    if (isPrintView) return children;
    const isFocused = focusedItemId === id;
    
    return (
      <div 
        onClick={(e) => {
          e.stopPropagation();
          setFocusedItemId(id);
        }}
        className={`relative transition-all duration-200 cursor-pointer ${
          isFocused 
            ? "border-2 border-emerald-400 rounded-xl p-4 m-0.5 bg-emerald-500/[0.03] shadow-md dark:bg-emerald-500/[0.02]" 
            : "border-2 border-transparent hover:bg-slate-100/50 dark:hover:bg-slate-800/30 hover:border-slate-200/50 dark:hover:border-slate-800/80 rounded-xl p-2 -m-2"
        }`}
      >
        {isFocused && (
          <>
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-full px-3 py-1 shadow-lg flex items-center gap-3 text-xs z-30 no-print">
              {onAdd && (
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onAdd();
                  }}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold px-2.5 py-0.5 rounded-full flex items-center gap-0.5 cursor-pointer transition-colors text-[10px]"
                >
                  <Plus size={10} /> Entry
                </button>
              )}
              {onAdd && <div className="w-px h-3 bg-slate-200 dark:bg-slate-700" />}
              
              {/* Reordering handles */}
              <button 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  if (index > 0) handleMoveListItem(type, index, "up"); 
                }} 
                disabled={index === 0}
                className="text-slate-500 hover:text-indigo-500 disabled:opacity-20 p-0.5 cursor-pointer"
                title="Move Up"
              >
                <ArrowUp size={11} />
              </button>
              <button 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  if (index < itemsArray.length - 1) handleMoveListItem(type, index, "down"); 
                }} 
                disabled={index === itemsArray.length - 1}
                className="text-slate-500 hover:text-indigo-500 disabled:opacity-20 p-0.5 cursor-pointer"
                title="Move Down"
              >
                <ArrowDown size={11} />
              </button>
              
              <button onClick={(e) => { e.stopPropagation(); }} className="text-slate-500 hover:text-indigo-500 font-serif font-bold text-[10px] p-0.5 cursor-pointer">T</button>
              <button onClick={(e) => { e.stopPropagation(); }} className="text-slate-500 hover:text-indigo-500 p-0.5 cursor-pointer"><Calendar size={12} /></button>
              
              {onDelete && (
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    onDelete(); 
                    setFocusedItemId(null); 
                  }} 
                  className="text-red-400 hover:text-red-500 p-0.5 cursor-pointer"
                  title="Delete Entry"
                >
                  <Trash2 size={12} />
                </button>
              )}
              
              <button 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  setIsSettingsOpen(!isSettingsOpen); 
                }} 
                className={`p-0.5 rounded cursor-pointer transition-colors ${isSettingsOpen ? "text-emerald-500" : "text-slate-500 hover:text-indigo-500"}`}
                title="Toggle fields settings"
              >
                <Settings size={12} />
              </button>
            </div>

            {/* Visibility Toggles Dropdown Popup */}
            {isSettingsOpen && toggles.length > 0 && (
              <div 
                onClick={(e) => e.stopPropagation()} 
                className="absolute top-9 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xl z-40 text-slate-800 dark:text-slate-200 min-w-[180px] flex flex-col gap-3 no-print"
              >
                {toggles.map((t, i) => (
                  <div key={i} className="flex items-center justify-between gap-6 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                    <span>{t.label}</span>
                    <ToggleSwitch checked={t.checked} onChange={t.onChange} />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
        {children}
      </div>
    );
  };

  const fontConfig = FONTS[fontFamily] || FONTS.sans;
  const sizeConfig = SIZES[fontSize] || SIZES.sm;

  // Custom margin map
  const marginClass = {
    compact: "mb-2",
    normal: "mb-4",
    loose: "mb-6"
  }[marginSize];

  // Custom line height map
  const leadingClass = {
    tight: "leading-tight",
    normal: "leading-normal",
    relaxed: "leading-relaxed"
  }[lineHeight];

  // Spacing padding map
  const paddingClass = {
    compact: "p-4.5",
    normal: "p-7",
    loose: "p-9.5"
  }[spacing];

  // Style objects
  const primaryStyle = { color: primaryColor };
  const borderPrimaryStyle = { borderColor: primaryColor };
  const accentStyle = { color: accentColor };
  const borderAccentStyle = { borderColor: accentColor };
  const bgPrimaryStyle = { backgroundColor: primaryColor };
  const bgAccentStyle = { backgroundColor: accentColor };

  // Helper to change personal info field
  const handlePersonalChange = (key, value) => {
    onChange({
      ...data,
      personalInfo: {
        ...data.personalInfo,
        [key]: value
      }
    });
  };

  // Reorder list helper
  const handleMoveListItem = (section, idx, direction) => {
    if (direction === "up" && idx === 0) return;
    if (direction === "down" && idx === data[section].length - 1) return;

    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    const updated = [...data[section]];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    onChange({ ...data, [section]: updated });
  };

  // Delete list helper
  const handleDeleteListItem = (section, idx) => {
    const updated = data[section].filter((_, i) => i !== idx);
    onChange({ ...data, [section]: updated });
  };

  // Render bullet points from text
  const renderBulletPoints = (text, placeholder = "• Click to edit description...") => {
    if (!text && isPrintView) return null;
    const lines = text ? text.split("\n") : [];
    if (lines.length === 0) {
      return (
        <li className="list-none text-gray-400 italic">
          {placeholder}
        </li>
      );
    }
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed && isPrintView) return null;
      const displayLine = trimmed.startsWith("•") || trimmed.startsWith("-") 
        ? trimmed.substring(1).trim() 
        : trimmed;
      return (
        <li key={idx} className={`${leadingClass} text-gray-700 list-none relative pl-4 before:content-['•'] before:absolute before:left-0 before:text-gray-400/80`}>
          {displayLine || <span className="text-gray-300 italic">Empty point</span>}
        </li>
      );
    });
  };

  // Render section decoration based on header style selection
  const renderSectionHeader = (title) => {
    if (headingStyle === "clean") {
      return (
        <h2 className={`${fontConfig.headingClass} ${sizeConfig.h2} tracking-wider text-gray-800 uppercase pb-1 mb-2 font-black`}>
          {title}
        </h2>
      );
    }

    if (headingStyle === "line") {
      return (
        <h2 
          className={`${fontConfig.headingClass} ${sizeConfig.h2} tracking-wider uppercase pb-1 mb-3 border-b-2 font-black`}
          style={{ borderColor: accentColor, color: primaryColor }}
        >
          {title}
        </h2>
      );
    }

    if (headingStyle === "block") {
      return (
        <h2 
          className={`${fontConfig.headingClass} text-[11px] text-white tracking-widest uppercase py-1.5 px-3 mb-3.5 rounded font-bold shadow-sm`}
          style={{ backgroundColor: primaryColor }}
        >
          {title}
        </h2>
      );
    }

    // Default: "accent"
    return (
      <h2 
        className={`${fontConfig.headingClass} ${sizeConfig.h2} tracking-tight text-gray-900 uppercase mb-3.5 flex items-center gap-2 font-extrabold`}
        style={primaryStyle}
      >
        <span className="w-1.5 h-3.5 rounded-sm" style={{ backgroundColor: accentColor }} />
        <span>{title}</span>
      </h2>
    );
  };

  // SECTION RENDERS
  // ----------------------------------------------------

  const renderSummary = () => {
    if (disabledSections.includes("summary")) return null;
    const hasVal = personalInfo.summary;
    if (!hasVal && isPrintView) return null;

    return (
      <div className={`print-section ${marginClass}`}>
        {renderSectionHeader("Professional Summary")}
        <EditorItemBox id="summary" type="summary" index={0} itemsArray={[]}>
          <div className="text-gray-700 text-justify">
            <EditableField
              value={personalInfo.summary}
              placeholder="Introduce yourself, your career history, and core competencies..."
              onSave={(val) => handlePersonalChange("summary", val)}
              isTextArea={true}
              isPrintView={isPrintView}
              className={`${leadingClass} text-xs text-justify`}
            />
          </div>
        </EditorItemBox>
      </div>
    );
  };

  const renderExperience = (pageNum = 1) => {
    if (disabledSections.includes("experience")) return null;
    const items = pageNum === 1 ? experience.slice(0, 3) : experience.slice(3);
    if (items.length === 0) return null;

    return (
      <div className={`print-section ${marginClass}`}>
        <div className="flex justify-between items-baseline mb-2">
          {renderSectionHeader("Work Experience")}
        </div>

        <div className="space-y-4">
          {items.map((exp, subIdx) => {
            const idx = pageNum === 1 ? subIdx : subIdx + 3;
            return (
              <EditorItemBox 
              key={exp.id || idx}
              id={exp.id || `exp-${idx}`}
              type="experience"
              index={idx}
              itemsArray={experience}
              onAdd={() => {
                const newItem = { id: `exp-${Date.now()}`, company: "New Company", role: "Job Title", location: "City, State", startDate: "2024-01", endDate: "Present", description: "• Engineered scaling features..." };
                onChange({ ...data, experience: [...experience, newItem] });
                setFocusedItemId(newItem.id);
              }}
              onDelete={() => handleDeleteListItem("experience", idx)}
              toggles={[
                { label: "Title", checked: !exp.hideTitle, onChange: (val) => {
                  const updated = experience.map((e, i) => i === idx ? { ...e, hideTitle: !val } : e);
                  onChange({ ...data, experience: updated });
                }},
                { label: "Company Name", checked: !exp.hideCompany, onChange: (val) => {
                  const updated = experience.map((e, i) => i === idx ? { ...e, hideCompany: !val } : e);
                  onChange({ ...data, experience: updated });
                }},
                { label: "Description", checked: !exp.hideDescription, onChange: (val) => {
                  const updated = experience.map((e, i) => i === idx ? { ...e, hideDescription: !val } : e);
                  onChange({ ...data, experience: updated });
                }},
                { label: "Location", checked: !exp.hideLocation, onChange: (val) => {
                  const updated = experience.map((e, i) => i === idx ? { ...e, hideLocation: !val } : e);
                  onChange({ ...data, experience: updated });
                }},
                { label: "Date Period", checked: !exp.hideDate, onChange: (val) => {
                  const updated = experience.map((e, i) => i === idx ? { ...e, hideDate: !val } : e);
                  onChange({ ...data, experience: updated });
                }}
              ]}
            >
              <div className="flex justify-between items-baseline font-bold text-gray-900 text-xs">
                <span>
                  {!exp.hideTitle && (
                    <EditableField
                      value={exp.role}
                      placeholder="Software Engineer"
                      onSave={(val) => {
                        const updated = experience.map((e, i) => i === idx ? { ...e, role: val } : e);
                        onChange({ ...data, experience: updated });
                      }}
                      isPrintView={isPrintView}
                      className="font-bold text-gray-900"
                    />
                  )}
                  {!exp.hideTitle && !exp.hideCompany && <span className="font-normal text-gray-400 mx-1.5">|</span>}
                  {!exp.hideCompany && (
                    <EditableField
                      value={exp.company}
                      placeholder="Tech Corp"
                      onSave={(val) => {
                        const updated = experience.map((e, i) => i === idx ? { ...e, company: val } : e);
                        onChange({ ...data, experience: updated });
                      }}
                      isPrintView={isPrintView}
                      className="font-medium text-gray-600"
                    />
                  )}
                </span>
                {!exp.hideDate && (
                  <span className="text-[10px] font-semibold tracking-wider shrink-0 uppercase whitespace-nowrap" style={accentStyle}>
                    <EditableField
                      value={exp.startDate}
                      placeholder="2022-01"
                      onSave={(val) => {
                        const updated = experience.map((e, i) => i === idx ? { ...e, startDate: val } : e);
                        onChange({ ...data, experience: updated });
                      }}
                      isPrintView={isPrintView}
                    />
                    <span className="mx-1">–</span>
                    <EditableField
                      value={exp.endDate}
                      placeholder="Present"
                      onSave={(val) => {
                        const updated = experience.map((e, i) => i === idx ? { ...e, endDate: val } : e);
                        onChange({ ...data, experience: updated });
                      }}
                      isPrintView={isPrintView}
                    />
                  </span>
                )}
              </div>

              {!exp.hideLocation && (
                <div className="text-gray-500 italic text-[10px] mb-1 font-medium">
                  <EditableField
                    value={exp.location}
                    placeholder="San Francisco, CA"
                    onSave={(val) => {
                      const updated = experience.map((e, i) => i === idx ? { ...e, location: val } : e);
                      onChange({ ...data, experience: updated });
                    }}
                    isPrintView={isPrintView}
                  />
                </div>
              )}

              {/* Description Edit (clicking opens textarea to edit raw bullet list) */}
              {!exp.hideDescription && (
                <div className="text-gray-700 text-xs">
                  {isPrintView ? (
                    <ul className="list-disc pl-4 space-y-0.5 mt-1 text-gray-700">
                      {renderBulletPoints(exp.description)}
                    </ul>
                  ) : (
                    <div className="mt-1 pl-4 border-l border-slate-100 hover:border-indigo-200 transition-colors">
                      <EditableField
                        value={exp.description}
                        placeholder="• List your achievements...\n• Use action verbs and percentages..."
                        onSave={(val) => {
                          const updated = experience.map((e, i) => i === idx ? { ...e, description: val } : e);
                          onChange({ ...data, experience: updated });
                        }}
                        isTextArea={true}
                        isPrintView={isPrintView}
                        className="text-gray-700 leading-normal w-full block whitespace-pre-line"
                      />
                    </div>
                  )}
                </div>
              )}

            </EditorItemBox>
          );
          })}

          {!isPrintView && (
            <button
              onClick={() => {
                const newItem = { id: `exp-${Date.now()}`, company: "New Company", role: "Job Title", location: "City, State", startDate: "2024-01", endDate: "Present", description: "• Engineered scaling features..." };
                onChange({ ...data, experience: [...experience, newItem] });
              }}
              className="w-full py-1.5 border border-dashed border-slate-200 text-slate-400 hover:text-indigo-500 hover:border-indigo-400 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <Plus size={12} /> Add Experience
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderEducation = (pageNum = 1) => {
    if (disabledSections.includes("education")) return null;
    const targetPage = experience.length > 2 ? 2 : 1;
    if (pageNum !== targetPage) return null;
    if (education.length === 0) return null;

    return (
      <div className={`print-section ${marginClass}`}>
        {renderSectionHeader("Education")}

        <div className="space-y-4">
          {education.map((edu, idx) => (
            <EditorItemBox 
              key={edu.id || idx}
              id={edu.id || `edu-${idx}`}
              type="education"
              index={idx}
              itemsArray={education}
              onAdd={() => {
                const newItem = { id: `edu-${Date.now()}`, institution: "University Name", degree: "Degree Title", location: "City, State", graduationDate: "2024", details: "Major coursework..." };
                onChange({ ...data, education: [...education, newItem] });
                setFocusedItemId(newItem.id);
              }}
              onDelete={() => handleDeleteListItem("education", idx)}
              toggles={[
                { label: "Degree Title", checked: !edu.hideTitle, onChange: (val) => {
                  const updated = education.map((e, i) => i === idx ? { ...e, hideTitle: !val } : e);
                  onChange({ ...data, education: updated });
                }},
                { label: "Institution Name", checked: !edu.hideCompany, onChange: (val) => {
                  const updated = education.map((e, i) => i === idx ? { ...e, hideCompany: !val } : e);
                  onChange({ ...data, education: updated });
                }},
                { label: "Details/Description", checked: !edu.hideDescription, onChange: (val) => {
                  const updated = education.map((e, i) => i === idx ? { ...e, hideDescription: !val } : e);
                  onChange({ ...data, education: updated });
                }},
                { label: "Location", checked: !edu.hideLocation, onChange: (val) => {
                  const updated = education.map((e, i) => i === idx ? { ...e, hideLocation: !val } : e);
                  onChange({ ...data, education: updated });
                }},
                { label: "Date Period", checked: !edu.hideDate, onChange: (val) => {
                  const updated = education.map((e, i) => i === idx ? { ...e, hideDate: !val } : e);
                  onChange({ ...data, education: updated });
                }}
              ]}
            >
              <div className="flex justify-between items-baseline font-bold text-gray-900 text-xs">
                <span>
                  {!edu.hideTitle && (
                    <EditableField
                      value={edu.degree}
                      placeholder="B.S. Computer Science"
                      onSave={(val) => {
                        const updated = education.map((e, i) => i === idx ? { ...e, degree: val } : e);
                        onChange({ ...data, education: updated });
                      }}
                      isPrintView={isPrintView}
                    />
                  )}
                  {!edu.hideTitle && edu.fieldOfStudy && (
                    <>
                      <span className="font-normal text-gray-400 mx-1">in</span>
                      <EditableField
                        value={edu.fieldOfStudy}
                        placeholder="Field of Study"
                        onSave={(val) => {
                          const updated = education.map((e, i) => i === idx ? { ...e, fieldOfStudy: val } : e);
                          onChange({ ...data, education: updated });
                        }}
                        isPrintView={isPrintView}
                      />
                    </>
                  )}
                </span>
                {!edu.hideDate && (
                  <span className="text-[10px] font-semibold tracking-wider shrink-0 uppercase" style={accentStyle}>
                    <EditableField
                      value={edu.graduationDate}
                      placeholder="2020-05"
                      onSave={(val) => {
                        const updated = education.map((e, i) => i === idx ? { ...e, graduationDate: val } : e);
                        onChange({ ...data, education: updated });
                      }}
                      isPrintView={isPrintView}
                    />
                  </span>
                )}
              </div>

              {(!edu.hideCompany || !edu.hideLocation) && (
                <div className="flex justify-between text-gray-600 italic text-[10px] font-medium">
                  {!edu.hideCompany ? (
                    <EditableField
                      value={edu.institution}
                      placeholder="University Name"
                      onSave={(val) => {
                        const updated = education.map((e, i) => i === idx ? { ...e, institution: val } : e);
                        onChange({ ...data, education: updated });
                      }}
                      isPrintView={isPrintView}
                    />
                  ) : <span />}
                  {!edu.hideLocation && (
                    <EditableField
                      value={edu.location}
                      placeholder="Berkeley, CA"
                      onSave={(val) => {
                        const updated = education.map((e, i) => i === idx ? { ...e, location: val } : e);
                        onChange({ ...data, education: updated });
                      }}
                      isPrintView={isPrintView}
                    />
                  )}
                </div>
              )}

              {!edu.hideDescription && (
                <div className="text-gray-500 mt-1 text-[10.5px]">
                  <EditableField
                    value={edu.details}
                    placeholder="GPA: 3.8/4.0. Core coursework..."
                    onSave={(val) => {
                      const updated = education.map((e, i) => i === idx ? { ...e, details: val } : e);
                      onChange({ ...data, education: updated });
                    }}
                    isPrintView={isPrintView}
                    className="w-full block leading-relaxed"
                  />
                </div>
              )}

            </EditorItemBox>
          ))}

          {!isPrintView && (
            <button
              onClick={() => {
                const newItem = { id: `edu-${Date.now()}`, institution: "University Name", degree: "Degree Title", location: "City, State", graduationDate: "2024", details: "Major coursework..." };
                onChange({ ...data, education: [...education, newItem] });
              }}
              className="w-full py-1.5 border border-dashed border-slate-200 text-slate-400 hover:text-indigo-500 hover:border-indigo-400 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <Plus size={12} /> Add Education
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderProjects = (pageNum = 1) => {
    if (disabledSections.includes("projects")) return null;
    if (pageNum !== 2) return null;
    if (projects.length === 0) return null;

    return (
      <div className={`print-section ${marginClass}`}>
        {renderSectionHeader("Featured Projects")}

        <div className="space-y-4">
          {projects.map((proj, idx) => (
            <EditorItemBox 
              key={proj.id || idx}
              id={proj.id || `proj-${idx}`}
              type="projects"
              index={idx}
              itemsArray={projects}
              onAdd={() => {
                const newItem = { id: `proj-${Date.now()}`, title: "New Project", techStack: "Technologies Used", link: "", description: "• Constructed frontend interfaces..." };
                onChange({ ...data, projects: [...projects, newItem] });
                setFocusedItemId(newItem.id);
              }}
              onDelete={() => handleDeleteListItem("projects", idx)}
              toggles={[
                { label: "Title", checked: !proj.hideTitle, onChange: (val) => {
                  const updated = projects.map((e, i) => i === idx ? { ...e, hideTitle: !val } : e);
                  onChange({ ...data, projects: updated });
                }},
                { label: "Tech Stack", checked: !proj.hideTech, onChange: (val) => {
                  const updated = projects.map((e, i) => i === idx ? { ...e, hideTech: !val } : e);
                  onChange({ ...data, projects: updated });
                }},
                { label: "Description", checked: !proj.hideDescription, onChange: (val) => {
                  const updated = projects.map((e, i) => i === idx ? { ...e, hideDescription: !val } : e);
                  onChange({ ...data, projects: updated });
                }},
                { label: "Link", checked: !proj.hideLink, onChange: (val) => {
                  const updated = projects.map((e, i) => i === idx ? { ...e, hideLink: !val } : e);
                  onChange({ ...data, projects: updated });
                }}
              ]}
            >
              <div className="flex justify-between items-baseline font-bold text-gray-900 text-xs">
                <span>
                  {!proj.hideTitle && (
                    <EditableField
                      value={proj.title}
                      placeholder="Project Name"
                      onSave={(val) => {
                        const updated = projects.map((e, i) => i === idx ? { ...e, title: val } : e);
                        onChange({ ...data, projects: updated });
                      }}
                      isPrintView={isPrintView}
                    />
                  )}
                  {!proj.hideTitle && proj.link && (
                    <a href={proj.link} target="_blank" rel="noreferrer" className="inline-flex items-center ml-1 text-gray-400 hover:text-indigo-600 no-print">
                      <ExternalLink size={10} />
                    </a>
                  )}
                </span>
                {!proj.hideTech && (
                  <span className="text-[10px] font-normal text-gray-500 italic shrink-0">
                    <EditableField
                      value={proj.techStack}
                      placeholder="React, Next.js, Node.js"
                      onSave={(val) => {
                        const updated = projects.map((e, i) => i === idx ? { ...e, techStack: val } : e);
                        onChange({ ...data, projects: updated });
                      }}
                      isPrintView={isPrintView}
                    />
                  </span>
                )}
              </div>

              {/* Editable link (visible only in editor) */}
              {!proj.hideLink && !isPrintView && (
                <div className="text-[9px] text-slate-400 mt-0.5">
                  <EditableField
                    value={proj.link}
                    placeholder="Add Project Link (https://...)"
                    onSave={(val) => {
                      const updated = projects.map((e, i) => i === idx ? { ...e, link: val } : e);
                      onChange({ ...data, projects: updated });
                    }}
                  />
                </div>
              )}

              {!proj.hideDescription && (
                <div className="text-gray-700 text-xs mt-1">
                  {isPrintView ? (
                    <ul className="list-disc pl-4 space-y-0.5 mt-1 text-gray-700">
                      {renderBulletPoints(proj.description)}
                    </ul>
                  ) : (
                    <div className="pl-4 border-l border-slate-100 hover:border-indigo-200 transition-colors mt-0.5">
                      <EditableField
                        value={proj.description}
                        placeholder="• Built a task manager...\n• Integrated stripe..."
                        onSave={(val) => {
                          const updated = projects.map((e, i) => i === idx ? { ...e, description: val } : e);
                          onChange({ ...data, projects: updated });
                        }}
                        isTextArea={true}
                        isPrintView={isPrintView}
                        className="text-gray-700 leading-normal w-full block whitespace-pre-line"
                      />
                    </div>
                  )}
                </div>
              )}

            </EditorItemBox>
          ))}

          {!isPrintView && (
            <button
              onClick={() => {
                const newItem = { id: `proj-${Date.now()}`, title: "New Project", techStack: "Technologies Used", link: "", description: "• Constructed frontend interfaces..." };
                onChange({ ...data, projects: [...projects, newItem] });
              }}
              className="w-full py-1.5 border border-dashed border-slate-200 text-slate-400 hover:text-indigo-500 hover:border-indigo-400 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <Plus size={12} /> Add Project
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderSkills = (pageNum = 1) => {
    if (disabledSections.includes("skills")) return null;
    const items = pageNum === 1 ? skills.slice(0, 2) : skills.slice(2);
    if (items.length === 0) return null;

    // Helper for rendering skills inside canvas
    const renderSkillPills = (itemsText, sectionIdx) => {
      if (!itemsText) return null;
      return (
        <div className="flex flex-wrap gap-1.5 mt-1.5">
          {itemsText.split(",").map((s, i) => {
            const trimmed = s.trim();
            if (!trimmed) return null;
            return (
              <span 
                key={i} 
                className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-50 text-slate-700 border border-slate-200/80 shadow-sm"
              >
                {trimmed}
              </span>
            );
          })}
        </div>
      );
    };

    return (
      <div className={`print-section ${marginClass}`}>
        {renderSectionHeader("Skills & Expertise")}

        <div className="space-y-2.5">
          {items.map((skill, subIdx) => {
            const idx = pageNum === 1 ? subIdx : subIdx + 2;
            return (
              <EditorItemBox 
                key={skill.id || idx}
                id={skill.id || `skill-${idx}`}
                type="skills"
                index={idx}
                itemsArray={skills}
                onAdd={() => {
                  const newItem = { id: `skill-${Date.now()}`, category: "Category Title", items: "Skill A, Skill B, Skill C" };
                  onChange({ ...data, skills: [...skills, newItem] });
                  setFocusedItemId(newItem.id);
                }}
                onDelete={() => handleDeleteListItem("skills", idx)}
              >
                <div className="flex items-start gap-2.5 w-full">
                  <div className="w-24 shrink-0 text-left font-bold text-gray-900 text-[10.5px] pt-1">
                    <EditableField
                      value={skill.category}
                      placeholder="Category"
                      onSave={(val) => {
                        const updated = skills.map((e, i) => i === idx ? { ...e, category: val } : e);
                        onChange({ ...data, skills: updated });
                      }}
                      isPrintView={isPrintView}
                      className="font-bold text-gray-900"
                    />
                  </div>

                  <div className="flex-1">
                    {isPrintView ? (
                      renderSkillPills(skill.items, idx)
                    ) : (
                      <EditableField
                        value={skill.items}
                        placeholder="Item 1, Item 2, Item 3"
                        onSave={(val) => {
                          const updated = skills.map((e, i) => i === idx ? { ...e, items: val } : e);
                          onChange({ ...data, skills: updated });
                        }}
                        isPrintView={isPrintView}
                        className="text-gray-700 text-xs w-full block"
                      />
                    )}
                  </div>
                </div>

              </EditorItemBox>
            );
          })}

          {!isPrintView && (
            <button
              onClick={() => {
                const newItem = { id: `skill-${Date.now()}`, category: "Category Title", items: "Skill A, Skill B, Skill C" };
                onChange({ ...data, skills: [...skills, newItem] });
              }}
              className="w-full py-1 border border-dashed border-slate-200 text-slate-400 hover:text-indigo-500 hover:border-indigo-400 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <Plus size={11} /> Add Skill Set
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderCertifications = () => {
    if (disabledSections.includes("certifications")) return null;
    if (certifications.length === 0 && isPrintView) return null;

    return (
      <div className={`print-section ${marginClass}`}>
        {renderSectionHeader("Certifications")}

        <div className="grid grid-cols-1 gap-2">
          {certifications.map((cert, idx) => (
            <div key={cert.id || idx} className="editable-item-wrap group p-2.5 border border-gray-100 bg-slate-50/50 rounded-lg relative flex justify-between items-start">
              
              {!isPrintView && (
                <div className="editable-item-controls absolute right-2 top-2 bg-slate-900/90 text-white rounded-lg border border-slate-700/80 px-1 py-0.5 shadow-lg flex items-center gap-1 text-[10px]">
                  <button onClick={() => handleMoveListItem("certifications", idx, "up")} disabled={idx === 0} className="p-0.5 hover:bg-slate-800 rounded disabled:opacity-20 cursor-pointer"><ArrowUp size={10} /></button>
                  <button onClick={() => handleMoveListItem("certifications", idx, "down")} disabled={idx === certifications.length - 1} className="p-0.5 hover:bg-slate-800 rounded disabled:opacity-20 cursor-pointer"><ArrowDown size={10} /></button>
                  <button onClick={() => handleDeleteListItem("certifications", idx)} className="p-0.5 hover:bg-red-950 text-red-400 rounded cursor-pointer"><Trash2 size={10} /></button>
                </div>
              )}

              <div className="text-xs">
                <span className="font-semibold text-gray-900 block">
                  <EditableField
                    value={cert.name}
                    placeholder="AWS Solutions Architect"
                    onSave={(val) => {
                      const updated = certifications.map((e, i) => i === idx ? { ...e, name: val } : e);
                      onChange({ ...data, certifications: updated });
                    }}
                    isPrintView={isPrintView}
                  />
                </span>
                <span className="text-gray-500 block text-[9.5px] mt-0.5">
                  <EditableField
                    value={cert.issuer}
                    placeholder="Amazon Web Services"
                    onSave={(val) => {
                      const updated = certifications.map((e, i) => i === idx ? { ...e, issuer: val } : e);
                      onChange({ ...data, certifications: updated });
                    }}
                    isPrintView={isPrintView}
                  />
                </span>
              </div>

              <span className="text-gray-400 text-[9.5px] font-semibold uppercase tracking-wider shrink-0 mt-0.5">
                <EditableField
                  value={cert.date}
                  placeholder="2024-01"
                  onSave={(val) => {
                    const updated = certifications.map((e, i) => i === idx ? { ...e, date: val } : e);
                    onChange({ ...data, certifications: updated });
                  }}
                  isPrintView={isPrintView}
                />
              </span>

            </div>
          ))}

          {!isPrintView && (
            <button
              onClick={() => {
                const newItem = { id: `cert-${Date.now()}`, name: "Certification Name", issuer: "Issuing Authority", date: "2024" };
                onChange({ ...data, certifications: [...certifications, newItem] });
              }}
              className="w-full py-1 border border-dashed border-slate-200 text-slate-400 hover:text-indigo-500 hover:border-indigo-400 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <Plus size={11} /> Add Certification
            </button>
          )}
        </div>
      </div>
    );
  };

  // ENHANCV-SPECIFIC SECTIONS
  // ----------------------------------------------------

  const renderStrengths = () => {
    if (disabledSections.includes("strengths")) return null;
    if (strengths.length === 0 && isPrintView) return null;

    return (
      <div className={`print-section ${marginClass}`}>
        {renderSectionHeader("Strengths")}

        <div className="space-y-3">
          {strengths.map((str, idx) => (
            <div key={str.id || idx} className="editable-item-wrap group p-2 -m-2 relative">
              
              {!isPrintView && (
                <div className="editable-item-controls absolute right-2 top-2 bg-slate-900/90 text-white rounded-lg border border-slate-700/80 px-1 py-0.5 shadow-lg flex items-center gap-1 text-[10px]">
                  <button onClick={() => handleMoveListItem("strengths", idx, "up")} disabled={idx === 0} className="p-0.5 hover:bg-slate-800 rounded disabled:opacity-20 cursor-pointer"><ArrowUp size={10} /></button>
                  <button onClick={() => handleMoveListItem("strengths", idx, "down")} disabled={idx === strengths.length - 1} className="p-0.5 hover:bg-slate-800 rounded disabled:opacity-20 cursor-pointer"><ArrowDown size={10} /></button>
                  <button onClick={() => handleDeleteListItem("strengths", idx)} className="p-0.5 hover:bg-red-950 text-red-400 rounded cursor-pointer"><Trash2 size={10} /></button>
                </div>
              )}

              <div className="text-xs">
                <span className="font-extrabold text-gray-900 uppercase tracking-wide block">
                  <EditableField
                    value={str.name}
                    placeholder="Problem Solving"
                    onSave={(val) => {
                      const updated = strengths.map((s, i) => i === idx ? { ...s, name: val } : s);
                      onChange({ ...data, strengths: updated });
                    }}
                    isPrintView={isPrintView}
                  />
                </span>
                <span className="text-gray-600 block text-[10px] leading-relaxed mt-0.5">
                  <EditableField
                    value={str.description}
                    placeholder="Describe how this strength helps you deliver projects..."
                    onSave={(val) => {
                      const updated = strengths.map((s, i) => i === idx ? { ...s, description: val } : s);
                      onChange({ ...data, strengths: updated });
                    }}
                    isPrintView={isPrintView}
                  />
                </span>
              </div>

            </div>
          ))}

          {!isPrintView && (
            <button
              onClick={() => {
                const newItem = { id: `str-${Date.now()}`, name: "New Strength", description: "Short description of strength/skill..." };
                onChange({ ...data, strengths: [...strengths, newItem] });
              }}
              className="w-full py-1 border border-dashed border-slate-200 text-slate-400 hover:text-indigo-500 hover:border-indigo-400 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <Plus size={11} /> Add Strength
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderLanguages = (pageNum = 1) => {
    if (disabledSections.includes("languages")) return null;
    const items = pageNum === 1 ? languages.slice(0, 2) : languages.slice(2);
    if (items.length === 0) return null;

    return (
      <div className={`print-section ${marginClass}`}>
        {renderSectionHeader("Languages")}

        <div className="space-y-2.5">
          {items.map((lang, subIdx) => {
            const idx = pageNum === 1 ? subIdx : subIdx + 2;
            return (
              <EditorItemBox 
                key={lang.id || idx}
                id={lang.id || `lang-${idx}`}
                type="languages"
                index={idx}
                itemsArray={languages}
                onAdd={() => {
                  const newItem = { id: `lang-${Date.now()}`, name: "New Language", level: "Proficiency Level", rating: 4 };
                  onChange({ ...data, languages: [...languages, newItem] });
                  setFocusedItemId(newItem.id);
                }}
                onDelete={() => handleDeleteListItem("languages", idx)}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="text-xs">
                    <span className="font-bold text-gray-900 block">
                      <EditableField
                        value={lang.name}
                        placeholder="Spanish"
                        onSave={(val) => {
                          const updated = languages.map((l, i) => i === idx ? { ...l, name: val } : l);
                          onChange({ ...data, languages: updated });
                        }}
                        isPrintView={isPrintView}
                      />
                    </span>
                    <span className="text-gray-500 block text-[9.5px] mt-0.5">
                      <EditableField
                        value={lang.level}
                        placeholder="Full Professional Proficiency"
                        onSave={(val) => {
                          const updated = languages.map((l, i) => i === idx ? { ...l, level: val } : l);
                          onChange({ ...data, languages: updated });
                        }}
                        isPrintView={isPrintView}
                      />
                    </span>
                  </div>

                  {/* Visual Rating Indicator (Dots) */}
                  <div className="flex items-center gap-1 shrink-0 ml-4">
                    {[1, 2, 3, 4, 5].map((dot) => {
                      const isActive = dot <= (lang.rating || 5);
                      return (
                        <button
                          key={dot}
                          onClick={() => {
                            if (isPrintView) return;
                            const updated = languages.map((l, i) => i === idx ? { ...l, rating: dot } : l);
                            onChange({ ...data, languages: updated });
                          }}
                          className={`w-2.5 h-2.5 rounded-full transition-all shrink-0 ${
                            isPrintView ? "pointer-events-none" : "cursor-pointer hover:scale-125"
                          }`}
                          style={{
                            backgroundColor: isActive ? accentColor : "#e2e8f0"
                          }}
                        />
                      );
                    })}
                  </div>
                </div>

              </EditorItemBox>
            );
          })}

          {!isPrintView && (
            <button
              onClick={() => {
                const newItem = { id: `lang-${Date.now()}`, name: "New Language", level: "Proficiency Level", rating: 4 };
                onChange({ ...data, languages: [...languages, newItem] });
              }}
              className="w-full py-1 border border-dashed border-slate-200 text-slate-400 hover:text-indigo-500 hover:border-indigo-400 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <Plus size={11} /> Add Language
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderAchievements = () => {
    if (disabledSections.includes("achievements")) return null;
    if (achievements.length === 0 && isPrintView) return null;

    return (
      <div className={`print-section ${marginClass}`}>
        {renderSectionHeader("Achievements")}

        <div className="space-y-2">
          {achievements.map((ach, idx) => (
            <div key={ach.id || idx} className="editable-item-wrap group p-2 -m-2 relative flex items-start gap-2">
              
              {!isPrintView && (
                <div className="editable-item-controls absolute right-2 top-2 bg-slate-900/90 text-white rounded-lg border border-slate-700/80 px-1 py-0.5 shadow-lg flex items-center gap-1 text-[10px]">
                  <button onClick={() => handleMoveListItem("achievements", idx, "up")} disabled={idx === 0} className="p-0.5 hover:bg-slate-800 rounded disabled:opacity-20 cursor-pointer"><ArrowUp size={10} /></button>
                  <button onClick={() => handleMoveListItem("achievements", idx, "down")} disabled={idx === achievements.length - 1} className="p-0.5 hover:bg-slate-800 rounded disabled:opacity-20 cursor-pointer"><ArrowDown size={10} /></button>
                  <button onClick={() => handleDeleteListItem("achievements", idx)} className="p-0.5 hover:bg-red-950 text-red-400 rounded cursor-pointer"><Trash2 size={10} /></button>
                </div>
              )}

              <span className="text-[12px] pt-0.5" style={accentStyle}>🏆</span>
              <div className="flex-1 text-xs text-gray-700 leading-normal">
                <EditableField
                  value={ach.text}
                  placeholder="Describe your award, key metric bump, or professional milestone..."
                  onSave={(val) => {
                    const updated = achievements.map((a, i) => i === idx ? { ...a, text: val } : a);
                    onChange({ ...data, achievements: updated });
                  }}
                  isPrintView={isPrintView}
                  className="font-medium text-gray-700"
                />
              </div>

            </div>
          ))}

          {!isPrintView && (
            <button
              onClick={() => {
                const newItem = { id: `ach-${Date.now()}`, text: "New professional milestone or award..." };
                onChange({ ...data, achievements: [...achievements, newItem] });
              }}
              className="w-full py-1 border border-dashed border-slate-200 text-slate-400 hover:text-indigo-500 hover:border-indigo-400 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <Plus size={11} /> Add Achievement
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderPassions = () => {
    if (disabledSections.includes("passions")) return null;
    if (passions.length === 0 && isPrintView) return null;

    return (
      <div className={`print-section ${marginClass}`}>
        {renderSectionHeader("Passions & Hobbies")}

        <div className="space-y-3">
          {passions.map((pass, idx) => (
            <div key={pass.id || idx} className="editable-item-wrap group p-2 -m-2 relative">
              
              {!isPrintView && (
                <div className="editable-item-controls absolute right-2 top-2 bg-slate-900/90 text-white rounded-lg border border-slate-700/80 px-1 py-0.5 shadow-lg flex items-center gap-1 text-[10px]">
                  <button onClick={() => handleMoveListItem("passions", idx, "up")} disabled={idx === 0} className="p-0.5 hover:bg-slate-800 rounded disabled:opacity-20 cursor-pointer"><ArrowUp size={10} /></button>
                  <button onClick={() => handleMoveListItem("passions", idx, "down")} disabled={idx === passions.length - 1} className="p-0.5 hover:bg-slate-800 rounded disabled:opacity-20 cursor-pointer"><ArrowDown size={10} /></button>
                  <button onClick={() => handleDeleteListItem("passions", idx)} className="p-0.5 hover:bg-red-950 text-red-400 rounded cursor-pointer"><Trash2 size={10} /></button>
                </div>
              )}

              <div className="text-xs">
                <span className="font-bold text-gray-900 block">
                  <EditableField
                    value={pass.name}
                    placeholder="Passionate Activity"
                    onSave={(val) => {
                      const updated = passions.map((p, i) => i === idx ? { ...p, name: val } : p);
                      onChange({ ...data, passions: updated });
                    }}
                    isPrintView={isPrintView}
                  />
                </span>
                <span className="text-gray-500 block text-[9.5px] leading-relaxed mt-0.5">
                  <EditableField
                    value={pass.description}
                    placeholder="Short description of this interest/passion..."
                    onSave={(val) => {
                      const updated = passions.map((p, i) => i === idx ? { ...p, description: val } : p);
                      onChange({ ...data, passions: updated });
                    }}
                    isPrintView={isPrintView}
                  />
                </span>
              </div>

            </div>
          ))}

          {!isPrintView && (
            <button
              onClick={() => {
                const newItem = { id: `pass-${Date.now()}`, name: "New Hobby / Passion", description: "Details of your interest..." };
                onChange({ ...data, passions: [...passions, newItem] });
              }}
              className="w-full py-1 border border-dashed border-slate-200 text-slate-400 hover:text-indigo-500 hover:border-indigo-400 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <Plus size={11} /> Add Passion
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderBooks = () => {
    if (disabledSections.includes("books")) return null;
    if (books.length === 0 && isPrintView) return null;

    return (
      <div className={`print-section ${marginClass}`}>
        {renderSectionHeader("Books I Read")}

        <div className="space-y-2">
          {books.map((book, idx) => (
            <div key={book.id || idx} className="editable-item-wrap group p-2 -m-2 relative flex items-center gap-1 text-xs">
              
              {!isPrintView && (
                <div className="editable-item-controls absolute right-2 top-2 bg-slate-900/90 text-white rounded-lg border border-slate-700/80 px-1 py-0.5 shadow-lg flex items-center gap-1 text-[10px]">
                  <button onClick={() => handleMoveListItem("books", idx, "up")} disabled={idx === 0} className="p-0.5 hover:bg-slate-800 rounded disabled:opacity-20 cursor-pointer"><ArrowUp size={10} /></button>
                  <button onClick={() => handleMoveListItem("books", idx, "down")} disabled={idx === books.length - 1} className="p-0.5 hover:bg-slate-800 rounded disabled:opacity-20 cursor-pointer"><ArrowDown size={10} /></button>
                  <button onClick={() => handleDeleteListItem("books", idx)} className="p-0.5 hover:bg-red-950 text-red-400 rounded cursor-pointer"><Trash2 size={10} /></button>
                </div>
              )}

              <span className="text-[11px]" style={accentStyle}>📖</span>
              <span className="font-bold text-gray-800 italic">
                <EditableField
                  value={book.title}
                  placeholder="Book Title"
                  onSave={(val) => {
                    const updated = books.map((b, i) => i === idx ? { ...b, title: val } : b);
                    onChange({ ...data, books: updated });
                  }}
                  isPrintView={isPrintView}
                />
              </span>
              <span className="text-gray-400 mx-1">by</span>
              <span className="text-gray-500 font-medium">
                <EditableField
                  value={book.author}
                  placeholder="Author Name"
                  onSave={(val) => {
                    const updated = books.map((b, i) => i === idx ? { ...b, author: val } : b);
                    onChange({ ...data, books: updated });
                  }}
                  isPrintView={isPrintView}
                />
              </span>

            </div>
          ))}

          {!isPrintView && (
            <button
              onClick={() => {
                const newItem = { id: `book-${Date.now()}`, title: "Book Title", author: "Author" };
                onChange({ ...data, books: [...books, newItem] });
              }}
              className="w-full py-1 border border-dashed border-slate-200 text-slate-400 hover:text-indigo-500 hover:border-indigo-400 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <Plus size={11} /> Add Book
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderQuotes = () => {
    if (disabledSections.includes("quotes")) return null;
    if (quotes.length === 0 && isPrintView) return null;

    return (
      <div className={`print-section ${marginClass}`}>
        {renderSectionHeader("Favorite Quotes")}

        <div className="space-y-3">
          {quotes.map((q, idx) => (
            <div key={q.id || idx} className="editable-item-wrap group p-2 -m-2 relative text-center">
              
              {!isPrintView && (
                <div className="editable-item-controls absolute right-2 top-2 bg-slate-900/90 text-white rounded-lg border border-slate-700/80 px-1 py-0.5 shadow-lg flex items-center gap-1 text-[10px]">
                  <button onClick={() => handleMoveListItem("quotes", idx, "up")} disabled={idx === 0} className="p-0.5 hover:bg-slate-800 rounded disabled:opacity-20 cursor-pointer"><ArrowUp size={10} /></button>
                  <button onClick={() => handleMoveListItem("quotes", idx, "down")} disabled={idx === quotes.length - 1} className="p-0.5 hover:bg-slate-800 rounded disabled:opacity-20 cursor-pointer"><ArrowDown size={10} /></button>
                  <button onClick={() => handleDeleteListItem("quotes", idx)} className="p-0.5 hover:bg-red-950 text-red-400 rounded cursor-pointer"><Trash2 size={10} /></button>
                </div>
              )}

              <div className="text-gray-700 text-xs italic leading-relaxed">
                <span className="text-gray-300 font-serif text-lg leading-none mr-0.5">“</span>
                <EditableField
                  value={q.text}
                  placeholder="Enter quote here..."
                  onSave={(val) => {
                    const updated = quotes.map((item, i) => i === idx ? { ...item, text: val } : item);
                    onChange({ ...data, quotes: updated });
                  }}
                  isPrintView={isPrintView}
                />
                <span className="text-gray-300 font-serif text-lg leading-none ml-0.5">”</span>
              </div>
              <div className="text-[10px] font-semibold text-gray-500 mt-1 uppercase tracking-wider">
                <span className="mr-0.5">—</span>
                <EditableField
                  value={q.author}
                  placeholder="Author"
                  onSave={(val) => {
                    const updated = quotes.map((item, i) => i === idx ? { ...item, author: val } : item);
                    onChange({ ...data, quotes: updated });
                  }}
                  isPrintView={isPrintView}
                />
              </div>

            </div>
          ))}

          {!isPrintView && (
            <button
              onClick={() => {
                const newItem = { id: `quote-${Date.now()}`, text: "Clean code always looks like it was written by someone who cares.", author: "Michael Feathers" };
                onChange({ ...data, quotes: [...quotes, newItem] });
              }}
              className="w-full py-1 border border-dashed border-slate-200 text-slate-400 hover:text-indigo-500 hover:border-indigo-400 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <Plus size={11} /> Add Quote
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderDayInLife = () => {
    if (disabledSections.includes("dayInLife")) return null;
    if (dayInLife.length === 0 && isPrintView) return null;

    let accumulatedPercent = 0;
    const radius = 38;
    const circumference = 2 * Math.PI * radius; // ~238.76
    const strokeWidth = 14;
    const center = 50;

    // Harmonized colors for Day in My Life chart
    const chartColors = ["#4f46e5", "#10b981", "#f59e0b", "#f43f5e", "#8b5cf6", "#06b6d4"];

    return (
      <div className={`print-section ${marginClass}`}>
        {renderSectionHeader("A Day in My Life")}

        <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50/50 p-3.5 rounded-xl border border-slate-100/80">
          
          {/* SVG Pie Ring Donut Chart */}
          <div className="relative w-28 h-28 shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              <circle cx={center} cy={center} r={radius} fill="transparent" stroke="#f1f5f9" strokeWidth={strokeWidth} />
              {dayInLife.map((item, idx) => {
                const percent = Math.min(Math.max(item.percentage || 0, 0), 100);
                const strokeLength = (percent / 100) * circumference;
                const offset = circumference - (accumulatedPercent / 100) * circumference;
                accumulatedPercent += percent;
                const color = chartColors[idx % chartColors.length];

                return (
                  <circle
                    key={item.id || idx}
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="transparent"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${strokeLength} ${circumference}`}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className="pie-segment"
                  />
                );
              })}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[9px] font-bold uppercase text-gray-400 tracking-wide leading-none">Time Spent</span>
              <span className="text-[10px] font-black text-gray-700 uppercase mt-0.5 whitespace-nowrap">My Day</span>
            </div>
          </div>

          {/* List items with inline edit capability */}
          <div className="flex-1 space-y-1 w-full text-xs text-gray-600 font-medium">
            {dayInLife.map((item, idx) => {
              const color = chartColors[idx % chartColors.length];
              return (
                <div key={item.id || idx} className="flex items-center justify-between gap-2 group/dil text-[11px]">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                    <EditableField
                      value={item.activity}
                      placeholder="Coding, Meetings..."
                      onSave={(val) => {
                        const updated = dayInLife.map((d, i) => i === idx ? { ...d, activity: val } : d);
                        onChange({ ...data, dayInLife: updated });
                      }}
                      isPrintView={isPrintView}
                      className="truncate text-gray-700 font-semibold"
                    />
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {!isPrintView ? (
                      <input
                        type="number"
                        value={item.percentage}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0;
                          const updated = dayInLife.map((d, i) => i === idx ? { ...d, percentage: val } : d);
                          onChange({ ...data, dayInLife: updated });
                        }}
                        className="w-8 bg-slate-100 text-center rounded text-[10px] font-bold text-gray-900 border-0 py-0.5 text-gray-950 font-mono"
                        min="0"
                        max="100"
                      />
                    ) : (
                      <span className="font-bold text-gray-900">{item.percentage}</span>
                    )}
                    <span className="text-gray-400">%</span>
                    
                    {!isPrintView && (
                      <button
                        onClick={() => {
                          const updated = dayInLife.filter((_, i) => i !== idx);
                          onChange({ ...data, dayInLife: updated });
                        }}
                        className="text-red-400 hover:text-red-600 font-bold ml-1 text-xs opacity-0 group-hover/dil:opacity-100 transition-opacity"
                        title="Delete"
                      >
                        ×
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {!isPrintView && dayInLife.length < 6 && (
              <button
                onClick={() => {
                  const newItem = { id: `dil-${Date.now()}`, activity: "Coding & Design", percentage: 25 };
                  onChange({ ...data, dayInLife: [...dayInLife, newItem] });
                }}
                className="text-[9.5px] font-bold text-indigo-500 hover:text-indigo-600 flex items-center gap-0.5 mt-2.5 cursor-pointer"
              >
                <Plus size={10} /> Add Activity
              </button>
            )}
          </div>

        </div>
      </div>
    );
  };

  const renderCustomSection = (sectionId) => {
    if (disabledSections.includes(sectionId)) return null;
    const custSec = customSections.find(c => c.id === sectionId);
    if (!custSec) return null;
    if (custSec.items.length === 0 && isPrintView) return null;

    return (
      <div key={sectionId} className={`print-section ${marginClass}`}>
        <div className="flex justify-between items-baseline mb-2 group/sec">
          {/* Section Title Inline Editable */}
          <div className="flex items-center gap-2">
            {renderSectionHeader(
              <EditableField
                value={custSec.title}
                placeholder="Section Title"
                onSave={(val) => {
                  const updated = customSections.map(c => c.id === sectionId ? { ...c, title: val } : c);
                  onChange({ ...data, customSections: updated });
                }}
                isPrintView={isPrintView}
                className="font-bold"
              />
            )}
            
            {/* Trash button to delete entire custom section (Only in Editor) */}
            {!isPrintView && (
              <button
                onClick={() => {
                  if (confirm(`Delete the entire custom section "${custSec.title}"?`)) {
                    const updatedCustoms = customSections.filter(c => c.id !== sectionId);
                    const updatedLeft = (layoutSettings.leftColumnSections || []).filter(id => id !== sectionId);
                    const updatedRight = (layoutSettings.rightColumnSections || []).filter(id => id !== sectionId);
                    const updatedOrder = (layoutSettings.sectionOrder || []).filter(id => id !== sectionId);

                    onChange({
                      ...data,
                      customSections: updatedCustoms,
                      layoutSettings: {
                        ...data.layoutSettings,
                        leftColumnSections: updatedLeft,
                        rightColumnSections: updatedRight,
                        sectionOrder: updatedOrder
                      }
                    });
                  }
                }}
                className="text-red-400 hover:text-red-600 hover:bg-slate-100 p-1 rounded opacity-0 group-hover/sec:opacity-100 transition-opacity no-print"
                title="Delete Section"
              >
                <Trash2 size={11} />
              </button>
            )}
          </div>
        </div>

        <div className="space-y-3">
          {custSec.items.map((item, idx) => (
            <div key={item.id || idx} className="editable-item-wrap group p-2 -m-2 relative">
              
              {!isPrintView && (
                <div className="editable-item-controls absolute right-2 top-2 bg-slate-900/90 text-white rounded-lg border border-slate-700/80 px-1 py-0.5 shadow-lg flex items-center gap-1 text-[10px]">
                  <button
                    onClick={() => {
                      if (idx === 0) return;
                      const updatedItems = [...custSec.items];
                      const temp = updatedItems[idx];
                      updatedItems[idx] = updatedItems[idx - 1];
                      updatedItems[idx - 1] = temp;
                      const updatedCustoms = customSections.map(c => c.id === sectionId ? { ...c, items: updatedItems } : c);
                      onChange({ ...data, customSections: updatedCustoms });
                    }}
                    disabled={idx === 0}
                    className="p-0.5 hover:bg-slate-800 rounded disabled:opacity-20 cursor-pointer"
                  >
                    <ArrowUp size={10} />
                  </button>
                  <button
                    onClick={() => {
                      if (idx === custSec.items.length - 1) return;
                      const updatedItems = [...custSec.items];
                      const temp = updatedItems[idx];
                      updatedItems[idx] = updatedItems[idx + 1];
                      updatedItems[idx + 1] = temp;
                      const updatedCustoms = customSections.map(c => c.id === sectionId ? { ...c, items: updatedItems } : c);
                      onChange({ ...data, customSections: updatedCustoms });
                    }}
                    disabled={idx === custSec.items.length - 1}
                    className="p-0.5 hover:bg-slate-800 rounded disabled:opacity-20 cursor-pointer"
                  >
                    <ArrowDown size={10} />
                  </button>
                  <button
                    onClick={() => {
                      const updatedItems = custSec.items.filter((_, i) => i !== idx);
                      const updatedCustoms = customSections.map(c => c.id === sectionId ? { ...c, items: updatedItems } : c);
                      onChange({ ...data, customSections: updatedCustoms });
                    }}
                    className="p-0.5 hover:bg-red-950 text-red-400 rounded cursor-pointer"
                  >
                    <Trash2 size={10} />
                  </button>
                </div>
              )}

              <div className="flex justify-between items-baseline font-bold text-gray-900 text-xs">
                <span>
                  <EditableField
                    value={item.title}
                    placeholder="Entry Title"
                    onSave={(val) => {
                      const updatedItems = custSec.items.map((it, i) => i === idx ? { ...it, title: val } : it);
                      const updatedCustoms = customSections.map(c => c.id === sectionId ? { ...c, items: updatedItems } : c);
                      onChange({ ...data, customSections: updatedCustoms });
                    }}
                    isPrintView={isPrintView}
                  />
                  {item.subtitle && (
                    <>
                      <span className="font-normal text-gray-400 mx-1.5">|</span>
                      <EditableField
                        value={item.subtitle}
                        placeholder="Subtitle"
                        onSave={(val) => {
                          const updatedItems = custSec.items.map((it, i) => i === idx ? { ...it, subtitle: val } : it);
                          const updatedCustoms = customSections.map(c => c.id === sectionId ? { ...c, items: updatedItems } : c);
                          onChange({ ...data, customSections: updatedCustoms });
                        }}
                        isPrintView={isPrintView}
                        className="font-medium text-gray-600"
                      />
                    </>
                  )}
                </span>
                <span className="text-[10px] font-semibold tracking-wider shrink-0 uppercase" style={accentStyle}>
                  <EditableField
                    value={item.date}
                    placeholder="Date / Period"
                    onSave={(val) => {
                      const updatedItems = custSec.items.map((it, i) => i === idx ? { ...it, date: val } : it);
                      const updatedCustoms = customSections.map(c => c.id === sectionId ? { ...c, items: updatedItems } : c);
                      onChange({ ...data, customSections: updatedCustoms });
                    }}
                    isPrintView={isPrintView}
                  />
                </span>
              </div>

              <div className="text-gray-700 text-xs mt-1">
                {isPrintView ? (
                  <ul className="list-disc pl-4 space-y-0.5 mt-1 text-gray-700">
                    {renderBulletPoints(item.description)}
                  </ul>
                ) : (
                  <div className="pl-4 border-l border-slate-100 hover:border-indigo-200 transition-colors mt-0.5">
                    <EditableField
                      value={item.description}
                      placeholder="• Entry description details..."
                      onSave={(val) => {
                        const updatedItems = custSec.items.map((it, i) => i === idx ? { ...it, description: val } : it);
                        const updatedCustoms = customSections.map(c => c.id === sectionId ? { ...c, items: updatedItems } : c);
                        onChange({ ...data, customSections: updatedCustoms });
                      }}
                      isTextArea={true}
                      isPrintView={isPrintView}
                      className="text-gray-700 leading-normal w-full block whitespace-pre-line"
                    />
                  </div>
                )}
              </div>

            </div>
          ))}

          {!isPrintView && (
            <button
              onClick={() => {
                const newItem = { id: `citem-${Date.now()}`, title: "New Entry Title", subtitle: "Subtitle Details", date: "2024", description: "• Details..." };
                const updatedItems = [...custSec.items, newItem];
                const updatedCustoms = customSections.map(c => c.id === sectionId ? { ...c, items: updatedItems } : c);
                onChange({ ...data, customSections: updatedCustoms });
              }}
              className="w-full py-1.5 border border-dashed border-slate-200 text-slate-400 hover:text-indigo-500 hover:border-indigo-400 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
            >
              <Plus size={11} /> Add Entry
            </button>
          )}
        </div>
      </div>
    );
  };

  const dispatchSection = (sectionId, pageNum = 1) => {
    if (sectionId.startsWith("custom_")) {
      // Custom sections go to page 2 if pageNum === 2, else ignore
      if (pageNum === 1) return null;
      return renderCustomSection(sectionId);
    }

    switch (sectionId) {
      case "summary":
        return pageNum === 1 ? renderSummary() : null;
      case "experience":
        return renderExperience(pageNum);
      case "education":
        return renderEducation(pageNum);
      case "projects":
        return renderProjects(pageNum);
      case "skills":
        return renderSkills(pageNum);
      case "certifications":
        return pageNum === 1 ? renderCertifications() : null;
      case "strengths":
        return pageNum === 2 ? renderStrengths() : null;
      case "languages":
        return renderLanguages(pageNum);
      case "achievements":
        return pageNum === 2 ? renderAchievements() : null;
      case "passions":
        return pageNum === 2 ? renderPassions() : null;
      case "books":
        return pageNum === 2 ? renderBooks() : null;
      case "quotes":
        return pageNum === 2 ? renderQuotes() : null;
      case "dayInLife":
        return pageNum === 2 ? renderDayInLife() : null;
      default:
        return null;
    }
  };

  // COLUMN LAYOUT WIDTHS
  const getColumnWidths = () => {
    switch (columnRatio) {
      case "50-50":
        return { left: "w-1/2", right: "w-1/2" };
      case "70-30":
        return { left: "w-[70%]", right: "w-[30%]" };
      case "60-40":
      default:
        return { left: "w-[60%]", right: "w-[40%]" };
    }
  };

  const colWidths = getColumnWidths();

  const renderPage = (pageNum) => {
    return (
      <div 
        className={`resume-preview-sheet ${fontConfig.bodyClass} ${sizeConfig.body} ${paddingClass} ${leadingClass} flex flex-col bg-white text-gray-800 relative w-[210mm] min-h-[297mm] p-[20mm] ${
          isPrintView ? 'page-break-container' : 'shadow-xl rounded-lg mb-6'
        }`}
        style={pageNum === 2 && isPrintView ? { pageBreakBefore: "always", breakBefore: "page" } : {}}
      >
        {/* 1. HEADER SECTION (Always Full Width - only on page 1) */}
        {pageNum === 1 && (
          <header className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 mb-4 border-b-2" style={borderPrimaryStyle}>
            
            {/* Left Side: Name and Professional Title */}
            <div className="flex-1 space-y-1">
              <h1 className={`${fontConfig.headingClass} ${sizeConfig.h1} tracking-tight leading-none text-gray-900`}>
                <EditableField
                  value={personalInfo.firstName}
                  placeholder="First Name"
                  onSave={(val) => handlePersonalChange("firstName", val)}
                  isPrintView={isPrintView}
                  className={`${fontConfig.headingClass} ${sizeConfig.h1} tracking-tight leading-none text-gray-900`}
                />
                <span className="mx-1"></span>
                <EditableField
                  value={personalInfo.lastName}
                  placeholder="Last Name"
                  onSave={(val) => handlePersonalChange("lastName", val)}
                  isPrintView={isPrintView}
                  className={`${fontConfig.headingClass} ${sizeConfig.h1} tracking-tight leading-none text-gray-900`}
                />
              </h1>
              
              <div className="text-[12px] font-bold tracking-wider uppercase mt-1.5" style={accentStyle}>
                <EditableField
                  value={personalInfo.title}
                  placeholder="Professional Title"
                  onSave={(val) => handlePersonalChange("title", val)}
                  isPrintView={isPrintView}
                  className="font-bold text-[12px]"
                />
              </div>
            </div>

            {/* Right Side: Contact Info Grid (Sleek grid) */}
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10.5px] text-gray-600 font-semibold shrink-0">
              {/* Email */}
              <div className="flex items-center gap-1.5">
                <Mail size={11} className="text-gray-400" />
                <EditableField
                  value={personalInfo.email}
                  placeholder="email@example.com"
                  onSave={(val) => handlePersonalChange("email", val)}
                  isPrintView={isPrintView}
                />
              </div>

              {/* Phone */}
              <div className="flex items-center gap-1.5">
                <Phone size={11} className="text-gray-400" />
                <EditableField
                  value={personalInfo.phone}
                  placeholder="+1 (555) 012-3456"
                  onSave={(val) => handlePersonalChange("phone", val)}
                  isPrintView={isPrintView}
                />
              </div>

              {/* Location */}
              <div className="flex items-center gap-1.5">
                <MapPin size={11} className="text-gray-400" />
                <EditableField
                  value={personalInfo.location}
                  placeholder="City, State"
                  onSave={(val) => handlePersonalChange("location", val)}
                  isPrintView={isPrintView}
                />
              </div>

              {/* Website */}
              <div className="flex items-center gap-1.5">
                <Globe size={11} className="text-gray-400" />
                <EditableField
                  value={personalInfo.website}
                  placeholder="website.com"
                  onSave={(val) => handlePersonalChange("website", val)}
                  isPrintView={isPrintView}
                />
              </div>

              {/* LinkedIn */}
              <div className="flex items-center gap-1.5">
                <Linkedin size={11} className="text-gray-400" />
                <EditableField
                  value={personalInfo.linkedin}
                  placeholder="linkedin.com/in/user"
                  onSave={(val) => handlePersonalChange("linkedin", val)}
                  isPrintView={isPrintView}
                />
              </div>

              {/* GitHub */}
              <div className="flex items-center gap-1.5">
                <Github size={11} className="text-gray-400" />
                <EditableField
                  value={personalInfo.github}
                  placeholder="github.com/user"
                  onSave={(val) => handlePersonalChange("github", val)}
                  isPrintView={isPrintView}
                />
              </div>
            </div>

          </header>
        )}

        {/* 2. BODY CONTENT (Modular Columns or Single Column vertical list) */}
        <div className="flex-1 flex flex-col justify-start">
          {layoutStyle === "double" ? (
            /* DUAL COLUMN STRUCTURE */
            <div className="flex gap-6 items-stretch w-full flex-1">
              {/* Column 1 (Left Column) */}
              <div className={`${colWidths.left} flex flex-col gap-1.5`}>
                {leftColumnSections.map((secId) => dispatchSection(secId, pageNum))}
              </div>
              
              {/* Split divider lines depending on template style */}
              <div className="w-px bg-slate-200/80 shrink-0 self-stretch no-print" />

              {/* Column 2 (Right Column) */}
              <div className={`${colWidths.right} flex flex-col gap-1.5`}>
                {rightColumnSections.map((secId) => dispatchSection(secId, pageNum))}
              </div>
            </div>
          ) : (
            /* SINGLE COLUMN STRUCTURE */
            <div className="space-y-2.5">
              {sectionOrder.map((secId) => dispatchSection(secId, pageNum))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const hasPage2 = (
    experience.length > 3 || 
    (experience.length > 2 && education.length > 0) || 
    projects.length > 0 || 
    skills.length > 2 || 
    languages.length > 2 || 
    strengths.length > 0 || 
    passions.length > 0 || 
    achievements.length > 0 ||
    customSections.length > 0
  );

  return (
    <div id="resume-preview-root" className={`flex flex-col items-center w-full ${isPrintView ? 'print-area' : ''}`}>
      {/* Page 1 */}
      {renderPage(1)}

      {/* Page 2 */}
      {hasPage2 && (
        <>
          {/* Page Break Visual Divider (Hidden in print) */}
          <div className="w-full flex items-center justify-center my-8 no-print page-break-divider">
            <div className="w-24 h-px bg-slate-300 dark:bg-slate-700" />
            <span className="mx-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Page 2</span>
            <div className="w-24 h-px bg-slate-300 dark:bg-slate-700" />
          </div>
          {renderPage(2)}
        </>
      )}
    </div>
  );
}
