import React from "react";
import { Mail, Phone, MapPin, Globe, ExternalLink } from "lucide-react";
import { FONTS, SIZES } from "../types/resume";

const Linkedin = ({ size = 16, className = "" }) => (
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

const Github = ({ size = 16, className = "" }) => (
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

export default function ResumePreview({ data, isPrintView = false }) {
  const { personalInfo, experience, education, projects, skills, certifications, layoutSettings } = data;
  const { 
    template, primaryColor, accentColor, fontSize, spacing, fontFamily,
    sectionOrder = ["summary", "experience", "education", "projects", "skills", "certifications"],
    lineHeight = "normal", // tight, normal, relaxed
    marginSize = "normal" // compact, normal, loose
  } = layoutSettings;

  const fontConfig = FONTS[fontFamily] || FONTS.sans;
  const sizeConfig = SIZES[fontSize] || SIZES.sm;

  // Custom margin map
  const marginClass = {
    compact: "mb-2.5",
    normal: "mb-4.5",
    loose: "mb-7"
  }[marginSize];

  // Custom line height map
  const leadingClass = {
    tight: "leading-tight",
    normal: "leading-normal",
    relaxed: "leading-relaxed"
  }[lineHeight];

  // Spacing padding map
  const paddingClass = {
    compact: "p-6",
    normal: "p-8",
    loose: "p-10"
  }[spacing];

  // Helper colors style objects
  const primaryStyle = { color: primaryColor };
  const borderPrimaryStyle = { borderColor: primaryColor };
  const accentStyle = { color: accentColor };
  const borderAccentStyle = { borderColor: accentColor };
  const bgPrimaryStyle = { backgroundColor: primaryColor };
  const bgAccentStyle = { backgroundColor: accentColor };

  // Initials badge builder
  const renderInitialsBadge = (sizeClass = "w-11 h-11 text-xs") => {
    const first = personalInfo.firstName?.[0] || "";
    const last = personalInfo.lastName?.[0] || "";
    if (!first && !last) return null;
    return (
      <div 
        className={`${sizeClass} rounded-full flex items-center justify-center font-extrabold text-white shrink-0 shadow-sm uppercase`}
        style={bgPrimaryStyle}
      >
        {first}{last}
      </div>
    );
  };

  // Convert bullet points text to list
  const renderBulletPoints = (text) => {
    if (!text) return null;
    return text.split("\n").map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return null;
      const displayLine = trimmed.startsWith("•") || trimmed.startsWith("-") 
        ? trimmed.substring(1).trim() 
        : trimmed;
      return (
        <li key={idx} className={`${leadingClass} text-gray-700 list-none relative pl-4 before:content-['•'] before:absolute before:left-0 before:text-gray-400`}>
          {displayLine}
        </li>
      );
    });
  };

  // Convert comma separated list of skills to styled pills
  const renderSkillPills = (itemsText) => {
    if (!itemsText) return null;
    return (
      <div className="flex flex-wrap gap-1.5 mt-1.5">
        {itemsText.split(",").map((s, i) => {
          const trimmed = s.trim();
          if (!trimmed) return null;
          return (
            <span 
              key={i} 
              className="px-2 py-0.5 rounded text-[10px] font-semibold bg-gray-50 text-gray-700 border border-gray-200"
            >
              {trimmed}
            </span>
          );
        })}
      </div>
    );
  };

  const hasPersonalInfo = personalInfo.firstName || personalInfo.lastName;
  const hasExperience = experience.length > 0 && experience.some(e => e.company || e.role);
  const hasEducation = education.length > 0 && education.some(ed => ed.institution || ed.degree);
  const hasProjects = projects.length > 0 && projects.some(p => p.title);
  const hasSkills = skills.length > 0 && skills.some(s => s.category || s.items);
  const hasCertifications = certifications.length > 0 && certifications.some(c => c.name);

  // Sub-Sections Render Map
  // ----------------------------------------------------
  const renderSummarySection = () => {
    if (!personalInfo.summary) return null;
    return (
      <div className={`print-section ${marginClass}`}>
        {template !== "classic" && (
          <h2 className={`${fontConfig.headingClass} ${sizeConfig.h2} tracking-tight text-gray-800 uppercase text-xs mb-2 flex items-center gap-2`}>
            <span className="w-1 h-3 rounded" style={bgAccentStyle} /> Professional Summary
          </h2>
        )}
        <p className={`${leadingClass} text-gray-700 text-justify text-xs`}>{personalInfo.summary}</p>
      </div>
    );
  };

  const renderExperienceSection = () => {
    if (!hasExperience) return null;
    return (
      <div className={`print-section ${marginClass}`}>
        <h2 className={`${fontConfig.headingClass} ${sizeConfig.h2} tracking-tight text-gray-800 uppercase text-xs mb-3 flex items-center gap-2 ${template === 'classic' ? 'border-b pb-1 mb-2.5' : ''}`} style={template === 'classic' ? primaryStyle : null}>
          {template !== "classic" && <span className="w-1 h-3 rounded" style={bgAccentStyle} />} Professional Experience
        </h2>
        
        {/* Timeline representation for Modern/Minimal templates */}
        <div className={template === "modern" || template === "minimal" ? "relative border-l-2 ml-1.5 pl-5 space-y-4" : "space-y-4"}>
          {experience.map((exp, idx) => (
            <div key={exp.id} className="relative text-xs">
              
              {/* Timeline Connector Node */}
              {(template === "modern" || template === "minimal") && (
                <div 
                  className="absolute -left-[27px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: accentColor }}
                />
              )}

              <div className="flex flex-wrap justify-between items-baseline font-bold text-gray-900">
                <span className="text-[13px]">{exp.role} <span className="font-normal text-gray-500">| {exp.company}</span></span>
                <span className="text-[10px] font-semibold uppercase shrink-0" style={accentStyle}>{exp.startDate} – {exp.endDate || "Present"}</span>
              </div>
              {exp.location && <div className="text-gray-500 italic text-[10px] mb-1">{exp.location}</div>}
              
              <ul className="list-disc pl-3.5 space-y-0.5 mt-1.5 text-gray-700">
                {renderBulletPoints(exp.description)}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderEducationSection = () => {
    if (!hasEducation) return null;
    return (
      <div className={`print-section ${marginClass}`}>
        <h2 className={`${fontConfig.headingClass} ${sizeConfig.h2} tracking-tight text-gray-800 uppercase text-xs mb-3 flex items-center gap-2 ${template === 'classic' ? 'border-b pb-1 mb-2.5' : ''}`} style={template === 'classic' ? primaryStyle : null}>
          {template !== "classic" && <span className="w-1 h-3 rounded" style={bgAccentStyle} />} Education
        </h2>
        <div className="space-y-3">
          {education.map((edu) => (
            <div key={edu.id} className="text-xs">
              <div className="flex justify-between font-bold text-gray-900">
                <span>{edu.degree} in {edu.fieldOfStudy}</span>
                <span className="font-semibold text-[10px]" style={accentStyle}>{edu.graduationDate}</span>
              </div>
              <div className="flex justify-between text-gray-600 italic">
                <span>{edu.institution}</span>
                {edu.location && <span>{edu.location}</span>}
              </div>
              {edu.details && <p className="text-gray-500 mt-1 leading-relaxed">{edu.details}</p>}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderProjectsSection = () => {
    if (!hasProjects) return null;
    return (
      <div className={`print-section ${marginClass}`}>
        <h2 className={`${fontConfig.headingClass} ${sizeConfig.h2} tracking-tight text-gray-800 uppercase text-xs mb-3 flex items-center gap-2 ${template === 'classic' ? 'border-b pb-1 mb-2.5' : ''}`} style={template === 'classic' ? primaryStyle : null}>
          {template !== "classic" && <span className="w-1 h-3 rounded" style={bgAccentStyle} />} Featured Projects
        </h2>
        <div className="space-y-3">
          {projects.map((proj) => (
            <div key={proj.id} className="text-xs">
              <div className="flex justify-between items-baseline font-bold text-gray-900">
                <span>
                  {proj.title}
                  {proj.link && (
                    <a href={proj.link} target="_blank" rel="noreferrer" className="inline-flex items-center ml-1 text-gray-400 hover:text-gray-600">
                      <ExternalLink size={10} />
                    </a>
                  )}
                </span>
                {proj.techStack && <span className="text-[10px] font-normal text-gray-500 italic shrink-0">{proj.techStack}</span>}
              </div>
              <ul className="list-disc pl-3.5 space-y-0.5 mt-1.5 text-gray-700">
                {renderBulletPoints(proj.description)}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderSkillsSection = () => {
    if (!hasSkills) return null;
    return (
      <div className={`print-section ${marginClass}`}>
        <h2 className={`${fontConfig.headingClass} ${sizeConfig.h2} tracking-tight text-gray-800 uppercase text-xs mb-3 flex items-center gap-2 ${template === 'classic' ? 'border-b pb-1 mb-2.5' : ''}`} style={template === 'classic' ? primaryStyle : null}>
          {template !== "classic" && <span className="w-1 h-3 rounded" style={bgAccentStyle} />} Skills & Expertise
        </h2>
        <div className="space-y-2.5 text-xs">
          {skills.map((skill) => (
            <div key={skill.id} className="flex flex-col sm:flex-row sm:items-start gap-1">
              <span className="font-bold text-gray-900 w-36 shrink-0 text-[11px]">{skill.category}:</span>
              <div className="flex-1">
                {template === "classic" ? <span className="text-gray-700">{skill.items}</span> : renderSkillPills(skill.items)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderCertificationsSection = () => {
    if (!hasCertifications) return null;
    return (
      <div className={`print-section ${marginClass}`}>
        <h2 className={`${fontConfig.headingClass} ${sizeConfig.h2} tracking-tight text-gray-800 uppercase text-xs mb-3 flex items-center gap-2 ${template === 'classic' ? 'border-b pb-1 mb-2.5' : ''}`} style={template === 'classic' ? primaryStyle : null}>
          {template !== "classic" && <span className="w-1 h-3 rounded" style={bgAccentStyle} />} Certifications
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {certifications.map((cert) => (
            <div key={cert.id} className="flex justify-between text-gray-700 bg-gray-50/50 p-2 rounded border border-gray-100/80">
              <div>
                <span className="font-semibold text-gray-900">{cert.name}</span>
                <span className="text-gray-500 block text-[10px]">{cert.issuer}</span>
              </div>
              <span className="text-gray-500 shrink-0 text-[10px] font-semibold">{cert.date}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Sections Dispatch Router
  const renderSectionByOrder = (sectionName) => {
    switch (sectionName) {
      case "summary":
        return renderSummarySection();
      case "experience":
        return renderExperienceSection();
      case "education":
        return renderEducationSection();
      case "projects":
        return renderProjectsSection();
      case "skills":
        return renderSkillsSection();
      case "certifications":
        return renderCertificationsSection();
      default:
        return null;
    }
  };

  // LAYOUT SELECTORS
  // ----------------------------------------------------
  
  // TEMPLATE 1: Harvard Classic (Center Aligned, Serif, Initials Badge)
  const renderClassic = () => {
    return (
      <div className={`h-full ${fontConfig.bodyClass} ${sizeConfig.body} ${paddingClass} flex flex-col`}>
        {/* Header */}
        <div className="text-center mb-4 flex flex-col items-center">
          
          {/* Centered Initials Badge */}
          <div className="mb-2">
            {renderInitialsBadge("w-14 h-14 text-sm")}
          </div>

          <h1 className={`${fontConfig.headingClass} ${sizeConfig.h1} tracking-wide text-gray-900 mb-1`} style={primaryStyle}>
            {personalInfo.firstName} {personalInfo.lastName}
          </h1>
          <p className="text-gray-600 font-bold tracking-wider uppercase text-xs">
            {personalInfo.title}
          </p>

          <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-[11px] text-gray-500 mt-2 font-medium">
            {personalInfo.location && <span>{personalInfo.location}</span>}
            {personalInfo.phone && <span>• {personalInfo.phone}</span>}
            {personalInfo.email && <span>• {personalInfo.email}</span>}
            {personalInfo.website && (
              <a href={personalInfo.website} target="_blank" rel="noreferrer" className="hover:underline">
                • {personalInfo.website.replace(/^https?:\/\//, "")}
              </a>
            )}
            {personalInfo.linkedin && (
              <a href={`https://${personalInfo.linkedin}`} target="_blank" rel="noreferrer" className="hover:underline">
                • {personalInfo.linkedin.replace(/^linkedin\.com\/in\//, "")}
              </a>
            )}
            {personalInfo.github && (
              <a href={`https://${personalInfo.github}`} target="_blank" rel="noreferrer" className="hover:underline">
                • {personalInfo.github.replace(/^github\.com\//, "")}
              </a>
            )}
          </div>
        </div>

        {/* Dynamic section ordering loop */}
        <div className="space-y-1">
          {sectionOrder.map((sectionName) => renderSectionByOrder(sectionName))}
        </div>
      </div>
    );
  };

  // TEMPLATE 2: Sleek Modern (Badge left, timeline nodes, styled pills)
  const renderModern = () => {
    return (
      <div className={`h-full ${fontConfig.bodyClass} ${sizeConfig.body} ${paddingClass} flex flex-col`}>
        {/* Header bar */}
        <div className="flex justify-between items-center border-b-2 pb-4 mb-4" style={borderPrimaryStyle}>
          <div className="flex items-center gap-3.5">
            {renderInitialsBadge("w-14 h-14 text-sm")}
            <div>
              <h1 className={`${fontConfig.headingClass} ${sizeConfig.h1} text-gray-900 tracking-tight leading-none`} style={primaryStyle}>
                {personalInfo.firstName} {personalInfo.lastName}
              </h1>
              <p className="text-xs font-bold tracking-wide mt-1" style={accentStyle}>
                {personalInfo.title}
              </p>
            </div>
          </div>

          <div className="text-right text-[10px] text-gray-500 space-y-0.5 font-medium">
            {personalInfo.location && <div>{personalInfo.location}</div>}
            {personalInfo.phone && <div>{personalInfo.phone}</div>}
            {personalInfo.email && <div className="font-semibold" style={accentStyle}>{personalInfo.email}</div>}
            
            <div className="flex gap-2 justify-end mt-1 text-[9px] uppercase font-bold text-gray-400">
              {personalInfo.website && <a href={personalInfo.website} target="_blank" rel="noreferrer" className="hover:underline">Web</a>}
              {personalInfo.linkedin && <a href={`https://${personalInfo.linkedin}`} target="_blank" rel="noreferrer" className="hover:underline">LinkedIn</a>}
              {personalInfo.github && <a href={`https://${personalInfo.github}`} target="_blank" rel="noreferrer" className="hover:underline">GitHub</a>}
            </div>
          </div>
        </div>

        {/* Dynamic ordering loop */}
        <div className="space-y-1">
          {sectionOrder.map((sectionName) => renderSectionByOrder(sectionName))}
        </div>
      </div>
    );
  };

  // TEMPLATE 3: Minimalist Accent (Simple typography, timeline lines)
  const renderMinimal = () => {
    return (
      <div className={`h-full ${fontConfig.bodyClass} ${sizeConfig.body} ${paddingClass} flex flex-col`}>
        <div className="mb-5 flex justify-between items-start">
          <div>
            <h1 className={`${fontConfig.headingClass} ${sizeConfig.h1} tracking-tight text-gray-900 leading-none`} style={primaryStyle}>
              {personalInfo.firstName} {personalInfo.lastName}
            </h1>
            <p className="text-[10px] uppercase font-extrabold tracking-widest mt-1.5" style={accentStyle}>
              {personalInfo.title}
            </p>
          </div>

          <div className="flex flex-col gap-0.5 items-end text-[10px] text-gray-500 font-semibold">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
          </div>
        </div>

        {/* Dynamic ordering loop */}
        <div className="space-y-1">
          {sectionOrder.map((sectionName) => renderSectionByOrder(sectionName))}
        </div>
      </div>
    );
  };

  // TEMPLATE 4: Creative Split Column (2-Column Grid with full sidebar)
  const renderCreative = () => {
    // Collect settings specifically for sidebar coloring
    const sidebarStyle = {
      backgroundColor: primaryColor,
    };

    return (
      <div className={`h-full ${fontConfig.bodyClass} ${sizeConfig.body} flex flex-row min-h-full items-stretch`}>
        
        {/* Left Column (Colored Sidebar) */}
        <div className="w-1/3 text-white p-6 flex flex-col shrink-0" style={sidebarStyle}>
          
          {/* Sidebar Header Badge */}
          <div className="flex flex-col items-center mb-6 text-center">
            <div className="w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center font-extrabold text-white text-sm mb-3">
              {personalInfo.firstName?.[0] || ""}{personalInfo.lastName?.[0] || ""}
            </div>
            <h1 className={`${fontConfig.headingClass} text-lg tracking-tight leading-tight`}>
              {personalInfo.firstName}<br/>{personalInfo.lastName}
            </h1>
            <p className="text-[10px] opacity-80 uppercase tracking-widest font-semibold mt-1">
              {personalInfo.title}
            </p>
          </div>

          {/* Contact details */}
          <div className="mb-6 space-y-2 text-[10px]">
            <h3 className="text-[11px] font-bold uppercase tracking-widest border-b border-white/20 pb-1 mb-2">
              Contact Details
            </h3>
            {personalInfo.location && <div>{personalInfo.location}</div>}
            {personalInfo.phone && <div>{personalInfo.phone}</div>}
            {personalInfo.email && <div className="break-all">{personalInfo.email}</div>}
            {personalInfo.website && <div className="break-all opacity-80">{personalInfo.website.replace(/^https?:\/\//, "")}</div>}
            {personalInfo.linkedin && <div className="break-all opacity-80">{personalInfo.linkedin.replace(/^linkedin\.com\/in\//, "")}</div>}
            {personalInfo.github && <div className="break-all opacity-80">{personalInfo.github.replace(/^github\.com\//, "")}</div>}
          </div>

          {/* Skills (Rendered inside sidebar as visual light text list) */}
          {hasSkills && (
            <div className="space-y-3 text-[10px]">
              <h3 className="text-[11px] font-bold uppercase tracking-widest border-b border-white/20 pb-1">
                Expertise
              </h3>
              {skills.map((skill) => (
                <div key={skill.id} className="space-y-1">
                  <span className="font-bold opacity-90 block">{skill.category}</span>
                  <div className="flex flex-wrap gap-1">
                    {skill.items.split(",").map((s, i) => (
                      <span key={i} className="bg-white/10 border border-white/10 px-1.5 py-0.5 rounded text-[9px] font-medium block">
                        {s.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Certifications (Sidebar layout) */}
          {hasCertifications && (
            <div className="mt-6 space-y-3 text-[10px]">
              <h3 className="text-[11px] font-bold uppercase tracking-widest border-b border-white/20 pb-1">
                Certifications
              </h3>
              {certifications.map((cert) => (
                <div key={cert.id} className="space-y-0.5">
                  <span className="font-semibold block leading-tight">{cert.name}</span>
                  <span className="opacity-75 block text-[9px]">{cert.issuer} • {cert.date}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column (Main content in white background) */}
        <div className={`w-2/3 ${paddingClass} flex flex-col bg-white text-gray-800`}>
          {/* Render right-side sections by ordering (skipping skills/certifications if they exist in sidebar) */}
          <div className="space-y-1">
            {sectionOrder.map((sectionName) => {
              if (sectionName === "skills" || sectionName === "certifications") return null;
              return renderSectionByOrder(sectionName);
            })}
          </div>
        </div>

      </div>
    );
  };

  const selectTemplate = () => {
    switch (template) {
      case "classic":
        return renderClassic();
      case "modern":
        return renderModern();
      case "minimal":
        return renderMinimal();
      case "creative":
        return renderCreative();
      default:
        return renderModern();
    }
  };

  return (
    <div 
      id="resume-preview-root" 
      className={`resume-preview-sheet ${isPrintView ? 'print-area' : ''}`}
      style={{ minHeight: isPrintView ? 'auto' : '297mm' }}
    >
      {selectTemplate()}
    </div>
  );
}
