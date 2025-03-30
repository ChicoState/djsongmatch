# Use Node.js 18 as the base image
FROM node:18 AS builder

# Set working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Set environment variable
ENV NODE_ENV=development

# Copy only dependency-related files first (to leverage Docker cache)
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install

# Conditionally install @libsql/linux-arm64-musl only on ARM64 builds
ARG TARGETARCH
RUN if [ "$TARGETARCH" = "arm64" ]; then pnpm add @libsql/linux-arm64-musl; fi

# Copy the rest of the project
COPY . .

# Optionally expose (can remove if Docker Compose handles this)
# EXPOSE 3000

# Optional CMD (can be removed if Docker Compose specifies it)
# CMD ["pnpm", "dev"]
