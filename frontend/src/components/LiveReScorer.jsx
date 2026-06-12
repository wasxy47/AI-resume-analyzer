import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import Icon from "./Icon";

const sections = [
  { id: "professional_summary", label: "Professional Summary" },
  { id: "work_experience", label: "Work Experience" },
  { id: "education", label: "Education" },
  { id: "skills", label: "Skills" },
];

function gradeClass(grade) {
  const value = grade?.toUpperCase() || "";
  if (value === "A") return "chip-success";
  if (value === "B") return "chip-accent";
  if (value === "C") return "chip-warning";
  return "chip-danger";
}

export default function LiveReScorer({ sectionScores, targetRole }) {
  const [selectedSection, setSelectedSection] = useState("professional_summary");
  const [sectionText, setSectionText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [animatedScore, setAnimatedScore] = useState(0);

  const originalScore = sectionScores?.[selectedSection] || 0;
  const scoreDiff = result?.score ? result.score - originalScore : 0;

  const handleRescore = async () => {
    if (sectionText.trim().length < 10) return;
    setIsLoading(true);
    setResult(null);
    setError(null);
    setAnimatedScore(0);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/rescore-section`, {
        section_name: sections.find((section) => section.id === selectedSection)?.label || selectedSection,
        section_text: sectionText,
        target_role: targetRole || "General",
      });
      setResult(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to rescore section. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!result?.score) return undefined;
    const interval = setInterval(() => {
      setAnimatedScore((prev) => {
        if (prev < result.score) return prev + 1;
        clearInterval(interval);
        return result.score;
      });
    }, 10);
    return () => clearInterval(interval);
  }, [result?.score]);

  return (
    <section className="surface p-6 md:p-7">
      <div className="mb-6">
        <div className="section-kicker mb-2">
          <Icon name="pen" size={16} />
          Live Re-Score
        </div>
        <h2 className="section-title">Test an improved resume section</h2>
        <p className="section-subtitle mt-2">Paste a revised section and get a fast quality score for the target role.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[0.78fr_1.22fr]">
        <aside className="rounded-[8px] border border-[var(--border)] bg-[var(--bg-inset)] p-4">
          <div className="mb-4 text-sm font-extrabold text-[var(--text-primary)]">Section Baseline</div>
          <div className="space-y-2">
            {sections.map((section) => {
              const active = selectedSection === section.id;
              const score = sectionScores?.[section.id] || 0;

              return (
                <button
                  key={section.id}
                  onClick={() => {
                    setSelectedSection(section.id);
                    setResult(null);
                    setError(null);
                    setAnimatedScore(0);
                  }}
                  className={`w-full rounded-[8px] border p-3 text-left transition-all ${
                    active
                      ? "border-[var(--accent-line)] bg-[var(--accent-soft)]"
                      : "border-[var(--border)] bg-white/[0.035] hover:border-[var(--border-strong)]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-bold text-[var(--text-primary)]">{section.label}</span>
                    <span className="text-sm font-black text-[var(--accent)]">{score || "N/A"}</span>
                  </div>
                  <div className="meter mt-3">
                    <div className="meter-fill bg-[var(--accent)]" style={{ width: `${score}%` }} />
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        <div className="rounded-[8px] border border-[var(--border)] bg-[var(--bg-inset)] p-4">
          <textarea
            placeholder="Paste or type your improved section content here..."
            className="textarea h-56"
            value={sectionText}
            onChange={(e) => setSectionText(e.target.value)}
          />

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-xs font-bold text-[var(--text-muted)]">{sectionText.length} characters</span>
            <button onClick={handleRescore} disabled={isLoading || sectionText.trim().length < 10} className="btn btn-primary">
              {isLoading ? (
                <>
                  <span className="inline-block h-4 w-4 rounded-full border-2 border-[#06100c]/25 border-t-[#06100c]" style={{ animation: "spin 0.7s linear infinite" }} />
                  Scoring section
                </>
              ) : (
                <>
                  <Icon name="bolt" size={17} />
                  Re-Score Section
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

          {result && (
            <div className="mt-5 rounded-[8px] border border-[var(--border)] bg-white/[0.035] p-5">
              <div className="flex flex-col gap-5 md:flex-row md:items-start">
                <div className="shrink-0 rounded-[8px] border border-[var(--border)] bg-[var(--bg-surface)] p-5 text-center">
                  <div className="text-xs font-bold text-[var(--text-muted)]">New Score</div>
                  <div className="mt-1 text-5xl font-black text-[var(--text-primary)]">{animatedScore}</div>
                  <span className={`chip mt-3 ${gradeClass(result.grade)}`}>Grade {result.grade}</span>
                </div>

                <div className="min-w-0 flex-1">
                  {scoreDiff !== 0 && (
                    <div className={`mb-3 inline-flex rounded-[8px] border px-3 py-2 text-sm font-bold ${
                      scoreDiff > 0
                        ? "border-[rgba(68,208,123,0.26)] bg-[var(--green-bg)] text-[var(--green)]"
                        : "border-[rgba(255,107,119,0.26)] bg-[var(--red-bg)] text-[var(--red)]"
                    }`}>
                      {scoreDiff > 0 ? `+${scoreDiff} points improvement` : `${Math.abs(scoreDiff)} points lower than baseline`}
                    </div>
                  )}

                  <p className="rounded-[8px] border border-[var(--border)] bg-[var(--bg-inset)] p-4 text-sm leading-7 text-[var(--text-secondary)]">
                    {result.quick_feedback}
                  </p>

                  {result.top_issue && (
                    <div className="mt-3 flex items-start gap-3 rounded-[8px] border border-[rgba(255,184,77,0.26)] bg-[var(--orange-bg)] p-4">
                      <Icon name="warning" size={16} className="mt-1 shrink-0 text-[var(--orange)]" />
                      <div>
                        <div className="text-xs font-black text-[var(--orange)]">Still needs work</div>
                        <p className="mt-1 text-sm leading-6 text-[var(--text-primary)]">{result.top_issue}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
