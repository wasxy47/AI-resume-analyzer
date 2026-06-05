export default function Navbar() {
  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 56,
        background: 'rgba(10, 14, 26, 0.8)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 48px',
        zIndex: 200,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{ color: 'var(--accent)', fontSize: 16 }}>✦</span>
        <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>
          Resume<span style={{ color: 'var(--accent)' }}>AI</span>
        </span>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 999,
          padding: '4px 12px',
          fontSize: 12,
          color: 'var(--text-secondary)',
        }}
      >
        <span style={{ display: 'flex', gap: 2 }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#F55036', display: 'inline-block', marginTop: 1 }} />
        </span>
        Powered by Groq
      </div>
    </nav>
  );
}
