# Resume AI — ATS Optimizer

> Paste your resume. Paste a job description. Find out exactly what's missing — and get rewrites to fix it.

Resume AI runs your resume through the same logic ATS systems use, scores it against the job description, and gives you high-impact suggestions with STAR-method rewrites — all in seconds.

**[Live Demo →](https://theresume-ai.vercel.app)**

---
### Home View
<img width="941" height="476" alt="resumeAI1" src="https://github.com/user-attachments/assets/76de1166-c717-41ef-b9a7-e0fef627f249" />

### Resume Upload View
<img width="938" height="477" alt="resumeAI2" src="https://github.com/user-attachments/assets/37177110-c21a-40a0-9ebe-e6f610cbd0cc" />

### Analysis Result View
<img width="941" height="472" alt="resumeAI3" src="https://github.com/user-attachments/assets/5830ad3f-bf60-4483-ba4e-1f36e94c3b86" />



---

## Features

- **Job Description Requirement Extraction** — Parses any job description to surface must-have skills, nice-to-have qualifications, and critical domain keywords
- **Rigorous ATS Scoring** — Produces a 0–100 fit score across Skills, Experience, Education, and Job Title alignment using a professional rubric
- **Evidence Matching** — Pulls specific excerpts from your resume that prove alignment with the role
- **Targeted Rewrites** — Generates high-impact bullet rewrites using the STAR method to close keyword and impact gaps
- **Privacy-First** — Results live in `sessionStorage` only. Nothing is stored or sent anywhere after you close the tab.

---

## Tech Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 15 (App Router) |
| AI Engine | Groq SDK — `llama-3.3-70b-versatile` |
| Validation | Zod |
| Styling | Tailwind CSS |
| Icons | Lucide React |

---

## Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/your-username/resume-ai.git
cd resume-ai
npm install
```

### 2. Set Environment Variables

Create a `.env.local` file in the root:
```env
GROQ_API_KEY=your_groq_api_key_here
```

Get your key at [console.groq.com](https://console.groq.com).

### 3. Run Locally
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## How It Works

1. Paste your resume text and a job description
2. The app extracts requirements from the JD using a structured Zod schema
3. Your resume is scored against each requirement category
4. Gaps are identified and matched to AI-generated rewrites
5. Results display your score, evidence matches, and prioritized suggestions

---
