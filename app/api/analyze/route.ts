import { callGroq } from "@/app/lib/groq";
import { parseResume } from "@/app/lib/parseResume";
import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";


// Zod Schema for validating incoming request data
const ExtractionSchema = z.object({
  job_title: z.string(),
  must_have_skills: z.array(z.string()),
  nice_to_have_skills: z.array(z.string()),
  certifications: z.array(z.string()),
  tools: z.array(z.string()),
  domain_keywords: z.array(z.string()),
  critical_phrases: z.array(z.string()),
  evidences_from_jd: z.array(z.string()),
});
const EXTRACTION_SCHEMA_DESCRIPTION = `{
  "job_title": "string",
  "must_have_skills": ["string"],
  "nice_to_have_skills": ["string"],
  "certifications": ["string"],
  "tools": ["string"],
  "domain_keywords": ["string"],
  "critical_phrases": ["string - exact notable phrases from the Job Description"],
  "evidences_from_jd": ["string - direct quotes or paraphrases of requirements"]
}`;

const ScoringSchema = z.object({
  score: z.number().int().min(0).max(100),
  match_label: z.enum(["Strong Match", "Good Match", "Partial Match", "Weak Match"]),
  summary: z.string(),
  score_breakdown: z.object({
  skills: z.object({
      rating: z.enum(["strong", "good", "partial", "weak"]),
      reason: z.string(),
    }),
    experience: z.object({
      rating: z.enum(["strong", "good", "partial", "weak"]),
      reason: z.string(),
    }),
    education_certs: z.object({
      rating: z.enum(["strong", "good", "partial", "weak"]),
      reason: z.string(),
    }),
    title: z.object({
      rating: z.enum(["strong", "good", "partial", "weak"]),
      reason: z.string(),
    }),}),
  evidence_matches: z.array(z.string()),
  missing_keywords: z.array(z.string()),
});

const SCORING_SCHEMA_DESCRIPTION = `{
  "score": "integer 0-100. Score this resume the way a real ATS system would: prioritize exact and near-exact keyword matches from the JD found in the resume. Must-have skills that are absent should heavily penalize the score. Nice-to-have skills add small bonus points. Years of experience only matter if they meet the JD minimum. Do not reward soft skills, potential, or general impressiveness — only match what is explicitly present in the resume against what is explicitly required in the Job Description."
  "match_label": "Strong Match" | "Good Match" | "Partial Match" | "Weak Match",
  "summary": "2-3 sentence plain-English summary of the match. Lead with the label verdict, then explain the biggest strength and the biggest gap.",
 
  "score_breakdown": {
    "skills": {
      "rating": "strong" | "good" | "partial" | "weak",
      "reason": "1-2 sentences explaining why, referencing specific skills present or missing"
    },
    "experience": {
      "rating": "strong" | "good" | "partial" | "weak",
      "reason": "1-2 sentences explaining why, referencing years or domain relevance"
    },
    "education_certs": {
      "rating": "strong" | "good" | "partial" | "weak",
      "reason": "1-2 sentences explaining why, referencing degree or certifications"
    },
    "title": {
      "rating": "strong" | "good" | "partial" | "weak",
      "reason": "1-2 sentences explaining why, referencing the candidate's current title vs target role"
    }
  },
  "evidence_matches": ["string - specific text from resume that matches JD requirements"],
  "missing_keywords": ["string - required skills or keywords absent from the resume"]
}`;

const SuggestionsSchema = z.object({
  suggestions: z.array(
    z.object({
      target_section: z.string(),
      rewrite: z.string(),
      reason: z.string(),
    }),
  ),
});

const SUGGESTIONS_SCHEMA_DESCRIPTION = `{
  "suggestions": [
    {
      "target_section": "Work Experience | Skills | Education/Certs  | Summary/Objective | Projects | Certifications | Languages | Volunteer Work",
      "rewrite": "string - a full rewritten bullet or sentence using STAR method. Naturally incorporate missing keywords only where they are plausibly implied by the candidate's existing experience. Never fabricate tools or technologies not present or implied in the resume."
      "reason": "string - why this change improves ATS score or recruiter appeal"
    }
  ]
}`;



export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const jobDescription = formData.get("job_description") as string;
    const resumeFile = formData.get("resume") as File | null;

    if (!jobDescription || !resumeFile) {
      return NextResponse.json(
        { error: "Missing job description or resume file" },
        { status: 400 },
      );
    }

    const resumeText = await parseResume(resumeFile);

    //1. Extraction
    const extractionPrompt = ` You are an expert Technical Recruiter. Analyze the provided JOB DESCRIPTION and extract the core requirements.
 Distinguish between required "must-have" skills and "nice-to-have" qualifications.
 Return ONLY valid JSON. No markdown, no explanation, no extra text.

  SCHEMA:
${EXTRACTION_SCHEMA_DESCRIPTION}

JOB DESCRIPTION:
${jobDescription}`;

    const rawExtractionResponse = await callGroq(extractionPrompt);
    const extractionResult = ExtractionSchema.parse(rawExtractionResponse);

    //2. Scoring 
    const scoringPrompt = `You are an expert ATS (Applicant Tracking System). Your task is to provide a rigorous, unbiased match score between the RESUME and the JOB DESCRIPTION DATA.
Scoring Rubric:
- Score the resume holistically from 0-100 based on overall fit.
- Then rate each category independently:
  - skills: are the must-have and nice-to-have skills present? (strong/good/partial/weak)
  - experience: does the experience align with domain keywords and seniority? (strong/good/partial/weak)
  - education_certs: does the candidate meet education/certification requirements? (strong/good/partial/weak)
  - title: does the candidate's trajectory match the target role? (strong/good/partial/weak)
- Be critical. Only give a high score if there is clear evidence in the resume.
- score is your own judgment — do not derive it mathematically from the breakdown.

Return ONLY valid JSON. No markdown, no explanation, no extra text.

SCHEMA:
${SCORING_SCHEMA_DESCRIPTION}

RESUME:
${resumeText}

Job Description DATA:
${JSON.stringify(extractionResult, null, 2)}`;

    const rawScoringResponse = await callGroq(scoringPrompt);
    const scoringResult = ScoringSchema.parse(rawScoringResponse);
   
   
   
    //3. Suggestions
const suggestionsPrompt = `You are a Career Coach and Resume Editor. Based on the ATS analysis and the original resume, provide between 3-8 high-impact suggestions.

For each suggestion:
- Provide a "rewrite" that uses the STAR method (Situation, Task, Action, Result) where possible.
- Incorporate at least one missing keyword naturally into the rewrite.
- The "reason" should explain how this change helps bypass ATS filters or appeals to a recruiter.
- Do not fabricate technologies not implied by the resume.

Return ONLY valid JSON. No markdown, no explanation, no extra text.

SCHEMA:
${SUGGESTIONS_SCHEMA_DESCRIPTION}

JOB REQUIREMENTS:
${JSON.stringify(extractionResult, null, 2)}

ATS ANALYSIS RESULT:
${JSON.stringify(scoringResult, null, 2)}

RESUME:
${resumeText}`;

    const rawSuggestionsResponse = await callGroq(suggestionsPrompt);
    const suggestionsResult = SuggestionsSchema.parse(rawSuggestionsResponse);
    return NextResponse.json({
      extraction: extractionResult,
      scoring: scoringResult,
      suggestions: suggestionsResult,
    });
  } catch (error) {
    console.error("Analysis route failed:", error);
    return NextResponse.json(
      {
        error: "Analysis Failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
