# Use Python 3.11
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install uv dependencies and uv itself
RUN apt-get update && \
    apt-get install -y curl build-essential && \
    curl -LsSf https://astral.sh/uv/install.sh | sh && \
    /root/.local/bin/uv --version && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Add uv to PATH
ENV PATH="/root/.local/bin:$PATH"

# Copy the dependency list and install using uv
COPY ./backend/requirements.txt ./requirements.txt
RUN uv pip install --system -r requirements.txt

# Copy the backend code
COPY ./backend ./backend

EXPOSE 5001

# Environment config
ENV FLASK_APP=backend.api:create_app
ENV PYTHONUNBUFFERED=1

CMD ["python", "-m", "backend.api"]
