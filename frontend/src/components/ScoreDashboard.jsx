import { useEffect, useState } from "react";
import Icon from "./Icon";

const sectionLabels = {
  contact_info: "Contact",
  professional_summary: "Summary",
  work_experience: "Experience",
  education: "Education",
  skills: "Skills",
  formatting: "Formatting",
};

function getScoreColor(score) {
  if (score >= 75) return "var(--green)";
  if (score >= 50) return "var(--orange)";
  return "var(--red)";
}

function getSignal(score) {
  if (score >= 85) return "Top-tier";
  if (score >= 75) return "Competitive";
  if (score >= 55) return "Developing";
  return "Needs focus";
}

function AnimatedScoreRing({ score, size = 144, label = "Overall" }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = size / 2 - 10;
  const circumference = 2 * Math.PI * radius;
  const color = getScoreColor(score);
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  useEffect(() => {
    const startTime = performance.now();
    const duration = 1100;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(eased * score));
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [score]);

  return (
    <div className="relative inline-flex shrink-0 items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{ transition: "stroke-dashoffset 0.12s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-black" style={{ color }}>{animatedScore}</span>
        <span className="mt-1 text-xs font-bold text-[var(--text-muted)]">{label}</span>
      </div>
    </div>
  );
}

function SectionScore({ label, score }) {
  const color = getScoreColor(score);

  return (
    <div className="metric-card">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-extrabold text-[var(--text-primary)]">{label}</div>
          <div className="mt-1 text-xs font-semibold text-[var(--text-muted)]">{getSignal(score)}</div>
        </div>
        <span className="text-2xl font-black" style={{ color }}>{score}</span>
      </div>
      <div className="meter mt-5">
        <div className="meter-fill" style={{ width: `${score}%`, background: color }} />
      </div>
    </div>
  );
}

export default function ScoreDashboard({ data }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(timer);
  }, []);

  const overallScore = data?.overall_score ?? 0;
  const candidateName = data?.candidate_name ?? "Candidate";
  const detectedRole = data?.detected_role ?? "Role not detected";
  const summary = data?.summary ?? "";
  const sectionScores = data?.section_scores ?? {};
  const atsScore = data?.ats_compatibility?.score ?? 0;
  const matchScore = data?.job_role_match?.match_percentage ?? 0;

  return (
    <div
      className="space-y-5"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: "all 0.45s ease",
      }}
    >
      <div className="dashboard-grid">
        <section className="surface overflow-hidden p-6 md:p-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="section-kicker mb-3">
                <Icon name="chart" size={16} />
                Resume Scorecard
              </div>
              <h2 className="text-3xl font-black leading-tight text-[var(--text-primary)] md:text-4xl">{candidateName}</h2>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="chip chip-accent">
                  <Icon name="briefcase" size={14} />
                  {detectedRole}
                </span>
                <span className="chip">
                  <Icon name="shield" size={14} />
                  ATS {atsScore}%
                </span>
                <span className="chip">
                  <Icon name="target" size={14} />
                  Match {matchScore}%
                </span>
              </div>
            </div>
            <AnimatedScoreRing score={overallScore} />
          </div>

          {summary && (
            <div className="mt-7 rounded-[8px] border border-[var(--border)] bg-[var(--bg-inset)] p-5">
              <div className="mb-2 flex items-center gap-2 text-sm font-extrabold text-[var(--text-primary)]">
                <Icon name="sparkles" size={16} className="text-[var(--accent)]" />
                AI Summary
              </div>
              <p className="text-sm leading-7 text-[var(--text-secondary)]">{summary}</p>
            </div>
          )}
        </section>

        <aside className="surface p-6 md:p-7">
          <div className="section-kicker mb-3">
            <Icon name="target" size={16} />
            Hiring Signal
          </div>
          <div className="text-4xl font-black text-[var(--text-primary)]">{getSignal(overallScore)}</div>
          <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">
            The score combines content quality, structure, keyword coverage, formatting, and role alignment.
          </p>
          <div className="mt-6 grid gap-3">
            <div className="flex items-center justify-between rounded-[8px] border border-[var(--border)] bg-white/[0.035] p-3">
              <span className="text-xs font-bold text-[var(--text-muted)]">Best section</span>
              <span className="text-sm font-black text-[var(--green)]">
                {Object.entries(sectionScores).sort((a, b) => b[1] - a[1])?.[0]?.[1] ?? 0}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-[8px] border border-[var(--border)] bg-white/[0.035] p-3">
              <span className="text-xs font-bold text-[var(--text-muted)]">Focus section</span>
              <span className="text-sm font-black text-[var(--orange)]">
                {Object.entries(sectionScores).sort((a, b) => a[1] - b[1])?.[0]?.[1] ?? 0}
              </span>
            </div>
          </div>
        </aside>
      </div>

      <section className="metric-grid">
        {Object.entries(sectionLabels).map(([key, label]) => (
          <SectionScore key={key} label={label} score={sectionScores[key] ?? 0} />
        ))}
      </section>
    </div>
  );
}
