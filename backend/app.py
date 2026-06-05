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
        result = analyze_resume(file_bytes, file.filename, target_role)
        return jsonify({"success": True, "analysis": result}), 200

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
