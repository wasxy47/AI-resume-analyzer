import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function CustomTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: '#1A2235', border: '1px solid #1E2D45', borderRadius: 8, padding: '8px 12px', color: '#F0F4FF', fontSize: 13, boxShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
        <p>{`${payload[0].payload.name}: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
}

export default function SkillsAnalysis({ data }) {
  if (!data) return null;

  const tech = data.technical_skills || [];
  const soft = data.soft_skills || [];
  const certs = data.certifications || [];
  const missing = data.missing_key_skills || [];

  const chartData = [
    { name: "Technical", count: tech.length },
    { name: "Soft Skills", count: soft.length },
    { name: "Certifications", count: certs.length },
    { name: "Missing", count: missing.length },
  ];

  return (
    <div className="card" style={{ padding: 28, marginBottom: 20 }}>
      <h3 className="section-heading">Skills Analysis</h3>

      <div style={{ height: 200, width: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 0, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E2D45" vertical={false} />
            <XAxis dataKey="name" tick={{ fill: "#8896B3", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis hide={true} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
            <Bar
              dataKey="count"
              fill="var(--accent)"
              radius={[4, 4, 0, 0]}
              barSize={40}
              label={{ position: 'top', fill: '#8896B3', fontSize: 12 }}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16, marginTop: 24 }}>
        <div>
          <div style={{ fontSize: 11, textTransform: 'uppercase', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Technical</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {tech.map((s, i) => (
              <span key={i} style={{ background: 'rgba(79,142,247,0.1)', border: '1px solid rgba(79,142,247,0.2)', color: '#4F8EF7', padding: '4px 12px', borderRadius: 999, fontSize: 12, display: 'inline-flex' }}>{s}</span>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 11, textTransform: 'uppercase', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Soft Skills</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {soft.map((s, i) => (
              <span key={i} style={{ background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.2)', color: '#A78BFA', padding: '4px 12px', borderRadius: 999, fontSize: 12, display: 'inline-flex' }}>{s}</span>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 11, textTransform: 'uppercase', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Certifications</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {certs.map((s, i) => (
              <span key={i} style={{ background: 'var(--green-bg)', border: '1px solid rgba(16,185,129,0.3)', color: 'var(--green)', padding: '4px 12px', borderRadius: 999, fontSize: 12, display: 'inline-flex' }}>{s}</span>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 11, textTransform: 'uppercase', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>Missing</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {missing.map((s, i) => (
              <span key={i} style={{ background: 'var(--red-bg)', border: '1px solid rgba(239,68,68,0.2)', color: 'var(--orange)', padding: '4px 12px', borderRadius: 999, fontSize: 12, display: 'inline-flex' }}>{s}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
