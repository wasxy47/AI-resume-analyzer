import { useState, useEffect } from "react";

function getScoreColor(score) {
  if (score >= 75) return 'var(--green)';
  if (score >= 50) return 'var(--orange)';
  return 'var(--red)';
}

export default function JobRoleMatch({ data }) {
  const [animatedMatch, setAnimatedMatch] = useState(0);
  const matchPercentage = data?.match_percentage ?? 0;
  const color = getScoreColor(matchPercentage);

  useEffect(() => {
    let start = 0;
    const duration = 1200;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedMatch(Math.round(eased * matchPercentage));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [matchPercentage]);

  if (!data) return null;

  return (
    <div className="card" style={{ padding: 28, marginBottom: 20 }}>
      <h3 className="section-heading">Job Role Match</h3>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32 }}>
        {/* Left column */}
        <div>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Detected Role</div>
          <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>{data.detected_role}</span>
          </div>

          <div style={{ fontSize: 56, fontWeight: 800, color, marginTop: 12, lineHeight: 1 }}>
            {animatedMatch}%
          </div>

          <div style={{ height: 6, borderRadius: 3, background: 'var(--bg-elevated)', marginTop: 16, overflow: 'hidden' }}>
            <div style={{ height: '100%', background: color, width: `${animatedMatch}%`, transition: 'width 0.1s linear' }}></div>
          </div>

          <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 12, lineHeight: 1.6, fontStyle: 'italic' }}>
            {data.recommendation}
          </div>
        </div>

        {/* Right column */}
        <div>
          <div>
            <div style={{ fontSize: 11, textTransform: 'uppercase', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>
              Skills You Have
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {(data.matched_skills || []).map((skill, i) => (
                <span key={i} style={{
                  background: 'var(--green-bg)', border: '1px solid rgba(16,185,129,0.3)',
                  color: 'var(--green)', padding: '4px 12px', borderRadius: 999, fontSize: 12
                }}>
                  ✓ {skill}
                </span>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 11, textTransform: 'uppercase', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>
              Skills You're Missing
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {(data.missing_skills || []).map((skill, i) => (
                <span key={i} style={{
                  background: 'var(--red-bg)', border: '1px solid rgba(239,68,68,0.3)',
                  color: 'var(--orange)', padding: '4px 12px', borderRadius: 999, fontSize: 12
                }}>
                  ! {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
