import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Icon from "./Icon";

const levels = ["Beginner", "Developing", "Competitive", "Top Tier"];

function categoryClass(category) {
  const value = category?.toLowerCase() || "";
  if (value === "content") return "chip-accent";
  if (value === "keywords") return "chip-warning";
  if (value === "structure") return "";
  if (value === "skills") return "chip-success";
  return "";
}

function impactClass(impact) {
  const value = impact?.toLowerCase() || "";
  if (value === "high") return "chip-danger";
  if (value === "medium") return "chip-warning";
  return "";
}

export default function CompletenessRoadmap({ roadmap, overallScore, candidateName }) {
  const storageKey = `resumeai_completed_tasks_${candidateName || "guest"}`;
  const [completedTasks, setCompletedTasks] = useState(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(completedTasks));
  }, [completedTasks, storageKey]);

  if (!roadmap) return null;

  const tasks = roadmap.tasks || [];
  const currentLevelIndex = Math.max(0, levels.indexOf(roadmap.current_level));
  const totalPointsGained = tasks
    .filter((task) => completedTasks.includes(task.id))
    .reduce((sum, task) => sum + (task.points_gain || 0), 0);
  const taskProgress = tasks.length ? (completedTasks.length / tasks.length) * 100 : 0;
  const nextLevelScore = roadmap.next_level_score || 100;
  const levelProgress = Math.min(100, Math.max(0, (overallScore / nextLevelScore) * 100));

  const toggleTask = (taskId) => {
    setCompletedTasks((prev) =>
      prev.includes(taskId) ? prev.filter((id) => id !== taskId) : [...prev, taskId]
    );
  };

  return (
    <section className="surface p-6 md:p-7">
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="section-kicker mb-2">
            <Icon name="map" size={16} />
            Resume Roadmap
          </div>
          <h2 className="section-title">Path to {roadmap.next_level || "the next level"}</h2>
          <p className="section-subtitle mt-2 max-w-2xl">{roadmap.level_description}</p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-[8px] border border-[var(--border)] bg-[var(--bg-inset)] p-3 text-center">
            <div className="text-2xl font-black text-[var(--accent)]">{overallScore}</div>
            <div className="text-[11px] font-bold text-[var(--text-muted)]">Current Score</div>
          </div>
          <div className="rounded-[8px] border border-[var(--border)] bg-[var(--bg-inset)] p-3 text-center">
            <div className="text-2xl font-black text-[var(--green)]">+{totalPointsGained}</div>
            <div className="text-[11px] font-bold text-[var(--text-muted)]">Tracked Gain</div>
          </div>
          <div className="col-span-2 rounded-[8px] border border-[var(--border)] bg-[var(--bg-inset)] p-3 text-center sm:col-span-1">
            <div className="text-2xl font-black text-[var(--gold)]">{completedTasks.length}/{tasks.length}</div>
            <div className="text-[11px] font-bold text-[var(--text-muted)]">Tasks Done</div>
          </div>
        </div>
      </div>

      <div className="mb-9 rounded-[8px] border border-[var(--border)] bg-[var(--bg-inset)] p-5">
        <div className="relative grid grid-cols-4 gap-2">
          <div className="absolute left-[8%] right-[8%] top-5 h-0.5 bg-white/[0.09]" />
          {levels.map((level, index) => {
            const active = index <= currentLevelIndex;
            const current = index === currentLevelIndex;
            return (
              <div key={level} className="relative flex flex-col items-center text-center">
                <div
                  className={`z-10 flex h-10 w-10 items-center justify-center rounded-[8px] border ${
                    active
                      ? "border-[var(--accent-line)] bg-[var(--accent-soft)] text-[var(--accent)]"
                      : "border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-muted)]"
                  }`}
                >
                  {current ? <Icon name="target" size={17} /> : active ? <Icon name="check" size={17} /> : <span className="h-2 w-2 rounded-full bg-current" />}
                </div>
                <span className={`mt-3 text-xs font-bold ${active ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]"}`}>{level}</span>
              </div>
            );
          })}
        </div>

        <div className="mt-7">
          <div className="mb-2 flex items-center justify-between text-xs font-bold text-[var(--text-muted)]">
            <span>{roadmap.current_level}</span>
            <span>{roadmap.next_level}</span>
          </div>
          <div className="meter">
            <div className="meter-fill bg-[var(--accent)]" style={{ width: `${levelProgress}%` }} />
          </div>
        </div>
      </div>

      {totalPointsGained > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 rounded-[8px] border border-[rgba(68,208,123,0.24)] bg-[var(--green-bg)] p-4 text-sm font-bold text-[var(--green)]"
        >
          Estimated score improvement tracked: +{totalPointsGained} points
        </motion.div>
      )}

      <div className="space-y-3">
        {tasks.map((task) => {
          const isCompleted = completedTasks.includes(task.id);

          return (
            <button
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`flex w-full flex-col gap-4 rounded-[8px] border p-4 text-left transition-all md:flex-row md:items-center ${
                isCompleted
                  ? "border-[rgba(68,208,123,0.3)] bg-[var(--green-bg)]"
                  : "border-[var(--border)] bg-white/[0.035] hover:border-[var(--accent-line)]"
              }`}
            >
              <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-[6px] border ${
                isCompleted ? "border-[rgba(68,208,123,0.3)] bg-[var(--green)] text-[#06100c]" : "border-[var(--border-strong)] text-[var(--text-muted)]"
              }`}>
                {isCompleted && <Icon name="check" size={15} />}
              </span>

              <span className={`flex-1 text-sm leading-6 ${isCompleted ? "text-[var(--text-muted)] line-through" : "text-[var(--text-primary)]"}`}>
                {task.task}
              </span>

              <span className="flex flex-wrap items-center gap-2 md:justify-end">
                <span className={`chip ${categoryClass(task.category)}`}>{task.category}</span>
                <span className={`chip ${impactClass(task.impact)}`}>{task.impact} impact</span>
                <span className="chip chip-success">+{task.points_gain} pts</span>
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-7">
        <div className="mb-2 flex justify-between text-xs font-bold text-[var(--text-muted)]">
          <span>Task Progress</span>
          <span>{Math.round(taskProgress)}%</span>
        </div>
        <div className="meter">
          <div className="meter-fill bg-[var(--gold)]" style={{ width: `${taskProgress}%` }} />
        </div>
        {roadmap.motivational_line && (
          <p className="mt-5 text-center text-sm leading-6 text-[var(--text-secondary)]">{roadmap.motivational_line}</p>
        )}
      </div>
    </section>
  );
}
