# Base image with pnpm support
FROM node:20-slim AS base

# Setup pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Set working directory
WORKDIR /workspace/frontend

# Copy package files first (use Docker layer caching)
COPY package.json pnpm-lock.yaml ./

FROM base AS deps

# Use cache mount for pnpm store (faster rebuilds)
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

# Conditionally install driver for ARM64
ARG TARGETARCH
RUN if [ "$TARGETARCH" = "arm64" ]; then pnpm add @libsql/linux-arm64-musl; fi

FROM base

ENV NODE_ENV=development
WORKDIR /workspace/frontend

# Copy installed node_modules from deps stage
COPY --from=deps /workspace/frontend/node_modules ./node_modules

# Copy the rest of frontend
COPY . .
