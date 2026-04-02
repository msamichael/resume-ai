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

const ScoringSchema = z.object({
  score: z.number().int().min(0).max(100),
  score_breakdown: z.object({
    skills: z.number(),
    experience: z.number(),
    education_certs: z.number(),
    title: z.number(),
  }),
  evidence_matches: z.array(z.string()),
  missing_keywords: z.array(z.string()),
});

// const FeedbackSchema = z.object({
//     feedback: z.string(),
//     improvements: z.array(z.string()),
// });

const SuggestionsSchema = z.object({
  suggestions: z.array(
    z.object({
      // target_section: z.enum(['skills', 'experience', 'education_certs', 'title']),
      target_section: z.string(),
      rewrite: z.string(),
      reason: z.string(),
    }),
  ),
});

// Combined schema for the entire response
const ResponseSchema = z.object({
  extraction: ExtractionSchema,
  scoring: ScoringSchema,
  // feedback: FeedbackSchema,
  suggestions: SuggestionsSchema,
});

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

    //1. Job Description Extraction Prompt
    const extractionPrompt = ` You are a resume analysis assistant. Extract structured data from the job description.
Return ONLY valid JSON matching this schema:
${JSON.stringify(ExtractionSchema.shape, null, 2)}
JOB DESCRIPTION:
${jobDescription}`;

    const rawExtractionResponse = await callGroq(extractionPrompt);
    const extractionResult = ExtractionSchema.parse(rawExtractionResponse);

    //2. Resume Scoring Prompt
    const scoringPrompt = `You are a resume analysis assistant. Compare the resume to the extracted Job Description data.
Return ONLY valid JSON matching this schema:
${JSON.stringify(ScoringSchema.shape, null, 2)}
RESUME:
${resumeText}

Job Description DATA:
${JSON.stringify(extractionResult)}`;

    const rawScoringResponse = await callGroq(scoringPrompt);
    const scoringResult = ScoringSchema.parse(rawScoringResponse);
    //3. Resume Improvement Suggestions Prompt
    const suggestionsPrompt = `You are a resume analysis assistant. Based on the extracted Job Description data and the resume scoring, provide specific suggestions to improve the resume.
Return ONLY valid JSON matching this schema:
${JSON.stringify(SuggestionsSchema.shape, null, 2)}
RESUME SCORE:
${JSON.stringify(scoringResult)}  `;

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
      { error: "Analysis Failed",  details: error instanceof Error ? error.message : "Unknown error", },
      { status: 500},
    );
  }
}
