export const CURATED_TEMPLATES = [
  {
    id: "executive-1",
    name: "Executive — Enhancv Classic",
    description: "Centered headers with top border lines and spacious double-row layout for experience. Ideal for executives and mid-level professionals.",
    category: "Professional",
    settings: { template: "executive", primaryColor: "#1a1a1a", accentColor: "#333333", fontSize: "sm", spacing: "loose", fontFamily: "rubik", lineHeight: "normal", marginSize: "loose", layoutStyle: "single", headingStyle: "top-line", experienceLayout: "double-row" }
  },
  {
    id: "executive-2",
    name: "Executive — Minimalist Director",
    description: "Crisp centered structure with a sophisticated aesthetic. Uses spacious padding and clear hierarchical typography.",
    category: "Professional",
    settings: { template: "executive", primaryColor: "#111827", accentColor: "#1f2937", fontSize: "base", spacing: "loose", fontFamily: "lato", lineHeight: "relaxed", marginSize: "loose", layoutStyle: "single", headingStyle: "top-line", experienceLayout: "double-row" }
  },
  {
    id: "executive-3",
    name: "Executive — Corporate Analyst",
    description: "Dense but highly readable executive template for analytical roles. Double-row job headers ensure maximum scannability.",
    category: "Creative",
    settings: { template: "executive", primaryColor: "#0f172a", accentColor: "#475569", fontSize: "xs", spacing: "normal", fontFamily: "chivo", lineHeight: "tight", marginSize: "normal", layoutStyle: "single", headingStyle: "top-line", experienceLayout: "double-row" }
  },
  {
    id: "ivy-league-1",
    name: "Ivy League — Executive",
    description: "Traditional Ivy League centered header format with clean serif typography. The gold standard for MBAs, consulting, and executive leadership roles.",
    category: "Professional",
    settings: { template: "ivy-league", primaryColor: "#1a1a1a", accentColor: "#333333", fontSize: "sm", spacing: "normal", fontFamily: "tinos", lineHeight: "normal", marginSize: "normal", layoutStyle: "single", headingStyle: "line" }
  },
  {
    id: "ivy-league-2",
    name: "Ivy League — Finance Director",
    description: "High-density Ivy League layout with compact spacing. Tailored for Wall Street, private equity, and investment banking.",
    category: "Professional",
    settings: { template: "ivy-league", primaryColor: "#111827", accentColor: "#1f2937", fontSize: "xs", spacing: "compact", fontFamily: "gelasio", lineHeight: "tight", marginSize: "compact", layoutStyle: "single", headingStyle: "line" }
  },
  {
    id: "ivy-league-3",
    name: "Ivy League — Academic Scholar",
    description: "Generous spacing and clean serif headings. Perfect for university faculties, PhD researchers, and academic publications.",
    category: "Academic",
    settings: { template: "ivy-league", primaryColor: "#1a1a1a", accentColor: "#4b5563", fontSize: "base", spacing: "loose", fontFamily: "tinos", lineHeight: "relaxed", marginSize: "loose", layoutStyle: "single", headingStyle: "line" }
  },
  {
    id: "timeline-1",
    name: "Timeline — Data Scientist",
    description: "Color-coded timeline markers with left-aligned date badges. Modern, scannable layout for tech, analytics, and ML roles.",
    category: "Tech",
    settings: { template: "timeline", primaryColor: "#0f172a", accentColor: "#2563eb", fontSize: "sm", spacing: "normal", fontFamily: "rubik", lineHeight: "normal", marginSize: "normal", layoutStyle: "single", headingStyle: "accent" }
  },
  {
    id: "timeline-2",
    name: "Timeline — Product Manager",
    description: "Timeline sidebar with teal accents. Clean and structured for operations managers, PMs, and growth leaders.",
    category: "Professional",
    settings: { template: "timeline", primaryColor: "#064e3b", accentColor: "#10b981", fontSize: "sm", spacing: "normal", fontFamily: "lato", lineHeight: "normal", marginSize: "normal", layoutStyle: "single", headingStyle: "accent" }
  },
  {
    id: "timeline-3",
    name: "Timeline — UX Designer",
    description: "Creative timeline layout with vivid orange markers. Eye-catching format for designers, creatives, and strategists.",
    category: "Creative",
    settings: { template: "timeline", primaryColor: "#1a1a1a", accentColor: "#ea580c", fontSize: "sm", spacing: "normal", fontFamily: "raleway", lineHeight: "normal", marginSize: "normal", layoutStyle: "single", headingStyle: "accent" }
  },
  {
    id: "classic-1",
    name: "Classic — Senior Auditor",
    description: "Clean single-column layout with blue accent lines. ATS-optimized and recruiter-friendly for corporate professionals.",
    category: "Professional",
    settings: { template: "classic", primaryColor: "#1e3a5f", accentColor: "#2563eb", fontSize: "sm", spacing: "normal", fontFamily: "arimo", lineHeight: "normal", marginSize: "normal", layoutStyle: "single", headingStyle: "line" }
  },
  {
    id: "classic-2",
    name: "Classic — Sales Executive",
    description: "Bold headings with a compact, results-driven format. Perfect for B2B sales, account managers, and business development.",
    category: "Professional",
    settings: { template: "classic", primaryColor: "#0f172a", accentColor: "#0ea5e9", fontSize: "sm", spacing: "compact", fontFamily: "montserrat", lineHeight: "normal", marginSize: "compact", layoutStyle: "single", headingStyle: "line" }
  },
  {
    id: "classic-3",
    name: "Classic — Medical Practitioner",
    description: "Clean clinical format with teal highlights. Standard layout for physicians, nurses, and healthcare professionals.",
    category: "Academic",
    settings: { template: "classic", primaryColor: "#115e59", accentColor: "#14b8a6", fontSize: "sm", spacing: "normal", fontFamily: "bitter", lineHeight: "normal", marginSize: "normal", layoutStyle: "single", headingStyle: "line" }
  },
  {
    id: "classic-4",
    name: "Classic — Marketing Manager",
    description: "Modern single-column with violet accents. Suitable for digital marketers, brand managers, and growth hackers.",
    category: "Creative",
    settings: { template: "classic", primaryColor: "#2e1065", accentColor: "#7c3aed", fontSize: "sm", spacing: "normal", fontFamily: "chivo", lineHeight: "relaxed", marginSize: "normal", layoutStyle: "single", headingStyle: "line" }
  },
  {
    id: "classic-5",
    name: "Classic — DevOps Engineer",
    description: "Minimal and compact layout with dark slate accents. Built for cloud engineers, infrastructure, and SRE specialists.",
    category: "Tech",
    settings: { template: "classic", primaryColor: "#111827", accentColor: "#3b82f6", fontSize: "xs", spacing: "compact", fontFamily: "exo2", lineHeight: "tight", marginSize: "compact", layoutStyle: "single", headingStyle: "line" }
  },
  {
    id: "classic-6",
    name: "Classic — Copywriter & PR",
    description: "Elegant serif layout with generous spacing and red accents. Ideal for content strategists, copywriters, and PR agents.",
    category: "Creative",
    settings: { template: "classic", primaryColor: "#1f2937", accentColor: "#dc2626", fontSize: "base", spacing: "normal", fontFamily: "volkhov", lineHeight: "relaxed", marginSize: "normal", layoutStyle: "single", headingStyle: "line" }
  }
];
