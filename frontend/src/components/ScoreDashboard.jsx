import { useEffect, useState } from "react";

const sectionLabels = {
  contact_info: "Contact Info",
  professional_summary: "Professional Summary",
  work_experience: "Work Experience",
  education: "Education",
  skills: "Skills",
  formatting: "Formatting",
};

function getScoreColor(score) {
  if (score >= 75) return 'var(--green)';
  if (score >= 50) return 'var(--orange)';
  return 'var(--red)';
}

function AnimatedScoreRing({ score }) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;
  const color = getScoreColor(score);

  useEffect(() => {
    let start = 0;
    const duration = 1500;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(Math.round(eased * score));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [score]);

  return (
    <div style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="100" height="100" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth="6"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 50 50)"
          style={{ transition: "stroke-dashoffset 0.1s ease" }}
        />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: 24, fontWeight: 700, color }}>
          {animatedScore}
        </span>
        <span style={{ color: 'var(--text-secondary)', fontSize: 11, fontWeight: 500, marginTop: -2 }}>
          Overall
        </span>
      </div>
    </div>
  );
}

function MetricCard({ label, score }) {
  const color = getScoreColor(score);

  return (
    <div className="card" style={{ padding: '16px 20px' }}>
      <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </p>
      <div style={{ fontSize: 28, fontWeight: 700, color, marginTop: 4 }}>
        {score}
      </div>
      <div style={{ width: '100%', height: 4, background: 'var(--bg-elevated)', borderRadius: 2, marginTop: 10, overflow: 'hidden' }}>
        <div
          style={{
            height: '100%',
            borderRadius: 2,
            transition: 'width 0.8s ease 0.2s',
            width: `${score}%`,
            background: color,
          }}
        ></div>
      </div>
    </div>
  );
}

export default function ScoreDashboard({ data }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const overallScore = data?.overall_score ?? 0;
  const candidateName = data?.candidate_name ?? "Candidate";
  const detectedRole = data?.detected_role ?? "Not Detected";
  const summary = data?.summary ?? "";
  const sectionScores = data?.section_scores ?? {};

  return (
    <div style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.5s ease', marginTop: 40 }}>
      {/* Candidate Header Card */}
      <div className="card" style={{ padding: '28px 32px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20 }}>
        <div>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            {candidateName}
          </h2>
          <div style={{ background: 'var(--accent-glow)', border: '1px solid var(--accent)', color: 'var(--accent)', fontSize: 13, borderRadius: 999, padding: '3px 12px', display: 'inline-block', marginTop: 6 }}>
            {detectedRole}
          </div>
        </div>
        <AnimatedScoreRing score={overallScore} />
      </div>

      {/* Section Scores Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 20 }}>
        {Object.entries(sectionLabels).map(([key, label]) => (
          <MetricCard
            key={key}
            label={label}
            score={sectionScores[key] ?? 0}
          />
        ))}
      </div>

      {/* Summary Card */}
      {summary && (
        <div className="card" style={{ padding: '24px 28px', marginBottom: 20 }}>
          <div style={{ fontSize: 11, textTransform: 'uppercase', fontWeight: 600, color: 'var(--text-secondary)', letterSpacing: '0.08em', marginBottom: 10 }}>
            AI Summary
          </div>
          <p style={{ fontSize: 15, color: 'var(--text-primary)', lineHeight: 1.7 }}>
            {summary}
          </p>
        </div>
      )}
    </div>
  );
}
