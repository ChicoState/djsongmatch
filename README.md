## Prerequisites
- If you don't have Docker, make sure you download it first.
- Make sure Docker is running. If you get a Docker daemon error, it means Docker is not running.

## Option 1: Running both containers for Next.js and Flask backend using Docker Compose
Now, to build the Docker containers, use the following command. This runs both containers together, linking the services.
```bash
docker-compose up --build
```
This runs both containers and you can access the frontend at:
```bash
http://localhost:3000
```
and the backend can be accessed from:
```bash
http://localhost:5001
```
How to stop both services:
```
docker-compose stop
```
How to restart both services:
```
docker-compose restart
```
You can also stop and restart the services individually, by adding the frontend or backend keywords to the commands. Example:
```
docker-compose stop frontend
docker-compose restart frontend
docker-compose stop backend
docker-compose restart backend
```
To remove all unused objects, run the following command. This will clear up some disc space!!
```
docker system prune
```

## Option 2: Run Only the Frontend
Build the Next.js container
```bash
docker build -t djsongmatch .
```
Run the Next.js container
```bash
docker run -p 3000:3000 djsongmatch
```

## Option 3: Run Only the Backend
Navigate to the backend/ directory
```bash
cd src/app/backend
```
Build the Flask container
```bash
docker build -t flask-backend .
```
Run the Flask container
```bash
docker run -p 5001:5001 flask-backend
```

Note: Building the containers may take a while. They don't always need to rebuilt, only in specific scenarios which include: modifying Dockerfile, changing dependencies in package.json or package-lock.json, and modifying drizzle.config.ts. Also, if wanting to work on another branch, checkout the branch and then rebuild the container(s).

# Backend Scripts

## Setting Up a Virtual Environment
A virtual environment (venv) keeps project dependencies isolated. If you haven't already, create one at the root level:

```bash
python3 -m venv venv
```

Activate your virtual environment:
```bash
# For macOS/Linux
source venv/bin/activate

# For Windows
venv\Scripts\activate
```

After activating, install the requirements (only needed when first creating the environment or when dependencies change):
```bash
pip install -r backend/requirements.txt
```

## Running Scripts
Make sure the virtual environment is activated before running backend scripts. Run scripts from the root level using the -m flag, for example:  
```bash
python3 -m backend.scripts.pre_process_data
```

## Deactivating the virtual environment
When finished, deactivate the virtual environment:
```bash
deactivate
```