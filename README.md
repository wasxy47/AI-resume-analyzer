<div align="center">
  <img src="https://img.icons8.com/color/96/000000/resume.png" alt="Resume AI Logo" width="80" height="80" />
  <h1>🚀 ResumeAI - Hiring Signal Engine</h1>
  <p><strong>Next-Gen AI Resume Analyzer & Optimizer</strong></p>

  <p>
    <img src="https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
    <img src="https://img.shields.io/badge/Styling-Tailwind%20CSS%20v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="TailwindCSS" />
    <img src="https://img.shields.io/badge/Backend-Flask-000000?style=for-the-badge&logo=flask&logoColor=white" alt="Flask" />
    <img src="https://img.shields.io/badge/AI-Groq%20Llama--3-F55036?style=for-the-badge&logo=artificial-intelligence&logoColor=white" alt="Groq" />
    <img src="https://img.shields.io/badge/Deployment-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
  </p>
</div>

## 🌟 Overview

**ResumeAI** is an advanced full-stack application designed to analyze, optimize, and score resumes against specific job descriptions. Powered by ultra-fast LLMs via the **Groq API**, it acts as a virtual recruiter, providing deep insights, actionable roadmaps, and instantly generated assets like cover letters and interview questions.

With a premium dark-mode UI, smooth animations, and a decoupled architecture, ResumeAI offers a state-of-the-art user experience for job seekers looking to land their dream roles.

## ✨ Key Features

- 📊 **ATS Compatibility Check**: Parses your resume and grades it against modern Applicant Tracking Systems.
- 🎯 **JD Matching**: Upload a Job Description (JD) to see exactly how well your resume aligns with the role.
- 📝 **Live Re-Scorer**: Make adjustments to your resume and get immediate updated scores and feedback.
- ✉️ **Cover Letter Generator**: Instantly craft highly tailored, professional cover letters (with tone adjustments).
- 🎤 **Interview Prep**: Generates personalized behavioral and technical interview questions based on your experience.
- 📥 **Export & Share**: Download your analysis report as a high-quality PDF or share your score beautifully.

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, Tailwind CSS v4, jsPDF, html2canvas
- **Backend**: Python, Flask, Groq API (llama-3.3-70b-versatile), PyPDF2, python-docx
- **Deployment**: Vercel (Serverless Functions for Python)

## 🚀 Quick Start (Local Development)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/ResumeAI.git
cd ResumeAI
```

### 2. Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r ../requirements.txt

# Create a .env file and add your Groq API Key
echo "GROQ_API_KEY=your_api_key_here" > .env

# Run the Flask Server
python app.py
```
*Backend will run on `http://localhost:5000`*

### 3. Frontend Setup
```bash
cd ../frontend
npm install

# Run the Vite Dev Server
npm run dev
```
*Frontend will run on `http://localhost:5173`*

## 🌐 Vercel Deployment Guide

This project is fully pre-configured for a seamless deployment on Vercel!

1. Push your code to a **GitHub repository**.
2. Go to your [Vercel Dashboard](https://vercel.com/dashboard) and click **Add New > Project**.
3. Import your GitHub repository.
4. **Important Framework Settings**:
   - Vercel will automatically detect Vite for the frontend.
   - Keep the default Build Command (`npm run build`) and Output Directory (`dist`).
5. **Environment Variables**:
   - Add a new variable:
     - **Name**: `GROQ_API_KEY`
     - **Value**: `your_actual_groq_api_key_here`
6. Click **Deploy**.

**How the deployment works:**
The `vercel.json` file is configured to serve the frontend normally and route all `/api/(.*)` requests to the Python serverless function located at `api/index.py`. The `requirements.txt` at the root ensures Vercel installs all necessary Python packages.
