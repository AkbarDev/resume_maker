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
      description: "• Architected and migrated legacy monolith to micro-frontends (React/Next.js) resulting in a 40% improvement in page loading speed.\n• Directed a team of 6 engineers to deliver an real-time analytics dashboard using WebSocket and Redis, processing 5M+ daily requests.\n• Established CI/CD pipelines on AWS (GitHub Actions, ECS, Fargate) reducing production deployment cycles from 2 days to 15 minutes.\n• Mentored junior engineers, introduced TDD practices, and increased unit test coverage from 45% to 88%."
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
    },
    {
      id: "proj-2",
      title: "DocuSummarize API",
      techStack: "Python, FastAPI, Hugging Face Hub, Docker",
      link: "https://github.com/sarahj-codes/docusummarize",
      description: "• Engineered a microservice that parses PDF documents and generates high-fidelity executive summaries using a fine-tuned BART model.\n• Deployed containerized service using Docker and FastAPI, achieving sub-2-second response times for documents up to 50 pages."
    }
  ],
  skills: [
    { id: "skill-1", category: "Languages", items: "JavaScript (ES6+), TypeScript, HTML5/CSS3, Python, SQL" },
    { id: "skill-2", category: "Frameworks & Libs", items: "React, Next.js, Node.js, Express, FastAPI, Tailwind CSS" },
    { id: "skill-3", category: "Tools & Cloud", items: "Git, AWS (S3, EC2, ECS), Docker, PostgreSQL, MongoDB, Redis" },
    { id: "skill-4", category: "Methodologies", items: "Agile/Scrum, CI/CD, Test-Driven Development (TDD), RESTful APIs" }
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
  layoutSettings: {
    template: "modern", // classic, modern, minimal, elegant
    primaryColor: "#0f172a", // Slate 900
    accentColor: "#2563eb", // Blue 600
    fontSize: "sm", // xs, sm, base, lg
    spacing: "compact", // compact, normal, loose
    fontFamily: "sans" // sans, serif, mono
  }
};

export const COLOR_PRESETS = [
  { name: "Slate", primary: "#0f172a", accent: "#3b82f6" },
  { name: "Emerald", primary: "#064e3b", accent: "#10b981" },
  { name: "Indigo", primary: "#1e1b4b", accent: "#6366f1" },
  { name: "Burgundy", primary: "#450a0a", accent: "#ef4444" },
  { name: "Teal", primary: "#115e59", accent: "#14b8a6" },
  { name: "Charcoal", primary: "#1f2937", accent: "#4b5563" }
];

export const FONTS = {
  sans: {
    label: "Outfit / Inter",
    headingClass: "font-outfit font-bold",
    bodyClass: "font-inter"
  },
  serif: {
    label: "Playfair / Georgia",
    headingClass: "font-playfair font-bold",
    bodyClass: "font-serif"
  },
  mono: {
    label: "Fira Code / Mono",
    headingClass: "font-mono font-bold",
    bodyClass: "font-mono text-sm"
  }
};

export const SIZES = {
  xs: {
    body: "text-xs",
    h1: "text-xl",
    h2: "text-sm",
    h3: "text-xs",
    spacing: "gap-1",
    sectionSpacing: "mb-3"
  },
  sm: {
    body: "text-sm",
    h1: "text-2xl",
    h2: "text-base",
    h3: "text-sm",
    spacing: "gap-1.5",
    sectionSpacing: "mb-4"
  },
  base: {
    body: "text-base",
    h1: "text-3xl",
    h2: "text-lg",
    h3: "text-base",
    spacing: "gap-2",
    sectionSpacing: "mb-5"
  },
  lg: {
    body: "text-lg",
    h1: "text-4xl",
    h2: "text-xl",
    h3: "text-lg",
    spacing: "gap-2.5",
    sectionSpacing: "mb-6"
  }
};
