"""
Flask API server for the AI Resume Analyzer.

Endpoints
---------
POST /api/analyze
    Accepts a multipart form upload with:
      - file   : PDF or DOCX resume (required)
      - target_role : string (optional)
    Returns a JSON object with the full resume analysis.
"""

import logging
import os
import sys

# Fix for Vercel deployment: Ensure the backend directory is in the Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from flask import Flask, jsonify, request
from flask_cors import CORS

from analyzer import analyze_resume

# ---------------------------------------------------------------------------
# App Setup
# ---------------------------------------------------------------------------

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)

ALLOWED_EXTENSIONS = {".pdf", ".docx"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10 MB

# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------


@app.route("/api/analyze", methods=["POST"])
def analyze():
    """Receive a resume file and return AI-powered analysis."""

    # --- Validate file presence ---------------------------------------------
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded. Please attach a resume file."}), 400

    file = request.files["file"]

    if file.filename is None or file.filename.strip() == "":
        return jsonify({"error": "No file selected."}), 400

    # --- Validate file extension --------------------------------------------
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        return (
            jsonify({
                "error": f"Invalid file type '{ext}'. Only PDF and DOCX files are accepted."
            }),
            400,
        )

    # --- Read file bytes ----------------------------------------------------
    file_bytes = file.read()

    if len(file_bytes) == 0:
        return jsonify({"error": "The uploaded file is empty."}), 400

    if len(file_bytes) > MAX_FILE_SIZE:
        return jsonify({"error": "File size exceeds the 10 MB limit."}), 400

    # --- Optional target role -----------------------------------------------
    target_role = request.form.get("target_role", "").strip() or None

    # --- Run analysis -------------------------------------------------------
    try:
        logger.info(
            "Analyzing file: %s (%d bytes) | target_role=%s",
            file.filename,
            len(file_bytes),
            target_role,
        )
        result, resume_text = analyze_resume(file_bytes, file.filename, target_role)
        return jsonify({"success": True, "analysis": result, "resume_text": resume_text}), 200

    except ValueError as exc:
        # Covers unsupported type / empty text
        logger.warning("Validation error: %s", exc)
        return jsonify({"error": str(exc)}), 400

    except RuntimeError as exc:
        # Covers API failures / JSON parse errors
        logger.error("Analysis failed: %s", exc)
        return jsonify({"error": str(exc)}), 500

    except Exception as exc:
        logger.exception("Unexpected error during analysis")
        return jsonify({"error": "An unexpected error occurred. Please try again."}), 500

# ---------------------------------------------------------------------------
# New Advanced Endpoints
# ---------------------------------------------------------------------------

@app.route("/api/analyze-jd", methods=["POST"])
def analyze_jd():
    data = request.json
    resume_text = data.get("resume_text")
    job_description = data.get("job_description")
    
    if not resume_text or not job_description:
        return jsonify({"error": "Missing resume_text or job_description"}), 400
        
    system_prompt = """You are an expert ATS system and career coach. Compare the candidate's resume against the provided job description and return ONLY a valid JSON object:
{
  "match_score": number between 0-100,
  "matched_keywords": ["keyword1", "keyword2"],
  "missing_keywords": ["keyword1", "keyword2"],
  "matched_phrases": ["phrase from JD found in resume"],
  "missing_phrases": ["important JD phrase not in resume"],
  "score_breakdown": {
    "skills_match": number,
    "experience_match": number,
    "education_match": number,
    "keywords_match": number
  },
  "top_3_improvements": [
    "Specific actionable change to increase match score"
  ],
  "verdict": "string — 2 sentence honest assessment of this resume for this role"
}"""
    
    user_message = f"Resume:\n{resume_text}\n\nJob Description:\n{job_description}"
    
    try:
        from analyzer import client, MODEL
        import json
        import re
        
        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message},
            ],
            temperature=0.3,
            max_tokens=2048,
        )
        
        raw_content = response.choices[0].message.content
        cleaned = re.sub(r"^```(?:json)?\s*", "", raw_content.strip())
        cleaned = re.sub(r"\s*```$", "", cleaned).strip()
        result = json.loads(cleaned)
        return jsonify(result), 200
        
    except Exception as exc:
        logger.exception("JD Match analysis failed")
        return jsonify({"error": "Failed to analyze job description match."}), 500


@app.route("/api/rescore-section", methods=["POST"])
def rescore_section():
    data = request.json
    section_name = data.get("section_name")
    section_text = data.get("section_text")
    target_role = data.get("target_role", "General")
    
    if not section_name or not section_text:
        return jsonify({"error": "Missing section_name or section_text"}), 400
        
    system_prompt = """You are an expert resume reviewer. Evaluate this specific resume section and return ONLY a valid JSON object with NO extra text:
{
  "score": number between 0-100,
  "grade": "A" or "B" or "C" or "D" or "F",
  "quick_feedback": "string — 1-2 sentences on what changed and what still needs work",
  "top_issue": "string — single most important remaining problem if any"
}"""
    
    user_message = f"Section: {section_name}\nTarget Role: {target_role}\n\n{section_text}"
    
    try:
        from analyzer import client, MODEL
        import json
        import re
        
        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message},
            ],
            temperature=0.3,
            max_tokens=1024,
        )
        
        raw_content = response.choices[0].message.content
        cleaned = re.sub(r"^```(?:json)?\s*", "", raw_content.strip())
        cleaned = re.sub(r"\s*```$", "", cleaned).strip()
        result = json.loads(cleaned)
        return jsonify(result), 200
        
    except Exception as exc:
        logger.exception("Rescore section failed")
        return jsonify({"error": "Failed to rescore section."}), 500


@app.route("/api/generate-cover-letter", methods=["POST"])
def generate_cover_letter():
    data = request.json
    resume_text = data.get("resume_text")
    target_role = data.get("target_role")
    tone = data.get("tone", "professional")
    
    if not resume_text or not target_role:
        return jsonify({"error": "Missing resume_text or target_role"}), 400
        
    system_prompt = f"""You are an expert career coach who writes outstanding cover letters. Write a cover letter based on the candidate's actual resume — use their REAL achievements, projects, and skills. Do NOT use placeholders like [Company Name] or [Your Name]. Reference specific things from their resume.

Tone guide:
- professional: formal, structured, traditional
- confident: assertive, achievement-focused, bold claims
- concise: short (3 paragraphs max), punchy, direct

Requested tone: {tone}

Return ONLY a valid JSON object:
{{
  "cover_letter": "full cover letter text with \\n for line breaks",
  "word_count": number,
  "key_achievements_used": ["achievement 1", "achievement 2", "achievement 3"],
  "tone_used": "{tone}"
}}"""
    
    user_message = f"Resume:\n{resume_text}\n\nTarget Role:\n{target_role}"
    
    try:
        from analyzer import client, MODEL
        import json
        import re
        
        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_message},
            ],
            temperature=0.7,
            max_tokens=2048,
        )
        
        raw_content = response.choices[0].message.content
        cleaned = re.sub(r"^```(?:json)?\s*", "", raw_content.strip())
        cleaned = re.sub(r"\s*```$", "", cleaned).strip()
        result = json.loads(cleaned)
        return jsonify(result), 200
        
    except Exception as exc:
        logger.exception("Cover letter generation failed")
        return jsonify({"error": "Failed to generate cover letter."}), 500


# ---------------------------------------------------------------------------
# Health Check
# ---------------------------------------------------------------------------


@app.route("/api/health", methods=["GET"])
def health():
    """Simple health-check endpoint."""
    return jsonify({"status": "ok"}), 200


# ---------------------------------------------------------------------------
# Entry Point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
