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
cd backend
```
Build the Flask container
```bash
docker build -t flask-backend .
```
Run the Flask container
```bash
docker run -p 5000:5000 flask-backend
```

Note: Building the containers may take a while. They don't always need to rebuilt, only in specific scenarios which include: modifying Dockerfile, changing dependencies in package.json or package-lock.json, and modifying drizzle.config.ts. Also, if wanting to work on another branch, checkout the branch and then rebuild the container(s).