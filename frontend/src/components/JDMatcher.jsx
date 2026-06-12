import { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import Icon from "./Icon";

function getScoreColor(score) {
  if (score >= 75) return "var(--green)";
  if (score >= 50) return "var(--orange)";
  return "var(--red)";
}

export default function JDMatcher({ resumeText }) {
  const [jdText, setJdText] = useState("");
  const [jdResult, setJdResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleAnalyze = async () => {
    if (jdText.trim().length < 50) return;
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/analyze-jd`, {
        resume_text: resumeText,
        job_description: jdText,
      });
      setJdResult(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to analyze job description match. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetMatcher = () => {
    setJdResult(null);
    setJdText("");
    setError(null);
  };

  return (
    <section className="surface p-6 md:p-7">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="section-kicker mb-2">
            <Icon name="briefcase" size={16} />
            JD Matcher
          </div>
          <h2 className="section-title">Match against a real job post</h2>
          <p className="section-subtitle mt-2 max-w-2xl">
            Paste a job description to compare required skills, keywords, experience fit, and top changes.
          </p>
        </div>

        {jdResult && (
          <button onClick={resetMatcher} className="btn btn-secondary">
            <Icon name="refresh" size={16} />
            Try Another JD
          </button>
        )}
      </div>

      {!jdResult ? (
        <div className="rounded-[8px] border border-[var(--border)] bg-[var(--bg-inset)] p-4">
          <textarea
            placeholder="Paste the full job description here..."
            className="textarea h-56"
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            disabled={isLoading}
          />

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-xs font-bold text-[var(--text-muted)]">
              {jdText.trim().length} characters
            </span>
            <button onClick={handleAnalyze} disabled={jdText.trim().length < 50 || isLoading} className="btn btn-primary">
              {isLoading ? (
                <>
                  <span className="inline-block h-4 w-4 rounded-full border-2 border-[#06100c]/25 border-t-[#06100c]" style={{ animation: "spin 0.7s linear infinite" }} />
                  Analyzing match
                </>
              ) : (
                <>
                  <Icon name="search" size={17} />
                  Analyze Match
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="mt-4 flex items-center gap-2 rounded-[8px] border border-[rgba(255,107,119,0.28)] bg-[var(--red-bg)] p-3 text-sm text-[var(--red)]">
              <Icon name="warning" size={16} />
              {error}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-5 animate-fade-in-up">
          <div className="grid gap-5 lg:grid-cols-[0.82fr_1.18fr]">
            <div className="rounded-[8px] border border-[var(--border)] bg-[var(--bg-inset)] p-6 text-center">
              <div className="relative mx-auto h-36 w-36">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke={getScoreColor(jdResult.match_score)}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 42}
                    strokeDashoffset={(2 * Math.PI * 42) - ((jdResult.match_score || 0) / 100) * (2 * Math.PI * 42)}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black" style={{ color: getScoreColor(jdResult.match_score) }}>
                    {jdResult.match_score}
                  </span>
                  <span className="text-xs font-bold text-[var(--text-muted)]">Match</span>
                </div>
              </div>
              {jdResult.verdict && (
                <p className="mt-5 text-sm leading-7 text-[var(--text-secondary)]">{jdResult.verdict}</p>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {Object.entries(jdResult.score_breakdown || {}).map(([key, value]) => (
                <div key={key} className="rounded-[8px] border border-[var(--border)] bg-white/[0.035] p-4">
                  <div className="mb-3 flex justify-between gap-3">
                    <span className="text-sm font-extrabold capitalize text-[var(--text-primary)]">{key.replace("_", " ")}</span>
                    <span className="text-sm font-black text-[var(--accent)]">{value}%</span>
                  </div>
                  <div className="meter">
                    <div className="meter-fill bg-[var(--accent)]" style={{ width: `${value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="rounded-[8px] border border-[rgba(68,208,123,0.24)] bg-[var(--green-bg)] p-5">
              <div className="mb-3 flex items-center gap-2 text-sm font-extrabold text-[var(--text-primary)]">
                <Icon name="check" size={16} className="text-[var(--green)]" />
                Keywords Found
              </div>
              <div className="keyword-cloud">
                {jdResult.matched_keywords?.length ? (
                  jdResult.matched_keywords.map((kw, i) => <span key={i} className="chip chip-success">{kw}</span>)
                ) : (
                  <p className="empty-copy">No matching keywords found.</p>
                )}
              </div>
            </div>

            <div className="rounded-[8px] border border-[rgba(255,107,119,0.24)] bg-[var(--red-bg)] p-5">
              <div className="mb-3 flex items-center gap-2 text-sm font-extrabold text-[var(--text-primary)]">
                <Icon name="warning" size={16} className="text-[var(--red)]" />
                Missing Keywords
              </div>
              <div className="keyword-cloud">
                {jdResult.missing_keywords?.length ? (
                  jdResult.missing_keywords.map((kw, i) => <span key={i} className="chip chip-danger">{kw}</span>)
                ) : (
                  <p className="empty-copy">No missing keywords listed.</p>
                )}
              </div>
            </div>
          </div>

          {jdResult.top_3_improvements?.length > 0 && (
            <div className="rounded-[8px] border border-[var(--border)] bg-[var(--bg-inset)] p-5">
              <div className="mb-4 flex items-center gap-2 text-sm font-extrabold text-[var(--text-primary)]">
                <Icon name="listChecks" size={16} className="text-[var(--accent)]" />
                Top Match Improvements
              </div>
              <div className="grid gap-3">
                {jdResult.top_3_improvements.map((improvement, index) => (
                  <div key={index} className="flex gap-4 rounded-[8px] border border-[var(--border)] bg-white/[0.035] p-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-[var(--accent-soft)] text-sm font-black text-[var(--accent)]">
                      {index + 1}
                    </span>
                    <p className="text-sm leading-6 text-[var(--text-secondary)]">{improvement}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
