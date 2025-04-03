# Use Python 3.11
FROM python:3.11-slim

# Container's working directory
#   All following commands (COPY, RUN, CMD, etc) execute here
#   Maps to ./backend on host via docker-compose volumes
WORKDIR /app

# Copy requirements.txt and install dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Expose network port for Flask development server
EXPOSE 5001

# Environment variables
#   - FLASK_APP: Points to our create_app() function in api/__init__.py
#   - FLASK_ENV: Enable development mode (debug + auto-reload)
#   - PYTHONUNBUFFERED: Better log output
ENV FLASK_APP=api
ENV FLASK_ENV=development
ENV PYTHONUNBUFFERED=1

# Run Flask
#   Note: create_app() is automatically called during flask run
CMD ["flask", "run", "--host=0.0.0.0", "--port=5001"]