# Use Python 3.11
FROM python:3.11-slim

WORKDIR /app

# Copy requirements.txt and install dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

ENV FLASK_APP=flaskTest.py
ENV FLASK_ENV=development

# Run Flask
CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]