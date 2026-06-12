import Icon from "./Icon";

const navItems = [
  { id: "overview", label: "Overview", icon: "chart" },
  { id: "roadmap", label: "Roadmap", icon: "map" },
  { id: "skills", label: "Skills", icon: "target" },
  { id: "recruiter", label: "Recruiter", icon: "userSearch" },
  { id: "rewrites", label: "Rewrites", icon: "refresh" },
  { id: "interview", label: "Interview", icon: "mic" },
  { id: "cover", label: "Cover Letter", icon: "mail" },
  { id: "ats", label: "ATS Check", icon: "shield" },
  { id: "rescore", label: "Re-Score", icon: "pen" },
  { id: "jdmatch", label: "JD Match", icon: "briefcase" },
];

function scoreTone(score = 0) {
  if (score >= 75) return "bg-[var(--green)]";
  if (score >= 50) return "bg-[var(--orange)]";
  return "bg-[var(--red)]";
}

export default function Sidebar({ activeTab, setActiveTab, atsScore }) {
  const score = atsScore || 0;

  const triggerReportAction = (action) => {
    const button = document.querySelector(`[data-report-action="${action}"]`);
    if (button) button.click();
  };

  return (
    <>
      <aside className="group/sidebar fixed bottom-0 left-0 top-14 z-40 hidden w-[72px] hover:w-[248px] flex-col border-r border-[var(--border)] bg-[rgba(12,15,13,0.86)] p-3 backdrop-blur-xl transition-all duration-300 overflow-hidden whitespace-nowrap md:flex">
        <div className="mb-0 group-hover/sidebar:mb-4 h-0 group-hover/sidebar:h-[68px] opacity-0 group-hover/sidebar:opacity-100 transition-all duration-300 rounded-[8px] border border-transparent group-hover/sidebar:border-[var(--border)] bg-transparent group-hover/sidebar:bg-white/[0.035] p-0 group-hover/sidebar:p-3 overflow-hidden">
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="text-xs font-bold text-[var(--text-muted)]">ATS Compatibility</span>
            <span className="text-sm font-black text-[var(--text-primary)]">{score}%</span>
          </div>
          <div className="meter">
            <div className={`meter-fill ${scoreTone(score)}`} style={{ width: `${score}%` }} />
          </div>
        </div>

        <nav className="hide-scrollbar flex-1 space-y-1 overflow-y-auto overscroll-contain pr-1">
          {navItems.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className={`group flex min-h-[44px] w-full items-center gap-3 rounded-[8px] border px-3 text-left text-sm font-bold transition-all ${
                  active
                    ? "border-[var(--accent-line)] bg-[var(--accent-soft)] text-[var(--text-primary)] shadow-[0_0_0_1px_rgba(79,217,187,0.06)]"
                    : "border-transparent text-[var(--text-secondary)] hover:border-[var(--border)] hover:bg-white/[0.045] hover:text-[var(--text-primary)]"
                }`}
              >
                <div className="shrink-0 flex items-center justify-center w-[18px]">
                  <Icon name={item.icon} size={18} className={active ? "text-[var(--accent)]" : "text-[var(--text-muted)] group-hover:text-[var(--accent)]"} />
                </div>
                <span className="truncate opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-300">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-auto flex flex-col gap-2 rounded-[8px] border border-[var(--border)] bg-[var(--bg-inset)] p-2 group-hover/sidebar:p-3 transition-all duration-300">
          <button onClick={() => triggerReportAction("download")} className="btn btn-secondary h-10 min-h-10 w-full px-0 justify-center group-hover/sidebar:px-3 group-hover/sidebar:justify-start text-xs overflow-hidden transition-all duration-300">
            <div className="shrink-0 flex items-center justify-center w-[24px]">
              <Icon name="download" size={16} />
            </div>
            <span className="opacity-0 w-0 group-hover/sidebar:w-auto group-hover/sidebar:opacity-100 transition-all duration-300 ml-0 group-hover/sidebar:ml-1">Download PDF</span>
          </button>
          <button onClick={() => triggerReportAction("share")} className="btn btn-primary h-10 min-h-10 w-full px-0 justify-center group-hover/sidebar:px-3 group-hover/sidebar:justify-start text-xs overflow-hidden transition-all duration-300">
            <div className="shrink-0 flex items-center justify-center w-[24px]">
              <Icon name="share" size={16} />
            </div>
            <span className="opacity-0 w-0 group-hover/sidebar:w-auto group-hover/sidebar:opacity-100 transition-all duration-300 ml-0 group-hover/sidebar:ml-1">Share Score</span>
          </button>
        </div>
      </aside>

      <div className="hide-scrollbar fixed bottom-0 left-0 right-0 z-50 flex h-[64px] items-center gap-1 overflow-x-auto border-t border-[var(--border)] bg-[rgba(8,9,7,0.94)] px-2 backdrop-blur-xl md:hidden">
        {navItems.map((item) => {
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={`flex h-11 min-w-[46px] items-center justify-center rounded-[8px] border transition-all ${
                active
                  ? "border-[var(--accent-line)] bg-[var(--accent-soft)] text-[var(--accent)]"
                  : "border-transparent text-[var(--text-muted)]"
              }`}
              title={item.label}
            >
              <Icon name={item.icon} size={19} />
            </button>
          );
        })}
      </div>
    </>
  );
}
