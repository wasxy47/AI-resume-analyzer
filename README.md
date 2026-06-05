<div align="center">
  <br />
  <img src="https://img.shields.io/badge/Powered_by-Groq_AI-F55036?style=for-the-badge&logo=groq&logoColor=white" alt="Powered by Groq" />
  <h1>🚀 ResumeAI - Premium AI Resume Analyzer</h1>
  <p>
    A full-stack, AI-powered application that acts as a senior HR professional to analyze resumes, score ATS compatibility, and provide actionable rewrite suggestions. Built with a stunning dark-mode SaaS UI.
  </p>
  <p>
    <a href="#features"><strong>Features</strong></a> ·
    <a href="#tech-stack"><strong>Tech Stack</strong></a> ·
    <a href="#getting-started"><strong>Getting Started</strong></a> ·
    <a href="#deployment"><strong>Deployment</strong></a>
  </p>
</div>

---

## ✨ Features

- **📄 Universal Parsing:** Accurately extracts text from `.pdf` and `.docx` files using robust Python libraries.
- **🤖 Deep AI Analysis:** Utilizes the Groq API (LLMs) to scan for technical/soft skills, missing keywords, and overall ATS compatibility.
- **📊 Visual Dashboards:** Rich, interactive charts and progress rings using Recharts.
- **📝 Before/After Rewrites:** See exactly how to improve your bullet points and professional summary with side-by-side comparisons.
- **🎯 Action Plan:** Gives you a priority-based, 5-step checklist to dramatically improve your resume.
- **📥 PDF Export:** One-click download of your entire analysis report in a clean PDF format.
- **🎨 Premium UI:** Custom glassmorphism, animated rings, and a deep-slate dark theme inspired by top-tier SaaS platforms like Vercel and Linear.

## 🛠 Tech Stack

### Frontend
- ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) **React.js** (Vite)
- ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white) **Tailwind CSS v4** (Custom Design Tokens)
- 📈 **Recharts** (Data Visualization)
- 📄 **jsPDF** (Report Generation)

### Backend
- ![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54) **Python 3**
- ![Flask](https://img.shields.io/badge/flask-%23000.svg?style=for-the-badge&logo=flask&logoColor=white) **Flask** (RESTful API)
- ⚡ **Groq API** (Blazing fast LLM inference)
- 📚 **pdfplumber & python-docx** (Document Extraction)
- 🚀 **Gunicorn** (Production Server)

---

## 🚀 Getting Started (Local Development)

Follow these instructions to run the project locally on your machine.

### Prerequisites
- Node.js (v18+)
- Python 3.10+
- A valid Groq API Key

### 1. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Create a virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Environment variables setup
# Create a .env file in the backend directory and add your API key:
echo "XAI_API_KEY=your_groq_api_key_here" > .env

# Run the Flask server
python app.py
```
*The backend will run on `http://localhost:5000`*

### 2. Frontend Setup

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Run the Vite development server
npm run dev
```
*The frontend will run on `http://localhost:5173`*

---

## 🌍 Deployment

This project is configured to be deployed easily using **Vercel** as a unified full-stack application (Serverless Python + React Vite).

### Deploying to Vercel
1. Push your code to GitHub.
2. Sign up on [Vercel](https://vercel.com/) and click **Add New Project**.
3. Import your GitHub repository.
4. Keep the default configuration:
   - **Framework Preset:** `Other` (Vercel reads `vercel.json` automatically)
   - **Root Directory:** `./`
5. Open **Environment Variables** and add:
   - Key: `XAI_API_KEY` (or your chosen variable for the Groq API)
   - Value: `your_api_key_here`
6. Click **Deploy**!

Vercel will automatically build the React frontend and deploy the Flask backend as a serverless function at the `/api` route.

---

<div align="center">
  <p>Built with ❤️ for Internee.pk Gen AI Tasks</p>
</div>
