# Use Node.js 18 as the base image
FROM --platform=linux/amd64 node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Ensure all necessary environment variables are set
ENV NODE_ENV=development

COPY package.json package-lock.json ./

RUN npm install --legacy-peer-deps

# Copy the rest of the project files
COPY . .

# Fix potential permission issues on Mac
RUN chmod -R 777 /app/node_modules || true

EXPOSE 3000

# Start the Next.js server in development mode
CMD ["npm", "run", "dev"]
