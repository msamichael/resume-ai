# Resume AI - ATS Optimizer

An AI-powered Resume Analysis tool designed to bridge the gap between job seekers and Applicant Tracking Systems (ATS). This application analyzes resumes against specific job descriptions to provide rigorous scoring, keyword gap analysis, and professional rewrites using the STAR method.

## 🚀 Features

- **Deep Extraction**: Automatically identifies must-have skills, nice-to-have qualifications, and critical domain keywords from any Job Description.
- **Rigorous ATS Scoring**: Provides a 0-100 fit score based on a professional rubric covering Skills, Experience, Education, and Job Title alignment.
- **Evidence Matching**: Highlights specific excerpts from the resume that prove a match for the target role.
- **AI Recommendations**: Generates 3-8 high-impact suggestions with tailored rewrites to improve ATS readability and recruiter appeal.
- **Privacy-First**: Analysis results are stored in `sessionStorage`, ensuring no data persists after the browser tab is closed.

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **AI Engine**: Groq SDK (Running `llama-3.3-70b-versatile`)
- **Validation**: Zod for strict schema enforcement of AI responses.
- **Icons**: Lucide React
- **Styling**: Tailwind CSS

## ⚙️ Getting Started

### Prerequisites

Get a Groq API Key at the Groq Console.

### Environment Variables

Create a `.env.local` file in the root directory and add:

```bash
GROQ_API_KEY=your_groq_api_key_here
```

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/resume-ai.git
   cd resume-ai
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
