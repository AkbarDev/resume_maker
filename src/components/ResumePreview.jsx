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
  const { template, primaryColor, accentColor, fontSize, spacing, fontFamily } = layoutSettings;

  // Retrieve current font details
  const fontConfig = FONTS[fontFamily] || FONTS.sans;
  const sizeConfig = SIZES[fontSize] || SIZES.sm;

  // Spacing map
  const spacingClass = {
    compact: {
      gap: "gap-1",
      itemGap: "gap-0.5",
      secGap: "space-y-2",
      sectionMargin: "mb-3",
      padding: "p-6",
      divider: "my-1.5"
    },
    normal: {
      gap: "gap-2",
      itemGap: "gap-1.5",
      secGap: "space-y-4",
      sectionMargin: "mb-5",
      padding: "p-8",
      divider: "my-3"
    },
    loose: {
      gap: "gap-3",
      itemGap: "gap-2.5",
      secGap: "space-y-6",
      sectionMargin: "mb-7",
      padding: "p-10",
      divider: "my-4.5"
    }
  }[spacing];

  // Helper to color headers
  const primaryStyle = { color: primaryColor };
  const borderPrimaryStyle = { borderColor: primaryColor };
  const accentStyle = { color: accentColor };
  const bgPrimaryStyle = { backgroundColor: primaryColor };

  // Helper to format text with newlines (like bullet points)
  const renderBulletPoints = (text) => {
    if (!text) return null;
    return text.split("\n").map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return null;
      // If it already has a bullet, don't double bullet
      const displayLine = trimmed.startsWith("•") || trimmed.startsWith("-") 
        ? trimmed.substring(1).trim() 
        : trimmed;
      return (
        <li key={idx} className="leading-relaxed list-none relative pl-4 before:content-['•'] before:absolute before:left-0 before:text-gray-400">
          {displayLine}
        </li>
      );
    });
  };

  const hasPersonalInfo = personalInfo.firstName || personalInfo.lastName;
  const hasExperience = experience.length > 0 && experience.some(e => e.company || e.role);
  const hasEducation = education.length > 0 && education.some(ed => ed.institution || ed.degree);
  const hasProjects = projects.length > 0 && projects.some(p => p.title);
  const hasSkills = skills.length > 0 && skills.some(s => s.category || s.items);
  const hasCertifications = certifications.length > 0 && certifications.some(c => c.name);

  // Layout Renders
  // ----------------------------------------------------
  // TEMPLATE 1: Harvard Classic (ATS-perfect, center aligned)
  const renderClassicTemplate = () => {
    return (
      <div className={`h-full ${fontConfig.bodyClass} ${sizeConfig.body} ${spacingClass.padding} flex flex-col`}>
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className={`${fontConfig.headingClass} ${sizeConfig.h1} tracking-wide text-gray-900 mb-1`} style={primaryStyle}>
            {personalInfo.firstName} {personalInfo.lastName}
          </h1>
          <p className="text-gray-600 font-medium tracking-wider uppercase text-xs">
            {personalInfo.title}
          </p>
          
          {/* Metadata Grid */}
          <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-1 text-xs text-gray-500 mt-2 font-medium">
            {personalInfo.location && <span className="flex items-center gap-0.5"><MapPin size={11} /> {personalInfo.location}</span>}
            {personalInfo.phone && <span className="flex items-center gap-0.5"><Phone size={11} /> {personalInfo.phone}</span>}
            {personalInfo.email && <span className="flex items-center gap-0.5"><Mail size={11} /> {personalInfo.email}</span>}
            {personalInfo.website && (
              <a href={personalInfo.website} target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-0.5">
                <Globe size={11} /> {personalInfo.website.replace(/^https?:\/\//, "")}
              </a>
            )}
            {personalInfo.linkedin && (
              <a href={`https://${personalInfo.linkedin}`} target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-0.5">
                <Linkedin size={11} /> {personalInfo.linkedin.replace(/^linkedin\.com\/in\//, "")}
              </a>
            )}
            {personalInfo.github && (
              <a href={`https://${personalInfo.github}`} target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-0.5">
                <Github size={11} /> {personalInfo.github.replace(/^github\.com\//, "")}
              </a>
            )}
          </div>
        </div>

        <div className={spacingClass.secGap}>
          {/* Summary */}
          {personalInfo.summary && (
            <div className="print-section">
              <p className="text-gray-700 leading-relaxed text-justify">{personalInfo.summary}</p>
            </div>
          )}

          {/* Experience */}
          {hasExperience && (
            <div className="print-section">
              <h2 className={`${fontConfig.headingClass} ${sizeConfig.h2} uppercase tracking-wider border-b pb-0.5 mb-2`} style={primaryStyle}>
                Professional Experience
              </h2>
              <div className="space-y-3">
                {experience.map((exp) => (
                  <div key={exp.id} className="text-xs">
                    <div className="flex justify-between font-bold text-gray-900">
                      <span>{exp.role} <span className="font-normal text-gray-500">| {exp.company}</span></span>
                      <span>{exp.startDate} – {exp.endDate || "Present"}</span>
                    </div>
                    {exp.location && <div className="text-gray-500 italic mb-1">{exp.location}</div>}
                    <ul className="list-disc pl-4 text-gray-700 space-y-0.5 mt-1">
                      {renderBulletPoints(exp.description)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {hasEducation && (
            <div className="print-section">
              <h2 className={`${fontConfig.headingClass} ${sizeConfig.h2} uppercase tracking-wider border-b pb-0.5 mb-2`} style={primaryStyle}>
                Education
              </h2>
              <div className="space-y-2">
                {education.map((edu) => (
                  <div key={edu.id} className="text-xs">
                    <div className="flex justify-between font-bold text-gray-900">
                      <span>{edu.degree} in {edu.fieldOfStudy}</span>
                      <span>{edu.graduationDate}</span>
                    </div>
                    <div className="flex justify-between text-gray-600 italic">
                      <span>{edu.institution}</span>
                      {edu.location && <span>{edu.location}</span>}
                    </div>
                    {edu.details && <p className="text-gray-600 mt-0.5">{edu.details}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {hasProjects && (
            <div className="print-section">
              <h2 className={`${fontConfig.headingClass} ${sizeConfig.h2} uppercase tracking-wider border-b pb-0.5 mb-2`} style={primaryStyle}>
                Key Projects
              </h2>
              <div className="space-y-3">
                {projects.map((proj) => (
                  <div key={proj.id} className="text-xs">
                    <div className="flex justify-between font-bold text-gray-900">
                      <span>
                        {proj.title}
                        {proj.link && (
                          <a href={proj.link} target="_blank" rel="noreferrer" className="inline-flex items-center ml-1 text-gray-400 hover:text-gray-600">
                            <ExternalLink size={10} />
                          </a>
                        )}
                      </span>
                      {proj.techStack && <span className="font-normal text-gray-500 italic">{proj.techStack}</span>}
                    </div>
                    <ul className="list-disc pl-4 text-gray-700 space-y-0.5 mt-1">
                      {renderBulletPoints(proj.description)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {hasSkills && (
            <div className="print-section">
              <h2 className={`${fontConfig.headingClass} ${sizeConfig.h2} uppercase tracking-wider border-b pb-0.5 mb-2`} style={primaryStyle}>
                Skills & Technical Expertise
              </h2>
              <div className="space-y-1 text-xs">
                {skills.map((skill) => (
                  <div key={skill.id} className="flex">
                    <span className="font-bold text-gray-900 w-32 shrink-0">{skill.category}:</span>
                    <span className="text-gray-700">{skill.items}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {hasCertifications && (
            <div className="print-section">
              <h2 className={`${fontConfig.headingClass} ${sizeConfig.h2} uppercase tracking-wider border-b pb-0.5 mb-2`} style={primaryStyle}>
                Certifications
              </h2>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {certifications.map((cert) => (
                  <div key={cert.id} className="flex justify-between text-gray-700">
                    <div>
                      <span className="font-semibold text-gray-900">{cert.name}</span>
                      <span className="text-gray-500"> – {cert.issuer}</span>
                    </div>
                    <span className="text-gray-500 shrink-0">{cert.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // TEMPLATE 2: Sleek Modern (Clean, Accent Bars, Left Metadata)
  const renderModernTemplate = () => {
    return (
      <div className={`h-full ${fontConfig.bodyClass} ${sizeConfig.body} ${spacingClass.padding} flex flex-col`}>
        {/* Header Grid */}
        <div className="flex justify-between items-start border-b-2 pb-4 mb-4" style={borderPrimaryStyle}>
          <div>
            <h1 className={`${fontConfig.headingClass} ${sizeConfig.h1} text-gray-900 tracking-tight leading-none`} style={primaryStyle}>
              {personalInfo.firstName} {personalInfo.lastName}
            </h1>
            <p className="text-sm font-semibold tracking-wide mt-1.5" style={accentStyle}>
              {personalInfo.title}
            </p>
          </div>

          <div className="text-right text-xs text-gray-600 space-y-0.5">
            {personalInfo.location && <div className="flex items-center justify-end gap-1"><MapPin size={11} style={accentStyle} /> {personalInfo.location}</div>}
            {personalInfo.phone && <div className="flex items-center justify-end gap-1"><Phone size={11} style={accentStyle} /> {personalInfo.phone}</div>}
            {personalInfo.email && <div className="flex items-center justify-end gap-1"><Mail size={11} style={accentStyle} /> {personalInfo.email}</div>}
            
            <div className="flex items-center justify-end gap-2 mt-1">
              {personalInfo.website && (
                <a href={personalInfo.website} target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-0.5">
                  <Globe size={11} /> Web
                </a>
              )}
              {personalInfo.linkedin && (
                <a href={`https://${personalInfo.linkedin}`} target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-0.5">
                  <Linkedin size={11} /> LI
                </a>
              )}
              {personalInfo.github && (
                <a href={`https://${personalInfo.github}`} target="_blank" rel="noreferrer" className="hover:underline flex items-center gap-0.5">
                  <Github size={11} /> GH
                </a>
              )}
            </div>
          </div>
        </div>

        <div className={spacingClass.secGap}>
          {/* Summary */}
          {personalInfo.summary && (
            <div className="print-section text-xs">
              <p className="text-gray-700 leading-relaxed">{personalInfo.summary}</p>
            </div>
          )}

          {/* Experience */}
          {hasExperience && (
            <div className="print-section">
              <div className="flex items-center gap-3 mb-2.5">
                <span className="w-1.5 h-5 rounded-sm shrink-0" style={bgPrimaryStyle} />
                <h2 className={`${fontConfig.headingClass} ${sizeConfig.h2} tracking-tight text-gray-900`}>
                  Professional Experience
                </h2>
              </div>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id} className="text-xs">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold text-gray-900 text-sm">{exp.role}</h3>
                      <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-sm bg-gray-100 text-gray-600">
                        {exp.startDate} – {exp.endDate || "Present"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 mt-0.5 mb-1.5">
                      <span>{exp.company}</span>
                      {exp.location && <span className="text-gray-400">• {exp.location}</span>}
                    </div>
                    <ul className="text-gray-700 space-y-1">
                      {renderBulletPoints(exp.description)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education & Projects in Side-by-Side or Stacked */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print-section">
            {/* Education */}
            {hasEducation && (
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-1.5 h-5 rounded-sm shrink-0" style={bgPrimaryStyle} />
                  <h2 className={`${fontConfig.headingClass} ${sizeConfig.h2} tracking-tight text-gray-900`}>
                    Education
                  </h2>
                </div>
                <div className="space-y-2">
                  {education.map((edu) => (
                    <div key={edu.id} className="text-xs">
                      <div className="font-bold text-gray-900">{edu.degree}</div>
                      <div className="text-gray-600 font-medium">{edu.institution}</div>
                      <div className="text-[10px] text-gray-500">{edu.graduationDate} {edu.location && `| ${edu.location}`}</div>
                      {edu.details && <p className="text-gray-500 mt-1">{edu.details}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {hasCertifications && (
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-1.5 h-5 rounded-sm shrink-0" style={bgPrimaryStyle} />
                  <h2 className={`${fontConfig.headingClass} ${sizeConfig.h2} tracking-tight text-gray-900`}>
                    Certifications
                  </h2>
                </div>
                <div className="space-y-1 text-xs">
                  {certifications.map((cert) => (
                    <div key={cert.id}>
                      <span className="font-bold text-gray-900">{cert.name}</span>
                      <div className="text-[10px] text-gray-500">{cert.issuer} • {cert.date}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Projects */}
          {hasProjects && (
            <div className="print-section">
              <div className="flex items-center gap-3 mb-2.5">
                <span className="w-1.5 h-5 rounded-sm shrink-0" style={bgPrimaryStyle} />
                <h2 className={`${fontConfig.headingClass} ${sizeConfig.h2} tracking-tight text-gray-900`}>
                  Featured Projects
                </h2>
              </div>
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
                      {proj.techStack && <span className="text-[10px] font-normal text-gray-500 uppercase">{proj.techStack}</span>}
                    </div>
                    <ul className="text-gray-700 space-y-1 mt-1">
                      {renderBulletPoints(proj.description)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {hasSkills && (
            <div className="print-section">
              <div className="flex items-center gap-3 mb-2.5">
                <span className="w-1.5 h-5 rounded-sm shrink-0" style={bgPrimaryStyle} />
                <h2 className={`${fontConfig.headingClass} ${sizeConfig.h2} tracking-tight text-gray-900`}>
                  Skills Summary
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {skills.map((skill) => (
                  <div key={skill.id} className="bg-gray-50 p-2 rounded border border-gray-100">
                    <span className="font-bold text-gray-900 block mb-0.5">{skill.category}</span>
                    <span className="text-gray-600 leading-tight">{skill.items}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // TEMPLATE 3: Minimalist Accent (Simple, sleek, no lines, margins/padding doing the work)
  const renderMinimalTemplate = () => {
    return (
      <div className={`h-full ${fontConfig.bodyClass} ${sizeConfig.body} ${spacingClass.padding} flex flex-col`}>
        {/* Top Info */}
        <div className="mb-4">
          <h1 className={`${fontConfig.headingClass} ${sizeConfig.h1} tracking-tight text-gray-900 leading-none`} style={primaryStyle}>
            {personalInfo.firstName} {personalInfo.lastName}
          </h1>
          <p className="text-xs uppercase font-bold tracking-wider mt-1.5" style={accentStyle}>
            {personalInfo.title}
          </p>

          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mt-3">
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

        <div className={spacingClass.secGap}>
          {personalInfo.summary && (
            <div className="print-section text-xs">
              <p className="text-gray-700 leading-relaxed">{personalInfo.summary}</p>
            </div>
          )}

          {hasExperience && (
            <div className="print-section">
              <h2 className={`text-xs font-bold uppercase tracking-widest text-gray-400 mb-2`}>
                Experience
              </h2>
              <div className="space-y-3">
                {experience.map((exp) => (
                  <div key={exp.id} className="text-xs">
                    <div className="flex justify-between items-baseline font-bold text-gray-900">
                      <span>{exp.role} <span className="font-normal text-gray-500">at {exp.company}</span></span>
                      <span className="font-medium text-gray-500">{exp.startDate} – {exp.endDate || "Present"}</span>
                    </div>
                    {exp.location && <div className="text-gray-400 italic text-[11px]">{exp.location}</div>}
                    <ul className="text-gray-700 space-y-0.5 mt-1">
                      {renderBulletPoints(exp.description)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {hasEducation && (
            <div className="print-section">
              <h2 className={`text-xs font-bold uppercase tracking-widest text-gray-400 mb-2`}>
                Education
              </h2>
              <div className="space-y-2">
                {education.map((edu) => (
                  <div key={edu.id} className="text-xs">
                    <div className="flex justify-between items-baseline font-bold text-gray-900">
                      <span>{edu.degree} in {edu.fieldOfStudy}</span>
                      <span className="font-medium text-gray-500">{edu.graduationDate}</span>
                    </div>
                    <div className="text-gray-500">{edu.institution} {edu.location && `• ${edu.location}`}</div>
                    {edu.details && <p className="text-gray-500 text-[11px] mt-0.5">{edu.details}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {hasProjects && (
            <div className="print-section">
              <h2 className={`text-xs font-bold uppercase tracking-widest text-gray-400 mb-2`}>
                Projects
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
                      {proj.techStack && <span className="font-normal text-gray-400 text-[11px]">{proj.techStack}</span>}
                    </div>
                    <ul className="text-gray-700 space-y-0.5 mt-1">
                      {renderBulletPoints(proj.description)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {hasSkills && (
            <div className="print-section">
              <h2 className={`text-xs font-bold uppercase tracking-widest text-gray-400 mb-2`}>
                Skills
              </h2>
              <div className="space-y-1 text-xs">
                {skills.map((skill) => (
                  <div key={skill.id} className="flex">
                    <span className="font-semibold text-gray-900 w-36 shrink-0">{skill.category}</span>
                    <span className="text-gray-700">{skill.items}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // TEMPLATE 4: Creative Grid (Split 2-Column layout - highly visual, premium)
  const renderCreativeTemplate = () => {
    return (
      <div className={`h-full ${fontConfig.bodyClass} ${sizeConfig.body} flex flex-row min-h-full items-stretch`}>
        {/* Left Column (Sidebar) */}
        <div className="w-1/3 text-white p-6 flex flex-col" style={bgPrimaryStyle}>
          {/* Header */}
          <div className="mb-6">
            <h1 className={`${fontConfig.headingClass} text-xl tracking-tight leading-tight mb-1`}>
              {personalInfo.firstName}<br/>{personalInfo.lastName}
            </h1>
            <p className="text-[11px] opacity-80 uppercase tracking-widest font-semibold">
              {personalInfo.title}
            </p>
          </div>

          {/* Contact Details */}
          <div className="mb-6 space-y-2.5 text-[11px]">
            <h3 className="text-xs font-bold uppercase tracking-widest border-b border-white/20 pb-1 mb-2">
              Contact
            </h3>
            {personalInfo.location && <div className="flex items-center gap-2"><MapPin size={11} className="opacity-80" /> <span>{personalInfo.location}</span></div>}
            {personalInfo.phone && <div className="flex items-center gap-2"><Phone size={11} className="opacity-80" /> <span>{personalInfo.phone}</span></div>}
            {personalInfo.email && <div className="flex items-center gap-2"><Mail size={11} className="opacity-80" /> <span className="break-all">{personalInfo.email}</span></div>}
            {personalInfo.website && (
              <div className="flex items-center gap-2">
                <Globe size={11} className="opacity-80" />
                <a href={personalInfo.website} target="_blank" rel="noreferrer" className="hover:underline break-all">
                  {personalInfo.website.replace(/^https?:\/\//, "")}
                </a>
              </div>
            )}
            {personalInfo.linkedin && (
              <div className="flex items-center gap-2">
                <Linkedin size={11} className="opacity-80" />
                <a href={`https://${personalInfo.linkedin}`} target="_blank" rel="noreferrer" className="hover:underline break-all">
                  {personalInfo.linkedin.replace(/^linkedin\.com\/in\//, "")}
                </a>
              </div>
            )}
            {personalInfo.github && (
              <div className="flex items-center gap-2">
                <Github size={11} className="opacity-80" />
                <a href={`https://${personalInfo.github}`} target="_blank" rel="noreferrer" className="hover:underline break-all">
                  {personalInfo.github.replace(/^github\.com\//, "")}
                </a>
              </div>
            )}
          </div>

          {/* Skills */}
          {hasSkills && (
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest border-b border-white/20 pb-1">
                Expertise
              </h3>
              {skills.map((skill) => (
                <div key={skill.id} className="text-[11px] space-y-0.5">
                  <span className="font-semibold opacity-90 block">{skill.category}</span>
                  <span className="opacity-75 leading-snug block">{skill.items}</span>
                </div>
              ))}
            </div>
          )}

          {/* Certifications (Sidebar Version) */}
          {hasCertifications && (
            <div className="mt-6 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-widest border-b border-white/20 pb-1">
                Certifications
              </h3>
              {certifications.map((cert) => (
                <div key={cert.id} className="text-[10px]">
                  <span className="font-semibold block">{cert.name}</span>
                  <span className="opacity-75 block">{cert.issuer} • {cert.date}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column (Main Content) */}
        <div className={`w-2/3 ${spacingClass.padding} flex flex-col ${spacingClass.secGap} bg-white text-gray-800`}>
          {/* Summary */}
          {personalInfo.summary && (
            <div className="print-section text-xs">
              <h2 className={`${fontConfig.headingClass} text-xs uppercase tracking-widest mb-1.5`} style={accentStyle}>
                Profile
              </h2>
              <p className="text-gray-600 leading-relaxed text-justify">{personalInfo.summary}</p>
            </div>
          )}

          {/* Experience */}
          {hasExperience && (
            <div className="print-section">
              <h2 className={`${fontConfig.headingClass} text-xs uppercase tracking-widest mb-2`} style={accentStyle}>
                Experience
              </h2>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id} className="text-xs">
                    <div className="flex justify-between items-baseline font-bold text-gray-900">
                      <span className="text-[13px]">{exp.role}</span>
                      <span className="font-medium text-gray-500 text-[10px]">{exp.startDate} – {exp.endDate || "Present"}</span>
                    </div>
                    <div className="text-gray-500 font-semibold mb-1">{exp.company} {exp.location && `| ${exp.location}`}</div>
                    <ul className="text-gray-600 space-y-0.5">
                      {renderBulletPoints(exp.description)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {hasProjects && (
            <div className="print-section">
              <h2 className={`${fontConfig.headingClass} text-xs uppercase tracking-widest mb-2`} style={accentStyle}>
                Featured Projects
              </h2>
              <div className="space-y-3">
                {projects.map((proj) => (
                  <div key={proj.id} className="text-xs">
                    <div className="flex justify-between items-baseline font-bold text-gray-900">
                      <span>{proj.title}</span>
                      {proj.techStack && <span className="font-normal text-gray-500 text-[10px] italic">{proj.techStack}</span>}
                    </div>
                    <ul className="text-gray-600 space-y-0.5 mt-0.5">
                      {renderBulletPoints(proj.description)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {hasEducation && (
            <div className="print-section">
              <h2 className={`${fontConfig.headingClass} text-xs uppercase tracking-widest mb-2`} style={accentStyle}>
                Education
              </h2>
              <div className="space-y-2">
                {education.map((edu) => (
                  <div key={edu.id} className="text-xs">
                    <div className="flex justify-between items-baseline font-bold text-gray-900">
                      <span>{edu.degree}</span>
                      <span className="font-medium text-gray-500 text-[10px]">{edu.graduationDate}</span>
                    </div>
                    <div className="text-gray-500">{edu.institution} {edu.location && `| ${edu.location}`}</div>
                    {edu.details && <p className="text-gray-500 text-[11px] mt-0.5">{edu.details}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Switch selector for template
  const selectTemplate = () => {
    switch (template) {
      case "classic":
        return renderClassicTemplate();
      case "modern":
        return renderModernTemplate();
      case "minimal":
        return renderMinimalTemplate();
      case "creative":
        return renderCreativeTemplate();
      default:
        return renderModernTemplate();
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
