import React, { useState } from "react";
import { 
  User, Briefcase, GraduationCap, Code, ShieldCheck, Settings, Plus, Trash2, 
  ChevronDown, ChevronUp, Sparkles, ArrowUp, ArrowDown 
} from "lucide-react";
import { COLOR_PRESETS, FONTS } from "../types/resume";

export default function ResumeEditor({ data, onChange, onAIEnhance }) {
  const [activeSection, setActiveSection] = useState("personalInfo");

  const toggleSection = (section) => {
    setActiveSection(activeSection === section ? null : section);
  };

  const handlePersonalChange = (key, value) => {
    onChange({
      ...data,
      personalInfo: {
        ...data.personalInfo,
        [key]: value
      }
    });
  };

  const updateList = (section, index, key, value) => {
    const updatedList = [...data[section]];
    updatedList[index] = { ...updatedList[index], [key]: value };
    onChange({ ...data, [section]: updatedList });
  };

  const addItem = (section, defaultObj) => {
    onChange({
      ...data,
      [section]: [...data[section], { id: `${section}-${Date.now()}`, ...defaultObj }]
    });
  };

  const removeItem = (section, index) => {
    const updatedList = data[section].filter((_, i) => i !== index);
    onChange({ ...data, [section]: updatedList });
  };

  const moveItem = (section, index, direction) => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === data[section].length - 1) return;
    
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    const updatedList = [...data[section]];
    const temp = updatedList[index];
    updatedList[index] = updatedList[targetIndex];
    updatedList[targetIndex] = temp;
    onChange({ ...data, [section]: updatedList });
  };

  const handleLayoutChange = (key, value) => {
    onChange({
      ...data,
      layoutSettings: {
        ...data.layoutSettings,
        [key]: value
      }
    });
  };

  return (
    <div className="space-y-4 pr-1 text-gray-200">
      
      {/* SECTION 1: Personal Info */}
      <div className="border border-dark-border rounded-xl bg-dark-card overflow-hidden transition-all duration-200">
        <button
          onClick={() => toggleSection("personalInfo")}
          className="w-full flex items-center justify-between p-4 font-semibold text-left border-b border-dark-border hover:bg-slate-800/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <User size={18} />
            </div>
            <span>Personal Information</span>
          </div>
          {activeSection === "personalInfo" ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {activeSection === "personalInfo" && (
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">First Name</label>
                <input
                  type="text"
                  value={data.personalInfo.firstName || ""}
                  onChange={(e) => handlePersonalChange("firstName", e.target.value)}
                  className="w-full bg-slate-900/60 border border-dark-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="e.g. John"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Last Name</label>
                <input
                  type="text"
                  value={data.personalInfo.lastName || ""}
                  onChange={(e) => handlePersonalChange("lastName", e.target.value)}
                  className="w-full bg-slate-900/60 border border-dark-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="e.g. Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">Professional Title</label>
              <input
                type="text"
                value={data.personalInfo.title || ""}
                onChange={(e) => handlePersonalChange("title", e.target.value)}
                className="w-full bg-slate-900/60 border border-dark-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                placeholder="e.g. Senior Software Engineer"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Email</label>
                <input
                  type="email"
                  value={data.personalInfo.email || ""}
                  onChange={(e) => handlePersonalChange("email", e.target.value)}
                  className="w-full bg-slate-900/60 border border-dark-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="e.g. john@example.com"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Phone</label>
                <input
                  type="text"
                  value={data.personalInfo.phone || ""}
                  onChange={(e) => handlePersonalChange("phone", e.target.value)}
                  className="w-full bg-slate-900/60 border border-dark-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="e.g. +1 (555) 019-2834"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Location</label>
                <input
                  type="text"
                  value={data.personalInfo.location || ""}
                  onChange={(e) => handlePersonalChange("location", e.target.value)}
                  className="w-full bg-slate-900/60 border border-dark-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="e.g. New York, NY"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Website</label>
                <input
                  type="text"
                  value={data.personalInfo.website || ""}
                  onChange={(e) => handlePersonalChange("website", e.target.value)}
                  className="w-full bg-slate-900/60 border border-dark-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="e.g. https://johndoe.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">LinkedIn Profile</label>
                <input
                  type="text"
                  value={data.personalInfo.linkedin || ""}
                  onChange={(e) => handlePersonalChange("linkedin", e.target.value)}
                  className="w-full bg-slate-900/60 border border-dark-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="e.g. linkedin.com/in/username"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">GitHub Profile</label>
                <input
                  type="text"
                  value={data.personalInfo.github || ""}
                  onChange={(e) => handlePersonalChange("github", e.target.value)}
                  className="w-full bg-slate-900/60 border border-dark-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  placeholder="e.g. github.com/username"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-semibold text-gray-400">Professional Summary</label>
                <button
                  type="button"
                  onClick={() => onAIEnhance({ type: "summary", text: data.personalInfo.summary })}
                  className="flex items-center gap-1 text-[11px] font-bold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-full transition-colors"
                >
                  <Sparkles size={10} /> AI Refine
                </button>
              </div>
              <textarea
                value={data.personalInfo.summary || ""}
                onChange={(e) => handlePersonalChange("summary", e.target.value)}
                rows={4}
                className="w-full bg-slate-900/60 border border-dark-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors resize-none leading-relaxed"
                placeholder="Briefly describe your career background, primary skillsets, and key professional ambitions..."
              />
            </div>
          </div>
        )}
      </div>

      {/* SECTION 2: Work Experience */}
      <div className="border border-dark-border rounded-xl bg-dark-card overflow-hidden transition-all duration-200">
        <button
          onClick={() => toggleSection("experience")}
          className="w-full flex items-center justify-between p-4 font-semibold text-left border-b border-dark-border hover:bg-slate-800/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Briefcase size={18} />
            </div>
            <span>Work Experience ({data.experience.length})</span>
          </div>
          {activeSection === "experience" ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {activeSection === "experience" && (
          <div className="p-5 space-y-5">
            {data.experience.map((exp, idx) => (
              <div key={exp.id} className="relative p-4 border border-dark-border bg-slate-900/40 rounded-xl space-y-3">
                <div className="absolute top-4 right-4 flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => moveItem("experience", idx, "up")}
                    disabled={idx === 0}
                    className="p-1 text-gray-500 hover:text-white disabled:opacity-30 disabled:hover:text-gray-500"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveItem("experience", idx, "down")}
                    disabled={idx === data.experience.length - 1}
                    className="p-1 text-gray-500 hover:text-white disabled:opacity-30 disabled:hover:text-gray-500"
                  >
                    <ArrowDown size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem("experience", idx)}
                    className="p-1 text-red-500 hover:text-red-400 ml-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>

                <div className="font-bold text-xs uppercase tracking-wider text-indigo-400">
                  Role #{idx + 1}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Company / Organization</label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => updateList("experience", idx, "company", e.target.value)}
                      className="w-full bg-slate-900/60 border border-dark-border rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      placeholder="e.g. Google"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Job Title</label>
                    <input
                      type="text"
                      value={exp.role}
                      onChange={(e) => updateList("experience", idx, "role", e.target.value)}
                      className="w-full bg-slate-900/60 border border-dark-border rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      placeholder="e.g. Software Engineer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Location</label>
                    <input
                      type="text"
                      value={exp.location}
                      onChange={(e) => updateList("experience", idx, "location", e.target.value)}
                      className="w-full bg-slate-900/60 border border-dark-border rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      placeholder="e.g. London, UK"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Start Date</label>
                    <input
                      type="text"
                      value={exp.startDate}
                      onChange={(e) => updateList("experience", idx, "startDate", e.target.value)}
                      className="w-full bg-slate-900/60 border border-dark-border rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      placeholder="e.g. 2021-08"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">End Date</label>
                    <input
                      type="text"
                      value={exp.endDate}
                      onChange={(e) => updateList("experience", idx, "endDate", e.target.value)}
                      className="w-full bg-slate-900/60 border border-dark-border rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      placeholder="e.g. Present"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-semibold text-gray-400">Description (One point per line)</label>
                    <button
                      type="button"
                      onClick={() => onAIEnhance({ type: "experience", text: exp.description, context: `Role: ${exp.role} at ${exp.company}` })}
                      className="flex items-center gap-1 text-[11px] font-bold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-full transition-colors"
                    >
                      <Sparkles size={10} /> AI Bullet Optimizer
                    </button>
                  </div>
                  <textarea
                    value={exp.description}
                    onChange={(e) => updateList("experience", idx, "description", e.target.value)}
                    rows={4}
                    className="w-full bg-slate-900/60 border border-dark-border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors font-mono resize-none leading-relaxed"
                    placeholder="• Built X utilizing Y to achieve Z&#10;• Orchestrated software migration..."
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => addItem("experience", { company: "", role: "", location: "", startDate: "", endDate: "", description: "" })}
              className="w-full flex items-center justify-center gap-2 border border-dashed border-dark-border hover:border-indigo-500 hover:bg-indigo-500/5 py-3 rounded-xl text-sm font-semibold transition-all duration-200"
            >
              <Plus size={16} /> Add Work Experience
            </button>
          </div>
        )}
      </div>

      {/* SECTION 3: Education */}
      <div className="border border-dark-border rounded-xl bg-dark-card overflow-hidden transition-all duration-200">
        <button
          onClick={() => toggleSection("education")}
          className="w-full flex items-center justify-between p-4 font-semibold text-left border-b border-dark-border hover:bg-slate-800/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <GraduationCap size={18} />
            </div>
            <span>Education ({data.education.length})</span>
          </div>
          {activeSection === "education" ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {activeSection === "education" && (
          <div className="p-5 space-y-5">
            {data.education.map((edu, idx) => (
              <div key={edu.id} className="relative p-4 border border-dark-border bg-slate-900/40 rounded-xl space-y-3">
                <button
                  type="button"
                  onClick={() => removeItem("education", idx)}
                  className="absolute top-4 right-4 p-1 text-red-500 hover:text-red-400"
                >
                  <Trash2 size={14} />
                </button>

                <div className="font-bold text-xs uppercase tracking-wider text-indigo-400">
                  Education #{idx + 1}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Institution / School</label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => updateList("education", idx, "institution", e.target.value)}
                      className="w-full bg-slate-900/60 border border-dark-border rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      placeholder="e.g. Berkeley University"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Degree</label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => updateList("education", idx, "degree", e.target.value)}
                      className="w-full bg-slate-900/60 border border-dark-border rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      placeholder="e.g. Bachelor of Science"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Field of Study</label>
                    <input
                      type="text"
                      value={edu.fieldOfStudy}
                      onChange={(e) => updateList("education", idx, "fieldOfStudy", e.target.value)}
                      className="w-full bg-slate-900/60 border border-dark-border rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      placeholder="e.g. Computer Science"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Location</label>
                    <input
                      type="text"
                      value={edu.location}
                      onChange={(e) => updateList("education", idx, "location", e.target.value)}
                      className="w-full bg-slate-900/60 border border-dark-border rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      placeholder="e.g. Berkeley, CA"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Graduation Date</label>
                    <input
                      type="text"
                      value={edu.graduationDate}
                      onChange={(e) => updateList("education", idx, "graduationDate", e.target.value)}
                      className="w-full bg-slate-900/60 border border-dark-border rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      placeholder="e.g. 2020-05"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Additional Details (GPA, Honors, etc.)</label>
                  <input
                    type="text"
                    value={edu.details}
                    onChange={(e) => updateList("education", idx, "details", e.target.value)}
                    className="w-full bg-slate-900/60 border border-dark-border rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="GPA 3.8/4.0. Thesis on NLP models..."
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => addItem("education", { institution: "", degree: "", fieldOfStudy: "", location: "", graduationDate: "", details: "" })}
              className="w-full flex items-center justify-center gap-2 border border-dashed border-dark-border hover:border-indigo-500 hover:bg-indigo-500/5 py-3 rounded-xl text-sm font-semibold transition-all duration-200"
            >
              <Plus size={16} /> Add Education
            </button>
          </div>
        )}
      </div>

      {/* SECTION 4: Projects */}
      <div className="border border-dark-border rounded-xl bg-dark-card overflow-hidden transition-all duration-200">
        <button
          onClick={() => toggleSection("projects")}
          className="w-full flex items-center justify-between p-4 font-semibold text-left border-b border-dark-border hover:bg-slate-800/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <Code size={18} />
            </div>
            <span>Featured Projects ({data.projects.length})</span>
          </div>
          {activeSection === "projects" ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {activeSection === "projects" && (
          <div className="p-5 space-y-5">
            {data.projects.map((proj, idx) => (
              <div key={proj.id} className="relative p-4 border border-dark-border bg-slate-900/40 rounded-xl space-y-3">
                <button
                  type="button"
                  onClick={() => removeItem("projects", idx)}
                  className="absolute top-4 right-4 p-1 text-red-500 hover:text-red-400"
                >
                  <Trash2 size={14} />
                </button>

                <div className="font-bold text-xs uppercase tracking-wider text-indigo-400">
                  Project #{idx + 1}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Project Title</label>
                    <input
                      type="text"
                      value={proj.title}
                      onChange={(e) => updateList("projects", idx, "title", e.target.value)}
                      className="w-full bg-slate-900/60 border border-dark-border rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      placeholder="e.g. Chatbot App"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Technologies Used (Comma list)</label>
                    <input
                      type="text"
                      value={proj.techStack}
                      onChange={(e) => updateList("projects", idx, "techStack", e.target.value)}
                      className="w-full bg-slate-900/60 border border-dark-border rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      placeholder="e.g. React, Node.js, Tailwind"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Project Link (Optional)</label>
                  <input
                    type="text"
                    value={proj.link}
                    onChange={(e) => updateList("projects", idx, "link", e.target.value)}
                    className="w-full bg-slate-900/60 border border-dark-border rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="e.g. https://github.com/user/project"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-xs font-semibold text-gray-400">Details / Achievements</label>
                    <button
                      type="button"
                      onClick={() => onAIEnhance({ type: "project", text: proj.description, context: `Project name: ${proj.title}` })}
                      className="flex items-center gap-1 text-[11px] font-bold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-full transition-colors"
                    >
                      <Sparkles size={10} /> AI Refine Bullet
                    </button>
                  </div>
                  <textarea
                    value={proj.description}
                    onChange={(e) => updateList("projects", idx, "description", e.target.value)}
                    rows={3}
                    className="w-full bg-slate-900/60 border border-dark-border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors font-mono resize-none leading-relaxed"
                    placeholder="• Built X utilizing Y to achieve Z"
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => addItem("projects", { title: "", techStack: "", link: "", description: "" })}
              className="w-full flex items-center justify-center gap-2 border border-dashed border-dark-border hover:border-indigo-500 hover:bg-indigo-500/5 py-3 rounded-xl text-sm font-semibold transition-all duration-200"
            >
              <Plus size={16} /> Add Project
            </button>
          </div>
        )}
      </div>

      {/* SECTION 5: Skills */}
      <div className="border border-dark-border rounded-xl bg-dark-card overflow-hidden transition-all duration-200">
        <button
          onClick={() => toggleSection("skills")}
          className="w-full flex items-center justify-between p-4 font-semibold text-left border-b border-dark-border hover:bg-slate-800/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400">
              <User size={18} />
            </div>
            <span>Skills & Expertise ({data.skills.length})</span>
          </div>
          {activeSection === "skills" ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {activeSection === "skills" && (
          <div className="p-5 space-y-4">
            {data.skills.map((skill, idx) => (
              <div key={skill.id} className="flex gap-3 items-start bg-slate-900/40 p-3 border border-dark-border rounded-xl">
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={skill.category}
                    onChange={(e) => updateList("skills", idx, "category", e.target.value)}
                    className="w-full bg-slate-900/60 border border-dark-border rounded-lg px-3 py-1.5 text-xs font-bold text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="Category (e.g. Programming Languages)"
                  />
                  <input
                    type="text"
                    value={skill.items}
                    onChange={(e) => updateList("skills", idx, "items", e.target.value)}
                    className="w-full bg-slate-900/60 border border-dark-border rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                    placeholder="Skills separated by commas (e.g. JavaScript, Python, C++)"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeItem("skills", idx)}
                  className="p-2 text-red-500 hover:text-red-400"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() => addItem("skills", { category: "", items: "" })}
              className="w-full flex items-center justify-center gap-2 border border-dashed border-dark-border hover:border-indigo-500 hover:bg-indigo-500/5 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
            >
              <Plus size={16} /> Add Skill Group
            </button>
          </div>
        )}
      </div>

      {/* SECTION 6: Certifications */}
      <div className="border border-dark-border rounded-xl bg-dark-card overflow-hidden transition-all duration-200">
        <button
          onClick={() => toggleSection("certifications")}
          className="w-full flex items-center justify-between p-4 font-semibold text-left border-b border-dark-border hover:bg-slate-800/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <ShieldCheck size={18} />
            </div>
            <span>Certifications ({data.certifications?.length || 0})</span>
          </div>
          {activeSection === "certifications" ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {activeSection === "certifications" && (
          <div className="p-5 space-y-4">
            {(data.certifications || []).map((cert, idx) => (
              <div key={cert.id} className="relative p-4 border border-dark-border bg-slate-900/40 rounded-xl space-y-3">
                <button
                  type="button"
                  onClick={() => removeItem("certifications", idx)}
                  className="absolute top-4 right-4 p-1 text-red-500 hover:text-red-400"
                >
                  <Trash2 size={14} />
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Certification Name</label>
                    <input
                      type="text"
                      value={cert.name}
                      onChange={(e) => updateList("certifications", idx, "name", e.target.value)}
                      className="w-full bg-slate-900/60 border border-dark-border rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      placeholder="AWS Solutions Architect"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Issuer</label>
                    <input
                      type="text"
                      value={cert.issuer}
                      onChange={(e) => updateList("certifications", idx, "issuer", e.target.value)}
                      className="w-full bg-slate-900/60 border border-dark-border rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      placeholder="Amazon Web Services"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Issue Date</label>
                    <input
                      type="text"
                      value={cert.date}
                      onChange={(e) => updateList("certifications", idx, "date", e.target.value)}
                      className="w-full bg-slate-900/60 border border-dark-border rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      placeholder="e.g. 2024-01"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-400 mb-1">Credential URL (Optional)</label>
                    <input
                      type="text"
                      value={cert.link || ""}
                      onChange={(e) => updateList("certifications", idx, "link", e.target.value)}
                      className="w-full bg-slate-900/60 border border-dark-border rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                      placeholder="e.g. credential-link.com"
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => addItem("certifications", { name: "", issuer: "", date: "", link: "" })}
              className="w-full flex items-center justify-center gap-2 border border-dashed border-dark-border hover:border-indigo-500 hover:bg-indigo-500/5 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
            >
              <Plus size={16} /> Add Certification
            </button>
          </div>
        )}
      </div>

      {/* SECTION 7: Layout & Design Settings */}
      <div className="border border-dark-border rounded-xl bg-dark-card overflow-hidden transition-all duration-200">
        <button
          onClick={() => toggleSection("layoutSettings")}
          className="w-full flex items-center justify-between p-4 font-semibold text-left border-b border-dark-border hover:bg-slate-800/40 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Settings size={18} />
            </div>
            <span>Design & Customization</span>
          </div>
          {activeSection === "layoutSettings" ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>

        {activeSection === "layoutSettings" && (
          <div className="p-5 space-y-4">
            
            {/* Template Selector */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-2">Resume Style Template</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "classic", name: "Harvard Classic", desc: "Traditional, centered, ATS standard" },
                  { id: "modern", name: "Sleek Modern", desc: "Structured sections, accent lines" },
                  { id: "minimal", name: "Minimal Accent", desc: "Understated hierarchy, generous space" },
                  { id: "creative", name: "Creative Grid", desc: "Sidebar details, high impact" }
                ].map((tpl) => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => handleLayoutChange("template", tpl.id)}
                    className={`flex flex-col text-left p-3 rounded-lg border text-sm transition-all ${
                      data.layoutSettings.template === tpl.id
                        ? "border-indigo-500 bg-indigo-500/5"
                        : "border-dark-border bg-slate-900/30 hover:border-gray-500"
                    }`}
                  >
                    <span className="font-semibold text-white">{tpl.name}</span>
                    <span className="text-[10px] text-gray-400 leading-tight mt-1">{tpl.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Typography */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Font Style</label>
                <select
                  value={data.layoutSettings.fontFamily}
                  onChange={(e) => handleLayoutChange("fontFamily", e.target.value)}
                  className="w-full bg-slate-900 border border-dark-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  {Object.entries(FONTS).map(([key, cfg]) => (
                    <option key={key} value={key} className="bg-slate-900">{cfg.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Overall Spacing</label>
                <select
                  value={data.layoutSettings.spacing}
                  onChange={(e) => handleLayoutChange("spacing", e.target.value)}
                  className="w-full bg-slate-900 border border-dark-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  <option value="compact" className="bg-slate-900">Compact Padding</option>
                  <option value="normal" className="bg-slate-900">Standard Padding</option>
                  <option value="loose" className="bg-slate-900">Comfortable Spacing</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1.5">Base Font Size</label>
                <select
                  value={data.layoutSettings.fontSize}
                  onChange={(e) => handleLayoutChange("fontSize", e.target.value)}
                  className="w-full bg-slate-900 border border-dark-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  <option value="xs" className="bg-slate-900">Extra Small (11px)</option>
                  <option value="sm" className="bg-slate-900">Small (12px)</option>
                  <option value="base" className="bg-slate-900">Medium (13px)</option>
                  <option value="lg" className="bg-slate-900">Large (14px)</option>
                </select>
              </div>
            </div>

            {/* Colors */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1.5">Theme Accent Color</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {COLOR_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => {
                      handleLayoutChange("primaryColor", preset.primary);
                      handleLayoutChange("accentColor", preset.accent);
                    }}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                      data.layoutSettings.primaryColor === preset.primary
                        ? "border-indigo-500 bg-indigo-500/10 text-white"
                        : "border-dark-border bg-slate-900/30 hover:border-gray-500 text-gray-300"
                    }`}
                  >
                    <span className="w-3.5 h-3.5 rounded-full border border-white/20" style={{ backgroundColor: preset.primary }} />
                    {preset.name}
                  </button>
                ))}
              </div>

              {/* Custom Colors Inputs */}
              <div className="grid grid-cols-2 gap-4 mt-2 bg-slate-900/30 p-3 rounded-lg border border-dark-border/40">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Primary Color</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={data.layoutSettings.primaryColor}
                      onChange={(e) => handleLayoutChange("primaryColor", e.target.value)}
                      className="w-8 h-8 rounded border border-dark-border cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={data.layoutSettings.primaryColor}
                      onChange={(e) => handleLayoutChange("primaryColor", e.target.value)}
                      className="bg-transparent border-0 text-xs font-mono text-white focus:outline-none w-20"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Secondary / Date Accent</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={data.layoutSettings.accentColor}
                      onChange={(e) => handleLayoutChange("accentColor", e.target.value)}
                      className="w-8 h-8 rounded border border-dark-border cursor-pointer bg-transparent"
                    />
                    <input
                      type="text"
                      value={data.layoutSettings.accentColor}
                      onChange={(e) => handleLayoutChange("accentColor", e.target.value)}
                      className="bg-transparent border-0 text-xs font-mono text-white focus:outline-none w-20"
                    />
                  </div>
                </div>
              </div>
            </div>
            
          </div>
        )}
      </div>

    </div>
  );
}
