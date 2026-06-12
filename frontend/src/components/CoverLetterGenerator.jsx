import { useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config";
import Icon from "./Icon";

export default function CoverLetterGenerator({ resumeText, targetRole, candidateName }) {
  const [tone, setTone] = useState("professional");
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const tones = [
    { id: "professional", label: "Professional", desc: "Formal, structured, and polished" },
    { id: "confident", label: "Confident", desc: "Achievement-led and assertive" },
    { id: "concise", label: "Concise", desc: "Short, direct, and modern" },
  ];

  const handleGenerate = async () => {
    if (!resumeText) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/generate-cover-letter`, {
        resume_text: resumeText,
        target_role: targetRole || "General Position",
        tone,
      });
      setResult(response.data);
      setCopied(false);
    } catch (err) {
      console.error(err);
      setError("Failed to generate cover letter. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result?.cover_letter) return;
    await navigator.clipboard.writeText(result.cover_letter);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section className="surface overflow-hidden p-6 md:p-7">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="section-kicker mb-2">
            <Icon name="mail" size={16} />
            Cover Letter
          </div>
          <h2 className="section-title">Generate a role-ready letter</h2>
          <p className="section-subtitle mt-2">
            {candidateName || "The candidate"} for {targetRole || "the target role"}.
          </p>
        </div>
        <span className="chip chip-accent">
          <Icon name="wand" size={14} />
          Resume-based
        </span>
      </div>

      <div className="rounded-[8px] border border-[var(--border)] bg-[var(--bg-inset)] p-4">
        <div className="grid gap-3 md:grid-cols-3">
          {tones.map((item) => (
            <button
              key={item.id}
              onClick={() => setTone(item.id)}
              className={`rounded-[8px] border p-4 text-left transition-all ${
                tone === item.id
                  ? "border-[var(--accent-line)] bg-[var(--accent-soft)]"
                  : "border-[var(--border)] bg-white/[0.035] hover:border-[var(--border-strong)]"
              }`}
            >
              <div className="font-extrabold text-[var(--text-primary)]">{item.label}</div>
              <p className="mt-1 text-xs leading-5 text-[var(--text-secondary)]">{item.desc}</p>
            </button>
          ))}
        </div>

        <button onClick={handleGenerate} disabled={isLoading || !resumeText} className="btn btn-primary mt-5 w-full">
          {isLoading ? (
            <>
              <span className="inline-block h-4 w-4 rounded-full border-2 border-[#06100c]/25 border-t-[#06100c]" style={{ animation: "spin 0.7s linear infinite" }} />
              Crafting letter
            </>
          ) : (
            <>
              <Icon name="sparkles" size={18} />
              Generate Cover Letter
            </>
          )}
        </button>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-[8px] border border-[rgba(255,107,119,0.28)] bg-[var(--red-bg)] p-3 text-sm text-[var(--red)]">
            <Icon name="warning" size={16} />
            {error}
          </div>
        )}
      </div>

      {result && (
        <div className="mt-6 animate-fade-in-up">
          {result.key_achievements_used?.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {result.key_achievements_used.map((achievement, index) => (
                <span key={index} className="chip chip-success">{achievement}</span>
              ))}
            </div>
          )}

          <div className="rounded-[8px] border border-[var(--border)] bg-[#f4f0e8] p-5 text-[#172018] md:p-7">
            <p className="whitespace-pre-wrap font-serif text-[15px] leading-8">{result.cover_letter}</p>

            <div className="mt-7 flex flex-col gap-3 border-t border-[#172018]/15 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <span className="text-xs font-bold text-[#172018]/60">
                {result.word_count} words | {result.tone_used} tone
              </span>
              <div className="flex flex-col gap-2 sm:flex-row">
                <button onClick={() => setResult(null)} className="btn btn-secondary border-[#172018]/20 bg-[#172018]/5 text-[#172018] hover:bg-[#172018]/10">
                  <Icon name="pen" size={16} />
                  Change Tone
                </button>
                <button onClick={handleGenerate} className="btn btn-secondary border-[#172018]/20 bg-[#172018]/5 text-[#172018] hover:bg-[#172018]/10">
                  <Icon name="refresh" size={16} />
                  Regenerate
                </button>
                <button onClick={handleCopy} className="btn border-[#172018] bg-[#172018] text-white hover:bg-[#172018]/90">
                  <Icon name={copied ? "check" : "copy"} size={16} />
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
