"""
Vercel Serverless Function entry point.
Wraps the Flask application from the backend directory.
"""

import sys
import os

# Add the backend directory to the Python path so imports work
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "backend"))

from app import app
