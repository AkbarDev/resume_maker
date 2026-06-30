# ApexCV: Free & Open-Source ATS Resume Maker

ApexCV is a premium, client-side, interactive resume builder and Applicant Tracking System (ATS) optimization assistant. It is built entirely with modern, open-source technologies, allowing developers and job applicants to edit, customize, optimize, and export professional, ATS-compliant resumes for free.

---

## 🛠️ Open-Source Tech Stack & Licensing

Every component of this application is 100% free, open-source, and permissive, making it ideal for self-hosting, public deployments, and community-driven modifications.

| Technology / Library | Role in Application | License / Type | Cost |
| :--- | :--- | :--- | :--- |
| **React (v19)** | Core Frontend UI Engine | [MIT License](https://opensource.org/licenses/MIT) | **Free** |
| **Vite (v8)** | Build Tool & Fast HMR Dev Server | [MIT License](https://opensource.org/licenses/MIT) | **Free** |
| **Tailwind CSS (v4)** | Utility Styling & Typography System | [MIT License](https://opensource.org/licenses/MIT) | **Free** |
| **Lucide React** | Premium Iconography System | [ISC License](https://opensource.org/licenses/ISC) | **Free** |
| **Browser Print Engine** | Native `@media print` vector PDF layout engine | Native Web Standard | **Free** |
| **Web LocalStorage** | Keystroke Autosave Engine (Secure, Offline) | Native Web Standard | **Free** |
| **Hugging Face Router** | Serverless OpenAI-compatible LLM Gateway | Open API Standard | **Free / Self-Token** |
| **Qwen 2.5 / Llama 3** | Free-weight open models for AI rewrites | Open Community Weights | **Free** |

---

## ✨ Features & Capabilities

1.  **Selectable PDF Export (ATS Compliant)**: Rather than printing canvas images (which blocker software/ATS systems cannot parse), ApexCV uses CSS Page print rules. Hitting **Download PDF** invokes the browser's native engine, delivering vector PDFs with fully selectable and searchable text.
2.  **Autosave Persistence**: Changes are synced to the local browser database (`localStorage`) upon every keystroke. Your edits will never be lost, and everything stays strictly on your local machine (100% private).
3.  **Real-Time Preview**: Split-pane layout lets you edit form values on the left and see template rendering update on the right instantly.
4.  **4 Professional Themes**:
    *   **Harvard Classic**: Elegant serif template optimized for corporate and university standards.
    *   **Sleek Modern**: Section accent bars and timelines.
    *   **Minimal Accent**: Clean, modern aesthetics with generous padding structure.
    *   **Creative Grid**: Split columns with sidebar highlights.
5.  **AI Assistant Panel**:
    *   **Bullet Point Optimizer**: Refines draft descriptions using action verbs and metrics.
    *   **ATS Compatibility Audit**: Compares your resume against a target job description and outputs a match score, missing keywords, and detailed critique report.
    *   **Professional Summary Generator**: Drafts a paragraph summary based on your filled skills and experiences.
    *   *Note: Includes a fully-featured **Demo Mode** simulating realistic outcomes so users can evaluate the tool instantly without supplying API credentials.*

---

## 🚀 Getting Started

### Prerequisites
*   [Node.js](https://nodejs.org/) (v18 or higher recommended)
*   npm (installed automatically with Node.js)

### Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/AkbarDev/resume_maker.git
cd resume_maker
npm install
```

### Running Locally
Launch the hot-reloading development server:
```bash
npm run dev
```
Navigate to **[http://localhost:5173/](http://localhost:5173/)** to access the workspace.

### Production Build
Generate optimized static production bundles in the `dist/` directory:
```bash
npm run build
```

---

## 🌐 Free Deployments

Since ApexCV is a static client-side Single Page Application, you can deploy it to production for free in minutes on the following developer-friendly platforms:
*   **Vercel**: Link your GitHub repo to Vercel for automatic deployments on every commit.
*   **Netlify**: Import your repo on Netlify for fast static hosting.
*   **GitHub Pages**: Deploy the built static assets from `dist/` directly to your repository's pages branch.
