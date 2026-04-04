"use client";

import {
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ArrowLeft,
} from "lucide-react";
import { useEffect, useState } from "react";
import CircularProgress from "../components/CircularProgress";
import { useRouter } from "next/navigation";

export default function AnalyzePage() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [expandedBreakdown, setExpandedBreakdown] = useState<string | null>(
    null,
  );
  const [results, setResults] = useState<any>(null);
  const [hasResults, setHasResults] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const analysisResult = sessionStorage.getItem("analysisResult");

    if (analysisResult) {
      try {
        const parsedResult = JSON.parse(analysisResult);
        setResults(parsedResult);
        setHasResults(true);
      } catch (error) {
        console.error("Error parsing analysis result:", error);
        setHasResults(false);
      }
    } else {
      setHasResults(false);
    }
  }, []);

  useEffect(() => {
    if (!hasResults) {
      router.replace("/");
    }
  }, [hasResults, router]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "strong":
        return <CheckCircle2 className="text-green-500" size={18} />;
      case "good":
        return <CheckCircle2 className="text-emerald-500" size={18} />;
      case "partial":
        return <AlertCircle className="text-amber-500" size={18} />;
      default:
        return <XCircle className="text-red-500" size={18} />;
    }
  };

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 italic">Loading analysis results...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Upload
        </button>

        <div className="flex flex-col gap-6">
          <div className="card ">
            <div className="flex flex-row justify-between items-center gap-6 p-4 animate-fade-in">
              {/* Circular Score */}
              <div className="shrink-0">
                <CircularProgress
                  value={results.scoring.score}
                  size={110}
                  strokeWidth={10}
                />
              </div>

              {/* Hero Section */}
              <div className="flex flex-col gap-1">
                <p className="text-xs text-gray-500 uppercase tracking-wide">
                  Overall Fit: {results.extraction.job_title}
                </p>
                <h2 className="text-2xl font-bold text-gray-900">
                  {results.scoring.match_label}
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {results.scoring.summary}
                </p>
              </div>
            </div>
          </div>

          {/* Score Analysis Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <h2 className="text-lg font-bold mb-4">Match Breakdown</h2>
              <div className="space-y-5">
                {Object.entries(results.scoring.score_breakdown).map(
                  ([key, value]: [string, any]) => (
                    <div
                      key={key}
                      className="flex flex-col border-b border-gray-50 pb-3 last:border-0 cursor-pointer hover:bg-gray-50/50 transition-colors rounded px-1"
                      onClick={() =>
                        setExpandedBreakdown(
                          expandedBreakdown === key ? null : key,
                        )
                      }
                    >
                      <div className="flex items-center justify-between">
                        <span className="capitalize text-sm font-semibold text-gray-700">
                          {key.replace("_", " ")}
                        </span>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] font-bold uppercase ${
                              value.rating === "strong"
                                ? "text-green-600"
                                : value.rating === "good"
                                  ? "text-emerald-600"
                                  : value.rating === "partial"
                                    ? "text-amber-600"
                                    : "text-red-600"
                            }`}
                          >
                            {value.rating}
                          </span>
                          {getStatusIcon(value.rating)}
                          <ChevronDown
                            size={14}
                            className={`text-gray-400 transition-transform duration-200 ${expandedBreakdown === key ? "rotate-180" : ""}`}
                          />
                        </div>
                      </div>
                      {expandedBreakdown === key && (
                        <p className="text-xs text-gray-500 leading-relaxed italic mt-2 animate-fade-in">
                          {value.reason}
                        </p>
                      )}
                    </div>
                  ),
                )}
              </div>
            </div>
            {/* Top Requirements */}
            <div className="card relative">
              <h2 className="text-lg font-bold mb-4">Top Requirements Found</h2>
              <div className="flex flex-wrap gap-2">
                {results.extraction.must_have_skills
                  .slice(0, 6)
                  .map((skill: string, i: number) => (
                    <span
                      key={i}
                      className="bg-blue-50  text-blue-700 text-xs px-2 py-1 rounded border border-blue-100 font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                {results.extraction.tools
                  .slice(0, 4)
                  .map((tool: string, i: number) => (
                    <span
                      key={i}
                      className="bg-purple-50 text-purple-700 text-xs px-2 py-1 rounded border border-purple-100 font-medium"
                    >
                      {tool}
                    </span>
                  ))}
              </div>
              <p className="text-[12px] text-gray-400 mt-4 italic">
                *Extracted from Job Description
              </p>
              <div className="flex flex-col  absolute bottom-2 right-4 gap-2 text-[10px] text-gray-800 mt-4">
                <div className="flex gap-1 items-center">
                  <div className="w-2 h-2 rounded-full bg-blue-700">
                  </div>
                    <p>Skills</p>
                </div>
                <div className="flex gap-1 items-center">
                  <div className="w-2 h-2 rounded-full bg-purple-700">
                  </div>
                    <p>Tools</p>
                </div>
              </div>
            </div>
          </div>

          {/* Evidence Matches */}
          <div className="card">
            <h2 className="text-lg font-bold">Evidence Matches</h2>
            <div className="flex flex-col gap-2 mt-3">
              {results.scoring.evidence_matches.map(
                (match: string, i: number) => (
                  <div
                    key={i}
                    className="bg-teal-50 border border-teal-200 rounded-lg p-4 animate-fade-in-up"
                  >
                    <p className="text-sm text-gray-700">{match}</p>
                  </div>
                ),
              )}
            </div>
          </div>

          {/* Missing Keywords */}
          <div className="card">
            <h2 className="text-lg font-bold">Missing Keywords</h2>
            <div className="flex flex-wrap gap-2 mt-3">
              {results.scoring.missing_keywords.map(
                (keyword: string, i: number) => (
                  <span
                    key={i}
                    className="bg-red-200/70 border-2 border-red-300 rounded-full px-3 py-1 text-sm text-red-900 animate-fade-in-up"
                  >
                    {keyword}
                  </span>
                ),
              )}
            </div>
          </div>

          {/* AI Recommendations */}

          <div className="card">
            <h2 className="text-lg font-bold">AI Recommendations</h2>

            <div className="flex flex-col gap-2 mt-3">
              <div className="flex">
                <p className="text-sm text-gray-700 italic">
                  *Click each suggestion to see the AI's reasoning
                </p>
              </div>
              {results.suggestions.suggestions.map((rec: any, i: number) => (
                <div
                  key={i}
                  className="bg-teal-50 border border-teal-200 rounded-lg px-3 py-2 cursor-pointer  hover:bg-teal-100 hover:border-teal-300 transition-colors duration-150 animate-fade-in-up"
                  onClick={() => setExpanded(expanded === i ? null : i)}
                >
                  {/* Top row */}
                  <div className="flex justify-between items-start gap-2">
                    <p className="text-sm text-gray-800 flex-1">
                      {rec.rewrite}
                    </p>
                    <span className="text-xs bg-teal-200 text-teal-800 px-2 py-0.5 rounded-full whitespace-nowrap">
                      {rec.target_section}
                    </span>
                    <ChevronDown
                      size={14}
                      className={`text-teal-600 transition-transform duration-200 ${expanded === i ? "rotate-180" : ""}`}
                    />
                  </div>

                  {/* Reason — expands on click */}
                  {expanded === i && (
                    <p className="text-xs text-teal-700 mt-2 pt-2 border-t border-teal-200 animate-fade-in">
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
