<div align="center">
  <img src="https://img.icons8.com/color/96/000000/resume.png" alt="Resume AI Logo" width="80" height="80" />
  <h1>🚀 ResumeAI - Hiring Signal Engine</h1>
  <p><strong>Next-Gen AI Resume Analyzer & Optimizer</strong></p>

  <p>
    <img src="https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/Styling-Tailwind%20CSS%20v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS" />
    <img src="https://img.shields.io/badge/Backend-Flask-000000?style=for-the-badge&logo=flask&logoColor=white" alt="Flask" />
    <img src="https://img.shields.io/badge/AI-Groq%20Llama--3-F55036?style=for-the-badge&logo=artificial-intelligence&logoColor=white" alt="Groq" />
  </p>
</div>

---

## 🌟 Overview

**ResumeAI** is an advanced full-stack web application designed to analyze, optimize, and score professional resumes against specific job descriptions. Powered by ultra-fast Large Language Models via the **Groq API**, it acts as your personal AI recruiter. It provides deep analytical insights, actionable roadmaps, and instantly generated career assets like customized cover letters and interview questions.

With a premium dark-mode UI, smooth animations, and a highly modular architecture, ResumeAI offers a state-of-the-art user experience for job seekers aiming to land their dream roles and bypass modern ATS barriers.

## ✨ Key Features & Capabilities

- 📊 **ATS Compatibility Check**: Parses your resume (PDF/DOCX) and grades its formatting, keyword density, and parseability against modern Applicant Tracking Systems.
- 🎯 **Deep JD Matching**: Upload a Job Description (JD) to see exactly how well your resume aligns with the target role, complete with missing keywords and hard-skill gap analysis.
- 📝 **Live Re-Scorer**: Make adjustments to your resume text directly within the app and get immediate updated scores and feedback without re-uploading the file.
- ✉️ **AI Cover Letter Generator**: Instantly craft highly tailored, professional cover letters that highlight your strengths. You can also adjust the tone (Professional, Confident, Concise).
- 🎤 **Interview Prep**: Generates personalized behavioral and technical interview questions based on your unique experience and the target job description.
- 📥 **Export & Share**: Download your comprehensive analysis report as a high-quality PDF, or share your score dynamically.
- 📱 **Fully Responsive UI**: Works seamlessly across desktop, tablet, and mobile devices with a collapsible sidebar and native bottom navigation.

## 🛠️ Technology Stack

**Frontend Architecture:**
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4 (with custom CSS layering and themes)
- **Icons**: Lucide React / Custom SVG
- **PDF Generation**: jsPDF & html2canvas

**Backend Architecture:**
- **Server**: Python 3.10+ / Flask Framework
- **AI Integration**: Groq API (`llama-3.3-70b-versatile` model for lightning-fast inference)
- **Document Processing**: `pdfplumber` (for PDF parsing), `python-docx` (for Word documents)
- **CORS & APIs**: `flask-cors`

---

## 📂 Project Structure

```text
📦 AI-resume-analyzer
 ┣ 📂 api                  # Serverless function entry point for cloud deployment
 ┃ ┗ 📜 index.py           # Vercel serverless adapter for the Flask app
 ┣ 📂 backend              # Python Flask API logic
 ┃ ┣ 📜 app.py             # Main Flask server and route definitions
 ┃ ┣ 📜 analyzer.py        # Core AI interaction and document parsing logic
 ┃ ┗ 📜 requirements.txt   # Python dependencies
 ┣ 📂 frontend             # React UI application
 ┃ ┣ 📂 src                # UI Components, styles, and assets
 ┃ ┣ 📂 public             # Static assets
 ┃ ┣ 📜 index.html         # Main HTML entry point
 ┃ ┣ 📜 package.json       # Node.js dependencies
 ┃ ┗ 📜 vite.config.js     # Vite configuration
 ┣ 📜 vercel.json          # Deployment configuration
 ┗ 📜 README.md            # Project documentation
```

---

## 🚀 Quick Start (Local Development)

To run this application locally on your machine, follow these steps:

### 1. Clone the Repository
```bash
git clone https://github.com/wasxy47/AI-resume-analyzer.git
cd AI-resume-analyzer
```

### 2. Backend Setup
Set up your Python virtual environment and start the Flask server.
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Create a .env file and add your Groq API Key
echo "GROQ_API_KEY=your_actual_groq_api_key_here" > .env

# Run the Flask Server
python app.py
```
*The backend API will run natively on `http://localhost:5000`*

### 3. Frontend Setup
Open a new terminal window to start the React application.
```bash
cd frontend
npm install

# Run the Vite Dev Server
npm run dev
```
*The frontend application will be available at `http://localhost:5173`*

---

## 🌐 Deployment (Vercel)

This project is already pre-configured for full-stack deployment on Vercel. 

1. Push your repository to GitHub.
2. Import the project in Vercel.
3. Ensure the **Framework Preset** is set to Vite.
4. Add `GROQ_API_KEY` to the **Environment Variables**.
5. Deploy! Vercel will automatically serve the frontend and host the Python backend via Serverless Functions.

---
*Built with ❤️ for modern job seekers.*
