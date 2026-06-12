import { useEffect, useState } from "react";
import Icon from "./Icon";

function getScoreColor(score) {
  if (score >= 75) return "var(--green)";
  if (score >= 50) return "var(--orange)";
  return "var(--red)";
}

export default function JobRoleMatch({ data }) {
  const [animatedMatch, setAnimatedMatch] = useState(0);
  const matchPercentage = data?.match_percentage ?? 0;
  const color = getScoreColor(matchPercentage);

  useEffect(() => {
    const duration = 1000;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedMatch(Math.round(eased * matchPercentage));
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [matchPercentage]);

  if (!data) return null;

  return (
    <section className="surface p-6 md:p-7">
      <div className="grid gap-6 lg:grid-cols-[0.86fr_1.14fr]">
        <div>
          <div className="section-kicker mb-2">
            <Icon name="briefcase" size={16} />
            Role Match
          </div>
          <h3 className="section-title">{data.detected_role || "Detected Role"}</h3>

          <div className="mt-6 rounded-[8px] border border-[var(--border)] bg-[var(--bg-inset)] p-5">
            <div className="flex items-end justify-between gap-4">
              <div>
                <div className="text-[13px] font-bold text-[var(--text-muted)]">Match Score</div>
                <div className="mt-1 text-6xl font-black leading-none" style={{ color }}>
                  {animatedMatch}%
                </div>
              </div>
              <Icon name="target" size={44} className="text-[var(--text-muted)]" />
            </div>

            <div className="meter mt-5">
              <div className="meter-fill" style={{ width: `${animatedMatch}%`, background: color }} />
            </div>

            {data.recommendation && (
              <p className="mt-5 text-sm leading-7 text-[var(--text-secondary)]">{data.recommendation}</p>
            )}
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-[8px] border border-[rgba(68,208,123,0.22)] bg-[var(--green-bg)] p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-extrabold text-[var(--text-primary)]">
              <Icon name="check" size={16} className="text-[var(--green)]" />
              Matched Skills
            </div>
            <div className="keyword-cloud">
              {(data.matched_skills || []).length ? (
                data.matched_skills.map((skill, i) => <span key={i} className="chip chip-success">{skill}</span>)
              ) : (
                <p className="empty-copy">No matched skills listed.</p>
              )}
            </div>
          </div>

          <div className="rounded-[8px] border border-[rgba(255,184,77,0.24)] bg-[var(--orange-bg)] p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-extrabold text-[var(--text-primary)]">
              <Icon name="warning" size={16} className="text-[var(--orange)]" />
              Skills To Add
            </div>
            <div className="keyword-cloud">
              {(data.missing_skills || []).length ? (
                data.missing_skills.map((skill, i) => <span key={i} className="chip chip-warning">{skill}</span>)
              ) : (
                <p className="empty-copy">No missing skills listed.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
