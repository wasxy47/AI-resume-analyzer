import { useState, useRef } from "react";

export default function HeroUpload({ onFileSelect, file, targetRole, setTargetRole, onAnalyze, loading, error }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      const ext = droppedFile.name.split('.').pop().toLowerCase();
      if (ext === 'pdf' || ext === 'docx') {
        onFileSelect(droppedFile);
      }
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      const ext = selectedFile.name.split('.').pop().toLowerCase();
      if (ext === 'pdf' || ext === 'docx') {
        onFileSelect(selectedFile);
      }
    }
  };

  return (
    <section style={{ maxWidth: 640, margin: '0 auto', paddingTop: 120, paddingLeft: 24, paddingRight: 24 }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: 48, fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--text-primary)', lineHeight: 1.1 }}>
          Analyze Your Resume<br/>
          <span style={{ background: 'linear-gradient(135deg, #4F8EF7, #A78BFA)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>with AI</span>
        </h1>
        <p style={{ fontSize: 16, color: 'var(--text-secondary)', maxWidth: 480, margin: '16px auto 40px', textAlign: 'center' }}>
          Upload your resume and get detailed AI feedback on skills, structure, ATS compatibility, and improvement suggestions.
        </p>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: `2px dashed ${isDragging ? 'var(--accent)' : 'var(--border)'}`,
          borderRadius: 'var(--radius-xl)',
          padding: '48px 32px',
          background: isDragging ? 'var(--accent-glow)' : 'var(--bg-surface)',
          textAlign: 'center',
          transition: 'all 0.2s ease',
          cursor: 'pointer',
          boxShadow: isDragging ? 'var(--shadow-glow)' : 'none',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--accent)';
          e.currentTarget.style.background = 'var(--accent-glow)';
          e.currentTarget.style.boxShadow = 'var(--shadow-glow)';
        }}
        onMouseLeave={(e) => {
          if (!isDragging) {
            e.currentTarget.style.borderColor = 'var(--border)';
            e.currentTarget.style.background = 'var(--bg-surface)';
            e.currentTarget.style.boxShadow = 'none';
          }
        }}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileInput}
          accept=".pdf,.docx"
          style={{ display: 'none' }}
        />
        
        {!file ? (
          <>
            <svg viewBox="0 0 24 24" fill="none" style={{ width: 40, height: 40, color: 'var(--text-muted)', margin: '0 auto 12px' }}>
              <path d="M12 4v12m0-12l-4 4m4-4l4 4M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>Drop your resume here</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>PDF or DOCX supported · Max 10MB</p>
          </>
        ) : (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'var(--green-bg)', border: '1px solid var(--green)', color: 'var(--green)', fontSize: 13, borderRadius: 999, padding: '4px 14px' }}>
            <svg viewBox="0 0 20 20" fill="none" style={{ width: 14, height: 14 }}>
              <path d="M4 10l4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span style={{ maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {file.name}
            </span>
          </div>
        )}
      </div>

      <div style={{ marginTop: 16 }}>
        <input
          type="text"
          value={targetRole}
          onChange={(e) => setTargetRole(e.target.value)}
          placeholder="e.g. Software Engineer"
          style={{
            width: '100%',
            background: 'var(--bg-input)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 16px',
            color: 'var(--text-primary)',
            fontSize: 14,
            outline: 'none',
            transition: 'all 0.2s',
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--accent)';
            e.target.style.boxShadow = '0 0 0 3px var(--accent-glow)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'var(--border)';
            e.target.style.boxShadow = 'none';
          }}
        />
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>💡 AI will auto-detect your target role if left empty</p>
      </div>

      <button
        onClick={onAnalyze}
        disabled={!file || loading}
        style={{
          width: '100%',
          marginTop: 20,
          height: 48,
          background: loading || !file ? 'var(--accent)' : 'var(--accent)',
          border: 'none',
          borderRadius: 'var(--radius-md)',
          color: 'white',
          fontSize: 15,
          fontWeight: 600,
          fontFamily: 'inherit',
          cursor: (!file || loading) ? 'not-allowed' : 'pointer',
          opacity: (!file || loading) ? 0.5 : 1,
          transition: 'all 0.2s',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 8,
        }}
        onMouseEnter={(e) => {
          if (file && !loading) {
            e.currentTarget.style.background = 'var(--accent-hover)';
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 20px rgba(79,142,247,0.3)';
          }
        }}
        onMouseLeave={(e) => {
          if (file && !loading) {
            e.currentTarget.style.background = 'var(--accent)';
            e.currentTarget.style.transform = 'none';
            e.currentTarget.style.boxShadow = 'none';
          }
        }}
        onMouseDown={(e) => {
          if (file && !loading) {
            e.currentTarget.style.transform = 'translateY(0)';
          }
        }}
        onMouseUp={(e) => {
          if (file && !loading) {
            e.currentTarget.style.transform = 'translateY(-1px)';
          }
        }}
      >
        {loading ? (
          <>
            <span style={{
              width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)',
              borderTop: '2px solid white', borderRadius: '50%',
              animation: 'spin 0.6s linear infinite'
            }} />
            Analyzing...
          </>
        ) : "Analyze Resume"}
      </button>

      {error && (
        <div style={{
          background: 'var(--red-bg)', border: '1px solid rgba(239,68,68,0.3)',
          borderRadius: 'var(--radius-md)', padding: '16px 20px',
          display: 'flex', gap: 12, alignItems: 'center', marginTop: 16
        }}>
          <div style={{ background: 'var(--red-bg)', borderRadius: '50%', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--red)', flexShrink: 0 }}>
            ✕
          </div>
          <p style={{ color: 'var(--text-primary)', fontSize: 14, flex: 1 }}>{error}</p>
          <button onClick={onAnalyze} style={{
            background: 'transparent', border: '1px solid rgba(239,68,68,0.5)',
            color: 'var(--red)', borderRadius: 'var(--radius-sm)', padding: '6px 12px',
            fontSize: 12, fontWeight: 600, cursor: 'pointer'
          }}>Retry</button>
        </div>
      )}

      {loading && (
        <div style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[1, 2, 3].map((i) => (
            <div key={i} style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 24 }}>
              <div className="shimmer" style={{ width: '40%', height: 20, marginBottom: 16 }}></div>
              <div className="shimmer" style={{ width: '100%', height: 12, marginBottom: 8 }}></div>
              <div className="shimmer" style={{ width: '85%', height: 12 }}></div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
