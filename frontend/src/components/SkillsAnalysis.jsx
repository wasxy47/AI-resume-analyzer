import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Icon from "./Icon";

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-[8px] border border-[var(--border)] bg-[var(--bg-elevated)] px-3 py-2 text-sm text-[var(--text-primary)] shadow-2xl">
      <span className="font-bold">{payload[0].payload.name}</span>: {payload[0].value}
    </div>
  );
}

function KeywordGroup({ title, items, tone = "chip", icon = "sparkles" }) {
  return (
    <div className="rounded-[8px] border border-[var(--border)] bg-white/[0.035] p-4">
      <div className="mb-3 flex items-center gap-2 text-sm font-extrabold text-[var(--text-primary)]">
        <Icon name={icon} size={15} className="text-[var(--accent)]" />
        {title}
      </div>
      <div className="keyword-cloud">
        {items.length ? (
          items.map((item, i) => <span key={i} className={`chip ${tone}`}>{item}</span>)
        ) : (
          <p className="empty-copy">No items listed.</p>
        )}
      </div>
    </div>
  );
}

export default function SkillsAnalysis({ data }) {
  if (!data) return null;

  const tech = data.technical_skills || [];
  const soft = data.soft_skills || [];
  const certs = data.certifications || [];
  const missing = data.missing_key_skills || [];

  const chartData = [
    { name: "Technical", count: tech.length, color: "#4fd9bb" },
    { name: "Soft", count: soft.length, color: "#83c5ff" },
    { name: "Certs", count: certs.length, color: "#ffb84d" },
    { name: "Missing", count: missing.length, color: "#ff6b77" },
  ];

  return (
    <section className="surface p-6 md:p-7">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="section-kicker mb-2">
            <Icon name="target" size={16} />
            Skills Intelligence
          </div>
          <h3 className="section-title">Skill coverage by category</h3>
          <p className="section-subtitle mt-2 max-w-2xl">
            The skill map separates proven capabilities from missing keywords that could strengthen role alignment.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {chartData.map((item) => (
            <div key={item.name} className="rounded-[8px] border border-[var(--border)] bg-[var(--bg-inset)] px-3 py-2 text-center">
              <div className="text-xl font-black" style={{ color: item.color }}>{item.count}</div>
              <div className="text-[11px] font-bold text-[var(--text-muted)]">{item.name}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 h-72 rounded-[8px] border border-[var(--border)] bg-[var(--bg-inset)] p-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 18, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: "#a7b1a8", fontSize: 12, fontWeight: 700 }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.035)" }} />
            <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={46} label={{ position: "top", fill: "#a7b1a8", fontSize: 12, fontWeight: 700 }}>
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <KeywordGroup title="Technical Skills" items={tech} tone="chip-accent" icon="sliders" />
        <KeywordGroup title="Soft Skills" items={soft} tone="" icon="users" />
        <KeywordGroup title="Certifications" items={certs} tone="chip-success" icon="shield" />
        <KeywordGroup title="Missing Key Skills" items={missing} tone="chip-warning" icon="warning" />
      </div>
    </section>
  );
}
