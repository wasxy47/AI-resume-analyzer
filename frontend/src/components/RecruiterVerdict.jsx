import { motion } from "framer-motion";
import Icon from "./Icon";

function pileStyle(pile) {
  const value = pile?.toLowerCase() || "";
  if (value.includes("yes")) {
    return { card: "border-[rgba(68,208,123,0.32)] bg-[var(--green-bg)]", chip: "chip-success", icon: "check" };
  }
  if (value.includes("maybe")) {
    return { card: "border-[rgba(255,184,77,0.32)] bg-[var(--orange-bg)]", chip: "chip-warning", icon: "warning" };
  }
  return { card: "border-[rgba(255,107,119,0.32)] bg-[var(--red-bg)]", chip: "chip-danger", icon: "x" };
}

export default function RecruiterVerdict({ verdict }) {
  if (!verdict) return null;

  const style = pileStyle(verdict.pile);
  const noticedItems = [
    { label: "First noticed", value: verdict.first_noticed },
    { label: "Second noticed", value: verdict.second_noticed },
    { label: "Third noticed", value: verdict.third_noticed },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="surface p-6 md:p-7"
    >
      <div className="mb-6">
        <div className="section-kicker mb-2">
          <Icon name="clock" size={16} />
          Recruiter Scan
        </div>
        <h2 className="section-title">Six-second resume read</h2>
        <p className="section-subtitle mt-2">The first impression, the risk, and the single fix with the highest leverage.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-[8px] border border-[var(--border)] bg-[var(--bg-inset)] p-5">
          <div className="mb-5 flex items-center gap-2 text-sm font-extrabold text-[var(--text-primary)]">
            <Icon name="userSearch" size={17} className="text-[var(--accent)]" />
            Attention Timeline
          </div>

          <div className="space-y-3">
            {noticedItems.map((item, index) => (
              <div key={item.label} className="flex gap-4 rounded-[8px] border border-[var(--border)] bg-white/[0.035] p-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-[var(--accent-soft)] text-sm font-black text-[var(--accent)]">
                  {index + 1}
                </span>
                <div>
                  <div className="text-xs font-bold text-[var(--text-muted)]">{item.label}</div>
                  <p className="mt-1 text-sm leading-6 text-[var(--text-primary)]">{item.value || "Not specified"}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <div className={`rounded-[8px] border p-5 ${style.card}`}>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <span className={`chip ${style.chip}`}>
                <Icon name={style.icon} size={14} />
                {verdict.pile || "Verdict"}
              </span>
              <span className="text-xs font-bold text-[var(--text-muted)]">Hiring pile</span>
            </div>
            <p className="text-sm leading-7 text-[var(--text-primary)]">{verdict.pile_reasoning}</p>
          </div>

          {verdict.completely_missed && (
            <div className="rounded-[8px] border border-[rgba(255,107,119,0.28)] bg-[var(--red-bg)] p-5">
              <div className="mb-2 flex items-center gap-2 text-sm font-extrabold text-[var(--red)]">
                <Icon name="warning" size={16} />
                Completely Missed
              </div>
              <p className="text-sm leading-7 text-[var(--text-primary)]">{verdict.completely_missed}</p>
            </div>
          )}

          {verdict.single_best_fix && (
            <div className="rounded-[8px] border border-[var(--accent-line)] bg-[var(--accent-soft)] p-5">
              <div className="mb-2 flex items-center gap-2 text-sm font-extrabold text-[var(--accent)]">
                <Icon name="wand" size={16} />
                Best Fix
              </div>
              <p className="border-l-2 border-[var(--accent)] pl-4 text-sm leading-7 text-[var(--text-primary)]">{verdict.single_best_fix}</p>
            </div>
          )}
        </div>
      </div>
    </motion.section>
  );
}
