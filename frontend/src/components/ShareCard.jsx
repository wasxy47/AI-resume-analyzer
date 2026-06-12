import { forwardRef } from "react";

const ShareCard = forwardRef(({ data }, ref) => {
  if (!data) return null;

  const candidateName = data.candidate_name || "Candidate";
  const targetRole = data.detected_role || "Professional";
  const overallScore = data.overall_score || 0;
  const atsScore = data.ats_compatibility?.score || 0;
  const matchScore = data.job_role_match?.match_percentage || 0;
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  const getScoreColor = (score) => {
    if (score >= 75) return "#44d07b";
    if (score >= 50) return "#ffb84d";
    return "#ff6b77";
  };

  const color = getScoreColor(overallScore);
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        left: "-9999px",
        top: 0,
        width: "600px",
        height: "320px",
        background: "linear-gradient(135deg, #080907 0%, #151b17 55%, #24312b 100%)",
        border: "1px solid rgba(79, 217, 187, 0.42)",
        borderRadius: "8px",
        padding: "32px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        color: "#f4f7ef",
        boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flex: 1 }}>
        <div style={{ flex: 1, paddingRight: "24px" }}>
          <div style={{ fontSize: "12px", color: "#4fd9bb", textTransform: "uppercase", marginBottom: "8px", fontWeight: 800 }}>
            AI Resume Analysis
          </div>
          <div style={{ fontSize: "28px", fontWeight: 800, color: "#f4f7ef", marginBottom: "8px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {candidateName}
          </div>
          <div
            style={{
              display: "inline-block",
              background: "rgba(79, 217, 187, 0.14)",
              border: "1px solid rgba(79, 217, 187, 0.36)",
              color: "#4fd9bb",
              fontSize: "13px",
              borderRadius: "6px",
              padding: "5px 11px",
              marginBottom: "20px",
              fontWeight: 700,
            }}
          >
            {targetRole}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "9px" }}>
            {[
              ["Overall Score", `${overallScore}/100`],
              ["ATS Score", `${atsScore}%`],
              ["Job Match", `${matchScore}%`],
            ].map(([label, value]) => (
              <div key={label} style={{ display: "flex", alignItems: "center", fontSize: "14px", color: "#a7b1a8" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "99px", background: "#4fd9bb", marginRight: "10px" }} />
                {label}: <span style={{ fontWeight: 800, color: "#f4f7ef", marginLeft: "6px" }}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "160px" }}>
          <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", width: "110px", height: "110px" }}>
            <svg width="110" height="110" viewBox="0 0 100 100" style={{ position: "absolute", inset: 0 }}>
              <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
              <circle
                cx="50"
                cy="50"
                r={radius}
                fill="none"
                stroke={color}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div style={{ fontSize: "34px", fontWeight: 900, color }}>{overallScore}</div>
          </div>
          <div style={{ fontSize: "11px", color: "#6f7b73", marginTop: "14px", fontWeight: 800 }}>
            Powered by ResumeAI
          </div>
        </div>
      </div>

      <div style={{ marginTop: "18px" }}>
        <div style={{ height: "1px", background: "linear-gradient(90deg, rgba(79,217,187,0) 0%, rgba(79,217,187,0.55) 50%, rgba(79,217,187,0) 100%)", marginBottom: "12px" }} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", color: "#6f7b73", fontWeight: 700 }}>
          <span>resumeai.app</span>
          <span>{today}</span>
        </div>
      </div>
    </div>
  );
});

ShareCard.displayName = "ShareCard";

export default ShareCard;
