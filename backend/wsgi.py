"""
WSGI entry point for deployments
"""
from api import create_app

app = create_app()

if __name__ == "__main__":
    # For local testing only (not used in production)
    app.run(host="0.0.0.0", port=5001, debug=True)