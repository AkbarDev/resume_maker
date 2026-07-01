export const INITIAL_RESUME_DATA = {
  personalInfo: {
    firstName: "Sarah",
    lastName: "Jenkins",
    title: "Senior Full Stack Engineer",
    email: "sarah.jenkins@devmail.com",
    phone: "+1 (555) 019-2834",
    location: "San Francisco, CA",
    website: "https://sarahj.dev",
    linkedin: "linkedin.com/in/sarahj-dev",
    github: "github.com/sarahj-codes",
    summary: "Driven and innovative software engineer with 6+ years of experience designing, building, and deploying highly scalable web applications. Expert in React, Node.js, and cloud architectures. Proven track record of optimizing database performance, leading cross-functional teams, and raising code coverage to 95%. Passionate about creating clean, accessible, and user-centric digital experiences."
  },
  experience: [
    {
      id: "exp-1",
      company: "InnovateTech Solutions",
      role: "Lead Full Stack Developer",
      location: "San Francisco, CA",
      startDate: "2023-03",
      endDate: "Present",
      description: "• Architected and migrated legacy monolith to micro-frontends (React/Next.js) resulting in a 40% improvement in page loading speed.\n• Directed a team of 6 engineers to deliver a real-time analytics dashboard using WebSockets and Redis, processing 5M+ daily requests.\n• Established CI/CD pipelines on AWS (GitHub Actions, ECS, Fargate) reducing production deployment cycles from 2 days to 15 minutes.\n• Mentored junior engineers, introduced TDD practices, and increased unit test coverage from 45% to 88%."
    },
    {
      id: "exp-2",
      company: "Launchpad Labs",
      role: "Senior Software Engineer",
      location: "Austin, TX (Remote)",
      startDate: "2020-08",
      endDate: "2023-02",
      description: "• Led development of a collaborative SaaS platform backend in Node.js (Express) and PostgreSQL, serving 150k monthly active users.\n• Redesigned database schemas and optimized SQL queries, reducing API endpoint latencies by 35%.\n• Integrated third-party APIs including Stripe for subscription billing and SendGrid for automated marketing workflows.\n• Implemented secure JWT-based authentication and OAuth2 integrations, increasing platform security compliance."
    }
  ],
  education: [
    {
      id: "edu-1",
      institution: "University of California, Berkeley",
      degree: "B.S. in Computer Science",
      location: "Berkeley, CA",
      graduationDate: "2020-05",
      details: "GPA: 3.82/4.0. Completed coursework in Algorithms, Database Systems, and Distributed Computing."
    }
  ],
  projects: [
    {
      id: "proj-1",
      title: "FlowState Task Manager",
      techStack: "React, TailwindCSS, Node.js, MongoDB",
      link: "https://github.com/sarahj-codes/flowstate",
      description: "• Built a real-time collaborative kanban board task manager with drag-and-drop support (React DnD).\n• Structured real-time updates using Socket.io and database change streams for instant sync across active tabs.\n• Designed and styled the interface with complex accessibility (WCAG 2.1 AA) compliance."
    }
  ],
  skills: [
    { id: "skill-1", category: "Languages", items: "JavaScript (ES6+), TypeScript, HTML5/CSS3, Python, SQL" },
    { id: "skill-2", category: "Frameworks & Libs", items: "React, Next.js, Node.js, Express, FastAPI, Tailwind CSS" },
    { id: "skill-3", category: "Tools & Cloud", items: "Git, AWS (S3, EC2, ECS), Docker, PostgreSQL, MongoDB, Redis" }
  ],
  certifications: [
    {
      id: "cert-1",
      name: "AWS Certified Solutions Architect – Associate",
      issuer: "Amazon Web Services",
      date: "2024-01",
      link: ""
    }
  ],
  strengths: [
    { id: "str-1", name: "Problem Solving", description: "Approaching challenges analytically to find optimal, scalable solutions." },
    { id: "str-2", name: "Technical Leadership", description: "Guiding development squads and establishing clean code methodologies." }
  ],
  languages: [
    { id: "lang-1", name: "English", level: "Native / Bilingual", rating: 5 },
    { id: "lang-2", name: "Spanish", level: "Intermediate", rating: 3 }
  ],
  achievements: [
    { id: "ach-1", text: "Successfully migrated 12 legacy services with zero production downtime." },
    { id: "ach-2", text: "Awarded Innovator of the Year out of 150+ engineers in 2024." }
  ],
  passions: [
    { id: "pass-1", name: "Open Source Coding", description: "Contributing back to core javascript frameworks and developer toolings." }
  ],
  books: [
    { id: "book-1", title: "Clean Code", author: "Robert C. Martin" },
    { id: "book-2", title: "Designing Data-Intensive Applications", author: "Martin Kleppmann" }
  ],
  quotes: [
    { id: "quote-1", text: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci" }
  ],
  dayInLife: [
    { id: "dil-1", activity: "Deep Work & Architecture", percentage: 50 },
    { id: "dil-2", activity: "Team Sync & Mentoring", percentage: 20 },
    { id: "dil-3", activity: "Research & Learning", percentage: 15 },
    { id: "dil-4", activity: "Code Reviews & Testing", percentage: 15 }
  ],
  customSections: [],
  layoutSettings: {
    template: "modern", // classic, modern, minimal, creative
    layoutStyle: "double", // single, double
    columnRatio: "60-40", // "50-50", "60-40", "70-30"
    primaryColor: "#0f172a", // Slate 900
    accentColor: "#4f46e5", // Indigo 600
    fontSize: "sm", // xs, sm, base, lg
    spacing: "normal", // compact, normal, loose
    fontFamily: "rubik", // rubik, arimo, lato, raleway, bitter, exo2, chivo, tinos, montserrat, oswald, volkhov, gelasio
    lineHeight: "normal", // tight, normal, relaxed
    marginSize: "normal", // compact, normal, loose
    headingStyle: "accent", // line, accent, block, clean
    leftColumnSections: ["summary", "experience", "education", "projects"],
    rightColumnSections: ["skills", "certifications", "strengths", "languages", "achievements", "passions", "books", "quotes", "dayInLife"],
    sectionOrder: ["summary", "experience", "education", "projects", "skills", "certifications", "strengths", "languages", "achievements", "passions", "books", "quotes", "dayInLife"]
  }
};

export const COLOR_PRESETS = [
  { name: "Charcoal & Indigo", primary: "#0f172a", accent: "#4f46e5" },
  { name: "Sleek Dark Slate", primary: "#1e293b", accent: "#6366f1" },
  { name: "Emerald Forest", primary: "#064e3b", accent: "#10b981" },
  { name: "Deep Burgundy", primary: "#450a0a", accent: "#ef4444" },
  { name: "Ocean Teal", primary: "#115e59", accent: "#14b8a6" },
  { name: "Minimal Graphite", primary: "#1f2937", accent: "#4b5563" },
  { name: "Midnight Violet", primary: "#1e1b4b", accent: "#8b5cf6" }
];

export const FONTS = {
  rubik: {
    label: "Rubik",
    headingClass: "font-sans",
    bodyClass: "font-sans",
    style: { fontFamily: "'Rubik', sans-serif" }
  },
  arimo: {
    label: "Arimo / Arial-like font",
    headingClass: "font-sans",
    bodyClass: "font-sans",
    style: { fontFamily: "'Arimo', sans-serif" }
  },
  lato: {
    label: "Lato",
    headingClass: "font-sans",
    bodyClass: "font-sans",
    style: { fontFamily: "'Lato', sans-serif" }
  },
  raleway: {
    label: "Raleway",
    headingClass: "font-sans",
    bodyClass: "font-sans",
    style: { fontFamily: "'Raleway', sans-serif" }
  },
  bitter: {
    label: "Bitter",
    headingClass: "font-serif",
    bodyClass: "font-serif",
    style: { fontFamily: "'Bitter', serif" }
  },
  exo2: {
    label: "Exo 2",
    headingClass: "font-sans",
    bodyClass: "font-sans",
    style: { fontFamily: "'Exo 2', sans-serif" }
  },
  chivo: {
    label: "Chivo",
    headingClass: "font-sans",
    bodyClass: "font-sans",
    style: { fontFamily: "'Chivo', sans-serif" }
  },
  tinos: {
    label: "Tinos / Times New Roman-like font",
    headingClass: "font-serif",
    bodyClass: "font-serif",
    style: { fontFamily: "'Tinos', serif" }
  },
  montserrat: {
    label: "Montserrat",
    headingClass: "font-sans",
    bodyClass: "font-sans",
    style: { fontFamily: "'Montserrat', sans-serif" }
  },
  oswald: {
    label: "Oswald",
    headingClass: "font-sans",
    bodyClass: "font-sans",
    style: { fontFamily: "'Oswald', sans-serif" }
  },
  volkhov: {
    label: "Volkhov",
    headingClass: "font-serif",
    bodyClass: "font-serif",
    style: { fontFamily: "'Volkhov', serif" }
  },
  gelasio: {
    label: "Gelasio / Georgia-like font",
    headingClass: "font-serif",
    bodyClass: "font-serif",
    style: { fontFamily: "'Gelasio', serif" }
  }
};

export const SIZES = {
  xs: {
    body: "text-[10px]",
    h1: "text-[18px]",
    h2: "text-[12px]",
    h3: "text-[10px]",
    spacing: "gap-1",
    sectionSpacing: "mb-2"
  },
  sm: {
    body: "text-[12px]",
    h1: "text-[22px]",
    h2: "text-[14px]",
    h3: "text-[12px]",
    spacing: "gap-1.5",
    sectionSpacing: "mb-3.5"
  },
  base: {
    body: "text-[14px]",
    h1: "text-[26px]",
    h2: "text-[16px]",
    h3: "text-[14px]",
    spacing: "gap-2",
    sectionSpacing: "mb-4.5"
  },
  lg: {
    body: "text-[16px]",
    h1: "text-[30px]",
    h2: "text-[18px]",
    h3: "text-[16px]",
    spacing: "gap-2.5",
    sectionSpacing: "mb-6"
  }
};
