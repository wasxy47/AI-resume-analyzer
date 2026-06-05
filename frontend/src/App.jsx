import { useState } from "react";
import axios from "axios";
import Navbar from "./components/Navbar";
import HeroUpload from "./components/HeroUpload";
import ScoreDashboard from "./components/ScoreDashboard";
import JobRoleMatch from "./components/JobRoleMatch";
import SkillsAnalysis from "./components/SkillsAnalysis";
import BeforeAfter from "./components/BeforeAfter";
import Improvements from "./components/Improvements";
import DownloadReport from "./components/DownloadReport";

function App() {
  const [file, setFile] = useState(null);
  const [targetRole, setTargetRole] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError("Please upload a resume file first.");
      return;
    }

    setLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      if (targetRole.trim()) {
        formData.append("target_role", targetRole.trim());
      }
      const API_URL = import.meta.env.VITE_API_URL !== undefined ? import.meta.env.VITE_API_URL : (import.meta.env.DEV ? "http://localhost:5000" : "");
      const response = await axios.post(
        `${API_URL}/api/analyze`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 120000,
        }
      );

      setAnalysisResult(response.data.analysis);
    } catch (err) {
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.code === "ECONNABORTED") {
        setError("Request timed out. Please try again.");
      } else if (err.code === "ERR_NETWORK") {
        setError("Cannot connect to the server. Make sure the backend is running on port 5000.");
      } else {
        setError("An error occurred while analyzing your resume. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Navbar />

      <main className={analysisResult ? "pb-24" : ""}>
        <HeroUpload
          onFileSelect={handleFileSelect}
          file={file}
          targetRole={targetRole}
          setTargetRole={setTargetRole}
          onAnalyze={handleAnalyze}
          loading={loading}
          error={error}
        />

        {analysisResult && (
          <div className="animate-fade-in-up" style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px 80px' }}>
            <ScoreDashboard data={analysisResult} />
            <JobRoleMatch data={analysisResult.job_role_match} />
            <SkillsAnalysis data={analysisResult.skills_analysis} />
            <BeforeAfter data={analysisResult.before_after} />
            <Improvements
              improvements={analysisResult.improvements}
              actionPlan={analysisResult.action_plan}
              strengths={analysisResult.strengths}
              atsCompatibility={analysisResult.ats_compatibility}
            />
            <DownloadReport data={analysisResult} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
