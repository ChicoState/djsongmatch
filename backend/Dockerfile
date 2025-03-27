# Use Python 3.11
FROM python:3.11-slim

WORKDIR /app

# Copy requirements.txt and install dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Create a jupyter kernel for the Python environment
RUN python3 -m ipykernel install --user --name=backend_kernel

COPY . .

EXPOSE 5001

ENV FLASK_APP=flaskTest.py
ENV FLASK_ENV=development

# Run Flask
CMD ["flask", "run", "--host=0.0.0.0", "--port=5001"]