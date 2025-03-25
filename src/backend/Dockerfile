# Use Python 3.11
FROM python:3.11-slim

# Set the working directory
WORKDIR /service

# Set build arguments
ARG TARGETARCH
ARG DEBIAN_FRONTEND=noninteractive

# Combined system dependencies installation
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    gcc \
    python3-dev \
    # Only install these on ARM
    $( [ "$TARGETARCH" = "arm64" ] && echo "libatlas3-base libopenblas-dev" ) \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements.txt and install dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend code
COPY . .

# Set Flask environment variables
ENV FLASK_APP=wsgi.py
ENV FLASK_ENV=development
ENV PYTHONUNBUFFERED=1

# Expose Flask’s default port
EXPOSE 5001

# Run Flask
CMD ["flask", "run", "--host=0.0.0.0", "--port=5001"]