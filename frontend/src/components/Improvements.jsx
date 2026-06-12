import Icon from "./Icon";

const priorityStyles = {
  high: { chip: "chip-danger", color: "var(--red)", label: "High" },
  medium: { chip: "chip-warning", color: "var(--orange)", label: "Medium" },
  low: { chip: "chip-success", color: "var(--green)", label: "Low" },
};

function getScoreColor(score) {
  if (score >= 75) return "var(--green)";
  if (score >= 50) return "var(--orange)";
  return "var(--red)";
}

function normalizePriority(priority) {
  return (priority ?? "medium").toLowerCase();
}

export default function Improvements({ improvements, actionPlan, strengths, atsCompatibility }) {
  const improvementList = improvements ?? [];
  const strengthsList = strengths ?? [];
  const ats = atsCompatibility ?? {};
  const plan = actionPlan ?? [];

  return (
    <div className="space-y-5">
      {(improvementList.length > 0 || strengthsList.length > 0) && (
        <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="surface p-6 md:p-7">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <div className="section-kicker mb-2">
                  <Icon name="listChecks" size={16} />
                  Priority Fixes
                </div>
                <h3 className="section-title">What to improve first</h3>
              </div>
              <span className="chip">{improvementList.length} items</span>
            </div>

            <div className="space-y-3">
              {improvementList.length === 0 ? (
                <p className="empty-copy">No improvement items returned for this report.</p>
              ) : (
                improvementList.map((item, i) => {
                  const priority = normalizePriority(item.priority);
                  const style = priorityStyles[priority] ?? priorityStyles.medium;

                  return (
                    <article key={i} className="rounded-[8px] border border-[var(--border)] bg-white/[0.035] p-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <span className={`chip ${style.chip}`}>
                          <span className="h-2 w-2 rounded-full" style={{ background: style.color }} />
                          {style.label}
                        </span>
                        {item.area && <span className="text-sm font-extrabold text-[var(--text-primary)]">{item.area}</span>}
                      </div>
                      <p className="mt-3 text-sm leading-6 text-[var(--text-secondary)]">{item.issue ?? item.description ?? "Improvement needed"}</p>
                      {item.fix && (
                        <div className="mt-4 border-l-2 border-[var(--accent)] pl-4 text-sm leading-6 text-[var(--text-primary)]">
                          {item.fix}
                        </div>
                      )}
                    </article>
                  );
                })
              )}
            </div>
          </div>

          <div className="surface p-6 md:p-7">
            <div className="mb-5">
              <div className="section-kicker mb-2">
                <Icon name="trophy" size={16} />
                Strengths
              </div>
              <h3 className="section-title">What already works</h3>
            </div>

            <div className="space-y-3">
              {strengthsList.length === 0 ? (
                <p className="empty-copy">No strengths returned for this report.</p>
              ) : (
                strengthsList.map((strength, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-[8px] border border-[rgba(68,208,123,0.22)] bg-[var(--green-bg)] p-4">
                    <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-[6px] bg-[rgba(68,208,123,0.18)] text-[var(--green)]">
                      <Icon name="check" size={15} />
                    </div>
                    <p className="text-sm leading-6 text-[var(--text-primary)]">
                      {typeof strength === "string" ? strength : strength.description ?? strength.text ?? JSON.stringify(strength)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      )}

      {ats && Object.keys(ats).length > 0 && (
        <section className="surface p-6 md:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="section-kicker mb-2">
                <Icon name="shield" size={16} />
                ATS Compatibility
              </div>
              <h3 className="section-title">Parsing and keyword readiness</h3>
              <p className="section-subtitle mt-2 max-w-2xl">
                Keyword coverage and formatting issues that can affect automated screening.
              </p>
            </div>
            {ats.score !== undefined && (
              <div className="min-w-[150px] rounded-[8px] border border-[var(--border)] bg-[var(--bg-inset)] p-4 text-center">
                <div className="text-4xl font-black" style={{ color: getScoreColor(ats.score) }}>{ats.score}%</div>
                <div className="mt-1 text-xs font-bold text-[var(--text-muted)]">ATS Score</div>
              </div>
            )}
          </div>

          {ats.score !== undefined && (
            <div className="meter mt-6 h-2.5">
              <div className="meter-fill" style={{ width: `${ats.score}%`, background: getScoreColor(ats.score) }} />
            </div>
          )}

          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            <div className="rounded-[8px] border border-[var(--border)] bg-white/[0.035] p-4">
              <div className="mb-3 text-sm font-extrabold text-[var(--text-primary)]">Keywords Found</div>
              <div className="keyword-cloud">
                {ats.keywords_found?.length ? (
                  ats.keywords_found.map((kw, i) => <span key={i} className="chip chip-success">{kw}</span>)
                ) : (
                  <p className="empty-copy">No matched keywords listed.</p>
                )}
              </div>
            </div>

            <div className="rounded-[8px] border border-[var(--border)] bg-white/[0.035] p-4">
              <div className="mb-3 text-sm font-extrabold text-[var(--text-primary)]">Missing Keywords</div>
              <div className="keyword-cloud">
                {ats.keywords_missing?.length ? (
                  ats.keywords_missing.map((kw, i) => <span key={i} className="chip chip-warning">{kw}</span>)
                ) : (
                  <p className="empty-copy">No missing keywords listed.</p>
                )}
              </div>
            </div>

            <div className="rounded-[8px] border border-[var(--border)] bg-white/[0.035] p-4">
              <div className="mb-3 text-sm font-extrabold text-[var(--text-primary)]">Screening Issues</div>
              <div className="space-y-3">
                {ats.issues?.length ? (
                  ats.issues.map((issue, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm leading-6 text-[var(--text-secondary)]">
                      <Icon name="warning" size={15} className="mt-1 shrink-0 text-[var(--orange)]" />
                      <span>{issue}</span>
                    </div>
                  ))
                ) : (
                  <p className="empty-copy">No ATS issues listed.</p>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {plan.length > 0 && (
        <section className="surface p-6 md:p-7">
          <div className="mb-6">
            <div className="section-kicker mb-2">
              <Icon name="map" size={16} />
              Action Plan
            </div>
            <h3 className="section-title">Next moves</h3>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {plan.slice(0, 6).map((step, i) => {
              const text = typeof step === "string" ? step : step.description ?? step.text ?? JSON.stringify(step);
              return (
                <div key={i} className="flex gap-4 rounded-[8px] border border-[var(--border)] bg-white/[0.035] p-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-[var(--accent-soft)] text-sm font-black text-[var(--accent)]">
                    {i + 1}
                  </span>
                  <p className="text-sm leading-6 text-[var(--text-secondary)]">{text}</p>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
