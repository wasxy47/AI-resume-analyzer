export default function BeforeAfter({ data }) {
  if (!data) return null;

  const sections = [
    {
      label: "Professional Summary",
      before: data.summary_before,
      after: data.summary_after,
    },
    {
      label: "Work Experience",
      before: data.experience_before,
      after: data.experience_after,
    },
    {
      label: "Skills Section",
      before: data.skills_before,
      after: data.skills_after,
    },
  ].filter(s => s.before || s.after);

  return (
    <div className="card" style={{ padding: 28, marginBottom: 20 }}>
      <h3 className="section-heading">AI-Suggested Improvements</h3>
      <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 24, marginTop: -16 }}>
        See how your resume can be improved
      </p>

      <div>
        {sections.map((section, idx) => (
          <div key={idx}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 10 }}>
              {section.label}
            </div>

            <div style={{ display: 'flex', gap: 12, alignItems: 'stretch', flexWrap: 'wrap' }}>
              {/* Before Panel */}
              <div style={{ flex: '1 1 300px', background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 'var(--radius-md)', padding: 16 }}>
                <div style={{ fontSize: 10, textTransform: 'uppercase', fontWeight: 700, color: 'var(--red)', opacity: 0.7, marginBottom: 8 }}>
                  BEFORE
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                  {section.before}
                </div>
              </div>

              {/* Arrow */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 18, flexShrink: 0, padding: '0 8px' }}>
                <span className="hidden md:inline">→</span>
                <span className="inline md:hidden">↓</span>
              </div>

              {/* After Panel */}
              <div style={{ flex: '1 1 300px', background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: 'var(--radius-md)', padding: 16 }}>
                <div style={{ fontSize: 10, textTransform: 'uppercase', fontWeight: 700, color: 'var(--green)', marginBottom: 8 }}>
                  AFTER
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.7 }}>
                  {section.after}
                </div>
              </div>
            </div>

            {idx < sections.length - 1 && (
              <div style={{ borderTop: '1px solid var(--border)', margin: '20px 0' }}></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
