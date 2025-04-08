# Use Python 3.11
FROM python:3.11-slim

# Container's working directory
#   All following commands (COPY, RUN, CMD, etc) execute here
WORKDIR /app

COPY ./backend/requirements.txt ./requirements.txt

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the backend code into the container
COPY ./backend ./backend

# Expose network port for Flask development server
EXPOSE 5001

# Environment variables
#   - FLASK_APP: Points to our create_app() function in backend/api/__init__.py
#   - PYTHONUNBUFFERED: Better log output
ENV FLASK_APP=backend.api:create_app
ENV PYTHONUNBUFFERED=1

# Run Flask
# CMD ["flask", "run", "--host=0.0.0.0", "--port=5001"]
CMD ["python", "-m", "backend.api"]