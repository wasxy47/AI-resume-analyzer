import { useState } from "react";

const priorityStyles = {
  high: { bg: 'var(--red-bg)', text: 'var(--red)' },
  medium: { bg: 'var(--orange-bg)', text: 'var(--orange)' },
  low: { bg: 'var(--green-bg)', text: 'var(--green)' },
};

function getScoreColor(score) {
  if (score >= 75) return 'var(--green)';
  if (score >= 50) return 'var(--orange)';
  return 'var(--red)';
}

export default function Improvements({ improvements, actionPlan, strengths, atsCompatibility }) {
  const improvementList = improvements ?? [];
  const strengthsList = strengths ?? [];
  const ats = atsCompatibility ?? {};
  const plan = actionPlan ?? [];

  return (
    <>
      {/* Section 6: Improvements & Strengths */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 20 }}>
        {/* Left - Improvements */}
        <div className="card" style={{ padding: 24 }}>
          <h3 className="section-heading">Key Improvements</h3>
          <div>
            {improvementList.map((item, i) => {
              const priority = (item.priority ?? "medium").toLowerCase();
              const styles = priorityStyles[priority] ?? priorityStyles.medium;
              
              return (
                <div key={i} style={{ padding: '14px 0', borderBottom: i < improvementList.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ background: styles.bg, color: styles.text, fontSize: 10, textTransform: 'uppercase', fontWeight: 700, padding: '2px 8px', borderRadius: 4 }}>
                      {priority}
                    </span>
                    {item.area && (
                      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
                        {item.area}
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
                    {item.issue ?? item.description ?? "Improvement needed"}
                  </p>
                  {item.fix && (
                    <p style={{ fontSize: 13, color: 'var(--text-primary)', marginTop: 6, paddingLeft: 12, borderLeft: '2px solid var(--accent)' }}>
                      {item.fix}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right - Strengths */}
        <div className="card" style={{ padding: 24 }}>
          <h3 className="section-heading">Your Strengths</h3>
          <div>
            {strengthsList.map((strength, i) => (
              <div key={i} style={{ padding: '12px 0', borderBottom: i < strengthsList.length - 1 ? '1px solid var(--border)' : 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 20, height: 20, background: 'var(--green-bg)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ color: 'var(--green)', fontSize: 11 }}>✓</span>
                </div>
                <div style={{ fontSize: 14, color: 'var(--text-primary)' }}>
                  {typeof strength === "string" ? strength : strength.description ?? strength.text ?? JSON.stringify(strength)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 7: ATS Compatibility */}
      <div className="card" style={{ padding: 28, marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="section-heading" style={{ marginBottom: 0 }}>ATS Compatibility</h3>
          {ats.score !== undefined && (
            <div style={{ fontSize: 32, fontWeight: 800, color: getScoreColor(ats.score) }}>
              {ats.score}%
            </div>
          )}
        </div>
        
        {ats.score !== undefined && (
          <div style={{ width: '100%', height: 8, borderRadius: 4, background: 'var(--bg-elevated)', marginTop: 12, overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: 4, transition: 'width 1s ease', width: `${ats.score}%`, background: getScoreColor(ats.score) }}></div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginTop: 20 }}>
          {/* Found Keywords */}
          {ats.keywords_found && ats.keywords_found.length > 0 && (
            <div>
              <div style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 8, fontWeight: 600 }}>Keywords Found</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {ats.keywords_found.map((kw, i) => (
                  <span key={i} style={{ background: 'var(--green-bg)', border: '1px solid rgba(16,185,129,0.3)', color: 'var(--green)', padding: '4px 12px', borderRadius: 999, fontSize: 12 }}>
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Missing Keywords */}
          {ats.keywords_missing && ats.keywords_missing.length > 0 && (
            <div>
              <div style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 8, fontWeight: 600 }}>Missing Keywords</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {ats.keywords_missing.map((kw, i) => (
                  <span key={i} style={{ background: 'var(--red-bg)', border: '1px solid rgba(239,68,68,0.3)', color: 'var(--orange)', padding: '4px 12px', borderRadius: 999, fontSize: 12 }}>
                    {kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Issues */}
          {ats.issues && ats.issues.length > 0 && (
            <div>
              <div style={{ fontSize: 11, textTransform: 'uppercase', color: 'var(--text-secondary)', marginBottom: 8, fontWeight: 600 }}>Issues</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {ats.issues.map((issue, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--orange)', fontSize: 13, flexShrink: 0 }}>⚠</span>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{issue}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Section 8: Action Plan */}
      {plan.length > 0 && (
        <div className="card" style={{ padding: 28, marginBottom: 20 }}>
          <h3 className="section-heading" style={{ marginBottom: 4 }}>Your Action Plan</h3>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 16 }}>5 steps to improve your resume</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {plan.slice(0, 5).map((step, i) => (
              <div key={i} style={{ padding: '16px 0', borderBottom: i < Math.min(plan.length, 5) - 1 ? '1px solid var(--border)' : 'none', display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #4F8EF7, #A78BFA)', color: 'white', fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {i + 1}
                </div>
                <div style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.6, paddingTop: 3 }}>
                  {typeof step === "string" ? step : step.description ?? step.text ?? JSON.stringify(step)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
