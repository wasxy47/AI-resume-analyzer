import heroMark from "../assets/hero.png";
import Icon from "./Icon";

function scoreColor(score) {
  if (score >= 75) return "var(--green)";
  if (score >= 50) return "var(--orange)";
  return "var(--red)";
}

export default function TopBar({ candidateName, detectedRole, overallScore, onNewAnalysis }) {
  const score = overallScore ?? 0;
  const radius = 15;
  const circumference = 2 * Math.PI * radius;
  const dash = circumference - (score / 100) * circumference;

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-[var(--border)] bg-[rgba(8,9,7,0.88)] backdrop-blur-xl">
      <div className="flex h-14 items-center justify-between gap-3 px-3 md:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] border border-[var(--border)] bg-white/[0.04]">
            <img src={heroMark} alt="" className="h-6 w-6 object-contain" />
          </div>
          <div className="hidden min-w-0 sm:block">
            <div className="truncate text-sm font-extrabold text-[var(--text-primary)]">ResumeAI Report</div>
            <div className="truncate text-xs font-semibold text-[var(--text-muted)]">{detectedRole || "Role signal pending"}</div>
          </div>
        </div>

        <div className="hidden min-w-0 items-center gap-3 md:flex">
          <span className="truncate text-sm font-bold text-[var(--text-primary)]">{candidateName || "Candidate"}</span>
          <span className="chip chip-accent">
            <Icon name="target" size={14} />
            Analysis Active
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 rounded-[8px] border border-[var(--border)] bg-white/[0.04] px-2 py-1">
            <div className="relative h-8 w-8">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r={radius} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
                <circle
                  cx="20"
                  cy="20"
                  r={radius}
                  fill="none"
                  stroke={scoreColor(score)}
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={dash}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-black" style={{ color: scoreColor(score) }}>
                {score}
              </span>
            </div>
            <span className="hidden text-xs font-bold text-[var(--text-secondary)] sm:inline">Score</span>
          </div>

          <button onClick={onNewAnalysis} className="btn btn-secondary h-10 min-h-10 px-3 sm:px-4">
            <Icon name="plus" size={16} />
            <span className="hidden sm:inline">New Analysis</span>
          </button>
        </div>
      </div>
    </header>
  );
}
