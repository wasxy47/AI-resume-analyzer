import { motion } from "framer-motion";
import Icon from "./Icon";

export default function BeforeAfter({ data }) {
  if (!data) return null;

  const sections = [
    { label: "Professional Summary", before: data.summary_before, after: data.summary_after },
    { label: "Work Experience", before: data.experience_before, after: data.experience_after },
    { label: "Skills Section", before: data.skills_before, after: data.skills_after },
  ].filter((section) => section.before || section.after);

  return (
    <section className="surface p-6 md:p-7">
      <div className="mb-6">
        <div className="section-kicker mb-2">
          <Icon name="wand" size={16} />
          AI Rewrites
        </div>
        <h2 className="section-title">Before and after improvements</h2>
        <p className="section-subtitle mt-2">Stronger language, clearer evidence, and better keyword alignment.</p>
      </div>

      <div className="space-y-5">
        {sections.map((section, index) => (
          <article key={section.label} className="rounded-[8px] border border-[var(--border)] bg-[var(--bg-inset)] p-4 md:p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-sm font-extrabold text-[var(--text-primary)]">{section.label}</h3>
              <span className="chip">Rewrite {index + 1}</span>
            </div>

            <div className="grid gap-3 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch">
              <div className="rounded-[8px] border border-[rgba(255,107,119,0.2)] bg-[var(--red-bg)] p-4">
                <div className="mb-3 flex items-center gap-2 text-xs font-black text-[var(--red)]">
                  <Icon name="x" size={14} />
                  Before
                </div>
                <p className="text-sm leading-7 text-[var(--text-secondary)]">{section.before || "No existing text detected."}</p>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, delay: index * 0.08 }}
                className="flex items-center justify-center text-[var(--text-muted)]"
              >
                <div className="hidden h-full items-center lg:flex">
                  <Icon name="arrowRight" size={22} />
                </div>
                <div className="lg:hidden">
                  <Icon name="arrowDown" size={22} />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.12 + 0.1 }}
                className="rounded-[8px] border border-[rgba(68,208,123,0.24)] bg-[var(--green-bg)] p-4"
              >
                <div className="mb-3 flex items-center gap-2 text-xs font-black text-[var(--green)]">
                  <Icon name="check" size={14} />
                  After
                </div>
                <p className="text-sm leading-7 text-[var(--text-primary)]">{section.after || "No rewrite returned."}</p>
              </motion.div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
