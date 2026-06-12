import { useRef, useState } from "react";
import heroMark from "../assets/hero.png";
import Icon from "./Icon";

function formatBytes(bytes) {
  if (!bytes) return "0 KB";
  const kb = bytes / 1024;
  if (kb < 1024) return `${Math.round(kb)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

export default function HeroUpload({ onFileSelect, file, targetRole, setTargetRole, onAnalyze, loading, error }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const acceptFile = (selectedFile) => {
    if (!selectedFile) return;
    const ext = selectedFile.name.split(".").pop()?.toLowerCase();
    if (ext === "pdf" || ext === "docx") {
      onFileSelect(selectedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    acceptFile(e.dataTransfer.files?.[0]);
  };

  return (
    <section id="upload" className="landing-workspace">
      <div className="hero-grid">
        <div className="hero-copy">
          <div>
            <div className="section-kicker mb-5">
              <Icon name="sparkles" size={16} />
              Resume Intelligence Workspace
            </div>
            <h1 className="hero-title">
              Turn a resume into a <span>hiring-ready signal.</span>
            </h1>
            <p className="hero-copy-text">
              Scan structure, ATS fit, recruiter impact, role match, rewrites, and interview angles in one polished workspace.
            </p>

            <div className="hero-proof-grid">
              <div className="proof-tile">
                <strong>ATS</strong>
                <span>Keyword fit, parsing risks, and missing terms.</span>
              </div>
              <div className="proof-tile">
                <strong>Recruiter</strong>
                <span>Six-second scan notes and a hiring pile verdict.</span>
              </div>
              <div className="proof-tile">
                <strong>Rewrite</strong>
                <span>Sharper bullets, stronger summary, cleaner skills.</span>
              </div>
            </div>
          </div>

          <div className="surface resume-visual">
            <div className="resume-visual-grid">
              <div className="doc-preview">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="h-3 w-32 rounded-full bg-[#172018]" />
                    <div className="mt-2 h-2 w-24 rounded-full bg-[#172018]/30" />
                  </div>
                  <img src={heroMark} alt="" className="h-14 w-14 object-contain" />
                </div>
                <div className="mt-5 grid grid-cols-[0.68fr_1fr] gap-3">
                  <div>
                    <div className="doc-line dark" />
                    <div className="doc-line" />
                    <div className="doc-line" />
                    <div className="doc-line" />
                  </div>
                  <div>
                    <div className="doc-line dark" />
                    <div className="doc-line" />
                    <div className="doc-line" />
                    <div className="doc-line" />
                    <div className="doc-line" />
                  </div>
                </div>
              </div>

              <div className="insight-stack">
                <div className="insight-tile">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="text-xs font-bold text-[var(--text-muted)]">Overall Score</span>
                    <span className="chip chip-success">84</span>
                  </div>
                  <div className="meter">
                    <div className="meter-fill bg-[var(--green)]" style={{ width: "84%" }} />
                  </div>
                </div>
                <div className="insight-tile">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <span className="text-xs font-bold text-[var(--text-muted)]">Role Match</span>
                    <span className="chip chip-warning">72</span>
                  </div>
                  <div className="meter">
                    <div className="meter-fill bg-[var(--gold)]" style={{ width: "72%" }} />
                  </div>
                </div>
                <div className="insight-tile">
                  <div className="flex items-start gap-3">
                    <Icon name="wand" size={18} className="mt-0.5 text-[var(--accent)]" />
                    <p className="text-sm leading-6 text-[var(--text-secondary)]">
                      Actionable fixes are organized by priority and score impact.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="surface upload-studio">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <div className="section-kicker mb-2">
                <Icon name="upload" size={15} />
                Start Analysis
              </div>
              <h2 className="section-title">Upload your resume</h2>
              <p className="section-subtitle mt-2">PDF or DOCX, up to 10 MB.</p>
            </div>
            <span className="chip">Private by session</span>
          </div>

          <div
            className={`drop-zone ${isDragging ? "active" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") fileInputRef.current?.click();
            }}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => acceptFile(e.target.files?.[0])}
              accept=".pdf,.docx"
              className="hidden"
            />

            {!file ? (
              <div className="flex max-w-[310px] flex-col items-center">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-[8px] border border-[var(--border)] bg-white/[0.05] text-[var(--accent)]">
                  <Icon name="fileText" size={28} />
                </div>
                <p className="text-base font-extrabold text-[var(--text-primary)]">Drop resume or browse files</p>
                <p className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">
                  The analysis report appears as an interactive dashboard after upload.
                </p>
              </div>
            ) : (
              <div className="flex max-w-[340px] flex-col items-center">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-[8px] border border-[rgba(68,208,123,0.3)] bg-[var(--green-bg)] text-[var(--green)]">
                  <Icon name="check" size={28} />
                </div>
                <p className="max-w-full truncate text-base font-extrabold text-[var(--text-primary)]">{file.name}</p>
                <p className="mt-2 text-sm text-[var(--text-muted)]">{formatBytes(file.size)}</p>
              </div>
            )}
          </div>

          <label className="mt-5 block">
            <span className="mb-2 block text-sm font-bold text-[var(--text-secondary)]">Target role <span className="font-normal text-[var(--text-muted)]">(optional)</span></span>
            <div className="relative">
              <Icon name="briefcase" size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="Software Engineer, Product Designer, Data Analyst"
                className="input pl-11"
                style={{ paddingLeft: 44 }}
              />
            </div>
          </label>

          <button onClick={onAnalyze} disabled={!file || loading} className="btn btn-primary mt-5 w-full">
            {loading ? (
              <>
                <span className="inline-block h-4 w-4 rounded-full border-2 border-[#06100c]/25 border-t-[#06100c]" style={{ animation: "spin 0.7s linear infinite" }} />
                Analyzing resume
              </>
            ) : (
              <>
                <Icon name="sparkles" size={18} />
                Analyze Resume
              </>
            )}
          </button>

          {error && (
            <div className="mt-4 flex items-start gap-3 rounded-[8px] border border-[rgba(255,107,119,0.28)] bg-[var(--red-bg)] p-4">
              <Icon name="warning" size={18} className="mt-0.5 shrink-0 text-[var(--red)]" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-[var(--text-primary)]">{error}</p>
                <button onClick={onAnalyze} className="btn btn-danger mt-3 min-h-9 px-3 text-xs">
                  <Icon name="refresh" size={14} />
                  Retry
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
