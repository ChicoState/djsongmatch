# 🎧 DJ Song Match
![Lint](https://github.com/ChicoState/djsongmatch/actions/workflows/lint.yml/badge.svg)
![Type Check](https://github.com/ChicoState/djsongmatch/actions/workflows/typecheck.yml/badge.svg)
[![Deploy to Production](https://github.com/ChicoState/djsongmatch/actions/workflows/deploy_to_home_server.yml/badge.svg)](https://github.com/ChicoState/djsongmatch/actions/workflows/deploy_to_home_server.yml)

[www.djsongmatch.com](http://www.djsongmatch.com)

A web-based tool for DJs to curate seamless sets faster.  
It recommends harmonically compatible song transitions using:

- Camelot wheel key matching
- BPM-based tempo compatibility
- Approximate Nearest Neighbors (ANN) using FAISS ML model

**Tech Stack**  
🧠 Python + Flask + SQLAlchemy (Backend)  
🎵 Next.js + TypeScript + Tailwind (Frontend)  
🔍 FAISS (Vector search for song similarity)  
🐳 Dockerized for easy setup

---

## 🧠 Features in the App

From your frontend, users can:

- **Search for a base song**
- **View harmonic & tempo-compatible recommendations**
- Use **interactive sliders** and filters to fine-tune results
- Toggle dark mode, manage playlists, and get recommendations instantly

The app is designed to be **fast, modular, and DJ-friendly**.

---

## 🚀 Getting Started

### Prerequisites

- Install [Docker](https://www.docker.com/)
- Make sure Docker is **running**

---

### 🐳 Option 1: Run Full App with Docker Compose

This starts both the backend and frontend.

```bash
docker-compose up --build
```

- Frontend: [http://localhost:3000](http://localhost:3000)  
- Backend: [http://localhost:5001](http://localhost:5001)

**Stop services:**
```bash
docker-compose stop
```

**Restart services:**
```bash
docker-compose restart
```

**Stop/restart individual containers:**
```bash
docker-compose stop frontend
docker-compose restart backend
```

**Clean up unused Docker resources:**
```bash
docker system prune
```

---

### ⚛️ Option 2: Run Only the Frontend (Next.js)

```bash
docker build -t djsongmatch .
docker run -p 3000:3000 djsongmatch
```

---

### 🐍 Option 3: Run Only the Backend (Flask)

```bash
cd src/app/backend
docker build -t flask-backend .
docker run -p 5001:5001 flask-backend
```

---

## 🛠 Backend Script Usage (Optional Dev Workflows)

### Set Up Virtual Environment (For Script Dev)
```bash
python3 -m venv venv
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate     # Windows
```

Install dependencies:

```bash
pip install -r backend/requirements.txt
```

### Run Backend Scripts

Example (from root level):

```bash
python3 -m backend.scripts.pre_process_data
```

### Deactivate Environment
```bash
deactivate
```
