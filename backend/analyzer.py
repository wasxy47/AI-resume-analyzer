"""
Resume Analyzer Module
Handles PDF/DOCX text extraction and Groq API integration for resume analysis.
"""

import io
import json
import logging
import os
import re

import pdfplumber
from docx import Document
from dotenv import load_dotenv
from openai import OpenAI

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

load_dotenv()

logger = logging.getLogger(__name__)

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise EnvironmentError("GROQ_API_KEY is not set. Add it to the .env file.")

client = OpenAI(
    api_key=GROQ_API_KEY,
    base_url="https://api.groq.com/openai/v1",
)

MODEL = "llama-3.3-70b-versatile"

SYSTEM_PROMPT = """You are an expert resume analyst and senior HR professional with 15 years of experience. Analyze the resume and return ONLY a valid JSON object with no markdown, no explanation, exactly this structure:

{
"candidate_name": "string",
"detected_role": "string (inferred target role from resume)",
"overall_score": number (0-100),
"summary": "string (2-3 sentence professional summary)",

"section_scores": {
"contact_info": number,
"professional_summary": number,
"work_experience": number,
"education": number,
"skills": number,
"formatting": number
},

"job_role_match": {
"detected_role": "string",
"match_percentage": number,
"matched_skills": ["string"],
"missing_skills": ["string"],
"recommendation": "string"
},

"skills_analysis": {
"technical_skills": ["string"],
"soft_skills": ["string"],
"certifications": ["string"],
"missing_key_skills": ["string"]
},

"before_after": {
"summary_before": "string (current summary from resume, verbatim)",
"summary_after": "string (AI improved version)",
"experience_before": "string (current experience bullet, verbatim)",
"experience_after": "string (AI improved version with metrics)",
"skills_before": "string (current skills section, verbatim)",
"skills_after": "string (AI improved version)"
},

"improvements": [
{
"priority": "High/Medium/Low",
"area": "string",
"issue": "string",
"fix": "string (specific actionable fix)"
}
],

"strengths": ["string"],

"ats_compatibility": {
"score": number,
"keywords_found": ["string"],
"keywords_missing": ["string"],
"issues": ["string"]
},

"action_plan": ["string (5 specific steps)"]
}"""

# ---------------------------------------------------------------------------
# Text Extraction Helpers
# ---------------------------------------------------------------------------


def extract_text_from_pdf(file_bytes: bytes) -> str:
    """Extract all text from a PDF file using pdfplumber."""
    text_parts: list[str] = []
    with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text()
            if page_text:
                text_parts.append(page_text)
    return "\n".join(text_parts)


def extract_text_from_docx(file_bytes: bytes) -> str:
    """Extract all text from a DOCX file using python-docx."""
    doc = Document(io.BytesIO(file_bytes))
    return "\n".join(para.text for para in doc.paragraphs if para.text.strip())


# ---------------------------------------------------------------------------
# Main Analysis Function
# ---------------------------------------------------------------------------


def analyze_resume(
    file_bytes: bytes,
    filename: str,
    target_role: str | None = None,
) -> dict:
    """
    Analyse a resume file and return structured feedback.

    Parameters
    ----------
    file_bytes : bytes
        Raw bytes of the uploaded resume file.
    filename : str
        Original filename (used to determine the file type).
    target_role : str | None
        Optional target job role to evaluate against.

    Returns
    -------
    dict
        Parsed JSON analysis result from the Groq LLM.

    Raises
    ------
    ValueError
        If the file type is unsupported or the extracted text is empty.
    RuntimeError
        If the Groq API call fails or the response cannot be parsed.
    """

    ext = os.path.splitext(filename)[1].lower()

    # --- Extract text -------------------------------------------------------
    if ext == ".pdf":
        resume_text = extract_text_from_pdf(file_bytes)
    elif ext == ".docx":
        resume_text = extract_text_from_docx(file_bytes)
    else:
        raise ValueError(f"Unsupported file type: {ext}. Only .pdf and .docx are accepted.")

    if not resume_text or not resume_text.strip():
        raise ValueError("Could not extract any text from the uploaded resume.")

    logger.info("Extracted %d characters from %s", len(resume_text), filename)

    # --- Build user message -------------------------------------------------
    user_message = f"Analyze this resume:\n\n{resume_text}"
    if target_role:
        user_message += f"\n\nEvaluate specifically for the role: {target_role}"

    # --- Call Groq API via OpenAI SDK ---------------------------------------
    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_message},
            ],
            temperature=0.3,
            max_tokens=4096,
        )
    except Exception as exc:
        logger.exception("Groq API call failed")
        raise RuntimeError(f"Groq API error: {exc}") from exc

    raw_content = response.choices[0].message.content
    if not raw_content:
        raise RuntimeError("Groq API returned an empty response.")

    logger.debug("Raw LLM response (first 500 chars): %s", raw_content[:500])

    # --- Parse JSON (strip potential markdown fences) -----------------------
    cleaned = raw_content.strip()
    # Remove ```json ... ``` or ``` ... ``` wrappers
    cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned)
    cleaned = re.sub(r"\s*```$", "", cleaned)
    cleaned = cleaned.strip()

    try:
        result = json.loads(cleaned)
    except json.JSONDecodeError as exc:
        logger.error("Failed to parse LLM JSON response: %s", exc)
        logger.error("Cleaned response was:\n%s", cleaned[:1000])
        raise RuntimeError(
            "The AI returned an invalid JSON response. Please try again."
        ) from exc

    return result
