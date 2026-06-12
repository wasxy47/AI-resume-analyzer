import { useEffect, useState } from "react";
import Icon from "./Icon";

const messages = [
  "Parsing document structure",
  "Evaluating section quality",
  "Calculating ATS compatibility",
  "Generating rewrite suggestions",
  "Scoring skills and keywords",
  "Finalizing the report",
];

export default function AnalysisLoader() {
  const [msgIndex, setMsgIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const msgInterval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % messages.length);
    }, 1400);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return 90;
        return Math.min(prev + Math.floor(Math.random() * 8) + 7, 90);
      });
    }, 1400);

    return () => {
      clearInterval(msgInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="surface mx-auto flex min-h-[360px] max-w-3xl flex-col items-center justify-center p-8 text-center">
      <div className="relative mb-8 flex h-28 w-28 items-center justify-center">
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-r-[var(--accent)] border-t-[var(--accent)]" style={{ animation: "spin 1s linear infinite" }} />
        <div className="absolute inset-3 rounded-full border-4 border-transparent border-b-[var(--gold)] border-l-[var(--gold)]" style={{ animation: "spin 1.45s linear infinite reverse" }} />
        <div className="flex h-16 w-16 items-center justify-center rounded-[8px] border border-[var(--border)] bg-[var(--bg-inset)] text-[var(--accent)]">
          <Icon name="sparkles" size={28} />
        </div>
      </div>

      <h2 className="text-xl font-black text-[var(--text-primary)]">Analyzing your resume</h2>
      <p className="mt-2 h-6 text-sm font-semibold text-[var(--text-secondary)]">{messages[msgIndex]}...</p>

      <div className="mt-7 w-full max-w-md">
        <div className="mb-2 flex justify-between text-xs font-bold text-[var(--text-muted)]">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="meter h-2">
          <div className="meter-fill bg-[var(--accent)]" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
}
