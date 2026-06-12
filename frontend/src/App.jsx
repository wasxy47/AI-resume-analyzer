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
import AnalysisLoader from "./components/AnalysisLoader";

import RecruiterVerdict from "./components/RecruiterVerdict";
import InterviewQuestions from "./components/InterviewQuestions";
import JDMatcher from "./components/JDMatcher";
import LiveReScorer from "./components/LiveReScorer";
import CoverLetterGenerator from "./components/CoverLetterGenerator";
import CompletenessRoadmap from "./components/CompletenessRoadmap";
import TopBar from "./components/TopBar";
import Sidebar from "./components/Sidebar";
import { AnimatePresence, motion } from "framer-motion";
import { API_BASE_URL } from "./config";

function App() {
  const [file, setFile] = useState(null);
  const [targetRole, setTargetRole] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

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
      
      const response = await axios.post(
        `${API_BASE_URL}/api/analyze`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 120000,
        }
      );

      setAnalysisResult(response.data.analysis);
      if (response.data.resume_text) {
        setResumeText(response.data.resume_text);
      }
      setActiveTab("overview");
    } catch (err) {
      if (err.response?.data?.error) {
        const errData = err.response.data.error;
        setError(typeof errData === 'string' ? errData : errData.message || JSON.stringify(errData));
      } else if (err.code === "ECONNABORTED") {
        setError("Request timed out. Please try again.");
      } else if (err.code === "ERR_NETWORK") {
        setError("Cannot connect to the server. Please check your internet connection.");
      } else {
        setError("An error occurred while analyzing your resume. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-background">
      {!analysisResult && (
        <>
          <Navbar />
          <main className="workspace-main flex flex-col">
            <HeroUpload
              onFileSelect={handleFileSelect}
              file={file}
              targetRole={targetRole}
              setTargetRole={setTargetRole}
              onAnalyze={handleAnalyze}
              loading={loading}
              error={error}
            />

            {loading && (
              <div className="landing-workspace pt-0 animate-fade-in-up">
                <AnalysisLoader />
              </div>
            )}

            {!loading && (
              <footer className="w-full text-center py-8 text-sm text-[var(--text-muted)] mt-auto flex items-center justify-center gap-3">
                <span>Built by <span className="text-[var(--text-primary)] font-medium">Abdul Wasay</span></span>
                <div className="w-1 h-1 rounded-full bg-[var(--border-strong)]"></div>
                <a
                  href="https://github.com/wasxy47/AI-resume-analyzer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-1.5"
                  title="View Source on GitHub"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>
                    <path d="M9 18c-4.51 2-5-2-7-2"/>
                  </svg>
                  <span className="font-medium">GitHub</span>
                </a>
              </footer>
            )}
          </main>
        </>
      )}

      {analysisResult && !loading && (
        <main className="analysis-shell">
            <TopBar 
              candidateName={analysisResult.candidate_name} 
              detectedRole={analysisResult.detected_role}
              overallScore={analysisResult.overall_score}
              onNewAnalysis={() => setAnalysisResult(null)}
            />
            
            <Sidebar 
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              atsScore={analysisResult.ats_compatibility?.score}
            />

            <div className="analysis-content">
              <div className="content-lane">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.25 }}
                >
                  {activeTab === "overview" && (
                    <div className="space-y-6">
                      <ScoreDashboard data={analysisResult} />
                      <Improvements
                        improvements={analysisResult.improvements}
                        strengths={analysisResult.strengths}
                        actionPlan={[]}
                        atsCompatibility={{}}
                      />
                    </div>
                  )}

                  {activeTab === "roadmap" && (
                    <CompletenessRoadmap roadmap={analysisResult.roadmap} overallScore={analysisResult.overall_score} candidateName={analysisResult.candidate_name} />
                  )}

                  {activeTab === "skills" && (
                    <div className="space-y-6">
                      <JobRoleMatch data={analysisResult.job_role_match} />
                      <SkillsAnalysis data={analysisResult.skills_analysis} />
                    </div>
                  )}

                  {activeTab === "recruiter" && (
                    <RecruiterVerdict verdict={analysisResult.recruiter_verdict} />
                  )}

                  {activeTab === "rewrites" && (
                    <BeforeAfter data={analysisResult.before_after} />
                  )}

                  {activeTab === "interview" && (
                    <InterviewQuestions questions={analysisResult.interview_questions} />
                  )}

                  {activeTab === "cover" && (
                    <CoverLetterGenerator resumeText={resumeText} targetRole={analysisResult.target_role || targetRole} candidateName={analysisResult.candidate_name} />
                  )}

                  {activeTab === "ats" && (
                    <Improvements
                      improvements={[]}
                      strengths={[]}
                      actionPlan={analysisResult.action_plan}
                      atsCompatibility={analysisResult.ats_compatibility}
                    />
                  )}

                  {activeTab === "rescore" && (
                    <LiveReScorer sectionScores={analysisResult.section_scores} targetRole={analysisResult.target_role || targetRole} />
                  )}

                  {activeTab === "jdmatch" && (
                    <JDMatcher resumeText={resumeText} />
                  )}
                </motion.div>
              </AnimatePresence>
              </div>
            </div>
            
            <div style={{ position: 'fixed', left: '-9999px', top: '-9999px', pointerEvents: 'none', opacity: 0 }}>
              <DownloadReport data={analysisResult} />
            </div>
        </main>
      )}
    </div>
  );
}

export default App;
