import { useState } from "react";
import { motion } from "framer-motion";
import Icon from "./Icon";

function difficultyClass(difficulty) {
  const value = difficulty?.toLowerCase() || "";
  if (value === "easy") return "chip-success";
  if (value === "hard") return "chip-danger";
  return "chip-warning";
}

export default function InterviewQuestions({ questions }) {
  const [activeTab, setActiveTab] = useState("technical");
  const [openCards, setOpenCards] = useState({});
  const [copied, setCopied] = useState(false);

  if (!questions) return null;

  const tabs = [
    { id: "technical", label: "Technical", icon: "sliders", count: questions.technical?.length || 0 },
    { id: "behavioral", label: "Behavioral", icon: "users", count: questions.behavioral?.length || 0 },
    { id: "curveball", label: "Curveball", icon: "bolt", count: questions.curveball?.length || 0 },
  ];

  const activeQuestions = questions[activeTab] || [];

  const toggleCard = (index) => {
    setOpenCards((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const copyToClipboard = async () => {
    const text = activeQuestions
      .map((question, index) => `${index + 1}. ${question.question}\nExpectation: ${question.what_interviewer_wants}`)
      .join("\n\n");
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section className="surface p-6 md:p-7">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="section-kicker mb-2">
            <Icon name="mic" size={16} />
            Interview Prep
          </div>
          <h2 className="section-title">Questions from resume evidence</h2>
          <p className="section-subtitle mt-2">Practice prompts generated from the candidate's actual experience and skill profile.</p>
        </div>

        {activeQuestions.length > 0 && (
          <button onClick={copyToClipboard} className="btn btn-secondary">
            <Icon name={copied ? "check" : "copy"} size={16} />
            {copied ? "Copied" : "Copy Questions"}
          </button>
        )}
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setOpenCards({});
            }}
            className={`btn min-h-10 px-3 text-xs ${activeTab === tab.id ? "btn-primary" : "btn-secondary"}`}
          >
            <Icon name={tab.icon} size={15} />
            {tab.label}
            <span className="rounded-[6px] bg-black/15 px-2 py-0.5">{tab.count}</span>
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {activeQuestions.length === 0 ? (
          <div className="rounded-[8px] border border-[var(--border)] bg-[var(--bg-inset)] p-5">
            <p className="empty-copy">No questions available for this category.</p>
          </div>
        ) : (
          activeQuestions.map((question, index) => {
            const open = openCards[index];
            return (
              <motion.article
                key={`${activeTab}-${index}`}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-[8px] border border-[var(--border)] bg-[var(--bg-inset)] p-5"
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-[var(--accent-soft)] text-sm font-black text-[var(--accent)]">
                    {index + 1}
                  </span>
                  <span className={`chip ${difficultyClass(question.difficulty)}`}>{question.difficulty || "Medium"}</span>
                </div>

                <p className="text-base font-bold leading-7 text-[var(--text-primary)]">{question.question}</p>

                <button onClick={() => toggleCard(index)} className="btn btn-secondary mt-4 min-h-10 px-3 text-xs">
                  <Icon name={open ? "chevronUp" : "chevronDown"} size={15} />
                  Interviewer Expectation
                </button>

                {open && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-4 rounded-[8px] border border-[var(--accent-line)] bg-[var(--accent-soft)] p-4"
                  >
                    <p className="text-sm leading-7 text-[var(--text-primary)]">{question.what_interviewer_wants}</p>
                  </motion.div>
                )}
              </motion.article>
            );
          })
        )}
      </div>
    </section>
  );
}
