"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import CircularProgress from "../components/CircularProgress";

export default function AnalyzePage() {
  const [expanded, setExpanded] = useState<number | null>(null);

  const recommendations = [
    {
      note: "Add more details about your project management experience.",
      section: "Experience",
      reason:
        "Recruiters scanning for PM roles look for quantified impact — try adding team size, timelines, or outcomes.",
    },
    {
      note: "Consider adding a certification in project management.",
      section: "Skills",
      reason:
        "PMP or CAPM certifications significantly improve ATS match scores for senior PM job postings.",
    },
    {
      note: "Highlight any experience with agile methodologies.",
      section: "Skills",
      reason:
        "Over 70% of tech job descriptions mention agile. A dedicated bullet point increases keyword match.",
    },
  ];

  const missingKeywords = [
    "Project Management",
    "Agile",
    "Scrum",
    "Leadership",
    "Stakeholder Communication",
  ];

  const evidenceMatches = [
    {
      keyword: "Project Management",
      excerpt:
        "Led cross-functional project management initiatives across 3 departments...",
    },
    {
      keyword: "Agile",
      excerpt:
        "Worked in agile teams using 2-week sprint cycles and daily standups...",
    },
    {
      keyword: "Leadership",
      excerpt: "Managed and mentored a team of 5 junior developers...",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col gap-6">
          <div className="card ">
           <div className="flex flex-row justify-between items-center gap-6 p-4 animate-fade-in">


            {/* Circular Score */}
            <div className="shrink-0">
              <CircularProgress value={72} size={110} strokeWidth={10} />
            </div>

            {/* Hero Section */}
            <div className="flex flex-col gap-1">
              <p className="text-xs text-gray-500 uppercase tracking-wide">
                Overall Fit Score
              </p>
              <h2 className="text-2xl font-bold text-gray-900">Good Match</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Your resume aligns well with this role. A few missing keywords
                and experience gaps are holding back a stronger match.
              </p>
            </div>
           </div>
          </div>
          {/* Evidence Matches */}
          <div className="card">
            
              <h2 className="text-2xl font-bold">Evidence Matches</h2>
              <div className="flex flex-col gap-2 mt-3">
                {evidenceMatches.map((match, i) => (
                  <div key={i} className="bg-zinc-100/90 rounded-lg p-4 animate-fade-in-up">
                    <span className="text-xs font-medium bg-green-100 text-green-800 border border-green-200 rounded-full px-2 py-0.5">
                      {match.keyword}
                    </span>
                    <p className="text-sm text-gray-700 mt-2">
                      {match.excerpt}
                    </p>
                  </div>
                ))}
              
            </div>
          </div>

          {/* Missing Keywords */}
          <div className="card">
            <h2 className="text-2xl font-bold">Missing Keywords</h2>
            <div className="flex flex-wrap gap-2 mt-3">
              {missingKeywords.map((keyword, i) => (
                <span
                  key={i}
                  className="bg-red-200/70 border-2 border-red-300 rounded-full px-3 py-1 text-sm text-red-900 animate-fade-in-up"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          {/* AI Recommendations */}

          <div className="card">
            <h2 className="text-2xl font-bold">AI Recommendations</h2>

            <div className="flex flex-col gap-2 mt-3">
              {recommendations.map((rec, i) => (
                <div
                  key={i}
                  className="bg-teal-50 border border-teal-200 rounded-lg px-3 py-2 cursor-pointer  hover:bg-teal-100 hover:border-teal-300 transition-colors duration-150 animate-fade-in-up"
                  onClick={() => setExpanded(expanded === i ? null : i)}
                >
                  {/* Top row */}
                  <div className="flex justify-between items-start gap-2">
                    <p className="text-sm text-gray-800 flex-1">{rec.note}</p>
                    <span className="text-xs bg-teal-200 text-teal-800 px-2 py-0.5 rounded-full whitespace-nowrap">
                      {rec.section}
                    </span>
                    <ChevronDown
                      size={14}
                      className={`text-teal-600 transition-transform duration-200 ${expanded === i ? "rotate-180" : ""}`}
                    />
                  </div>

                  {/* Reason — expands on click */}
                  {expanded === i && (
                    <p className="text-xs text-teal-700 mt-2 pt-2 border-t border-teal-200">
                      {rec.reason}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
